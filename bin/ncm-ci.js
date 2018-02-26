#!/usr/bin/env node

'use strict'

const Proxy = require('@nodesource/ncm-proxy')
const meow = require('meow')

const cli = meow(
  `
  Usage
    $ ncm-ci

  Options
    --profile   Profile: normal, strict  Default: normal
    --registry  NPM registry url         Default: https://registry.nodesource.io/

  Examples
    $ ncm-ci --profile=strict
`,
  {}
)

const proxy = new Proxy()

if (cli.flags.registry) {
  proxy.registry(cli.flags.registry)
}

proxy.on('error', err => {
  console.error(err)
})

proxy.check(pkg => {
  console.log(
    `${String(pkg.score || 0).padStart(3)} ${pkg.name}@${pkg.version}`
  )
  for (const result of pkg.results) {
    console.log(`    - ${result.name} ("${result.test}"="${result.value}")`)
  }
  return cli.flags.profile === 'strict' ? pkg.score > 85 : true
})

const server = proxy.listen(() => {
  console.log(`http://localhost:${server.address().port}/`)
})
