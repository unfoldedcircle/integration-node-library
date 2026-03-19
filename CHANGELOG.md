# UC Integration API Node.js wrapper Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

_Changes in the next release_

---

## 0.4.2-beta - 2026-03-19

### Fixed

- Rename Pagination field "total" to "count" ([#59](https://github.com/unfoldedcircle/integration-node-library/pull/59)).

## 0.4.1-beta - 2026-03-17

### Added

- Add `stable_ids` option to media browse and search requests.
- Add `getIds` method to Entities class.

## 0.4.0-beta - 2026-03-16

### Added

- New media-player attribute MediaPositionUpdatedAt ([feature-and-bug-tracker#443](https://github.com/unfoldedcircle/feature-and-bug-tracker/issues/443)).
- Add media browsing and searching features to media-player ([#56](https://github.com/unfoldedcircle/integration-node-library/pull/56)).

### Changed

- Update packages.
- Require Node.js v22.13.
- Add a `prepare` script to build the project. This allows using this library with GitHub references.

### Fixed

- Propagate `abort_driver_setup` event to setup-handler as `AbortDriverSetup` request.
- Redact sensitive information in WS message logging ([#55](https://github.com/unfoldedcircle/integration-node-library/pull/55))

## 0.3.0-beta - 2025-01-31

### Added

- Oauth2 API enhancement ([#49](https://github.com/unfoldedcircle/integration-node-library/pull/49)).

### Changed

- Export library as esm and cjs for better runtime compatability ([#49](https://github.com/unfoldedcircle/integration-node-library/pull/49)).

## 0.2.2-beta - 2024-12-18

### Fixed

- Message log filtering: previous fix removed complete message instead of just the image data.

## 0.2.1-beta - 2024-12-18

### Fixed

- Set default entity state in constructor if not provided ([#46](https://github.com/unfoldedcircle/integration-node-library/pull/46))
- Re-enable log filtering of base64 encoded images (regression from TS conversion) ([#47](https://github.com/unfoldedcircle/integration-node-library/pull/47))
- Crash on unsubscribe events ([#48](https://github.com/unfoldedcircle/integration-node-library/pull/48))

## 0.2.0-beta - 2024-11-05

### Breaking changes

- Package name change to `@unfoldedcircle/integration-api`.
- Changed to ES modules.
- Removed the default package export with an IntegrationAPI instance.
  - All objects are now exported at the root module level.
  - An instance of IntegrationAPI must be created manually.
- Using enums for all entity options, features etc. using UpperCamelCase and the entity name as prefix.

Example of how to initialize the integration wrapper and start the WebSocket server:

```ts
import * as uc from "@unfoldedcircle/integration-api";

const driver = new uc.IntegrationAPI();
driver.init("driver.json");
```

### Changed

- TypeScript conversion.
- Initial NPM package `@unfoldedcircle/integration-api`.

## 0.1.0-beta - 2024-08-21

### Breaking changes

- All entity class constructors have changed: use named parameters for all optional arguments.

### Added

- Remote-entity and UI definitions.
- Setup-flow and remote examples.
- Log configuration with the `debug` module.

### Changed

- Setup handler & entity command handler instead of events ([#35](https://github.com/unfoldedcircle/integration-node-library/pull/35)).
- Remove available & configured entity persistence ([#34](https://github.com/unfoldedcircle/integration-node-library/pull/34)).
- Remove features parameter from sensor entity constructor.

### Fixed

- Missing media-player features, options, and commands.
- Missing options property in available entities.
