import {
  StudySession,
  SessionState,
  Goal,
  EnergyCheckIn,
  DayStats,
  StatsSummary,
} from "./types";

const SESSIONS_KEY = "eva:sessions";
const GOALS_KEY = "eva:goals";

function readSessions(): StudySession[] {
  const raw = localStorage.getItem(SESSIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StudySession[];
  } catch {
    return [];
  }
}

function writeSessions(sessions: StudySession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

function readGoals(): Goal[] {
  const raw = localStorage.getItem(GOALS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Goal[];
  } catch {
    return [];
  }
}

function writeGoals(goals: Goal[]) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

// ── Sessions ──

export function getAllSessions(): StudySession[] {
  return readSessions().sort((a, b) => b.startedAt - a.startedAt);
}

export function getActiveSession(): StudySession | null {
  return readSessions().find((s) => s.endedAt === null) ?? null;
}

export function startSession(): StudySession {
  const sessions = readSessions();
  const now = Date.now();
  const session: StudySession = {
    id: crypto.randomUUID(),
    startedAt: now,
    endedAt: null,
    currentState: "study",
    stateHistory: [{ state: "study", startedAt: now, endedAt: null }],
    energyCheckIns: [],
  };
  sessions.push(session);
  writeSessions(sessions);
  return session;
}

export function startSessionWithCheckIn(level: EnergyCheckIn["level"]): StudySession {
  const sessions = readSessions();
  const now = Date.now();
  const session: StudySession = {
    id: crypto.randomUUID(),
    startedAt: now,
    endedAt: null,
    currentState: "study",
    stateHistory: [{ state: "study", startedAt: now, endedAt: null }],
    energyCheckIns: [{ timestamp: now, level }],
  };
  sessions.push(session);
  writeSessions(sessions);
  return session;
}

export function toggleSessionState(sessionId: string): StudySession | null {
  const sessions = readSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx === -1) return null;

  const session = sessions[idx];
  if (session.endedAt !== null) return null;

  const now = Date.now();
  const currentHistory = session.stateHistory[session.stateHistory.length - 1];
  if (currentHistory) {
    currentHistory.endedAt = now;
  }

  let newState: SessionState;
  if (session.currentState === "study") {
    newState = "leisure";
  } else {
    newState = "study";
  }

  session.currentState = newState;
  session.stateHistory.push({ state: newState, startedAt: now, endedAt: null });

  syncGoalsWithSessionState(newState);
  writeSessions(sessions);
  return session;
}

export function pauseSession(sessionId: string): StudySession | null {
  const sessions = readSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx === -1) return null;

  const session = sessions[idx];
  if (session.endedAt !== null || session.currentState === "paused") return null;

  const now = Date.now();
  const currentHistory = session.stateHistory[session.stateHistory.length - 1];
  if (currentHistory) {
    currentHistory.endedAt = now;
  }

  session.currentState = "paused";
  session.stateHistory.push({ state: "paused", startedAt: now, endedAt: null });

  syncGoalsWithSessionState("paused");
  writeSessions(sessions);
  return session;
}

export function endSession(sessionId: string): void {
  const sessions = readSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx === -1) return;

  const session = sessions[idx];
  const now = Date.now();

  const currentHistory = session.stateHistory[session.stateHistory.length - 1];
  if (currentHistory && !currentHistory.endedAt) {
    currentHistory.endedAt = now;
  }

  session.endedAt = now;
  writeSessions(sessions);
}

export function addEnergyCheckIn(sessionId: string, level: EnergyCheckIn["level"]): void {
  const sessions = readSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx === -1) return;
  sessions[idx].energyCheckIns.push({ timestamp: Date.now(), level });
  writeSessions(sessions);
}

// ── Goals (global store) ──

export function getAllGoals(): Goal[] {
  return readGoals().sort((a, b) => b.createdAt - a.createdAt);
}

export function getActiveGoals(): Goal[] {
  return readGoals().filter((g) => g.status === "active" || g.status === "paused");
}

export function createGoal(
  name: string,
  description: string,
  expectedDifficulty: 1 | 2 | 3 | 4 | 5,
  linkedSessionId: string | null
): Goal {
  const goals = readGoals();
  const goal: Goal = {
    id: crypto.randomUUID(),
    name,
    description,
    status: "pending",
    createdAt: Date.now(),
    startedAt: null,
    pausedAt: null,
    completedAt: null,
    expectedDifficulty,
    actualDifficulty: null,
    activeTime: 0,
    linkedSessionId,
  };
  goals.push(goal);
  writeGoals(goals);
  return goal;
}

export function startGoal(goalId: string): void {
  const goals = readGoals();
  const goal = goals.find((g) => g.id === goalId);
  if (!goal || goal.status !== "pending") return;
  goal.status = "active";
  goal.startedAt = Date.now();
  writeGoals(goals);
}

export function pauseGoal(goalId: string): void {
  const goals = readGoals();
  const goal = goals.find((g) => g.id === goalId);
  if (!goal || goal.status !== "active") return;
  const now = Date.now();
  goal.status = "paused";
  goal.pausedAt = now;
  if (goal.startedAt) {
    goal.activeTime += now - goal.startedAt;
    goal.startedAt = null;
  }
  writeGoals(goals);
}

export function resumeGoal(goalId: string): void {
  const goals = readGoals();
  const goal = goals.find((g) => g.id === goalId);
  if (!goal || goal.status !== "paused") return;
  goal.status = "active";
  goal.startedAt = Date.now();
  goal.pausedAt = null;
  writeGoals(goals);
}

