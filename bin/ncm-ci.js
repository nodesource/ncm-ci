#!/usr/bin/env node

'use strict'

const Proxy = require('@nodesource/ncm-proxy')
const meow = require('meow')
const semver = require('semver')

const cli = meow(
  `
  Usage
    $ NCM_TOKEN=token ncm-ci

  Options
    --registry  NPM registry url      Default: https://registry.npmjs.org

  Examples
    $ NCM_TOKEN=token ncm-ci
    http://localhost:14313
`,
  {}
)

if (!process.env.NCM_TOKEN) {
  console.error(cli.help)
  process.exit(1)
}

const proxy = new Proxy()

proxy.registry(cli.flags.registry || 'https://registry.npmjs.org')
proxy.auth(process.env.NCM_TOKEN)

proxy.on('error', err => {
  console.error(err)
})

proxy.check(pkg => {
  console.log(
    `${String(pkg.score || 0).padStart(3)} ${pkg.name}@${pkg.version}`
  )
  for (const result of pkg.results) {
    if (!result.pass) {
      console.log(`    - ${result.name} ("${result.test}"="${result.value}")`)
    }
  }
  for (const vul of pkg.vulnerabilities) {
    if (semver.satisfies(pkg.version, vul.semver.vulnerable[0])) {
      console.log(`    - ${vul.title} (severity=${vul.severity})`)
    }
  }
  return pkg.score > 85
})

const server = proxy.listen(() => {
  console.log(`http://localhost:${server.address().port}/`)
})
