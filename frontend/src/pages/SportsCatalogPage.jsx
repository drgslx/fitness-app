import React from "react";
import SportSelector from "../features/training/components/SportSelector";
import ExerciseForm from "../features/training/components/ExerciseForm";
import ExerciseList from "../features/training/components/ExerciseList";
import { useSportsCatalog } from "../features/training/hooks/useSportsCatalog";

export default function SportsCatalogPage() {
  const {
    sports,
    selectedSport,
    exercises,
    loadingSports,
    loadingExercises,
    saving,
    error,
    message,
    selectSport,
    addExercise,
    archiveSport,
    archiveExercise,
  } = useSportsCatalog();

  return (
    <section className="my-4 flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-surface/90 p-4 shadow-xl gap-4">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-3 md:flex-row md:items-start md:justify-between">
        <h2>Catalog personal de sporturi</h2>

        <p>
          Selecteaza un sport pentru a vedea si configura exercitiile.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-400/30 bg-[#321a18] px-3 py-2 text-[#ffaaaa]" role="alert">
          {error}
        </p>
      )}

      {message && <p role="status">{message}</p>}

      <div className="rounded-xl border border-white/10 bg-ink/70 p-4">
        <h3>Sporturile mele</h3>

        {loadingSports ? (
          <p role="status">Se incarca sporturile...</p>
        ) : (
          <SportSelector
            sports={sports}
            selectedId={selectedSport?.id}
            onSelect={selectSport}
            disabled={saving}
          />
        )}
      </div>

      {selectedSport && (
        <div className="rounded-xl border border-white/10 bg-ink/70 p-4">
          <div className="mb-3 flex flex-col justify-between gap-3 md:flex-row">
            <div>
              <span className="mb-2 block text-xs font-bold uppercase tracking-[.14em] text-accent">Sport selectat</span>
              <h3>{selectedSport.name}</h3>

              <p>
                Configureaza exercitiile disponibile pentru acest sport.
              </p>
            </div>

            {!selectedSport.is_system && (
              <button
                type="button"
                className="!border-[#82433f] !bg-[#321a18] !text-[#ffaaa3] hover:!border-[#ff766e] hover:!bg-[#46211e]"
                disabled={saving}
                onClick={() => archiveSport(selectedSport)}
              >
                Sterge sportul
              </button>
            )}
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-[minmax(280px,.85fr)_minmax(340px,1.15fr)]">
            <div className="w-full max-w-[720px] rounded-xl border border-white/10 bg-ink/70 p-4">
              <h3>Adauga exercitiu</h3>

              <ExerciseForm
                key={selectedSport.id}
                onSubmit={addExercise}
                disabled={saving || loadingExercises}
              />
            </div>

            <div className="rounded-xl border border-white/10 bg-ink/70 p-4">
              <h3>Exercitii existente</h3>

              <ExerciseList
                exercises={exercises}
                loading={loadingExercises}
                disabled={saving}
                onArchive={archiveExercise}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}