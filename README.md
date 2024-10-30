# Node.js API wrapper for the UC Integration API
[![License](https://img.shields.io/github/license/unfoldedcircle/integration-node-library.svg)](LICENSE)

This library simplifies writing Node.js based integrations for the [Unfolded Circle Remote devices](https://www.unfoldedcircle.com/)
by wrapping the [WebSocket Integration API](https://github.com/unfoldedcircle/core-api/tree/main/integration-api).

It's a beta release (in our eyes). Breaking changes are to be expected and missing features will be continuously added.

Not supported:

- Secure WebSocket
- Token based authentication

Requirements:
- Install [nvm](https://github.com/nvm-sh/nvm) (Node.js version manager) for local development
- Node.js v16.18.0 or newer (older versions are not tested)
  - Development dependencies require at least v18.18
  - The Remote Two firmware up to version 1.9.2 contains Node.js v16.18
  - Newer firmware versions contain Node.js v20.16

## Installation

This module is not yet available in the npmjs registry and must be installed from GitHub:

```shell
npm install https://github.com/unfoldedcircle/integration-node-library
```

⚠️ This installs the latest, bleeding edge development version from the GitHub repository. This can either be desired
for development, or have undesired side effects when doing `npm update` (which pulls the latest version from the default
branch).

A specific Git hash can be added to pin the version:

```shell
npm install https://github.com/unfoldedcircle/integration-node-library#$HASH
```
See npm documentation for all options.

### Environment Variables

Certain features can be configured by environment variables:

| Variable                 | Values           | Description                                                                                                          |
|--------------------------|------------------|----------------------------------------------------------------------------------------------------------------------|
| UC_CONFIG_HOME           | _directory path_ | Configuration directory to save the user configuration from the driver setup.<br>Default: $HOME or current directory |
| UC_INTEGRATION_INTERFACE | _address_        | Listening interface for WebSocket server.<br>Default: `0.0.0.0`                                                      |
| UC_INTEGRATION_HTTP_PORT | _number_         | WebSocket listening port.<br>Default: `port` field in driver metadata json file, if not specified: `9090`            |
| UC_DISABLE_MDNS_PUBLISH  | `true` / `false` | Disables mDNS service advertisement.<br>Default: `false`                                                             |

### Usage

Look into [examples](examples) for some pointers.

### Logging

Logging any kind of output is directed to the [debug](https://www.npmjs.com/package/debug) module.
To let the UC API wrapper output anything, run your integration driver with the `DEBUG` environment variable set like:

```shell
DEBUG=ucapi:* node driver.js
```

UC API wrapper exposes the following log-levels:

- `ucapi:msg`: WebSocket message trace
- `ucapi:debug`: debugging messages
- `ucapi:info`: informational messages like server up and running, client connected or disconnected.
- `ucapi:warn`: warnings
- `ucapi:error`: errors

If you only want to get errors and warnings reported:

```shell
DEBUG=ucapi:warn,ucapi:error node driver.js
```

Combine those settings with your existing application if any of your other modules or libs also uses __debug__

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the
[tags and releases on this repository](https://github.com/unfoldedcircle/integration-node-library/releases).

## Changelog

The major changes found in each new release are listed in the [changelog](https://github.com/unfoldedcircle/integration-node-library/blob/main/CHANGELOG.md)
and under the GitHub [releases](https://github.com/unfoldedcircle/integration-node-library/releases).

## Contributions

Please read our [contribution guidelines](https://github.com/unfoldedcircle/integration-node-library/blob/main/CONTRIBUTING.md)
before opening a pull request.

## License

This project is licensed under the [**Apache License 2.0**](https://choosealicense.com/licenses/apache-2.0/).
See the [LICENSE](https://github.com/unfoldedcircle/integration-node-library/blob/main/LICENSE) file for details.
