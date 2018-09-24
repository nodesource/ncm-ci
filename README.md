# @ns-private/ncm-ci
CI tool for [NCM 2.0](https://github.com/nodesource/ncm)

[![Build Status](http://badges.control-tower.nodesource.io/ncm-ci/status.svg)](https://us-west-2.console.aws.amazon.com/codebuild/home?region=us-west-2#/projects/ncm-ci-ci/view)

## Usage

```bash
$ cd some-project
$ NCM_TOKEN=token ncm-ci
NCM
some-project v5.0.0
Pass: 411, Whitelisted: 0, Fail: 10

    0   U @ns-private/check-deps v2.0.0
    0   U @ns-private/graphql v3.1.0
    0   U @ns-private/ncm-analyze-tree v1.0.2
    0   U @ns-private/graphql v4.0.0
   78 LV  atob v2.0.3
    0 L   jsonify v0.0.0
   85 LV  is-my-json-valid v2.17.1
   85 LV  shelljs v0.7.8
    0 L   spdx-license-ids v1.2.2
   85 LV  eslint v3.19.0

```

```bash
$ npm install -g @ns-private/ncm-ci
$ ncm-ci --help

  CI tool for NCM 2.0

  Usage
    $ cd node-project
    $ NCM_TOKEN=token ncm-ci
    $ echo $?

```
