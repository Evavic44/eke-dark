# Publishing

Maintainer reference for publishing and re-publishing `victoreke.eke-dark` to the
[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=victoreke.eke-dark).
Contributors don't need this file — see [CONTRIBUTING.md](../CONTRIBUTING.md).

## Prerequisites

- **`vsce`**, the packaging and publishing CLI:

  ```bash
  npm install -g @vscode/vsce
  ```

  Or run it without installing: `npx @vscode/vsce <command>`. The old unscoped `vsce`
  package is deprecated — use `@vscode/vsce`.

- **A valid Personal Access Token (PAT).** See [Authentication](#authentication-pat).

## Authentication (PAT)

`vsce` authenticates against Azure DevOps with a PAT. Tokens expire, so a lapsed token is
the usual cause of an auth failure on publish.

To create one:

1. Sign in at <https://dev.azure.com> with the account tied to the `victoreke` publisher.
2. User settings (top right) → **Personal Access Tokens** → **New Token**.
3. Configure:
   - **Organization**: set to **All accessible organizations**. Scoping to a single org is
     the most common cause of a confusing auth/permissions failure on publish.
   - **Scopes**: **Show all scopes** → **Marketplace** → **Manage**.
   - **Expiration**: set a longer custom window to avoid frequent regeneration.
4. **Create**, then copy the token immediately — Azure shows it only once.

Provide the token when `vsce` prompts, or pass it inline:

```bash
vsce publish -p <token>
```

Avoid letting the token land in shell history or a committed file.

If the token authenticates but publishing fails with a permissions error, re-check the
**Organization** field first — it should be "All accessible organizations".

## Releasing

1. **Regenerate and validate.** The italic variants are generated, so a color change to a
   base theme isn't complete until they're rebuilt:

   ```bash
   npm run build   # regenerates themes/*-italic.json
   npm test        # parity, contrast, and drift checks
   ```

   `npm test` also runs automatically on `vsce package` and `vsce publish` via
   `vscode:prepublish`, so a failure there aborts the publish.

2. **Update the CHANGELOG.** Move the accumulated `Added` / `Changed` / `Fixed` entries
   under a new version heading with today's ISO 8601 date, matching the existing style:

   ```markdown
   ## [1.0.2] - 2026-08-13
   ```

3. **Bump the version** in `package.json`. The Marketplace rejects a re-publish at the same
   version. A fix-only release is a patch bump (`1.0.1` → `1.0.2`) per semver.

4. **Commit** the changelog and version bump.

5. **Publish:**

   ```bash
   vsce publish
   ```

6. **Tag and push:**

   ```bash
   git tag v1.0.2
   git push && git push --tags
   ```

### One-shot version bump + publish

`vsce publish patch` bumps `package.json`, creates a git commit and tag, and publishes in
one command (also `minor` / `major`):

```bash
vsce publish patch
```

Caveats:

- Edit the CHANGELOG **before** running it — the bump and tag happen automatically, so
  there's no pause to stage changelog edits into the tagged commit.
- It requires a clean git working tree and fails on uncommitted changes. Commit first, or
  bump manually and run a plain `vsce publish`.

## Testing before publish

There is no staging Marketplace. To test locally:

```bash
vsce package                            # produces eke-dark-<version>.vsix
code --install-extension eke-dark-<version>.vsix
```

Then sideload it and verify in a normal VS Code window (not the Extension Development
Host) — that's the only way to see what users actually install.

Purely cosmetic color changes usually don't need this. Structural changes — README image
references, `contributes.themes` entries, `.vscodeignore` edits, manifest fields — do;
those are the class of change that can break silently.

## Checking publish status

The publish command returns in ~10–30 seconds. Propagation to the public listing takes a
few minutes (up to ~15) due to server-side validation and CDN caching. **Don't re-run
`publish` because the public page still shows the old version.**

Where to check, fastest to slowest:

| Source          | URL / command                                                                   | Notes                                            |
| --------------- | ------------------------------------------------------------------------------- | ------------------------------------------------ |
| Publisher hub   | <https://marketplace.visualstudio.com/manage/publishers/victoreke>                | Authoritative. Validation errors surface here.   |
| CLI             | `vsce show victoreke.eke-dark`                                                    | Prints current published version + metadata.     |
| Public listing  | <https://marketplace.visualstudio.com/items?itemName=victoreke.eke-dark>          | CDN-cached, laggiest. Hard-refresh after a wait. |

Check the publisher hub first. If a re-publish fails validation, it reports the error there
rather than leaving you refreshing the public page.
