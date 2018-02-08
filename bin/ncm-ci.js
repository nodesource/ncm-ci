#!/usr/bin/env node

'use strict'

const Proxy = require('ncm-proxy')
const meow = require('meow')

const cli = meow(
  `
  Usage
    $ ncm-ci

  Options
    --profile   Profile: normal, strict, r&d  Default: normal
    --port      Http port                     Default: 8080
    --registry  NPM registry url              Default: https://registry.npmjs.org/

  Examples
    $ ncm-ci
`,
  {}
)

const proxy = new Proxy()
proxy.profile(cli.flags.profile)
proxy.registry(cli.flags.registry)

proxy.on('install', pkg => {
  console.log(`install ${pkg.name}`)
})
proxy.on('delete version', version => {
  console.error(`delete version ${version.name}@${version.version}`)
})
proxy.on('warn version', version => {
  console.error(`warn version ${version.name}@${version.version}`)
})

const server = proxy.listen(cli.flags.port, () => {
  console.log(`http://localhost:${server.address().port}/`)
})
