# Node.js API wrapper for the UC Integration API
[![License](https://img.shields.io/github/license/unfoldedcircle/integration-node-library.svg)](LICENSE)

This library simplifies writing Node.js based integrations for the [Unfolded Circle Remote devices](https://www.unfoldedcircle.com/)
by wrapping the [WebSocket Integration API](https://github.com/unfoldedcircle/core-api/tree/main/integration-api).

It's an alpha release (in our eyes). Breaking changes are to be expected and missing features will be continuously added.

Not supported:

- Secure WebSocket
- Token based authentication

Requirements:
- Install [nvm](https://github.com/nvm-sh/nvm) (Node.js version manager) for local development
- Node.js v16.18.0 or newer (older versions are not tested)

## Installation

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

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the
[tags and releases on this repository](https://github.com/unfoldedcircle/integration-node-library/releases).

## Changelog

The major changes found in each new release are listed in the [changelog](https://github.com/aitatoi/integration-node-library/blob/main/CHANGELOG.md)
and under the GitHub [releases](https://github.com/unfoldedcircle/integration-node-library/releases).

## Contributions

Please read our [contribution guidelines](https://github.com/aitatoi/integration-node-library/blob/main/CONTRIBUTING.md)
before opening a pull request.

## License

This project is licensed under the [**Apache License 2.0**](https://choosealicense.com/licenses/apache-2.0/).
See the [LICENSE](https://github.com/aitatoi/integration-node-library/blob/main/LICENSE) file for details.
