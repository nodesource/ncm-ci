#!/usr/bin/env node

'use strict'

const analyze = require('@ns-private/ncm-analyze-tree')
const graphql = require('@ns-private/graphql')
const chalk = require('chalk')
const fetch = require('node-fetch')

if (!process.env.NCM_TOKEN) {
  console.error(`
    Usage
      $ cd node-project
      $ NCM_TOKEN=token ncm-ci
      $ echo $?
  `)
  process.exit(1)
}

const token = process.env.NCM_TOKEN
const api = {
  ncm: process.env.NCMAPI_URL || 'https://api.nodesource.com/ncm2/api/v1',
  accounts: process.env.ACCOUNTSAPI_URL || 'https://api.nodesource.com/accounts'
}

const getWhitelist = async ({ organizationId }) => {
  const whitelist = new Set()
  const data = await graphql({ token, url: api.ncm }, `
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
}

const getUserDetails = async () => {
  const res = await fetch(`${api.accounts}/user/details`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const details = await res.json()
  if (
    !details.permissions ||
    !details.permissions.includes('ncm:policy:read') ||
    !details.permissions.includes('ncm:cert:read')
  ) {
    console.error('Insufficient permissions. Your token needs at least:')
    console.log('- ncm:policy:read')
    console.log('- ncm:cert:read')
    process.exit(1)
  }
  return details
}

const main = async () => {
  const { orgId: organizationId } = await getUserDetails()
  const whitelist = await getWhitelist({ organizationId })
  const data = await analyze({
    dir: process.cwd(),
    token
  })
  const pkg = require(`${process.cwd()}/package.json`)

  const res = {
    pass: new Set(),
    whitelisted: new Set(),
    fail: new Set()
  }

  for (const pkg of data) {
    if (pkg.published) {
      const bucket = whitelist.has(`${pkg.name}@${pkg.version}`)
        ? res.whitelisted
        : pkg.score <= 85
          ? res.fail
          : res.pass
      bucket.add(pkg)
    }
  }

  console.log(`${chalk.bold('NCM')}`)
  console.log(`${chalk.grey.bold(pkg.name)} ${chalk.grey(`v${pkg.version}`)}`)
  console.log(`Pass: ${chalk(res.pass.size)}, Whitelisted: ${chalk(res.whitelisted.size)}, Fail: ${chalk(res.fail.size)}`)
  console.log()
  console.log(`      ${chalk.red.bold('L')}${chalk.grey('icense')}`)
  console.log(`       ${chalk.red.bold('V')}${chalk.grey('ulnerability')}`)
  console.log(`        ${chalk.red.bold('U')}${chalk.grey('nlicensed')}`)
  console.log()

  if (res.fail.size) {
    const pkgs = [...res.fail].sort((a, b) => a.name.localeCompare(b.name))
    for (const pkg of pkgs) {
      // Score
      process.stdout.write(String(pkg.score || 0).padStart(5))
      process.stdout.write(' ')

      // License
      if (pkg.results.find(r => r.name === 'license')) {
        process.stdout.write(chalk.red.bold('L'))
      } else {
        process.stdout.write(' ')
      }

      // Vulnerabilities
      if (pkg.vulnerabilities.length) {
        process.stdout.write(chalk.red.bold('V'))
      } else {
        process.stdout.write(' ')
      }

      // Uncertified
      if (!pkg.results.length && !pkg.vulnerabilities.length) {
        process.stdout.write(chalk.red.bold('U'))
      } else {
        process.stdout.write(' ')
      }
      process.stdout.write(' ')

      // Name & Version
      process.stdout.write(pkg.name)
      process.stdout.write(chalk.grey(` v${pkg.version} `))

      process.stdout.write('\n')
    }

    console.log()
    process.exit(1)
  } else {
    console.log(chalk.green('  All good!'))
    console.log()

    process.exit(0)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
