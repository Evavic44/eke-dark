# Eke Dark

A two-tone chrome color theme with teal accents and fully-colored syntax. (Also includes light variants.)

![Eke Dark screenshot placeholder](https://github.com/user-attachments/assets/681ab9b3-6027-4d7d-baee-1931f33e375e)

## Why another theme?

Eke Dark exists for two reasons:

**1. Consistency across IDEs.** I usually switch between VS Code and JetBrains IDEs, and just needed something consistent across both IDEs. Eke Dark is being built as a single visual language across both — VS Code first, [JetBrains version in progress](#jetbrains-version).

**2. The default JetBrains syntax highlighting leaves too many tokens uncolored.** Local variables, parameters, simple identifiers, and many properties render at the default foreground color — effectively white in dark themes, black in light themes. The result is large blocks of code where only keywords, strings, and a handful of other tokens carry color, and everything else blurs together. Eke Dark colors those tokens distinctly so the structure of code is visible at a glance.

The chrome takes visual cues from [JetBrains' Islands theme][islands] — the two-tone separation between editor and surrounding panels, the calm restrained palette. The syntax scheme is built from scratch around the principle that _every meaningful token should have a color_.

## Variants

Eke Dark ships in **Dark** and **Light** variants, each with an optional **Italic** version that styles comments and parameters in italic. The non-italic versions are the default. (They work with any monospace font with italic glyphs see [Recommended Setup](#recommended-setup)).

## Features

- **Two-tone UI chrome** — sidebar/panel darker than editor, activity bar/status bar darkest.
- **Teal accent (`#4ECDC4`)** — cursor, active tab underline, focus borders, buttons, badges, links.
- **Fully-colored syntax** — no token left at the foreground color. Variables, parameters, properties, and identifiers each get their own hue.
- **Semantic highlighting** — LSP-driven token colors with full `semanticTokenColors` support.
- **Bracket pair colorization** — gold, magenta, blue cycling.
- **Comprehensive language support** — TypeScript, JavaScript, Python, Rust, PHP, CSS/SCSS, JSON, YAML, Markdown, and more.

## Syntax Palette (Dark)

| Element                    | Color                                                | Hex       |
| -------------------------- | ---------------------------------------------------- | --------- |
| Keyword / Storage          | ![#E5A070](https://placehold.co/12x12/E5A070/E5A070) | `#E5A070` |
| Functions / Methods        | ![#6BBAFF](https://placehold.co/12x12/6BBAFF/6BBAFF) | `#6BBAFF` |
| String                     | ![#7FCC85](https://placehold.co/12x12/7FCC85/7FCC85) | `#7FCC85` |
| Number                     | ![#3CC8D4](https://placehold.co/12x12/3CC8D4/3CC8D4) | `#3CC8D4` |
| Class / Type / Variable    | ![#42D4BA](https://placehold.co/12x12/42D4BA/42D4BA) | `#42D4BA` |
| Property access            | ![#79E3D2](https://placehold.co/12x12/79E3D2/79E3D2) | `#79E3D2` |
| Constant / Key / Attribute | ![#D2A8FF](https://placehold.co/12x12/D2A8FF/D2A8FF) | `#D2A8FF` |
| Comment                    | ![#7a7e85](https://placehold.co/12x12/7a7e85/7a7e85) | `#7a7e85` |
| Decorator                  | ![#CCC76E](https://placehold.co/12x12/CCC76E/CCC76E) | `#CCC76E` |
| RegExp                     | ![#58D8E8](https://placehold.co/12x12/58D8E8/58D8E8) | `#58D8E8` |
| Tag (HTML)                 | ![#6BB0EA](https://placehold.co/12x12/6BB0EA/6BB0EA) | `#6BB0EA` |

Property access is a lighter tint of the variable color rather than a separate hue, so a chain
like `user.profile.name` stays one visual family while each link still reads as distinct. Where a
property is being _declared_ — an object literal key, a JSON key, an enum member — it takes the
constant purple instead.

## Installation

### From the Marketplace

1. Open the **Extensions** sidebar in VS Code (`Cmd+Shift+X` on macOS, `Ctrl+Shift+X` on Windows/Linux)
2. Search for `Eke`
3. Click **Install**
4. Open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux) → **Preferences: Color Theme** and pick one of the four Eke variants

### Manual install

1. Download the latest `.vsix` from the [Releases page](https://github.com/Evavic44/eke-dark/releases)
2. Install it via the command line:

```bash
   code --install-extension eke-dark-1.0.0.vsix
```

Or in VS Code: open the Extensions sidebar → `...` menu → **Install from VSIX** 3. Open the Command Palette → **Preferences: Color Theme** and pick an Eke variant

2. Restart VS Code.
3. Open the Command Palette → **Preferences: Color Theme** and pick an Eke variant.

## Recommended Setup

Eke Dark is tuned against specific typography. You don't need to match it, but the colors are calibrated for these fonts:

- **Editor / Markdown / CodeLens** — [Google Sans Code][google-sans-code] (alternatives with true italics: [JetBrains Mono][jetbrains-mono], [Cascadia Code][cascadia-code])
- **Terminal** — [Agave Nerd Font Mono][nerd-fonts], chosen for [Oh My Posh][oh-my-posh] glyph support. Plain Agave or any monospace works if you don't use a Nerd Font prompt.

![Terminal screenshot](https://github.com/user-attachments/assets/68514392-f8c0-4fde-9401-9b4cbbd799ab)

### Suggested `settings.json`

```jsonc
{
  "editor.fontFamily": "Google Sans Code, Menlo, 'Courier New', monospace",
  "editor.fontSize": 13,
  "editor.fontLigatures": true,
  "editor.semanticHighlighting.enabled": true,
  "editor.codeLensFontFamily": "Google Sans Code, Menlo, 'Courier New', monospace",
  "terminal.integrated.fontFamily": "Agave Nerd Font Mono, Menlo, 'Courier New', monospace",
  "terminal.integrated.fontSize": 13,
  "markdown.preview.fontFamily": "Google Sans Code, Menlo, 'Courier New', monospace",
}
```

## Contributing

Contributions are welcome. Color fixes, additional language scopes, and chrome polish especially. The theme is plain JSON with no build step, so getting it running locally takes about a minute:

1. Fork and clone the repository, then open it in VS Code:

```bash
   git clone https://github.com/<your-username>/eke-dark.git
   cd eke-dark
   code .
```

Open the repository folder itself as the workspace root, or the next step won't find the debug configuration.

2. Press <kbd>F5</kbd> (or **Run → Start Debugging**) to launch an **Extension Development Host** — a second VS Code window with the theme loaded. This uses the checked-in `.vscode/launch.json`; see [CONTRIBUTING.md](CONTRIBUTING.md#running-the-theme-locally) if <kbd>F5</kbd> doesn't start it.
3. In that window, open the Command Palette → **Preferences: Color Theme** and pick an Eke variant.
4. Edit any file in [themes/](themes/) and save. Changes apply live in the host window; run **Developer: Reload Window** there if one doesn't show up.

To find the scope behind a given token, run **Developer: Inspect Editor Tokens and Scopes** in the host window and click the token.

Remember that the four variants (`eke-dark`, `eke-dark-italic`, `eke-light`, `eke-light-italic`) need to stay in sync, and that most tokens need entries in both `tokenColors` and `semanticTokenColors`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guidelines, palette rules, and pull request checklist.

## Credits

- **[Islands theme][islands]** by JetBrains — chrome inspiration: two-tone separation, calm palette, the overall "softer, lighter" approach to UI.
- **[Yo Code][yo-code]** by Microsoft — the Yeoman generator used to scaffold this extension.
- **[Google Sans Code][google-sans-code]** — recommended editor font.
- **[Agave][agave]** by Blob — base font for the recommended terminal setup.
- **[Nerd Fonts][nerd-fonts]** — the patching project that produces Agave Nerd Font Mono with icon glyphs.

<!-- LINKS -->

[islands]: https://blog.jetbrains.com/platform/2025/12/meet-the-islands-theme-the-new-default-look-for-jetbrains-ides/
[yo-code]: https://code.visualstudio.com/api/get-started/your-first-extension
[google-sans-code]: https://fonts.google.com/specimen/Google+Sans+Code
[agave]: https://github.com/blobject/agave
[nerd-fonts]: https://www.nerdfonts.com/
[oh-my-posh]: https://ohmyposh.dev/
[jetbrains-mono]: https://www.jetbrains.com/lp/mono/
[cascadia-code]: https://github.com/microsoft/cascadia-code
