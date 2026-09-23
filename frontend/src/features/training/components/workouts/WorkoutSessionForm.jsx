import React, { useEffect, useState } from "react";
import { api, send, localDate } from "../../../../api/client";

const blankExercise = () => ({
  exercise_id: null,
  name: "",
  sets: 1,
  reps: null,
  minutes: null,
  weight_kg: null,
  notes: "",
});

const blankSession = (day) => ({
  day,
  title: "",
  sport: "",
  notes: "",
  exercises: [blankExercise()],
});

function normalizeSession(session, fallbackDay) {
  if (!session) return blankSession(fallbackDay);

  return {
    day: session.day || fallbackDay,
    title: session.title || "",
    sport: session.sport || "",
    notes: session.notes || "",
    exercises: session.exercises?.length
      ? session.exercises.map((exercise) => ({
          ...blankExercise(),
          ...exercise,
        }))
      : [blankExercise()],
  };
}

export default function WorkoutSessionForm({
  initialSession = null,
  onSubmit,
  submitLabel = "Salveaza sesiunea",
  editing = false,
}) {
  const [sports, setSports] = useState([]);
  const [exerciseCatalog, setExerciseCatalog] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [form, setForm] = useState(() =>
    normalizeSession(initialSession, localDate())
  );

  const [mode, setMode] = useState("new");
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectedSport = sports.find(
    (sport) => sport.name === form.sport
  );

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      setLoading(true);
      setError("");

      try {
        const requests = [api("/sport-types")];

        if (!editing) {
          requests.push(api("/workout-templates"));
        }

        const results = await Promise.all(requests);

        if (!active) return;

        setSports(results[0]);
        setTemplates(editing ? [] : results[1]);
      } catch (currentError) {
        if (active) setError(currentError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInitialData();

    return () => {
      active = false;
    };
  }, [editing]);

  useEffect(() => {
    let active = true;

    async function loadExercises() {
      if (!selectedSport?.id) {
        setExerciseCatalog([]);
        return;
      }

      try {
        const data = await api(
          `/sport-types/${selectedSport.id}/exercises`
        );

        if (active) setExerciseCatalog(data);
      } catch (currentError) {
        if (active) setError(currentError.message);
      }
    }

    loadExercises();

    return () => {
      active = false;
    };
  }, [selectedSport?.id]);

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateExercise(index, field, value) {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise, exerciseIndex) =>
        exerciseIndex === index
          ? { ...exercise, [field]: value }
          : exercise
      ),
    }));
  }

  function selectExercise(index, exerciseId) {
    const selected = exerciseCatalog.find(
      (exercise) => exercise.id === Number(exerciseId)
    );

    setForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise, exerciseIndex) =>
        exerciseIndex === index
          ? {
              ...exercise,
              exercise_id: selected?.id ?? null,
              name: selected?.name ?? "",
            }
          : exercise
      ),
    }));
  }

  function addExercise() {
    setForm((current) => ({
      ...current,
      exercises: [...current.exercises, blankExercise()],
    }));
  }

  function removeExercise(index) {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.filter(
        (_, exerciseIndex) => exerciseIndex !== index
      ),
    }));
  }

  function useTemplate(template) {
    setForm({
      day: form.day,
      title: template.name,
      sport: template.sport,
      notes: template.notes || "",
      exercises: template.exercises.map((exercise) => ({
        ...blankExercise(),
        ...exercise,
      })),
    });

    setMode("new");
    setSaveAsTemplate(false);
    setTemplateName("");
  }

  async function deleteTemplate(templateId) {
    if (!window.confirm("Stergi acest sablon?")) return;

    setBusy(true);
    setError("");

    try {
      await send(`/workout-templates/${templateId}`, "DELETE");

      setTemplates((current) =>
        current.filter((template) => template.id !== templateId)
      );
    } catch (currentError) {
      setError(currentError.message);
    } finally {
      setBusy(false);
    }
  }

  async function submit(event) {
    event.preventDefault();

    if (busy) return;

    setBusy(true);
    setError("");

    const payload = {
      ...form,
      save_as_template: !editing && saveAsTemplate,
      template_name:
        !editing && saveAsTemplate
          ? templateName.trim() || form.title
          : null,
    };

    try {
      await onSubmit(payload);
    } catch (currentError) {
      setError(currentError.message);
      setBusy(false);
    }
  }

  if (loading) {
    return <p role="status">Se incarca formularul...</p>;
  }

  return (
    <div className="session-form-layout">
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {!editing && (
        <div className="session-source">
          <div className="session-source-tabs">
            <button
              type="button"
              className={mode === "new" ? "selected" : "secondary-button"}
              onClick={() => setMode("new")}
            >
              Sesiune noua
            </button>

            <button
              type="button"
              className={
                mode === "template" ? "selected" : "secondary-button"
              }
              onClick={() => setMode("template")}
            >
              Din sesiune salvata
            </button>
          </div>

          {mode === "template" && (
            <div className="template-list">
              <h3>Sesiunile mele salvate</h3>

              {!templates.length && (
                <p>Nu ai inca sesiuni salvate ca sablon.</p>
              )}

              {templates.map((template) => (
                <article className="template-card" key={template.id}>
                  <div>
                    <strong>{template.name}</strong>
                    <small>{template.sport}</small>
                  </div>

                  <div className="actions">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => useTemplate(template)}
                    >
                      Foloseste
                    </button>

                    <button
                      type="button"
                      className="danger-button"
                      disabled={busy}
                      onClick={() => deleteTemplate(template.id)}
                    >
                      Sterge
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      <form onSubmit={submit}>
        <div className="form-grid">
          <label>
            Data
            <input
              type="date"
              required
              value={form.day}
              onChange={(event) =>
                updateForm("day", event.target.value)
              }
            />
          </label>

          <label>
            Titlu
            <input
              required
              maxLength={160}
              value={form.title}
              placeholder="Ex: Full body"
              onChange={(event) =>
                updateForm("title", event.target.value)
              }
            />
          </label>

          <label>
            Sport
            <select
              required
              value={form.sport}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  sport: event.target.value,
                  exercises: [blankExercise()],
                }))
              }
            >
              <option value="">Alege sportul</option>

              {sports.map((sport) => (
                <option key={sport.id} value={sport.name}>
                  {sport.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Note
          <textarea
            maxLength={2000}
            value={form.notes}
            placeholder="Observatii despre sesiune"
            onChange={(event) =>
              updateForm("notes", event.target.value)
            }
          />
        </label>

        <div className="exercise-form-list">
          {form.exercises.map((exercise, index) => (
            <fieldset className="exercise-fieldset" key={index}>
              <legend>Exercitiul {index + 1}</legend>

              <div className="form-grid">
                <label>
                  Exercitiu
                  <select
                    required
                    value={exercise.exercise_id ?? ""}
                    onChange={(event) =>
                      selectExercise(index, event.target.value)
                    }
                  >
                    <option value="">Alege exercitiul</option>

                    {exerciseCatalog.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>

                {["sets", "reps", "minutes", "weight_kg"].map(
                  (field, fieldIndex) => (
                    <label key={field}>
                      {["Seturi", "Repetari", "Minute", "Kg"][fieldIndex]}

                      <input
                        type="number"
                        step={
                          field === "sets" || field === "reps"
                            ? "1"
                            : "0.1"
                        }
                        min={field === "weight_kg" ? 0 : 1}
                        required={field === "sets"}
                        value={exercise[field] ?? ""}
                        onChange={(event) =>
                          updateExercise(
                            index,
                            field,
                            event.target.value === ""
                              ? null
                              : Number(event.target.value)
                          )
                        }
                      />
                    </label>
                  )
                )}
              </div>

              <label>
                Detalii
                <input
                  value={exercise.notes}
                  maxLength={500}
                  placeholder="Observatii pentru exercitiu"
                  onChange={(event) =>
                    updateExercise(index, "notes", event.target.value)
                  }
                />
              </label>

              <button
                type="button"
                className="danger-button"
                disabled={form.exercises.length === 1}
                onClick={() => removeExercise(index)}
              >
                Elimina exercitiul
              </button>
            </fieldset>
          ))}
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={addExercise}
        >
          + Adauga exercitiu
        </button>

        {!editing && (
          <fieldset className="template-options">
            <legend>Reutilizare</legend>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={saveAsTemplate}
                onChange={(event) =>
                  setSaveAsTemplate(event.target.checked)
                }
              />

              <span>Salveaza si ca sablon reutilizabil</span>
            </label>

            {saveAsTemplate && (
              <label>
                Nume sablon
                <input
                  maxLength={160}
                  value={templateName}
                  placeholder={form.title || "Ex: Full body A"}
                  onChange={(event) =>
                    setTemplateName(event.target.value)
                  }
                />
              </label>
            )}
          </fieldset>
        )}

        <div className="form-actions">
          <button type="submit" disabled={busy}>
            {busy ? "Se salveaza..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}