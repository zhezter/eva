import { useState, useCallback } from "react";
import { StatsSummary } from "../lib/types";
import * as storage from "../lib/storage";

export function useStatistics() {
  const [stats, setStats] = useState<StatsSummary | null>(null);

  const refreshStats = useCallback(() => {
    const sessions = storage.getAllSessions();
    const goals = storage.getAllGoals();
    setStats(storage.computeStats(sessions, goals));
  }, []);

  const getStats = useCallback((): StatsSummary => {
    const sessions = storage.getAllSessions();
    const goals = storage.getAllGoals();
    return storage.computeStats(sessions, goals);
  }, []);

  return { stats, refreshStats, getStats };
}
