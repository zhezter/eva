import { useState } from "react";

interface Props {
  onSubmit: (
    name: string,
    description: string,
    expectedDifficulty: 1 | 2 | 3 | 4 | 5
  ) => void;
  onCancel: () => void;
}

const DIFFICULTY_LABELS = ["", "Muy fácil", "Fácil", "Normal", "Difícil", "Muy difícil"];

export function GoalForm({ onSubmit, onCancel }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), description.trim(), difficulty);
  };

  return (
    <form className="goal-form" onSubmit={handleSubmit}>
      <h3 className="goal-form__title">Nueva meta</h3>

      <div className="goal-form__field">
        <label className="goal-form__label">Nombre de la meta</label>
        <input
          className="goal-form__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Leer capítulo 3"
          autoFocus
        />
      </div>

      <div className="goal-form__field">
        <label className="goal-form__label">Descripción (opcional)</label>
        <textarea
          className="goal-form__textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalles adicionales..."
          rows={2}
        />
      </div>

      <div className="goal-form__field">
        <label className="goal-form__label">
          ¿Qué tan difícil crees que será?
        </label>
        <div className="goal-form__difficulty">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              className={`btn btn--difficulty ${
                difficulty === level ? `btn--difficulty-${level} btn--selected` : ""
              }`}
              onClick={() => setDifficulty(level as 1 | 2 | 3 | 4 | 5)}
            >
              {DIFFICULTY_LABELS[level]}
            </button>
          ))}
        </div>
      </div>

      <div className="goal-form__actions">
        <button type="submit" className="btn btn--primary" disabled={!name.trim()}>
          Crear meta
        </button>
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
