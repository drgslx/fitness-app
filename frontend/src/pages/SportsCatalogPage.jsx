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
    <section className="panel sports-catalog-page">
      <div className="page-heading">
        <h2>Catalog personal de sporturi</h2>

        <p>
          Selecteaza un sport pentru a vedea si configura exercitiile.
        </p>
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {message && <p role="status">{message}</p>}

      <div className="catalog-section">
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
        <div className="selected-sport-panel">
          <div className="catalog-section-heading">
            <div>
              <span className="section-eyebrow">Sport selectat</span>
              <h3>{selectedSport.name}</h3>

              <p>
                Configureaza exercitiile disponibile pentru acest sport.
              </p>
            </div>

            {!selectedSport.is_system && (
              <button
                type="button"
                className="danger-button"
                disabled={saving}
                onClick={() => archiveSport(selectedSport)}
              >
                Sterge sportul
              </button>
            )}
          </div>

          <div className="catalog-content-grid">
            <div className="catalog-form-card">
              <h3>Adauga exercitiu</h3>

              <ExerciseForm
                key={selectedSport.id}
                onSubmit={addExercise}
                disabled={saving || loadingExercises}
              />
            </div>

            <div className="catalog-exercises">
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