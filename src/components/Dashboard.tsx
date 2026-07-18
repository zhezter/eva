import { useState } from "react";
import { useSession } from "../hooks/useSession";
import { useGoals } from "../hooks/useGoals";
import { useStatistics } from "../hooks/useStatistics";
import { SessionPanel } from "./SessionPanel";
import { StatisticsPanel } from "./StatisticsPanel";
import { GoalsPanel } from "./GoalsPanel";
import { EnergyCheckIn } from "./EnergyCheckIn";
import { EnergyHistogram } from "./EnergyHistogram";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { getAllSessions } from "../lib/storage";

type Tab = "session" | "goals" | "stats";
type StatsSubTab = "summary" | "energy";

interface DashboardProps {
  onToggleMini: () => void;
}

export function Dashboard({ onToggleMini }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("session");
  const [statsSubTab, setStatsSubTab] = useState<StatsSubTab>("summary");

  const {
    session,
    elapsed,
    studyElapsed,
    currentState,
    showCheckIn,
    needsInitialCheckIn,
    requestStartSession,
    confirmStartSession,
    cancelStartSession,
    toggleState,
    pauseSession,
    endSession,
    addCheckIn,
    dismissCheckIn,
  } = useSession();

  const {
    goals,
    createGoal,
    startGoal,
    pauseGoal,
    resumeGoal,
    completeGoal,
    deleteGoal,
    getGoalActiveTime,
    refreshGoals,
  } = useGoals();

  const { stats, refreshStats } = useStatistics();

  const handleEndSession = () => {
    endSession();
    refreshStats();
    refreshGoals();
  };

  const handleToggle = () => {
    toggleState();
    refreshGoals();
  };

  const handlePause = () => {
    pauseSession();
    refreshGoals();
  };

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__title-row">
          <h1 className="dashboard__title">
            <span className="dashboard__logo">EVA</span>
          </h1>
          <div className="dashboard__header-actions">
            {session && !session.endedAt && (
              <button className="btn btn--small btn--secondary" onClick={onToggleMini}>
                Modo mini
              </button>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <nav className="dashboard__tabs">
        <button
          className={`dashboard__tab ${activeTab === "session" ? "dashboard__tab--active" : ""}`}
          onClick={() => setActiveTab("session")}
        >
          Sesión
        </button>
        <button
          className={`dashboard__tab ${activeTab === "goals" ? "dashboard__tab--active" : ""}`}
          onClick={() => setActiveTab("goals")}
        >
          Metas
          {goals.filter((g) => g.status !== "completed").length > 0 && (
            <span className="dashboard__tab-badge">
              {goals.filter((g) => g.status !== "completed").length}
            </span>
          )}
        </button>
        <button
          className={`dashboard__tab ${activeTab === "stats" ? "dashboard__tab--active" : ""}`}
          onClick={() => { setActiveTab("stats"); refreshStats(); }}
        >
          Estadísticas
        </button>
      </nav>

      <main className="dashboard__main">
        {activeTab === "session" && (
          <>
            <section className="dashboard__session-card">
              <SessionPanel
                session={session}
                elapsed={elapsed}
                studyElapsed={studyElapsed}
                currentState={currentState}
                needsInitialCheckIn={needsInitialCheckIn}
                onStartRequest={requestStartSession}
                onConfirmStart={confirmStartSession}
                onCancelStart={cancelStartSession}
                onToggle={handleToggle}
                onPause={handlePause}
                onEnd={handleEndSession}
              />
            </section>

            {showCheckIn && (
              <EnergyCheckIn onSelect={addCheckIn} onDismiss={dismissCheckIn} />
            )}

            {session && !session.endedAt && (
              <section className="dashboard__session-mini-goals">
                <h3 className="dashboard__section-title">Metas activas</h3>
                {goals.filter((g) => g.status === "active").length === 0 ? (
                  <p className="dashboard__empty-hint">
                    No tienes metas activas. Ve a la pestaña de Metas para crear una.
                  </p>
                ) : (
                  <div className="dashboard__mini-goals-list">
                    {goals.filter((g) => g.status === "active").map((goal) => (
                      <div key={goal.id} className="mini-goal">
                        <span className="mini-goal__name">{goal.name}</span>
                        <span className="mini-goal__time">{formatMs(getGoalActiveTime(goal))}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {activeTab === "goals" && (
          <section className="dashboard__goals-card">
            <GoalsPanel
              goals={goals}
              sessionState={currentState}
              sessionId={session?.id ?? null}
              onCreateGoal={createGoal}
              onStartGoal={startGoal}
              onPauseGoal={pauseGoal}
              onResumeGoal={resumeGoal}
              onCompleteGoal={completeGoal}
              onDeleteGoal={deleteGoal}
              getGoalActiveTime={getGoalActiveTime}
            />
          </section>
        )}

        {activeTab === "stats" && (
          <>
            <div className="dashboard__stats-subtabs">
              <button
                className={`dashboard__stats-subtab ${statsSubTab === "summary" ? "dashboard__stats-subtab--active" : ""}`}
                onClick={() => setStatsSubTab("summary")}
              >
                Resumen
              </button>
              <button
                className={`dashboard__stats-subtab ${statsSubTab === "energy" ? "dashboard__stats-subtab--active" : ""}`}
                onClick={() => setStatsSubTab("energy")}
              >
                Energía
              </button>
            </div>

            {statsSubTab === "summary" && (
              <section className="dashboard__stats-card">
                <StatisticsPanel stats={stats} onRefresh={refreshStats} />
              </section>
            )}

            {statsSubTab === "energy" && (
              <section className="dashboard__stats-card">
                <EnergyHistogram sessions={getAllSessions()} />
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
