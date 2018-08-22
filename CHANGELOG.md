# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased](https://github.com/atomist/tree-path-ts/compare/0.2.1...HEAD)

## [0.2.1](https://github.com/atomist/tree-path-ts/compare/0.2.0...0.2.1) - 2018-08-22

## [0.2.0](https://github.com/atomist/tree-path-ts/compare/0.1.9...0.2.0) - 2018-08-22

### Changed

-   **BREAKING** Reorganize package to more standard Node.js layout.
-   Update dependencies, including TypeScript and its configuration.

## [0.1.9](https://github.com/atomist/tree-path-ts/compare/0.1.8...0.1.9) - 2018-04-11

Union release

### Added

-   Add `unionOf` convenience function to combine path expressions.

### Changed

-   Improve TypeDoc.
-   Tighten TSLint rules.

## [0.1.8](https://github.com/atomist/tree-path-ts/compare/0.1.7...0.1.8) - 2017-11-14

JSON.stringify release

### Added

-   Add `treeReplacer` function and `DefaultTreeReplacer` to allow
    safe `JSON.stringify`.

## [0.1.7](https://github.com/atomist/tree-path-ts/compare/0.1.6...0.1.7) - 2017-11-14

Nested predicate fix release

### Added

-   Add support for union path expressions.
-   Add `$parent` optional property on `TreeNode`, which increases
    efficiency and corrects handling of ancestor axes in nested
    predicates.

## [0.1.6](https://github.com/atomist/tree-path-ts/compare/0.1.5...0.1.6) - 2017-11-12

### Added

-   Allow .. and . in abbreviated syntax.
-   Add support for union path expressions.


## [0.1.5](https://github.com/atomist/tree-path-ts/compare/0.1.4...0.1.5) - 2017-11-12

Axis specifier release

### Added

-   Add more axis specifiers.

## [0.1.4](https://github.com/atomist/tree-path-ts/compare/0.1.3...0.1.4) - 2017-11-12

Following sibling release

### Added

-   Add support for `following-sibling` axis specifier.
-   Add support for `preceding-sibling` axis specifier.


## [0.1.3](https://github.com/atomist/tree-path-ts/compare/0.1.2...0.1.3) - 2017-11-10

Function release

### Added

-   Add `addScalaValues` convenience function.
-   Add Support for arbitrary function predicates, passed in via
    additional optional argument to `evaluate` methods.

## [0.1.2](https://github.com/atomist/tree-path-ts/compare/0.1.1...0.1.2) - 2017-10-18

### Added

-   Add evaluateScalar methods.
-   Add position predicate support.
-   Path expression evaluation can take a string.

## [0.1.1](https://github.com/atomist/tree-path-ts/compare/0.1.0...0.1.1) - 2017-10-11

### Changed

-   Moved tree package to root.

## [0.1.0](https://github.com/atomist/tree-path-ts/tree/0.1.0) - 2017-10-11

### Added

-   Everything