export function completeGoal(goalId: string, actualDifficulty: 1 | 2 | 3 | 4 | 5): void {
  const goals = readGoals();
  const goal = goals.find((g) => g.id === goalId);
  if (!goal) return;
  const now = Date.now();
  if (goal.status === "active" && goal.startedAt) {
    goal.activeTime += now - goal.startedAt;
    goal.startedAt = null;
  }
  goal.status = "completed";
  goal.completedAt = now;
  goal.actualDifficulty = actualDifficulty;
  writeGoals(goals);
}

export function deleteGoal(goalId: string): void {
  const goals = readGoals();
  const filtered = goals.filter((g) => g.id !== goalId);
  writeGoals(filtered);
}

function syncGoalsWithSessionState(newState: SessionState) {
  const goals = readGoals();
  let changed = false;
  for (const goal of goals) {
    if (goal.status === "active" && newState !== "study") {
      goal.status = "paused";
      goal.pausedAt = Date.now();
      changed = true;
    } else if (goal.status === "paused" && newState === "study") {
      goal.status = "active";
      goal.startedAt = Date.now();
      goal.pausedAt = null;
      changed = true;
    }
  }
  if (changed) writeGoals(goals);
}

// ── Stats ──

export function calculateStudyTimeMs(session: StudySession): number {
  let total = 0;
  for (const h of session.stateHistory) {
    if (h.state === "study") {
      const end = h.endedAt ?? Date.now();
      total += end - h.startedAt;
    }
  }
  return total;
}

export function calculateLeisureTimeMs(session: StudySession): number {
  let total = 0;
  for (const h of session.stateHistory) {
    if (h.state === "leisure") {
      const end = h.endedAt ?? Date.now();
      total += end - h.startedAt;
    }
  }
  return total;
}

function getDayStats(daySessions: StudySession[], goals: Goal[], dateStr: string): DayStats {
  let totalStudyMs = 0;
  let totalLeisureMs = 0;
  const allCheckIns: number[] = [];
  let goalsCompleted = 0;

  for (const s of daySessions) {
    totalStudyMs += calculateStudyTimeMs(s);
    totalLeisureMs += calculateLeisureTimeMs(s);
    for (const ci of s.energyCheckIns) {
      allCheckIns.push(ci.level);
    }
  }

  for (const g of goals) {
    if (g.status === "completed" && g.completedAt) {
      const gDay = new Date(g.completedAt).toISOString().slice(0, 10);
      if (gDay === dateStr) goalsCompleted++;
    }
  }

  return {
    date: dateStr,
    totalStudyMs,
    totalLeisureMs,
    sessionsCount: daySessions.length,
    avgEnergy: allCheckIns.length > 0
      ? allCheckIns.reduce((a, b) => a + b, 0) / allCheckIns.length
      : null,
    goalsCompleted,
  };
}

export function computeStats(sessions: StudySession[], goals: Goal[]): StatsSummary {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const todaySessions = sessions.filter(
    (s) => new Date(s.startedAt).toISOString().slice(0, 10) === todayStr
  );

  const dayStats: DayStats[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const daySessions = sessions.filter(
      (s) => new Date(s.startedAt).toISOString().slice(0, 10) === dateStr
    );
    dayStats.push(getDayStats(daySessions, goals, dateStr));
  }

  const continuousRecordMs = computeContinuousRecord(sessions);
  const maxBreakMs = computeMaxBreak(sessions);
  const goalDifficultyAnalysis = computeGoalDifficultyAnalysis(goals);

  return {
    today: getDayStats(todaySessions, goals, todayStr),
    last3: dayStats.slice(0, 3),
    last7: dayStats.slice(0, 7),
    last15: dayStats.slice(0, 15),
    last30: dayStats.slice(0, 30),
    continuousRecordMs,
    maxBreakMs,
    goalDifficultyAnalysis,
  };
}

function computeContinuousRecord(sessions: StudySession[]): number {
  let maxRecord = 0;
  for (const session of sessions) {
    let currentStreak = 0;
    for (const h of session.stateHistory) {
      if (h.state === "study") {
        const end = h.endedAt ?? Date.now();
        currentStreak += end - h.startedAt;
      } else {
        maxRecord = Math.max(maxRecord, currentStreak);
        currentStreak = 0;
      }
    }
    maxRecord = Math.max(maxRecord, currentStreak);
  }
  return maxRecord;
}

function computeMaxBreak(sessions: StudySession[]): number {
  let maxBreak = 0;
  for (const session of sessions) {
    for (const h of session.stateHistory) {
      if (h.state === "leisure" || h.state === "paused") {
        const end = h.endedAt ?? Date.now();
        maxBreak = Math.max(maxBreak, end - h.startedAt);
      }
    }
  }
  return maxBreak;
}

function computeGoalDifficultyAnalysis(goals: Goal[]) {
  let totalExpected = 0;
  let totalActual = 0;
  let count = 0;

  for (const goal of goals) {
    if (goal.status === "completed" && goal.actualDifficulty !== null) {
      totalExpected += goal.expectedDifficulty;
      totalActual += goal.actualDifficulty;
      count++;
    }
  }

  if (count === 0) return null;

  return {
    avgExpected: totalExpected / count,
    avgActual: totalActual / count,
    count,
  };
}

export function getAllEnergyCheckIns(sessions: StudySession[]): Array<{ timestamp: number; level: 1 | 2 | 3 | 4 | 5 }> {
  const all: Array<{ timestamp: number; level: 1 | 2 | 3 | 4 | 5 }> = [];
  for (const s of sessions) {
    for (const ci of s.energyCheckIns) {
      all.push(ci);
    }
  }
  return all.sort((a, b) => a.timestamp - b.timestamp);
}

export function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
