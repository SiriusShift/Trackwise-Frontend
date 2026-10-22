import { createContext, useContext, useLayoutEffect, useState } from "react";
import { buildAccentVars, isHexColor } from "@/shared/utils/accentTheme";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  accentStorageKey?: string;
  paletteStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accent: string | null;
  setAccent: (accent: string | null) => void;
  palette: string | null;
  setPalette: (palette: string | null) => void;
  setDefaultBranding: (locked: boolean) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  accent: null,
  setAccent: () => null,
  palette: null,
  setPalette: () => null,
  setDefaultBranding: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  accentStorageKey = "vite-ui-accent",
  paletteStorageKey = "vite-ui-palette",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [accent, setAccent] = useState<string | null>(() => {
    const stored = localStorage.getItem(accentStorageKey);
    return stored && isHexColor(stored) ? stored : null;
  });

  const [palette, setPalette] = useState<string | null>(() =>
    localStorage.getItem(paletteStorageKey)
  );

  // Public pages (sign-in, landing...) ignore the saved palette and accent.
  const [defaultBranding, setDefaultBranding] = useState(false);

  useLayoutEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    let appliedVars: string[] = [];

    const applyTheme = () => {
      const isDark = theme === "system" ? mediaQuery.matches : theme === "dark";

      root.classList.remove("light", "dark");
      root.classList.add(isDark ? "dark" : "light");

      const activePalette = defaultBranding ? null : palette;
      const activeAccent = defaultBranding ? null : accent;

      if (activePalette) root.dataset.palette = activePalette;
      else delete root.dataset.palette;

      appliedVars.forEach((name) => root.style.removeProperty(name));
      appliedVars = [];

      if (activeAccent) {
        Object.entries(buildAccentVars(activeAccent, isDark ? "dark" : "light")).forEach(
          ([key, value]) => {
            root.style.setProperty(`--${key}`, value);
            appliedVars.push(`--${key}`);
          }
        );
      }
    };

    applyTheme(); // initial run
    mediaQuery.addEventListener("change", applyTheme); // listen for system changes

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [theme, accent, palette, defaultBranding]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    accent,
    // A named palette and a custom accent are mutually exclusive: the accent's
    // inline variables would otherwise override the palette's colors.
    setAccent: (accent: string | null) => {
      if (accent) localStorage.setItem(accentStorageKey, accent);
      else localStorage.removeItem(accentStorageKey);
      setAccent(accent);
      if (accent) {
        localStorage.removeItem(paletteStorageKey);
        setPalette(null);
      }
    },
    palette,
    setDefaultBranding,
    setPalette: (palette: string | null) => {
      if (palette) localStorage.setItem(paletteStorageKey, palette);
      else localStorage.removeItem(paletteStorageKey);
      setPalette(palette);
      if (palette) {
        localStorage.removeItem(accentStorageKey);
        setAccent(null);
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
