export type SessionState = "study" | "leisure" | "paused";

export interface StateChange {
  state: SessionState;
  startedAt: number;
  endedAt: number | null;
}

export interface EnergyCheckIn {
  timestamp: number;
  level: 1 | 2 | 3 | 4 | 5;
}

export type GoalStatus = "pending" | "active" | "paused" | "completed";

export interface Goal {
  id: string;
  name: string;
  description: string;
  status: GoalStatus;
  createdAt: number;
  startedAt: number | null;
  pausedAt: number | null;
  completedAt: number | null;
  expectedDifficulty: 1 | 2 | 3 | 4 | 5;
  actualDifficulty: 1 | 2 | 3 | 4 | 5 | null;
  activeTime: number;
  linkedSessionId: string | null;
}

export interface StudySession {
  id: string;
  startedAt: number;
  endedAt: number | null;
  currentState: SessionState;
  stateHistory: StateChange[];
  energyCheckIns: EnergyCheckIn[];
}

export interface DayStats {
  date: string;
  totalStudyMs: number;
  totalLeisureMs: number;
  sessionsCount: number;
  avgEnergy: number | null;
  goalsCompleted: number;
}

export interface StatsSummary {
  today: DayStats;
  last3: DayStats[];
  last7: DayStats[];
  last15: DayStats[];
  last30: DayStats[];
  continuousRecordMs: number;
  maxBreakMs: number;
  goalDifficultyAnalysis: {
    avgExpected: number;
    avgActual: number;
    count: number;
  } | null;
}
