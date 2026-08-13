/**
 * Checks the four theme files agree with each other and stay readable.
 *
 * `vsce package` will happily ship a theme where a color is invisible against its own
 * background, or where one variant picked up a change the other three missed. This
 * catches both. Run with `npm test`.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildAll, THEMES } from "./build-italics.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(HERE, "..", "package.json"), "utf8"));

const failures = [];
const fail = (msg) => failures.push(msg);

// ---------------------------------------------------------------- contrast
const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function channels(hex) {
  let h = hex.slice(1);
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

function luminance(hex) {
  const [r, g, b] = channels(hex).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio. Alpha is ignored -- these are all near-opaque foregrounds. */
function contrast(fg, bg) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Floors, not targets. 4.5 is WCAG AA for body text; syntax tokens sit at 3.0 because
 * comments are deliberately recessive and AA would make them shout.
 */
const TOKEN_FLOOR = 3.0;
const UI_FLOOR = 3.0;
const ANSI_FLOOR = 2.0;
const BODY_FLOOR = 7.0;

/** ANSI black is conventionally a near-background swatch; holding it to a floor is wrong. */
const ANSI_EXEMPT = new Set(["terminal.ansiBlack"]);

const UI_KEYS = [
  "editor.foreground",
  "editorLineNumber.foreground",
  "editorCodeLens.foreground",
  "editorInlayHint.foreground",
  "editorInlayHint.parameterForeground",
  "editorInlayHint.typeForeground",
  "editorError.foreground",
  "editorWarning.foreground",
  "editorInfo.foreground",
  "editorHint.foreground",
];
const CHROME_KEYS = [
  "tab.inactiveForeground",
  "activityBar.inactiveForeground",
  "descriptionForeground",
  "input.placeholderForeground",
];

// ---------------------------------------------------------------- load
const files = pkg.contributes.themes.map((t) => t.path.replace("./themes/", ""));
const themes = new Map();
for (const f of files) {
  try {
    themes.set(f, JSON.parse(readFileSync(join(THEMES, f), "utf8")));
  } catch (err) {
    fail(`${f}: ${err.message}`);
  }
}
if (failures.length) {
  for (const f of failures) console.error(`  x ${f}`);
  process.exit(1);
}

// ---------------------------------------------------------------- manifest
for (const entry of pkg.contributes.themes) {
  const theme = themes.get(entry.path.replace("./themes/", ""));
  if (theme.name !== entry.label) {
    fail(`${entry.path}: "name" is "${theme.name}" but package.json label is "${entry.label}"`);
  }
  const expectedUi = theme.type === "dark" ? "vs-dark" : "vs";
  if (entry.uiTheme !== expectedUi) {
    fail(`${entry.path}: type "${theme.type}" should use uiTheme "${expectedUi}", got "${entry.uiTheme}"`);
  }
}

// ---------------------------------------------------------------- parity
const [reference, ...rest] = files;
const diff = (a, b) => [
  ...[...a].filter((x) => !b.has(x)).map((x) => `+${x}`),
  ...[...b].filter((x) => !a.has(x)).map((x) => `-${x}`),
];

for (const f of rest) {
  const colorDiff = diff(
    new Set(Object.keys(themes.get(f).colors)),
    new Set(Object.keys(themes.get(reference).colors))
  );
  if (colorDiff.length) fail(`${f}: colors differ from ${reference}: ${colorDiff.join(" ")}`);

  const semanticDiff = diff(
    new Set(Object.keys(themes.get(f).semanticTokenColors)),
    new Set(Object.keys(themes.get(reference).semanticTokenColors))
  );
  if (semanticDiff.length) fail(`${f}: semanticTokenColors differ from ${reference}: ${semanticDiff.join(" ")}`);

  // Scopes must match too -- a rule that exists in one variant only is a silent gap.
  const shape = (t) =>
    JSON.stringify(t.tokenColors.map((r) => [r.name, [r.scope].flat()]));
  if (shape(themes.get(f)) !== shape(themes.get(reference))) {
    fail(`${f}: tokenColors names/scopes differ from ${reference}`);
  }
}

// ---------------------------------------------------------------- values
for (const [f, theme] of themes) {
  for (const [key, value] of Object.entries(theme.colors)) {
    if (!HEX.test(value)) fail(`${f}: colors["${key}"] is not a hex color: ${value}`);
  }
  const fgs = [
    ...theme.tokenColors.map((r) => [r.name, r.settings.foreground]),
    ...Object.entries(theme.semanticTokenColors).map(([k, v]) => [
      k,
      typeof v === "string" ? v : v.foreground,
    ]),
  ];
  for (const [name, fg] of fgs) {
    if (fg !== undefined && !HEX.test(fg)) fail(`${f}: "${name}" is not a hex color: ${fg}`);
  }
}

// ---------------------------------------------------------------- contrast
for (const [f, theme] of themes) {
  const bg = theme.colors["editor.background"];
  const termBg = theme.colors["terminal.background"];
  const sideBg = theme.colors["sideBar.background"];

  const check = (label, fg, against, floor) => {
    if (!fg || !HEX.test(fg)) return;
    const ratio = contrast(fg, against);
    if (ratio < floor) {
      fail(`${f}: ${label} ${fg} is ${ratio.toFixed(2)}:1 against ${against} (floor ${floor})`);
    }
  };

  for (const rule of theme.tokenColors) {
    check(`tokenColors "${rule.name}"`, rule.settings.foreground, bg, TOKEN_FLOOR);
  }
  for (const [key, value] of Object.entries(theme.semanticTokenColors)) {
    const fg = typeof value === "string" ? value : value.foreground;
    check(`semanticTokenColors "${key}"`, fg, bg, TOKEN_FLOOR);
  }
  for (const key of UI_KEYS) {
    check(`colors["${key}"]`, theme.colors[key], bg, key === "editor.foreground" ? BODY_FLOOR : UI_FLOOR);
  }
  for (const key of CHROME_KEYS) {
    check(`colors["${key}"]`, theme.colors[key], sideBg, UI_FLOOR);
  }
  for (const [key, value] of Object.entries(theme.colors)) {
    if (!key.startsWith("terminal.ansi") || ANSI_EXEMPT.has(key)) continue;
    check(`colors["${key}"]`, value, termBg, ANSI_FLOOR);
  }
}

// ---------------------------------------------------------------- generated files
for (const { out, expected, actual } of buildAll()) {
  if (expected !== actual) {
    fail(`${out} is out of date -- run \`npm run build\` and commit the result`);
  }
}

// ---------------------------------------------------------------- report
if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n`);
  for (const f of failures) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}
console.log(
  `ok  ${themes.size} themes, ` +
    `${Object.keys(themes.get(reference).colors).length} color keys, ` +
    `${themes.get(reference).tokenColors.length} token rules`
);
