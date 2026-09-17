import React, { useEffect, useState } from "react";
import { api, send } from "../api/client";

export default function SportsCatalogPage() {
  const [sports, setSports] = useState([]);
  const [selectedSportId, setSelectedSportId] = useState("");
  const [exercises, setExercises] = useState([]);
  const [newSport, setNewSport] = useState("");
  const [newExercise, setNewExercise] = useState({
    name: "",
    tracking_type: "strength",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const selectedSport = sports.find(
    (sport) => sport.id === Number(selectedSportId)
  );

  async function loadSports(preferredId) {
    const data = await api("/sport-types");
    setSports(data);

    if (preferredId && data.some((sport) => sport.id === Number(preferredId))) {
      setSelectedSportId(String(preferredId));
    } else if (
      selectedSportId &&
      !data.some((sport) => sport.id === Number(selectedSportId))
    ) {
      setSelectedSportId("");
    }
  }

  async function loadExercises(sportId) {
    if (!sportId) {
      setExercises([]);
      return;
    }

    setExercises(await api(`/sport-types/${sportId}/exercises`));
  }

  async function action(fn) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await fn();
    } catch (currentError) {
      setError(currentError.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadSports().catch((currentError) => setError(currentError.message));
  }, []);

  useEffect(() => {
    loadExercises(selectedSportId).catch((currentError) =>
      setError(currentError.message)
    );
  }, [selectedSportId]);

  function submitSport(event) {
    event.preventDefault();

    action(async () => {
      const created = await send("/sport-types", "POST", { name: newSport });
      setNewSport("");
      await loadSports(created.id);
      setMessage("Sportul a fost adaugat.");
    });
  }

  function submitExercise(event) {
    event.preventDefault();

    action(async () => {
      await send(
        `/sport-types/${selectedSport.id}/exercises`,
        "POST",
        newExercise
      );
      setNewExercise({ name: "", tracking_type: "strength" });
      await loadExercises(selectedSport.id);
      setMessage("Exercitiul a fost adaugat.");
    });
  }

  function archiveSport(sport) {
    if (!window.confirm(`Arhivezi sportul "${sport.name}"?`)) return;

    action(async () => {
      await send(`/sport-types/${sport.id}`, "DELETE");
      setSelectedSportId("");
      setExercises([]);
      await loadSports();
      setMessage("Sportul a fost arhivat.");
    });
  }

  function archiveExercise(exercise) {
    if (!window.confirm(`Arhivezi exercitiul "${exercise.name}"?`)) return;

    action(async () => {
      await send(`/exercises/${exercise.id}`, "DELETE");
      await loadExercises(selectedSport.id);
      setMessage("Exercitiul a fost arhivat.");
    });
  }

  return (
    <section className="panel">
      <h2>Catalog personal de sporturi</h2>
      <p>
        Adauga sporturile tale, apoi configureaza exercitiile disponibile pentru
        fiecare sport.
      </p>

      {error && <p className="error" role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <form onSubmit={submitSport}>
        <h3>Adauga sport</h3>
        <label>
          Nume
          <input
            required
            maxLength={100}
            value={newSport}
            onChange={(event) => setNewSport(event.target.value)}
            placeholder="Ex: Sport de contact"
          />
        </label>
        <button disabled={busy}>Adauga sport</button>
      </form>

      {!!sports.length && (
        <>
          <h3>Sporturile mele</h3>
          <div className="actions">
            {sports.map((sport) => (
              <button
                key={sport.id}
                type="button"
                disabled={busy}
                onClick={() => setSelectedSportId(String(sport.id))}
              >
                {sport.name}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedSport && (
        <>
          <div className="actions">
            <h3>Exercitii pentru {selectedSport.name}</h3>
            <button
              type="button"
              disabled={busy}
              onClick={() => archiveSport(selectedSport)}
            >
              Arhiveaza sportul
            </button>
          </div>

          <form onSubmit={submitExercise}>
            <div className="form-grid">
              <label>
                Nume exercitiu
                <input
                  required
                  maxLength={160}
                  value={newExercise.name}
                  onChange={(event) =>
                    setNewExercise({ ...newExercise, name: event.target.value })
                  }
                />
              </label>

              <label>
                Cum este masurat
                <select
                  value={newExercise.tracking_type}
                  onChange={(event) =>
                    setNewExercise({
                      ...newExercise,
                      tracking_type: event.target.value,
                    })
                  }
                >
                  <option value="strength">Seturi, repetari si kg</option>
                  <option value="repetitions">Repetari</option>
                  <option value="duration">Runde / minute</option>
                  <option value="distance">Distanta si timp</option>
                  <option value="mixed">Mixt</option>
                </select>
              </label>
            </div>

            <button disabled={busy}>Adauga exercitiul</button>
          </form>

          <h3>Exercitii existente</h3>
          {!exercises.length && <p>Nu ai exercitii pentru acest sport.</p>}
          <div className="grid">
            {exercises.map((exercise) => (
              <article className="card card-body" key={exercise.id}>
                <strong>{exercise.name}</strong>
                <p>{exercise.tracking_type}</p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => archiveExercise(exercise)}
                >
                  Arhiveaza
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
