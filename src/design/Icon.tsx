// Part 00 — DS-10 icon registry component. Semantic keys only; the registry is the
// single source of icon glyphs (original erp-outline family, MIT). Direct glyph
// imports fail lint-design.
import registry from "@/design/icons/registry.json";

type IconKey = keyof typeof registry.icons;

export function Icon({
  name,
  size = 20,
  className,
  title
}: {
  name: IconKey | string;
  size?: number;
  className?: string;
  title?: string;
}) {
  const def = (registry.icons as Record<string, { label: string; d: string[] }>)[name];
  if (!def) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {def.d.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

export type { IconKey };
export const ICON_KEYS = Object.keys(registry.icons);
