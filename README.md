# @nodesource/ncm-ci
[NCM](https://nodesource.com/products/certified-modules) for CICD systems.

## Usage

```bash
$ cd some-project
$ NCM_TOKEN=token ncm-ci
NCM
@nodesource/ncm-ci v8.0.3
Pass: 319, Whitelisted: 0, Fail: 5

      License
       Vulnerability
        Uncertified

   85  V  eslint v3.19.0
   85  V  is-my-json-valid v2.17.1
    0 L   jsonify v0.0.0
   85  V  shelljs v0.7.8
    0 L   spdx-license-ids v1.2.2

```

<img src='screenshot.png' width='451' />

The tool will exit with a non-0 exit code if one or more dependencies failed
the certification check.

```bash
$ ncm-ci
$ echo $?
1
```

## Installation

```bash
$ npm install -g @nodesource/ncm-ci
```

## License & copyright

Copyright &copy; NodeSource.

Licensed under the MIT open source license, see the LICENSE file for details.
