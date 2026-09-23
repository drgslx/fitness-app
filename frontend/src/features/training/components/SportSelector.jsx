import React from "react";

export default function SportSelector({
  sports,
  selectedId,
  onSelect,
  disabled = false,
}) {
  if (!sports.length) {
    return <p>Nu exista sporturi disponibile.</p>;
  }

  return (
    <div className="actions" role="group" aria-label="Alege sportul">
      {sports.map((sport) => {
        const selected = sport.id === selectedId;

        return (
          <button
            key={sport.id}
            type="button"
            disabled={disabled}
            className={selected ? "selected" : ""}
            aria-pressed={selected}
            onClick={() => onSelect(sport.id)}
          >
            {sport.name}
          </button>
        );
      })}
    </div>
  );
}