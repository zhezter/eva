import { themes } from "../themes/themes";
import { useTheme } from "../themes/ThemeContext";

export function ThemeSwitcher() {
  const { themeId, setThemeId } = useTheme();

  return (
    <div className="theme-switcher">
      {Object.values(themes).map((t) => (
        <button
          key={t.id}
          className={`theme-switcher__swatch ${t.id === themeId ? "is-active" : ""}`}
          style={{ background: t.vars["--accent"] }}
          title={`${t.label} — ${t.description}`}
          onClick={() => setThemeId(t.id)}
        />
      ))}
    </div>
  );
}
