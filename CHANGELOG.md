# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

-   Handlers grammar has been changed to `handle Event { Statements }`: PR [#35](https://github.com/Gusarich/housify/pull/35)
-   All required Housing types have been added: PR [#36](https://github.com/Gusarich/housify/pull/36)

### Fixed

## [0.0.3-alpha] - 2024-07-21

### Added

-   Most of the Housing types have been added, and the names and fields have been fixed: PR [#17](https://github.com/Gusarich/housify/pull/17)
-   Support for `if` statements and all binary comparisons: PR [#20](https://github.com/Gusarich/housify/pull/20)

### Changed

-   Expression statements of types other than `void` are now forbidden: PR [#21](https://github.com/Gusarich/housify/pull/21)

### Fixed

-   Stat placeholders are now generated accurately: PR [#23](https://github.com/Gusarich/housify/pull/23)

## [0.0.2-alpha] - 2024-07-20

### Added

-   Single-line comments with `//` and multi-line comments with `/* */`: PR [#14](https://github.com/Gusarich/housify/pull/14)

## [0.0.1-alpha] - 2024-07-20

### Added

-   The initial version of the compiler

[unreleased]: https://github.com/Gusarich/housify/compare/v0.0.3-alpha...HEAD
[0.0.3-alpha]: https://github.com/Gusarich/housify/releases/tag/v0.0.3-alpha
[0.0.2-alpha]: https://github.com/Gusarich/housify/releases/tag/v0.0.2-alpha
[0.0.1-alpha]: https://github.com/Gusarich/housify/releases/tag/v0.0.1-alpha
