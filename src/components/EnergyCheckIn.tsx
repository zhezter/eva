interface Props {
  onSelect: (level: 1 | 2 | 3 | 4 | 5) => void;
  onDismiss: () => void;
}

const LEVELS = [
  { value: 1 as const, label: "Agotada", icon: "😰" },
  { value: 2 as const, label: "Cansada", icon: "😩" },
  { value: 3 as const, label: "Neutral", icon: "😐" },
  { value: 4 as const, label: "Bien", icon: "😊" },
  { value: 5 as const, label: "Con energía", icon: "⚡" },
];

export function EnergyCheckIn({ onSelect, onDismiss }: Props) {
  return (
    <div className="energy-checkin">
      <div className="energy-checkin__header">
        <span className="energy-checkin__icon">🌸</span>
        <h3 className="energy-checkin__title">¿Cómo vas?</h3>
      </div>
      <p className="energy-checkin__subtitle">Llevas un rato. ¿Cómo te sientes?</p>
      <div className="energy-checkin__options">
        {LEVELS.map(({ value, label, icon }) => (
          <button
            key={value}
            className={`btn btn--energy btn--energy-${value}`}
            onClick={() => onSelect(value)}
          >
            <span className="btn__icon">{icon}</span>
            <span className="btn__label">{label}</span>
          </button>
        ))}
      </div>
      <button className="btn btn--small btn--ghost" onClick={onDismiss}>
        Ahora no
      </button>
    </div>
  );
}
