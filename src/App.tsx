import { useState } from "react";
import { ThemeProvider } from "./themes/ThemeContext";
import { Dashboard } from "./components/Dashboard";
import { MiniWidget } from "./components/MiniWidget";
import { useMiniMode } from "./hooks/useMiniMode";
import "./styles/mini.css";

export default function App() {
  const { isMini, toggleMiniMode, exitMiniMode } = useMiniMode();

  return (
    <ThemeProvider>
      {isMini ? (
        <MiniWidget onExitMini={exitMiniMode} />
      ) : (
        <Dashboard onToggleMini={toggleMiniMode} />
      )}
    </ThemeProvider>
  );
}
