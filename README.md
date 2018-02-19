# ncm-ci
CI tool for [NCM 2.0](https://github.com/nodesource/ncm)

## Usage

```bash
$ npm install -g nodesource/ncm-ci
$ ncm-ci --help

  CI tool for NCM 2.0

  Usage
    $ ncm-ci

  Options
    --profile   Profile: normal, strict  Default: normal
    --port      Http port                Default: 8080
    --registry  NPM registry url         Default: https://registry.nodesource.io/

  Examples
    $ ncm-ci --profile=strict

```

## About

From the onboarding doc:

> ### A command-line simplified version of the Electron app
> The primary use-case for this is the CI/CD story. It will run the Local Proxy and use the same format config file as the Electron App to let CICD systems interface with the registry.