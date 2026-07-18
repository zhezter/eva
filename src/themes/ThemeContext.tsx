import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { themes, defaultTheme, ThemeId, Theme } from "./themes";

interface ThemeContextValue {
  theme: Theme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "eva:theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    return saved && themes[saved] ? saved : defaultTheme;
  });

  const theme = themes[themeId];

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.style.setProperty("--font-display", theme.displayFont);
    root.style.setProperty("--font-body", theme.bodyFont);
    root.setAttribute("data-theme", theme.id);
  }, [theme]);

  function setThemeId(id: ThemeId) {
    setThemeIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <ThemeContext.Provider value={{ theme, themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
}
