import { StudySession, SessionState, EnergyCheckIn } from "../lib/types";
import { formatMs } from "../lib/storage";

interface Props {
  session: StudySession | null;
  elapsed: number;
  studyElapsed: number;
  currentState: SessionState | null;
  needsInitialCheckIn: boolean;
  onStartRequest: () => void;
  onConfirmStart: (level: EnergyCheckIn["level"]) => void;
  onCancelStart: () => void;
  onToggle: () => void;
  onPause: () => void;
  onEnd: () => void;
}

const STATE_LABELS: Record<SessionState, string> = {
  study: "Estudiando",
  leisure: "Descansando",
  paused: "Pausada",
};

const STATE_ICONS: Record<SessionState, string> = {
  study: "📖",
  leisure: "☕",
  paused: "⏸️",
};

const ENERGY_LEVELS = [
  { value: 1 as const, label: "Agotada", icon: "😰" },
  { value: 2 as const, label: "Cansada", icon: "😩" },
  { value: 3 as const, label: "Neutral", icon: "😐" },
  { value: 4 as const, label: "Bien", icon: "😊" },
  { value: 5 as const, label: "Con energía", icon: "⚡" },
];

export function SessionPanel({
  session,
  elapsed,
  studyElapsed,
  currentState,
  needsInitialCheckIn,
  onStartRequest,
  onConfirmStart,
  onCancelStart,
  onToggle,
  onPause,
  onEnd,
}: Props) {
  if (needsInitialCheckIn) {
    return (
      <div className="session-panel">
        <div className="session-panel__initial-checkin">
          <div className="session-panel__decoration">
            <span className="deco deco--star">✦</span>
            <span className="deco deco--heart">♡</span>
            <span className="deco deco--star">✦</span>
          </div>
          <h2 className="session-panel__prompt">¿Cómo te sientes?</h2>
          <p className="session-panel__prompt-sub">Antes de empezar, cuéntame tu estado</p>
          <div className="session-panel__energy-options">
            {ENERGY_LEVELS.map(({ value, label, icon }) => (
              <button
                key={value}
                className={`btn btn--energy btn--energy-${value}`}
                onClick={() => onConfirmStart(value)}
              >
                <span className="btn__icon">{icon}</span>
                <span className="btn__label">{label}</span>
              </button>
            ))}
          </div>
          <button className="btn btn--small btn--ghost" onClick={onCancelStart}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  if (!session || session.endedAt) {
    return (
      <div className="session-panel">
        <div className="session-panel__idle">
          <div className="session-panel__decoration">
            <span className="deco deco--star">✦</span>
            <span className="deco deco--heart">♡</span>
            <span className="deco deco--star">✦</span>
          </div>
          <h2 className="session-panel__prompt">¿Lista para empezar?</h2>
          <button className="btn btn--primary btn--large" onClick={onStartRequest}>
            Empezar a estudiar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="session-panel">
      <div className="session-panel__status">
        <span className="session-panel__state-icon">
          {STATE_ICONS[currentState ?? "study"]}
        </span>
        <span className={`session-panel__state-label session-panel__state-label--${currentState}`}>
          {STATE_LABELS[currentState ?? "study"]}
        </span>
      </div>

      <div className="session-panel__timers">
        <div className="session-panel__timer">
          <span className="session-panel__timer-label">Tiempo total</span>
          <span className="session-panel__timer-value">{formatMs(elapsed)}</span>
        </div>
        <div className="session-panel__timer">
          <span className="session-panel__timer-label">Tiempo de estudio</span>
          <span className="session-panel__timer-value session-panel__timer-value--study">
            {formatMs(studyElapsed)}
          </span>
        </div>
      </div>

      <div className="session-panel__controls">
        <button
          className={`btn btn--large ${
            currentState === "study" ? "btn--leisure" : "btn--primary"
          }`}
          onClick={onToggle}
        >
          {currentState === "study" ? "Descansar" : "Volver a estudiar"}
        </button>

        <button
          className="btn btn--secondary"
          onClick={onPause}
          disabled={currentState === "paused"}
        >
          Pausar sesión
        </button>

        <button className="btn btn--danger" onClick={onEnd}>
          Terminar sesión
        </button>
      </div>
    </div>
  );
}
