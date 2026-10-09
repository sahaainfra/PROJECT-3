// Part 00 — DS-4/DS-5/DS-9: generates erp-design-tokens (CSS custom properties + TS constants)
// from the single source of truth src/design/tokens/tokens.json. Run via `npm run erp:tokens`.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const src = join(root, "src", "design", "tokens", "tokens.json");
const outDir = join(root, "src", "design", "tokens", "generated");
const tokens = JSON.parse(readFileSync(src, "utf8"));

const THEMES = ["light", "dark", "high-contrast"];
const DENSITIES = ["compact", "cozy", "touch"];

// Groups emitted at :root plus per-theme / per-density overrides
const ROOT_GROUPS = ["typography", "radius", "space", "shadow", "breakpoint"];

function toCssVars(obj) {
  return Object.entries(obj)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n");
}

let css = `/* GENERATED FILE — do not edit. Source: src/design/tokens/tokens.json (npm run erp:tokens) */\n\n`;

// :root = light theme + cozy density + shared groups
const rootVars = [
  toCssVars(tokens.color.light),
  toCssVars(tokens.density.cozy),
  ...ROOT_GROUPS.map((g) => toCssVars(tokens[g]))
].join("\n\n");
css += `:root {\n${rootVars}\n}\n\n`;

for (const theme of THEMES.slice(1)) {
  css += `[data-theme="${theme}"] {\n${toCssVars(tokens.color[theme])}\n}\n\n`;
}
for (const density of DENSITIES.filter((d) => d !== "cozy")) {
  css += `[data-density="${density}"] {\n${toCssVars(tokens.density[density])}\n}\n\n`;
}

// OS preference fallbacks (only when no explicit data-theme is set)
css += `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme]) {\n    color-scheme: dark;\n  }\n}\n`;
css += `@media (prefers-contrast: more) {\n  :root:not([data-theme]) {\n    color-scheme: normal;\n  }\n}\n`;

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "tokens.css"), css, "utf8");

// TypeScript constants
const ts = `/* GENERATED FILE — do not edit. Source: src/design/tokens/tokens.json (npm run erp:tokens) */

export type ThemeName = "light" | "dark" | "high-contrast";
export type DensityName = "compact" | "cozy" | "touch";

export const THEMES: ThemeName[] = ${JSON.stringify(THEMES)};
export const DENSITIES: DensityName[] = ${JSON.stringify(DENSITIES)};

export const color = ${JSON.stringify(tokens.color, null, 2)} as const;

export const density = ${JSON.stringify(tokens.density, null, 2)} as const;

export const space = ${JSON.stringify(tokens.space, null, 2)} as const;

export const radius = ${JSON.stringify(tokens.radius, null, 2)} as const;

export const typography = ${JSON.stringify(tokens.typography, null, 2)} as const;

export const breakpoint = ${JSON.stringify(tokens.breakpoint, null, 2)} as const;
`;
writeFileSync(join(outDir, "tokens.ts"), ts, "utf8");

console.log(`erp-design-tokens generated: ${join(outDir, "tokens.css")}, tokens.ts`);
