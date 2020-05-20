# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.8] 2019-05-30

### Changed

- Added more resolution for DeviantArt metadata.

## [3.0.1] 2019-10-30

### Changed

- Fix Sagiri not sending correct headers during POST.

## [3.0.0] - 2019-10-29

### Changed

- Completely redo API to a simpler, FP inspired interface. Main export is now a function instead of a class.
- Options have been renamed to make more sense.
- `getRatings` has been removed due to implementation quirks, but may come back in a future release.

### Added

- Errors from SauceNAO are properly thrown as a `SagiriClientError` or `SagiriServerError` and actually give the error message.
- Logging via the `debug` module now exists to help triage issues.
- It is now possible to override default options when fetching results.

## [2.0.3] - 2019-10-24

### Changed

- Ratings should now show properly.
- Tests are now done locally via `nock`.

## [2.0.2]

### Changed

- Codebase now uses Clarity ESLint config.

### Removed

- Rollup bundling

## [2.0.1]

### Changed

- Fixed typo in `similarity` key.

## [2.0.0] - 2019-08-04

### Changed

- Rewrite the library from the ground up in TypeScript
- Make the LICENSE file a markdown file
- Also build Node v12 on TravisCI
- Use Jest as test framework
- TypeScript based ESLint config
- Editorconfig for standardised formatting

### Added

- Rollup bundling
- Automatic doc generation
- Inclusion of docs in README.md
- Inclusion of this CHANGELOG.md
- GitHub templates

## [1.5.4] - 2019-08-02

- No changed to report

## [1.5.3] - 2019-04-14

- No changed to report

## [1.5.2] - 2019-03-04

- No changed to report

## [1.5.1] - 2019-03-04

- No changed to report

## [1.5.0] - 2019-03-04

- No changed to report

## [1.4.4] - 2018-12-09

- No changed to report

## [1.4.3] - 2018-03-14

### Changed

- Maintenance bump

## [1.4.2] - 2018-02-10

### Added

- Support more sites

## [1.4.0] - 2017-10-24

### Added

- Add ability to generate a DB mask by passing in an array of DB indexes to the constructor, and likewise for disabling DB indexes. ([382004b](https://github.com/ClarityCafe/Sagiri/commit/382004b04d49bfe4e69afe6c61cdc2b7082216b9))
- Add ability to enable "test mode" in the API ([3659032](https://github.com/ClarityCafe/Sagiri/commit/36590322dd5a7b6c37c11ed9bf69b95191be507b))

## [1.3.1] - 2017-10-18

### Fixed

- Fix a typo in TypeError for Ratelimiter ([3448526](https://github.com/ClarityCafe/Sagiri/commit/344852602fde93a23af8588a6c635c146269f170))
- Unref Ratelimiter timer to let Node exit early if need be ([3448526](https://github.com/ClarityCafe/Sagiri/commit/344852602fde93a23af8588a6c635c146269f170))
- Fix longLimiter using the short period ([23a8fa2](https://github.com/ClarityCafe/Sagiri/commit/23a8fa260ae499ed734de80d25d2ef031e2e108b))

## [1.3.0] - 2017-10-17

### Added

- Adds proper ratelimiting handling which prevents you from sending a request if you are ratelimited.

### Changed

- Reorganised index file structure to enable access to constants and the ratelimiter class, without breaking backwards compatibility.

## [1.2.4] - 2017-10-04

### Changed

- changes the package distro namespace from @sr229/sagiri to sagiri

## [1.2.1] - 2017-09-28

### Added

- Adds some error handling and adds a hidden index for Pixiv.

## [1.2.0] - 2017-09-27

### Changed

- Update package ver

## [1.1.1] - 2017-09-27

### Added

- add CC.yml for precise code analysis

[1.5.4]: https://github.com/ClarityCafe/Sagiri/compare/1.5.3...1.5.4
[1.5.3]: https://github.com/ClarityCafe/Sagiri/compare/1.5.2...1.5.3
[1.5.2]: https://github.com/ClarityCafe/Sagiri/compare/1.5.1...1.5.2
[1.5.1]: https://github.com/ClarityCafe/Sagiri/compare/1.5.0...1.5.1
[1.5.0]: https://github.com/ClarityCafe/Sagiri/compare/1.4.4...1.5.0
[1.4.4]: https://github.com/ClarityCafe/Sagiri/compare/1.4.3...1.4.4
[1.4.3]: https://github.com/ClarityCafe/Sagiri/compare/1.4.2...1.4.3
[1.4.2]: https://github.com/ClarityCafe/Sagiri/compare/1.4.0...1.4.2
[1.4.0]: https://github.com/ClarityCafe/Sagiri/compare/1.3.1...1.4.0
[1.3.1]: https://github.com/ClarityCafe/Sagiri/compare/1.3.0...1.3.1
[1.3.0]: https://github.com/ClarityCafe/Sagiri/compare/1.2.4...1.3.0
[1.2.4]: https://github.com/ClarityCafe/Sagiri/compare/1.2.1...1.2.4
[1.2.1]: https://github.com/ClarityCafe/Sagiri/compare/1.2.0...1.2.1
[1.2.0]: https://github.com/ClarityCafe/Sagiri/compare/1.1.1...1.2.0
[1.1.1]: https://github.com/ClarityCafe/Sagiri/releases/tag/1.1.1
