type Mode = "light" | "dark";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const isHexColor = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) return { h: 0, s: 0, l: l * 100 };

  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;

  return { h: (h * 60 + 360) % 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (h: number, s: number, l: number) => {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) =>
    light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
};

const luminance = (h: number, s: number, l: number) => {
  const [r, g, b] = hslToRgb(h, s, l).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const hsl = (h: number, s: number, l: number) =>
  `${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%`;

// Light mode runs pale to deep; dark mode is the reverse (matches index.css).
const CHART_LIGHTNESS = [87, 78, 68, 60, 52, 44];

/**
 * Builds the CSS variable overrides (without the leading `--`) for a
 * user-chosen accent color. Lightness is clamped per mode so the result
 * stays readable whatever color the user picks.
 */
export const buildAccentVars = (hex: string, mode: Mode) => {
  const { h, s } = hexToHsl(hex);
  const sat = clamp(s, 45, 92);
  const dark = mode === "dark";

  const primaryL = dark ? 62 : 48;
  // White text on the primary if it has enough contrast, otherwise near-black.
  const whiteContrast = 1.05 / (luminance(h, sat, primaryL) + 0.05);
  const primaryForeground = whiteContrast >= 4.5 ? "0 0% 100%" : "0 0% 10%";

  const primary = hsl(h, sat, primaryL);
  const chartLightness = dark
    ? [...CHART_LIGHTNESS].reverse()
    : CHART_LIGHTNESS;

  const vars: Record<string, string> = {
    primary,
    "primary-foreground": primaryForeground,
    ring: primary,
    accent: dark ? hsl(h, sat, 28) : hsl(h, clamp(sat, 60, 95), 94),
    "accent-foreground": dark ? hsl(h, 90, 88) : hsl(h, sat, 30),
    "sidebar-primary": primary,
    "sidebar-primary-foreground": primaryForeground,
    "sidebar-ring": primary,
  };

  chartLightness.forEach((l, i) => {
    vars[`chart-${i + 1}`] = hsl(h, clamp(sat, 60, 95), l);
  });

  return vars;
};
