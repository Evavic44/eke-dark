# Change Log

All notable changes to the "eke-dark" theme will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Added

- 91 previously unstyled UI keys, which had been falling back to VS Code's defaults: explorer indent guides, list filter matches, status bar item states, the debug stack-frame highlight and toolbar, quick-pick groups, toolbars, checkboxes, settings rows, notebooks, chat and inline chat, merge editor, staged/submodule git decorations, problem icons, and the unexpected-bracket color.
- `npm test` (`scripts/validate-themes.mjs`) — verifies all four variants declare the same color keys, token scopes, and semantic tokens; that every color is a valid hex and clears its contrast floor; and that the generated italic files are up to date.
- `npm run build` (`scripts/build-italics.mjs`) — generates the two `*-italic.json` files from their base themes, so colors are defined in exactly one place. Which scopes get italics is declared in `scripts/italic-scopes.json`.

### Changed

- Property, constant, enum member, object/JSON key, and tag attribute tokens moved from pink to purple: `#D2A8FF` in the dark variants, `#8250DF` in the light variants.
- Property _access_ now renders as a lighter tint of the variable color — `#79E3D2` dark, `#0d8272` light — so the links of a chain like `user.profile.name` are distinguishable. Property _declarations_ (object literal keys, JSON keys, enum members) keep the constant purple. Previously the semantic `property` token was left at the variable color, so the same expression rendered differently depending on whether the language had a semantic provider.
- Collapsed near-duplicate colors that were indistinguishable on screen but had to be kept in step by hand: methods now share the function color (`#6BBAFF` / `#1b6bab`), and interfaces and type parameters share the class/type color (`#42D4BA` / `#0b6e5f`). Same for the Rust lifetime color and the parameter inlay hint.
- Dark line numbers lightened to `#666b74` and light line numbers softened to `#868a94`, bringing both to roughly 3.3:1 — previously 2.15:1 and 5.04:1.
- Dark info and hint underlines lightened from `#857042` to `#98804B` (3.64:1 → 4.58:1).
- Light comments, strings, numbers, and doc comments darkened to clear WCAG AA on white; comments went from 2.69:1 to 4.56:1. The light regexp color moved to `#0A6A80` to separate it from the number color.

### Fixed

- **Light terminal: ANSI white was invisible.** `terminal.ansiWhite` was set to `#f3f4f6`, exactly the terminal background, and `ansiBrightWhite` to `#ffffff`. Any command that printed white text disappeared. They are now `#6b6f77` and `#8b8f96`, with `ansiBrightBlack` moved to `#5a5e66` to keep the grayscale ramp ordered, and `ansiBrightGreen` darkened to `#1a7f33` to match the other bright pairs.
- Dark terminal: `terminal.ansiBlack` lifted off the terminal background from `#191a1c` to `#33363b`.

## [1.0.0] - 2026-05-19

### Added

- Initial release of the eke-dark theme

[Unreleased]: https://github.com/Evavic44/eke-dark/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Evavic44/eke-dark/releases/tag/v1.0.0
