export type ThemeId = "sakura" | "midnight" | "sage" | "ink";

export interface Theme {
  id: ThemeId;
  label: string;
  description: string;
  vars: Record<string, string>;
  displayFont: string;
  bodyFont: string;
  signature: string;
}

export const themes: Record<ThemeId, Theme> = {
  sakura: {
    id: "sakura",
    label: "Marshmallow",
    description: "Lavanda y rosa suave — femenino pero sereno.",
    displayFont: "'Fraunces', serif",
    bodyFont: "'Quicksand', sans-serif",
    signature: "Nubes de algodón, pétalos suaves y un toque de calma.",
    vars: {
      "--bg": "rgba(228, 220, 237, 0.92)",
      "--bg-elevated": "rgba(240, 234, 247, 0.94)",
      "--surface": "rgba(215, 205, 228, 0.7)",
      "--border": "rgba(185, 168, 205, 0.5)",
      "--text": "#2D2438",
      "--text-muted": "#7A6B8A",
      "--accent": "#9B7BB8",
      "--accent-soft": "rgba(180, 155, 200, 0.5)",
      "--accent-contrast": "#FFFFFF",
      "--warn": "#C49560",
      "--danger": "#B86A7A",
      "--radius-sm": "12px",
      "--radius-md": "20px",
      "--radius-lg": "30px",
      "--shadow": "0 8px 32px rgba(140, 115, 170, 0.25)",
      "--deco-sparkle": "✦",
      "--deco-heart": "♡",
      "--deco-flower": "✿",
      "--deco-star": "★",
    },
  },

  midnight: {
    id: "midnight",
    label: "Midnight Focus",
    description: "Azul noche con acento lavanda — bajo estímulo visual.",
    displayFont: "'Fraunces', serif",
    bodyFont: "'Inter', sans-serif",
    signature: "Constelaciones y arcos de luz en la oscuridad.",
    vars: {
      "--bg": "rgba(18, 20, 31, 0.85)",
      "--bg-elevated": "rgba(27, 30, 46, 0.9)",
      "--surface": "rgba(32, 36, 58, 0.8)",
      "--border": "rgba(50, 55, 87, 0.6)",
      "--text": "#E7E9F5",
      "--text-muted": "#9AA0C3",
      "--accent": "#9C8CF0",
      "--accent-soft": "rgba(58, 52, 101, 0.7)",
      "--accent-contrast": "#12141F",
      "--warn": "#E8B85C",
      "--danger": "#E0708A",
      "--radius-sm": "8px",
      "--radius-md": "14px",
      "--radius-lg": "20px",
      "--shadow": "0 8px 24px rgba(0, 0, 0, 0.55)",
      "--deco-sparkle": "✧",
      "--deco-heart": "♡",
      "--deco-flower": "❋",
      "--deco-star": "★",
    },
  },

  sage: {
    id: "sage",
    label: "Sage",
    description: "Verde salvia mate, minimalista y neutro.",
    displayFont: "'Fraunces', serif",
    bodyFont: "'Inter', sans-serif",
    signature: "Hojas y tallos que crecen con cada sesión.",
    vars: {
      "--bg": "rgba(215, 222, 207, 0.92)",
      "--bg-elevated": "rgba(228, 234, 220, 0.94)",
      "--surface": "rgba(200, 210, 192, 0.7)",
      "--border": "rgba(175, 190, 163, 0.6)",
      "--text": "#2B3327",
      "--text-muted": "#6C7863",
      "--accent": "#5C7A4F",
      "--accent-soft": "rgba(185, 200, 170, 0.6)",
      "--accent-contrast": "#FFFFFF",
      "--warn": "#B98A3E",
      "--danger": "#B4523F",
      "--radius-sm": "6px",
      "--radius-md": "10px",
      "--radius-lg": "16px",
      "--shadow": "0 6px 18px rgba(43, 51, 39, 0.25)",
      "--deco-sparkle": "·",
      "--deco-heart": "♡",
      "--deco-flower": "❋",
      "--deco-star": "✦",
    },
  },

  ink: {
    id: "ink",
    label: "Ink & Paper",
    description: "Papel cálido con acento tinta azul — sobrio, tipo cuaderno.",
    displayFont: "'Fraunces', serif",
    bodyFont: "'Inter', sans-serif",
    signature: "Trazos de tinta y subrayados a mano.",
    vars: {
      "--bg": "rgba(225, 218, 203, 0.92)",
      "--bg-elevated": "rgba(238, 232, 222, 0.94)",
      "--surface": "rgba(210, 200, 182, 0.7)",
      "--border": "rgba(185, 173, 148, 0.6)",
      "--text": "#26323D",
      "--text-muted": "#6B7480",
      "--accent": "#2F5C8A",
      "--accent-soft": "rgba(170, 195, 220, 0.6)",
      "--accent-contrast": "#FFFFFF",
      "--warn": "#B9862F",
      "--danger": "#B24A3B",
      "--radius-sm": "4px",
      "--radius-md": "8px",
      "--radius-lg": "12px",
      "--shadow": "0 6px 18px rgba(38, 50, 61, 0.28)",
      "--deco-sparkle": "·",
      "--deco-heart": "♡",
      "--deco-flower": "·",
      "--deco-star": "✦",
    },
  },
};

export const defaultTheme: ThemeId = "sakura";
