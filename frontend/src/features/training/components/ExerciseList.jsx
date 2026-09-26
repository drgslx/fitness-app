import React from "react";

const trackingLabels = {
  strength: "Seturi, repetari si kg",
  repetitions: "Repetari",
  duration: "Runde / minute",
  distance: "Distanta si timp",
  mixed: "Mixt",
};

export default function ExerciseList({
  exercises,
  onArchive,
  loading = false,
  disabled = false,
}) {
  if (loading) {
    return <p role="status">Se incarca exercitiile...</p>;
  }

  if (!exercises.length) {
    return <p>Nu ai exercitii pentru acest sport.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
      {exercises.map((exercise) => (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-lg transition-colors hover:border-accent/30 p-4" key={exercise.id}>
          <strong>{exercise.name}</strong>

          <p>
            {trackingLabels[exercise.tracking_type] ??
              exercise.tracking_type}
          </p>

          {exercise.is_system ? (
            <small>Exercitiu standard</small>
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onArchive(exercise)}
            >
              Arhiveaza
            </button>
          )}
        </article>
      ))}
    </div>
  );
}