import { useState } from "react";
import { Goal, SessionState } from "../lib/types";
import { formatMs } from "../lib/storage";
import { GoalForm } from "./GoalForm";

interface Props {
  goals: Goal[];
  sessionState: SessionState | null;
  sessionId: string | null;
  onCreateGoal: (
    name: string,
    description: string,
    expectedDifficulty: 1 | 2 | 3 | 4 | 5,
    linkedSessionId: string | null
  ) => Goal;
  onStartGoal: (goalId: string) => void;
  onPauseGoal: (goalId: string) => void;
  onResumeGoal: (goalId: string) => void;
  onCompleteGoal: (goalId: string, actualDifficulty: 1 | 2 | 3 | 4 | 5) => void;
  onDeleteGoal: (goalId: string) => void;
  getGoalActiveTime: (goal: Goal) => number;
}

const DIFFICULTY_LABELS = ["", "Muy fácil", "Fácil", "Normal", "Difícil", "Muy difícil"];

export function GoalsPanel({
  goals,
  sessionState,
  sessionId,
  onCreateGoal,
  onStartGoal,
  onPauseGoal,
  onResumeGoal,
  onCompleteGoal,
  onDeleteGoal,
  getGoalActiveTime,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [completingGoal, setCompletingGoal] = useState<Goal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);

  const handleCreate = (
    name: string,
    description: string,
    expectedDifficulty: 1 | 2 | 3 | 4 | 5
  ) => {
    onCreateGoal(name, description, expectedDifficulty, sessionId);
    setShowForm(false);
  };

  const handleComplete = (actualDifficulty: 1 | 2 | 3 | 4 | 5) => {
    if (completingGoal) {
      onCompleteGoal(completingGoal.id, actualDifficulty);
      setCompletingGoal(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingGoal) {
      onDeleteGoal(deletingGoal.id);
      setDeletingGoal(null);
    }
  };

  const pendingGoals = goals.filter((g) => g.status === "pending");
  const activeGoals = goals.filter((g) => g.status === "active");
  const pausedGoals = goals.filter((g) => g.status === "paused");
  const completedGoals = goals.filter((g) => g.status === "completed");

  return (
    <div className="goals-panel">
      <div className="goals-panel__header">
        <h2 className="goals-panel__title">Metas</h2>
        {!showForm && !completingGoal && !deletingGoal && (
          <button className="btn btn--small btn--primary" onClick={() => setShowForm(true)}>
            + Nueva meta
          </button>
        )}
      </div>

      {showForm && (
        <GoalForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {completingGoal && (
        <div className="goals-panel__complete-form">
          <h3 className="goals-panel__complete-title">
            ¿Qué tan difícil fue "{completingGoal.name}"?
          </h3>
          <div className="goals-panel__difficulty-buttons">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                className={`btn btn--difficulty btn--difficulty-${level}`}
                onClick={() => handleComplete(level as 1 | 2 | 3 | 4 | 5)}
              >
                {DIFFICULTY_LABELS[level]}
              </button>
            ))}
          </div>
          <button className="btn btn--small" onClick={() => setCompletingGoal(null)}>
            Cancelar
          </button>
        </div>
      )}

      {deletingGoal && (
        <div className="goals-panel__delete-confirm">
          <p className="goals-panel__delete-text">
            ¿Eliminar "<strong>{deletingGoal.name}</strong>"?
          </p>
          <p className="goals-panel__delete-warning">Esta acción no se puede deshacer.</p>
          <div className="goals-panel__delete-actions">
            <button className="btn btn--small" onClick={() => setDeletingGoal(null)}>
              Cancelar
            </button>
            <button className="btn btn--small btn--danger" onClick={handleConfirmDelete}>
              Eliminar
            </button>
          </div>
        </div>
      )}

      {goals.length === 0 && !showForm && (
        <div className="goals-panel__empty">
          <p>No hay metas aún. Crea una para empezar a registrar tu tiempo.</p>
        </div>
      )}

      {activeGoals.length > 0 && (
        <div className="goals-panel__section">
          <h3 className="goals-panel__section-title">Activas</h3>
          <div className="goals-panel__list">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                getGoalActiveTime={getGoalActiveTime}
                onPause={() => onPauseGoal(goal.id)}
                onComplete={() => setCompletingGoal(goal)}
                onDelete={() => setDeletingGoal(goal)}
              />
            ))}
          </div>
        </div>
      )}

      {pausedGoals.length > 0 && (
        <div className="goals-panel__section">
          <h3 className="goals-panel__section-title">Pausadas</h3>
          <div className="goals-panel__list">
            {pausedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                getGoalActiveTime={getGoalActiveTime}
                onResume={() => onResumeGoal(goal.id)}
                onComplete={() => setCompletingGoal(goal)}
                onDelete={() => setDeletingGoal(goal)}
              />
            ))}
          </div>
        </div>
      )}

      {pendingGoals.length > 0 && (
        <div className="goals-panel__section">
          <h3 className="goals-panel__section-title">Pendientes</h3>
          <div className="goals-panel__list">
            {pendingGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                getGoalActiveTime={getGoalActiveTime}
                onStart={() => onStartGoal(goal.id)}
                onDelete={() => setDeletingGoal(goal)}
              />
            ))}
          </div>
        </div>
      )}

      {completedGoals.length > 0 && (
        <div className="goals-panel__section">
          <h3 className="goals-panel__section-title">Completadas</h3>
          <div className="goals-panel__list">
            {completedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                getGoalActiveTime={getGoalActiveTime}
                onDelete={() => setDeletingGoal(goal)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GoalCard({
  goal,
  getGoalActiveTime,
  onStart,
  onPause,
  onResume,
  onComplete,
  onDelete,
}: {
  goal: Goal;
  getGoalActiveTime: (g: Goal) => number;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onComplete?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className={`goal-card goal-card--${goal.status}`}>
      <div className="goal-card__info">
        <h3 className="goal-card__name">{goal.name}</h3>
        {goal.description && (
          <p className="goal-card__description">{goal.description}</p>
        )}
        <div className="goal-card__meta">
          <span className={`goal-card__status goal-card__status--${goal.status}`}>
            {goal.status === "pending" && "Pendiente"}
            {goal.status === "active" && "Activa"}
            {goal.status === "paused" && "Pausada"}
            {goal.status === "completed" && "Completada"}
          </span>
          <span className="goal-card__difficulty">
            Esperada: {DIFFICULTY_LABELS[goal.expectedDifficulty]}
          </span>
          {goal.actualDifficulty !== null && (
            <span className="goal-card__difficulty">
              Real: {DIFFICULTY_LABELS[goal.actualDifficulty]}
            </span>
          )}
        </div>
      </div>

      <div className="goal-card__time">
        <span className="goal-card__time-value">{formatMs(getGoalActiveTime(goal))}</span>
      </div>

      <div className="goal-card__actions">
        {onStart && (
          <button className="btn btn--small btn--primary" onClick={onStart}>
            Iniciar
          </button>
        )}
        {onPause && (
          <button className="btn btn--small btn--secondary" onClick={onPause}>
            Pausar
          </button>
        )}
        {onResume && (
          <button className="btn btn--small btn--primary" onClick={onResume}>
            Reanudar
          </button>
        )}
        {onComplete && (
          <button className="btn btn--small btn--primary" onClick={onComplete}>
            Completar
          </button>
        )}
        {onDelete && (
          <button className="btn btn--small btn--ghost" onClick={onDelete} title="Eliminar">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
