import { useState, useCallback, useEffect } from "react";
import { Goal } from "../lib/types";
import * as storage from "../lib/storage";

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(() => storage.getAllGoals());

  const refreshGoals = useCallback(() => {
    setGoals(storage.getAllGoals());
  }, []);

  useEffect(() => {
    refreshGoals();
  }, [refreshGoals]);

  const createGoal = useCallback(
    (name: string, description: string, expectedDifficulty: 1 | 2 | 3 | 4 | 5, linkedSessionId: string | null) => {
      const goal = storage.createGoal(name, description, expectedDifficulty, linkedSessionId);
      refreshGoals();
      return goal;
    },
    [refreshGoals]
  );

  const startGoal = useCallback(
    (goalId: string) => {
      storage.startGoal(goalId);
      refreshGoals();
    },
    [refreshGoals]
  );

  const pauseGoal = useCallback(
    (goalId: string) => {
      storage.pauseGoal(goalId);
      refreshGoals();
    },
    [refreshGoals]
  );

  const resumeGoal = useCallback(
    (goalId: string) => {
      storage.resumeGoal(goalId);
      refreshGoals();
    },
    [refreshGoals]
  );

  const completeGoal = useCallback(
    (goalId: string, actualDifficulty: 1 | 2 | 3 | 4 | 5) => {
      storage.completeGoal(goalId, actualDifficulty);
      refreshGoals();
    },
    [refreshGoals]
  );

  const deleteGoal = useCallback(
    (goalId: string) => {
      storage.deleteGoal(goalId);
      refreshGoals();
    },
    [refreshGoals]
  );

  const getGoalActiveTime = useCallback((goal: Goal): number => {
    if (!goal.startedAt) return goal.activeTime;
    const now = Date.now();
    if (goal.status === "active") {
      return goal.activeTime + (now - goal.startedAt);
    }
    return goal.activeTime;
  }, []);

  return {
    goals,
    createGoal,
    startGoal,
    pauseGoal,
    resumeGoal,
    completeGoal,
    deleteGoal,
    getGoalActiveTime,
    refreshGoals,
  };
}
