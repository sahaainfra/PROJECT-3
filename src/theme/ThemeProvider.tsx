// Part 00 — DS-4/DS-5/DS-9 theme provider: light, dark, high-contrast themes plus
// compact / cozy / touch density. The user's choice is stored in preferences
// (localStorage until the preferences API is wired to ui_user_preferences) and the
// OS preference is honoured by default.
"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { THEMES, DENSITIES, type ThemeName, type DensityName } from "@/design/tokens/generated/tokens";

interface ThemeState {
  theme: ThemeName | "system";
  density: DensityName;
  resolvedTheme: ThemeName;
  setTheme: (t: ThemeName | "system") => void;
  setDensity: (d: DensityName) => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

const THEME_STORAGE_KEY = "erp.preferences.theme";
const DENSITY_STORAGE_KEY = "erp.preferences.density";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName | "system">("system");
  const [density, setDensityState] = useState<DensityName>("cozy");
  const [osDark, setOsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | "system" | null;
    const storedDensity = localStorage.getItem(DENSITY_STORAGE_KEY) as DensityName | null;
    if (storedTheme && (storedTheme === "system" || THEMES.includes(storedTheme))) setThemeState(storedTheme);
    if (storedDensity && DENSITIES.includes(storedDensity)) setDensityState(storedDensity);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setOsDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setOsDark(e.matches);
    mq.addEventListener("change", onChange);
    setMounted(true);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme: ThemeName = theme === "system" ? (osDark ? "dark" : "light") : theme;

  useEffect(() => {
    if (!mounted) return;
    if (theme === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    document.documentElement.setAttribute("data-density", density);
  }, [theme, density, mounted]);

  const setTheme = useCallback((t: ThemeName | "system") => {
    setThemeState(t);
    localStorage.setItem(THEME_STORAGE_KEY, t);
  }, []);

  const setDensity = useCallback((d: DensityName) => {
    setDensityState(d);
    localStorage.setItem(DENSITY_STORAGE_KEY, d);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, density, resolvedTheme, setTheme, setDensity }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
