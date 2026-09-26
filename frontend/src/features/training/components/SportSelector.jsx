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
    <div className="my-3 flex flex-wrap items-center gap-2" role="group" aria-label="Alege sportul">
      {sports.map((sport) => {
        const selected = sport.id === selectedId;

        return (
          <button
            key={sport.id}
            type="button"
            disabled={disabled}
            className={selected ? "!border-accent !bg-accent !text-ink hover:!bg-[#8affad] hover:!text-ink" : ""}
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