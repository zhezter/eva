import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";

export function useMiniMode() {
  const [isMini, setIsMini] = useState(false);

  const toggleMiniMode = useCallback(async () => {
    const next = !isMini;
    try {
      await invoke("set_mini_mode", { mini: next });
      setIsMini(next);
    } catch (e) {
      console.error("Failed to toggle mini mode:", e);
    }
  }, [isMini]);

  const exitMiniMode = useCallback(async () => {
    if (!isMini) return;
    try {
      await invoke("set_mini_mode", { mini: false });
      setIsMini(false);
    } catch (e) {
      console.error("Failed to exit mini mode:", e);
    }
  }, [isMini]);

  return { isMini, toggleMiniMode, exitMiniMode };
}
