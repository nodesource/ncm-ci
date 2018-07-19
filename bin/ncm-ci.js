#!/usr/bin/env node

'use strict'

const Proxy = require('@ns-private/ncm-proxy')
const graphql = require('@ns-private/graphql')
const meow = require('meow')
const semver = require('semver')

const cli = meow(
  `
  Usage
    $ NCM_TOKEN=token NCM_ORG=id ncm-ci

  Options
    --registry  NPM registry url      Default: https://registry.npmjs.org

  Examples
    $ NCM_TOKEN=token NCM_ORG=id ncm-ci
    http://localhost:14313
`,
  {}
)

if (!process.env.NCM_TOKEN || !process.env.NCM_ORG) {
  console.error(cli.help)
  process.exit(1)
}

const token = process.env.NCM_TOKEN
const organizationId = process.env.NCM_ORG
const url = 'https://api.nodesource.com/ncm2/api/v1'

const getWhitelist = (async () => {
  const whitelist = new Set()
  const data = await graphql({ token, url }, `
    query($organizationId: String!) {
      policies(organizationId: $organizationId) {
        whitelist {
          name
          version
        }
      }
    }
  `, {
    organizationId
  })
  for (const policy of data.policies) {
    for (const pkg of policy.whitelist) {
      whitelist.add(`${pkg.name}@${pkg.version}`)
    }
  }
  return whitelist
})()

const proxy = new Proxy()

proxy.registry(cli.flags.registry || 'https://registry.npmjs.org')
proxy.auth(token)
proxy.api(url)

proxy.on('error', err => {
  console.error(err)
})

proxy.check(async pkg => {
  const id = `${pkg.name}@${pkg.version}`

  // Whitelisted?
  const whitelist = await getWhitelist
  let whitelisted = whitelist.has(id)

  // Score: "  80" or "(80)" (whitelisted)
  let scoreText = String(pkg.score || 0)
  if (whitelisted) {
    scoreText = `(${scoreText})`
  } else {
    scoreText = `  ${scoreText}`
  }
  scoreText = scoreText.padStart(5)

  // Whitelist: "" or "(whitelisted)" (whitelisted)
  const whitelistText = whitelisted
    ? '(whitelisted)'
    : ''

  // Header
  console.log(`${scoreText} ${id} ${whitelistText}`)

  // Certification results
  for (const result of pkg.results) {
    if (!result.pass) {
      console.log(`      - ${result.name} ("${result.test}"="${result.value}")`)
    }
  }

  // Vulnerabilities
  for (const vul of pkg.vulnerabilities) {
    if (semver.satisfies(pkg.version, vul.semver.vulnerable[0])) {
      console.log(`      - ${vul.title} (severity=${vul.severity})`)
    }
  }

  // Allow installation?
  return whitelisted || pkg.score > 85
})

const server = proxy.listen(() => {
  console.log(`http://localhost:${server.address().port}/`)
})
