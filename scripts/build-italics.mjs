/**
 * Generates themes/*-italic.json from their base themes.
 *
 * The italic variants used to be maintained by hand, which meant a color changed in
 * eke-dark.json had to be mirrored into eke-dark-italic.json by hand too. Deriving them
 * instead makes that class of drift impossible: the only difference a variant may have
 * is fontStyle: italic on the scopes listed in scripts/italic-scopes.json.
 *
 *   node scripts/build-italics.mjs            write the files
 *   node scripts/build-italics.mjs --check    exit 1 if they are out of date
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
export const THEMES = join(HERE, "..", "themes");
export const CONFIG = JSON.parse(
  readFileSync(join(HERE, "italic-scopes.json"), "utf8")
);

/** Merge `italic` into an existing fontStyle without dropping bold/strikethrough. */
function withItalic(fontStyle) {
  const parts = (fontStyle ?? "").split(/\s+/).filter(Boolean);
  if (!parts.includes("italic")) parts.push("italic");
  return parts.join(" ");
}

/** Build the italic variant of `base` in memory. Returns the serialized file body. */
export function buildItalic(base, variant) {
  const theme = structuredClone(base);
  theme.name = variant.name;

  const wanted = new Set(variant.tokenColors);
  const seen = new Set();
  for (const rule of theme.tokenColors) {
    if (!wanted.has(rule.name)) continue;
    seen.add(rule.name);
    rule.settings.fontStyle = withItalic(rule.settings.fontStyle);
  }
  const missingScopes = variant.tokenColors.filter((n) => !seen.has(n));
  if (missingScopes.length) {
    throw new Error(
      `${variant.out}: no tokenColors entry named ${missingScopes.join(", ")}`
    );
  }

  for (const key of variant.semanticTokenColors) {
    const current = theme.semanticTokenColors[key];
    if (current === undefined) {
      throw new Error(`${variant.out}: no semanticTokenColors entry "${key}"`);
    }
    // Semantic entries are either a bare color string or a settings object.
    theme.semanticTokenColors[key] =
      typeof current === "string"
        ? { foreground: current, fontStyle: "italic" }
        : { ...current, fontStyle: withItalic(current.fontStyle) };
  }

  return JSON.stringify(theme, null, 2) + "\n";
}

/** @returns {{out: string, expected: string, actual: string|null}[]} */
export function buildAll() {
  return CONFIG.variants.map((variant) => {
    const base = JSON.parse(readFileSync(join(THEMES, variant.base), "utf8"));
    let actual = null;
    try {
      actual = readFileSync(join(THEMES, variant.out), "utf8");
    } catch {
      /* not generated yet */
    }
    return { out: variant.out, expected: buildItalic(base, variant), actual };
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes("--check");
  const stale = [];
  for (const { out, expected, actual } of buildAll()) {
    if (expected === actual) {
      if (!check) console.log(`  ${out} up to date`);
      continue;
    }
    stale.push(out);
    if (!check) {
      writeFileSync(join(THEMES, out), expected);
      console.log(`  ${out} written`);
    }
  }
  if (check && stale.length) {
    console.error(
      `${stale.join(", ")} out of date -- run \`npm run build\` and commit the result.`
    );
    process.exit(1);
  }
}
