# @nodesource/ncm-ci
CI tool for [NCM 2.0](https://github.com/nodesource/ncm)

[![Build Status](http://badges.control-tower.nodesource.io/ncm-ci/status.svg)](https://us-west-2.console.aws.amazon.com/codebuild/home?region=us-west-2#/projects/ncm-ci-ci/view)

## Usage

```bash
$ npm install -g @nodesource/ncm-ci
$ ncm-ci --help

  CI tool for NCM 2.0

  Usage
    $ NCM_TOKEN=token NCM_ORG=id ncm-ci

  Options
    --registry  NPM registry url      Default: https://registry.npmjs.org

  Examples
    $ NCM_TOKEN=token NCM_ORG=id ncm-ci
    http://localhost:14313

```

## About

From the onboarding doc:

> ### A command-line simplified version of the Electron app
> The primary use-case for this is the CI/CD story. It will run the Local Proxy and use the same format config file as the Electron App to let CICD systems interface with the registry.