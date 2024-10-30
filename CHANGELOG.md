# UC Integration API Node.js wrapper Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

_Changes in the next release_

---

## 0.1.0-beta - 2024-08-21

### Breaking changes

- All entity class constructors have changed: use named parameters for all optional arguments.

### Added

- Remote-entity and UI definitions.
- Setup-flow and remote examples.
- Log configuration with the `debug` module.

### Changed

- Setup handler & entity command handler instead of events (#35).
- Remove available & configured entity persistence (#34).
- Remove features parameter from sensor entity constructor.

### Fixed

- Missing media-player features, options, and commands.
- Missing options property in available entities.
