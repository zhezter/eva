import { useSession } from "../hooks/useSession";
import { formatMs } from "../lib/storage";
import { getCurrentWindow } from "@tauri-apps/api/window";

interface MiniWidgetProps {
  onExitMini: () => void;
}

export function MiniWidget({ onExitMini }: MiniWidgetProps) {
  const { session, elapsed, currentState, toggleState, endSession } = useSession();

  const handleDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    getCurrentWindow().startDragging();
  };

  if (!session || session.endedAt) {
    return (
      <div className="mini-widget" onMouseDown={handleDrag}>
        <span className="mini-widget__idle">EVA sin sesión activa</span>
        <button
          className="mini-widget__btn mini-widget__btn--expand"
          onClick={(e) => { e.stopPropagation(); onExitMini(); }}
          title="Expandir"
        >
          ↗
        </button>
      </div>
    );
  }

  return (
    <div className="mini-widget" onMouseDown={handleDrag}>
      <div className="mini-widget__status">
        <span className={`mini-widget__dot mini-widget__dot--${currentState}`} />
        <span className="mini-widget__time">{formatMs(elapsed)}</span>
      </div>
      <div className="mini-widget__controls">
        <button
          className={`mini-widget__btn mini-widget__btn--toggle mini-widget__btn--${currentState}`}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={toggleState}
          title={currentState === "study" ? "Descansar" : "Volver a estudiar"}
        >
          {currentState === "study" ? "☕" : "📖"}
        </button>
        <button
          className="mini-widget__btn mini-widget__btn--stop"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={endSession}
          title="Terminar sesión"
        >
          ⏹
        </button>
        <button
          className="mini-widget__btn mini-widget__btn--expand"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onExitMini(); }}
          title="Expandir"
        >
          ↗
        </button>
      </div>
    </div>
  );
}
