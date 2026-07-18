import { useEffect, useState } from "react";
import { StudySession } from "../lib/types";
import * as storage from "../lib/storage";

interface Props {
  sessions: StudySession[];
}

const LEVEL_LABELS = ["", "😰", "😩", "😐", "😊", "⚡"];
const LEVEL_COLORS = ["", "#C47A8A", "#D4A574", "#9AA0C3", "#A8D4C4", "#7CB89E"];

export function EnergyHistogram({ sessions }: Props) {
  const [checkIns, setCheckIns] = useState<Array<{ timestamp: number; level: 1 | 2 | 3 | 4 | 5 }>>([]);

  useEffect(() => {
    setCheckIns(storage.getAllEnergyCheckIns(sessions));
  }, [sessions]);

  if (checkIns.length === 0) {
    return (
      <div className="energy-histogram">
        <h3 className="energy-histogram__title">Evolución del ánimo</h3>
        <p className="energy-histogram__empty">
          Aún no hay registros de energía. Empieza una sesión para empezar a registrar.
        </p>
      </div>
    );
  }

  const maxBarHeight = 120;

  return (
    <div className="energy-histogram">
      <h3 className="energy-histogram__title">Evolución del ánimo</h3>
      <div className="energy-histogram__chart">
        <div className="energy-histogram__y-axis">
          {[5, 4, 3, 2, 1].map((level) => (
            <div key={level} className="energy-histogram__y-label">
              <span>{LEVEL_LABELS[level]}</span>
            </div>
          ))}
        </div>
        <div className="energy-histogram__bars">
          {checkIns.map((ci, i) => {
            const height = (ci.level / 5) * maxBarHeight;
            const date = new Date(ci.timestamp);
            const timeStr = `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
            return (
              <div key={i} className="energy-histogram__bar-wrapper">
                <div
                  className="energy-histogram__bar"
                  style={{
                    height: `${height}px`,
                    backgroundColor: LEVEL_COLORS[ci.level],
                  }}
                  title={`${LEVEL_LABELS[ci.level]} - ${timeStr}`}
                />
                {checkIns.length <= 20 && (
                  <span className="energy-histogram__bar-label">{timeStr}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="energy-histogram__legend">
        {[1, 2, 3, 4, 5].map((level) => (
          <div key={level} className="energy-histogram__legend-item">
            <span
              className="energy-histogram__legend-dot"
              style={{ backgroundColor: LEVEL_COLORS[level] }}
            />
            <span>{LEVEL_LABELS[level]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
