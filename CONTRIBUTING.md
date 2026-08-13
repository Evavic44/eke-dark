# Contributing to Eke Dark

Thanks for taking the time to contribute. Eke Dark is a VS Code color theme, so most contributions come down to adjusting hex values in the theme JSON files, but there are a few conventions that keep the four variants consistent.

## Ways to contribute

- **Report a color bug** — a token that renders at the default foreground color, unreadable contrast, or a UI element that looks wrong in one variant but not the others.
- **Add language support** — TextMate scopes or semantic tokens for a language that currently falls through to the default color.
- **Improve chrome** — VS Code ships new UI surfaces regularly; unstyled ones inherit defaults that clash with the palette.
- **Documentation** — fixes and clarifications to the README or this file.

Before opening a pull request for anything larger than a single color tweak, please [open an issue](https://github.com/Evavic44/eke-dark/issues) so we can agree on the direction first.

## Project layout

```
themes/
  eke-dark.json          # Dark variant          <- edit this
  eke-dark-italic.json   # Dark + italics        <- generated
  eke-light.json         # Light variant         <- edit this
  eke-light-italic.json  # Light + italics       <- generated
scripts/
  italic-scopes.json     # Which scopes get italics, per variant
  build-italics.mjs      # Regenerates the two *-italic.json files
  validate-themes.mjs    # Parity + contrast checks (npm test)
assets/
  icon.png               # Marketplace icon
docs/
  PUBLISHING.md          # Maintainer-only: Marketplace release steps
package.json             # Extension manifest; registers the four themes
CHANGELOG.md
```

**Only the two base files are hand-edited.** The italic variants are generated from them by
`npm run build`, so a color can only ever be defined in one place. If you want a scope to be
italic, add its rule name to `scripts/italic-scopes.json` and rebuild — don't edit the generated
files directly, `npm test` will fail if they've drifted from their base.

Each theme file has three sections:

- `colors` — the UI chrome (editor, sidebar, status bar, tabs, terminal, etc.)
- `tokenColors` — TextMate scopes, used when no language server is active
- `semanticTokenColors` — LSP-driven token colors, which take precedence when available

A token often needs an entry in **both** `tokenColors` and `semanticTokenColors` to look right in every context. If you fix a color in only one, it will change appearance depending on whether the language server has loaded.

## Running the theme locally

You need [VS Code](https://code.visualstudio.com/) and [Git](https://git-scm.com/). There is no build step and no dependencies to install — the extension is plain JSON.

1. Fork and clone the repository, then open the folder in VS Code:

   ```bash
   git clone https://github.com/<your-username>/eke-dark.git
   cd eke-dark
   code .
   ```

   You must open the repository folder itself as the workspace root — pressing <kbd>F5</kbd> from a parent folder or a multi-root workspace will not pick up the debug configuration.

2. Press <kbd>F5</kbd> (or **Run → Start Debugging**). This uses the checked-in `.vscode/launch.json` (**Run Extension**) to launch an **Extension Development Host** — a second VS Code window with the theme loaded.

   If <kbd>F5</kbd> does nothing, opens a language-specific debugger, or asks you to select an environment, the launch configuration isn't being found. Confirm `.vscode/launch.json` exists at the repository root; if it's missing, create it with:

   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Run Extension",
         "type": "extensionHost",
         "request": "launch",
         "args": ["--extensionDevelopmentPath=${workspaceFolder}"]
       }
     ]
   }
   ```

3. In the new window, open the Command Palette (`Ctrl+Shift+P`, `Cmd+Shift+P` on macOS) → **Preferences: Color Theme** → pick an Eke variant.

4. Edit any file in [themes/](themes/) and save. The Extension Development Host applies theme changes live — no reload needed. If a change doesn't appear, run **Developer: Reload Window** in the host window.

### Finding the scope to edit

To learn which scope controls a given piece of syntax, open the Command Palette in the Extension Development Host and run **Developer: Inspect Editor Tokens and Scopes**, then click the token. The popup shows the semantic token type, the TextMate scopes, and which theme rule is currently winning.

### Building a `.vsix`

Only needed if you want to install your build permanently or attach it to an issue:

```bash
npx @vscode/vsce package
code --install-extension eke-dark-<version>.vsix
```

## Guidelines

- **Run `npm test` before you push.** It checks that all four variants declare the same keys and scopes, that every color is legible against the background it sits on, and that the generated italic files are current. It runs automatically on `vsce package`.
- **Keep dark and light in sync.** A change to `eke-dark.json` almost always needs a counterpart in `eke-light.json`. The italic variants take care of themselves — run `npm run build` and commit the result.
- **Stay within the palette.** New colors should be drawn from the [syntax palette in the README](README.md#syntax-palette-dark) or be a deliberate, justified addition. Say why in the PR if you're introducing a new hue.
- **Every meaningful token gets a color.** This is the core principle of the theme — if you find a token rendering at the default foreground, that's a bug worth fixing.
- **Avoid near-duplicate colors.** If two hexes are a handful of units apart, nobody can tell them apart but everyone has to keep them in step. Either collapse them into one or move them far enough to actually read as different.
- **Check contrast.** `npm test` enforces the floors (3:1 for syntax and chrome, 2:1 for ANSI colors), but aim for WCAG AA (4.5:1) on anything you expect people to read for long stretches.
- **Check both light and dark.** A color that reads well on the dark background often disappears on the light one.
- **Don't bump the version** in `package.json` — that happens at release time. Maintainers: see [docs/PUBLISHING.md](docs/PUBLISHING.md).

## Submitting a pull request

1. Create a branch: `git checkout -b fix/python-decorator-color`
2. Make your changes and verify them in the Extension Development Host.
3. Add a line to the `[Unreleased]` section of [CHANGELOG.md](CHANGELOG.md) under `Added`, `Changed`, or `Fixed`.
4. Commit with a short, descriptive message.
5. Open a pull request describing what changed and why. **Include before/after screenshots** for any visual change — they are the fastest way to review a theme PR. Mention which languages you tested against.

## Reporting issues

When reporting a color problem, please include:

- Which variant (Dark, Dark Italic, Light, Light Italic)
- The language and a small code snippet that reproduces it
- A screenshot
- The output of **Developer: Inspect Editor Tokens and Scopes** on the affected token, if you can grab it
- Your VS Code version

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE.md) that covers this project.
