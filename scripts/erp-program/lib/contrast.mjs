// Part 00 — DS-7: WCAG contrast recomputation from the token file.
// Shared by lint-design.mjs and the design unit tests. Exports a pure function.
import { readFileSync } from "node:fs";
import { join } from "node:path";

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

export function relLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fgHex, bgHex) {
  const l1 = relLuminance(fgHex);
  const l2 = relLuminance(bgHex);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export function loadTokens(root = process.cwd()) {
  return JSON.parse(readFileSync(join(root, "src", "design", "tokens", "tokens.json"), "utf8"));
}

export function computeContrastResults(tokens) {
  const results = [];
  for (const pair of tokens.contrast.pairs) {
    const theme = pair.theme || "light";
    const fg = tokens.color[theme][pair.fg];
    const bg = tokens.color[theme][pair.bg];
    if (!fg || !bg) {
      results.push({ ...pair, theme, ratio: null, pass: false, error: "token missing" });
      continue;
    }
    const ratio = contrastRatio(fg, bg);
    results.push({ ...pair, theme, ratio: Math.round(ratio * 100) / 100, pass: ratio >= pair.min });
  }
  return results;
}
