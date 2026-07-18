import { useState } from "react";
import { StatsSummary } from "../lib/types";
import { formatMs } from "../lib/storage";

interface Props {
  stats: StatsSummary | null;
  onRefresh: () => void;
}

type RangeKey = "today" | "last3" | "last7" | "last15" | "last30";

const RANGE_LABELS: Record<RangeKey, string> = {
  today: "Hoy",
  last3: "3 días",
  last7: "7 días",
  last15: "15 días",
  last30: "30 días",
};

export function StatisticsPanel({ stats, onRefresh }: Props) {
  const [range, setRange] = useState<RangeKey>("today");

  if (!stats) {
    return (
      <div className="stats-panel">
        <h2 className="stats-panel__title">Estadísticas</h2>
        <button className="btn btn--small" onClick={onRefresh}>
          Cargar datos
        </button>
      </div>
    );
  }

  const dayStats = (range === "today" ? [stats.today] : stats[range]) as Array<{
    totalStudyMs: number;
    totalLeisureMs: number;
    sessionsCount: number;
    goalsCompleted: number;
    avgEnergy: number | null;
  }>;
  const totalStudyMs = dayStats.reduce((acc, d) => acc + d.totalStudyMs, 0);
  const totalLeisureMs = dayStats.reduce((acc, d) => acc + d.totalLeisureMs, 0);
  const totalSessions = dayStats.reduce((acc, d) => acc + d.sessionsCount, 0);
  const totalGoals = dayStats.reduce((acc, d) => acc + d.goalsCompleted, 0);
  const avgEnergy =
    dayStats
      .filter((d) => d.avgEnergy !== null)
      .reduce((acc, d) => acc + (d.avgEnergy ?? 0), 0) /
      Math.max(1, dayStats.filter((d) => d.avgEnergy !== null).length) || null;

  return (
    <div className="stats-panel">
      <h2 className="stats-panel__title">Estadísticas</h2>

      <div className="stats-panel__ranges">
        {(Object.keys(RANGE_LABELS) as RangeKey[]).map((key) => (
          <button
            key={key}
            className={`btn btn--small ${range === key ? "btn--active" : ""}`}
            onClick={() => setRange(key)}
          >
            {RANGE_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="stats-panel__cards">
        <div className="stats-card">
          <span className="stats-card__label">Tiempo de estudio</span>
          <span className="stats-card__value stats-card__value--study">
            {formatMs(totalStudyMs)}
          </span>
        </div>
        <div className="stats-card">
          <span className="stats-card__label">Tiempo de descanso</span>
          <span className="stats-card__value">{formatMs(totalLeisureMs)}</span>
        </div>
        <div className="stats-card">
          <span className="stats-card__label">Sesiones</span>
          <span className="stats-card__value">{totalSessions}</span>
        </div>
        <div className="stats-card">
          <span className="stats-card__label">Metas completadas</span>
          <span className="stats-card__value">{totalGoals}</span>
        </div>
        {avgEnergy !== null && (
          <div className="stats-card">
            <span className="stats-card__label">Energía promedio</span>
            <span className="stats-card__value">
              {avgEnergy.toFixed(1)} / 5
            </span>
          </div>
        )}
      </div>

      <div className="stats-panel__records">
        <h3 className="stats-panel__subtitle">Récords</h3>
        <div className="stats-panel__record">
          <span className="stats-panel__record-label">Racha continua más larga</span>
          <span className="stats-panel__record-value">{formatMs(stats.continuousRecordMs)}</span>
        </div>
        <div className="stats-panel__record">
          <span className="stats-panel__record-label">Descanso más largo</span>
          <span className="stats-panel__record-value">{formatMs(stats.maxBreakMs)}</span>
        </div>
        {stats.goalDifficultyAnalysis && (
          <div className="stats-panel__record">
            <span className="stats-panel__record-label">
              Análisis de dificultad ({stats.goalDifficultyAnalysis.count} metas)
            </span>
            <span className="stats-panel__record-value">
              Esperada: {stats.goalDifficultyAnalysis.avgExpected.toFixed(1)} →
              Real: {stats.goalDifficultyAnalysis.avgActual.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
