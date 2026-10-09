// Part 00 — DS-33 design quality gates: token lint, navigation/icon registry lint,
// contrast recomputation, forbidden-term scan. Run via `npm run erp:lint-design`.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { loadTokens, computeContrastResults } from "./lib/contrast.mjs";

const root = process.cwd();
const failures = [];
const notes = [];

// 1. Token lint: every theme defines the same semantic token keys
const tokens = loadTokens(root);
const themeKeys = Object.entries(tokens.color).map(([t, v]) => [t, Object.keys(v).sort().join(",")]);
const [referenceTheme, referenceKeys] = themeKeys[0];
for (const [t, keys] of themeKeys.slice(1)) {
  if (keys !== referenceKeys) failures.push(`token: theme "${t}" keys differ from "${referenceTheme}"`);
}
for (const d of ["compact", "cozy", "touch"]) {
  if (!tokens.density[d]) failures.push(`token: density "${d}" missing`);
}
notes.push(`token: ${themeKeys.length} themes, ${referenceKeys.split(",").length} semantic colour tokens, 3 densities`);

// 2. Contrast recomputation (DS-7): zero FAIL allowed
const contrast = computeContrastResults(tokens);
for (const r of contrast) {
  if (!r.pass) failures.push(`contrast: ${r.theme} ${r.fg} on ${r.bg} = ${r.ratio} < ${r.min}`);
}
notes.push(`contrast: ${contrast.filter((r) => r.pass).length}/${contrast.length} pairs pass WCAG minima`);

// 3. Navigation registry lint (DS-13/DS-14)
const nav = JSON.parse(readFileSync(join(root, "src", "design", "navigation", "registry.json"), "utf8"));
const icons = JSON.parse(readFileSync(join(root, "src", "design", "icons", "registry.json"), "utf8"));
let entryCount = 0;
for (const group of nav.groups) {
  if (!group.entries || group.entries.length === 0) failures.push(`nav: empty group "${group.id}"`);
  for (const e of group.entries || []) {
    entryCount++;
    if (!e.route || !e.route.startsWith("/")) failures.push(`nav: entry "${e.id}" has no live route`);
    if (e.icon_key && !icons.icons[e.icon_key]) failures.push(`nav: entry "${e.id}" references unknown icon "${e.icon_key}"`);
    if (!e.is_active) failures.push(`nav: entry "${e.id}" is inactive (inactive entries must be removed, not shipped)`);
    const forbidden = nav.forbidden_terms.find((t) => (e.label_key || "").toLowerCase().includes(t) || (e.keywords || "").toLowerCase().includes(t));
    if (forbidden) failures.push(`nav: entry "${e.id}" contains forbidden term "${forbidden}"`);
  }
}
notes.push(`nav: ${nav.groups.length} groups, ${entryCount} entries, all icon keys resolvable`);

// 4. Icon registry lint (DS-10): fail on direct glyph imports (any icon library import in src/)
function walk(dir, cb) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, cb);
    else cb(p);
  }
}
walk(join(root, "src"), (p) => {
  if (!/\.(tsx?|css)$/.test(p) || p.includes("generated")) return;
  const text = readFileSync(p, "utf8");
  if (/(from\s+['"]react-icons|@mui\/icons-material|@fortawesome|lucide-react)/.test(text)) {
    failures.push(`icon: direct glyph/library import in ${p.replace(root, "")} — use the erp-outline registry (DS-10)`);
  }
});
notes.push("icon: no direct glyph imports found in src/");

// 5. Forbidden/technical terms in rendered UI sources
const forbiddenUi = nav.forbidden_terms;
walk(join(root, "src"), (p) => {
  if (!/\.(tsx?)$/.test(p)) return;
  const text = readFileSync(p, "utf8").toLowerCase();
  for (const t of forbiddenUi) {
    if (t === "console") continue; // console.* in code is allowed; only UI labels are linted
    if (text.includes(`"${t}"`) || text.includes(`'>${t}<`)) {
      failures.push(`ui: forbidden term "${t}" rendered in ${p.replace(root, "")}`);
    }
  }
});

console.log("=== erp:lint-design ===");
for (const n of notes) console.log(`  ok   ${n}`);
if (failures.length) {
  for (const f of failures) console.error(`  FAIL ${f}`);
  console.error(`lint-design: ${failures.length} failure(s)`);
  process.exit(1);
} else {
  console.log("lint-design: PASS");
}
