# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [0.3.0] - 2024-08-05

### Added

-   Static constants calculated at compile time: PR [#78](https://github.com/Gusarich/housify/pull/78)
-   Inline functions: PR [#81](https://github.com/Gusarich/housify/pull/81)

### Changed

### Fixed

-   Unused temporary stats are now set to 0 at the end of the handlers: PR [#81](https://github.com/Gusarich/housify/pull/81)

## [0.2.1] - 2024-07-24

### Added

-   The `EmulatedHouse.reset` method: PR [#72](https://github.com/Gusarich/housify/pull/72)
-   Housing types such as `ActionKind` are now available in the module exports: PR [#72](https://github.com/Gusarich/housify/pull/72)

## [0.2.0] - 2024-07-24

### Added

-   Actions Emulator MVP: PR [#45](https://github.com/Gusarich/housify/pull/45)
-   Augmented Assignment: PR [#63](https://github.com/Gusarich/housify/pull/63)
-   Constants via `const` statement: PR [#65](https://github.com/Gusarich/housify/pull/65)

### Changed

-   Compilation errors now include source location and provide more meaningful error messages: PR [#64](https://github.com/Gusarich/housify/pull/64)

### Fixed

-   Temporary stat names scoping moved from expressions to statements, fixing issues with nested expressions: PR [#62](https://github.com/Gusarich/housify/pull/62)

## [0.1.1] - 2024-07-23

### Changed

-   Default stat value definition syntax has been removed due to implementation constraints: PR [#58](https://github.com/Gusarich/housify/pull/58)

### Fixed

-   Temporary stats are now excluded from the compilation result: PR [#50](https://github.com/Gusarich/housify/pull/50)
-   Placeholders for player stats are now correctly generated: PR [#51](https://github.com/Gusarich/housify/pull/51)
-   Temporary stat names are now generated independently for each expression: PR [#52](https://github.com/Gusarich/housify/pull/52) and PR [#59](https://github.com/Gusarich/housify/pull/59)
-   There is now a limit of 20 persistent stats of each kind: PR [#53](https://github.com/Gusarich/housify/pull/53)
-   Global and player stat placeholders in expressions are now correctly generated: PR [#56](https://github.com/Gusarich/housify/pull/56)

## [0.1.0] - 2024-07-22

### Changed

-   The handler grammar has been changed to `handle EVENT { Statements }`: PR [#35](https://github.com/Gusarich/housify/pull/35)
-   All required Housing types have been added: PR [#36](https://github.com/Gusarich/housify/pull/36)
-   Event types in handlers must now accurately match the uppercase snake case event names from Housing types: PR [#37](https://github.com/Gusarich/housify/pull/37)

### Fixed

-   The variable names `global` and `player` are now forbidden: PR [#37](https://github.com/Gusarich/housify/pull/37)
-   Variables and stats of type `void` are now forbidden: PR [#37](https://github.com/Gusarich/housify/pull/37)
-   Handled events are now correctly checked during resolving and added to the result: PR [#37](https://github.com/Gusarich/housify/pull/37)

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

[Unreleased]: https://github.com/Gusarich/housify/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/Gusarich/housify/releases/tag/v0.3.0
[0.2.1]: https://github.com/Gusarich/housify/releases/tag/v0.2.1
[0.2.0]: https://github.com/Gusarich/housify/releases/tag/v0.2.0
[0.1.1]: https://github.com/Gusarich/housify/releases/tag/v0.1.1
[0.1.0]: https://github.com/Gusarich/housify/releases/tag/v0.1.0
[0.0.3-alpha]: https://github.com/Gusarich/housify/releases/tag/v0.0.3-alpha
[0.0.2-alpha]: https://github.com/Gusarich/housify/releases/tag/v0.0.2-alpha
[0.0.1-alpha]: https://github.com/Gusarich/housify/releases/tag/v0.0.1-alpha
