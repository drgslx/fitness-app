import React, { useEffect, useRef, useState } from "react";
import { api, send, localDate } from "../../../../api/client";

let nextExerciseKey = 0;

function createExercise(values = {}) {
  return {
    exercise_id: values.exercise_id ?? null,
    name: values.name ?? "",
    sets: values.sets ?? 1,
    reps: values.reps ?? null,
    minutes: values.minutes ?? null,
    weight_kg: values.weight_kg ?? null,
    notes: values.notes ?? "",
    // Identificator doar pentru React. Nu este trimis catre backend.
    clientKey: `exercise-${++nextExerciseKey}`,
  };
}

function createSession(session) {
  return {
    day: session?.day || localDate(),
    title: session?.title || "",
    sport: session?.sport || "",
    notes: session?.notes || "",
    exercises: Array.isArray(session?.exercises)
      ? session.exercises.map(createExercise)
      : [createExercise()],
  };
}

const NUMBER_FIELDS = [
  {
    key: "sets",
    label: "Seturi",
    min: 1,
    max: 100,
    step: 1,
    required: true,
  },
  {
    key: "reps",
    label: "Repetari",
    min: 1,
    max: 10000,
    step: 1,
  },
  {
    key: "minutes",
    label: "Minute",
    min: 0.1,
    max: 100000,
    step: 0.1,
  },
  {
    key: "weight_kg",
    label: "Kg",
    min: 0,
    max: 100000,
    step: 0.1,
  },
];

export default function WorkoutSessionForm({
  initialSession = null,
  onSubmit,
  submitLabel = "Salveaza sesiunea",
  editing = false,
}) {
  const [form, setForm] = useState(() => createSession(initialSession));
  const [sports, setSports] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [exerciseCatalog, setExerciseCatalog] = useState([]);

  const [mode, setMode] = useState("new");
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [busy, setBusy] = useState(false);

  const [error, setError] = useState("");
  const [catalogError, setCatalogError] = useState("");

  const mutationRef = useRef(false);

  const selectedSport = sports.find(
    (sport) => sport.name === form.sport
  );

  const selectedSportId = selectedSport?.id;

  // Inversam doar afisarea, fara sa modificam array-ul din state.
  const visibleExercises = form.exercises
    .map((exercise, index) => ({ exercise, index }))
    .reverse();

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [sportsResult, templatesResult] = await Promise.all([
          api("/sport-types"),
          editing ? Promise.resolve([]) : api("/workout-templates"),
        ]);

        if (!active) return;

        setSports(sportsResult);
        setTemplates(templatesResult);
      } catch (currentError) {
        if (active) setError(currentError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [editing]);

  useEffect(() => {
    let active = true;

    setExerciseCatalog([]);
    setCatalogError("");

    if (!selectedSportId) {
      setLoadingExercises(false);
      return;
    }

    setLoadingExercises(true);

    async function load() {
      try {
        const data = await api(
          `/sport-types/${selectedSportId}/exercises`
        );

        if (active) setExerciseCatalog(data);
      } catch (currentError) {
        if (active) setCatalogError(currentError.message);
      } finally {
        if (active) setLoadingExercises(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [selectedSportId]);

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateExercise(clientKey, changes) {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.clientKey === clientKey
          ? { ...exercise, ...changes }
          : exercise
      ),
    }));
  }

  function selectExercise(clientKey, exerciseId) {
    const selected = exerciseCatalog.find(
      (exercise) => String(exercise.id) === exerciseId
    );

    updateExercise(clientKey, {
      exercise_id: selected?.id ?? null,
      name: selected?.name ?? "",
    });
  }

  function changeSport(value) {
    const firstExercise = createExercise();

    setForm((current) => ({
      ...current,
      sport: value,
      exercises: [firstExercise],
    }));
  }

  function addExercise() {
    const exercise = createExercise();

    setForm((current) => ({
      ...current,
      exercises: [...current.exercises, exercise],
    }));
  }

  function removeExercise(clientKey) {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.filter(
        (exercise) => exercise.clientKey !== clientKey
      ),
    }));
  }

  async function useTemplate(template) {
    if (mutationRef.current) return;

    if (!form.day) {
      setError("Alege data sesiunii.");
      return;
    }

    mutationRef.current = true;
    setBusy(true);
    setError("");

    try {
      await onSubmit({
        day: form.day,
        title: template.name,
        sport: template.sport,
        notes: template.notes || "",
        exercises: (template.exercises ?? []).map((exercise) => ({
          exercise_id: exercise.exercise_id ?? null,
          name: exercise.name,
          sets: exercise.sets ?? 1,
          reps: exercise.reps ?? null,
          minutes: exercise.minutes ?? null,
          weight_kg: exercise.weight_kg ?? null,
          notes: exercise.notes ?? "",
        })),
        save_as_template: false,
        template_name: null,
      });
    } catch (currentError) {
      setError(currentError.message);
    } finally {
      mutationRef.current = false;
      setBusy(false);
    }
  }

  async function deleteTemplate(template) {
    if (mutationRef.current) return;
    if (!window.confirm(`Stergi sablonul "${template.name}"?`)) return;

    mutationRef.current = true;
    setBusy(true);
    setError("");

    try {
      await send(`/workout-templates/${template.id}`, "DELETE");

      setTemplates((current) =>
        current.filter((item) => item.id !== template.id)
      );
    } catch (currentError) {
      setError(currentError.message);
    } finally {
      mutationRef.current = false;
      setBusy(false);
    }
  }

  async function submit(event) {
    event.preventDefault();

    if (mutationRef.current || loadingExercises) return;

    if (!form.title.trim()) {
      setError("Completeaza titlul sesiunii.");
      return;
    }

    mutationRef.current = true;
    setBusy(true);
    setError("");

    const payload = {
      ...form,
      title: form.title.trim(),
      // Eliminam cheia folosita exclusiv de interfata.
      exercises: form.exercises.map(({ clientKey, ...exercise }) => ({
        ...exercise,
        name: exercise.name.trim(),
      })),
      save_as_template: !editing && saveAsTemplate,
      template_name:
        !editing && saveAsTemplate
          ? templateName.trim() || form.title.trim()
          : null,
    };

    try {
      await onSubmit(payload);
    } catch (currentError) {
      setError(currentError.message);
    } finally {
      mutationRef.current = false;
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
        <div className="session-source-tabs actions">
          <button
            type="button"
            disabled={busy}
            aria-pressed={mode === "new"}
            className={mode === "new" ? "selected" : "secondary-button"}
            onClick={() => setMode("new")}
          >
            Sesiune noua
          </button>

          <button
            type="button"
            disabled={busy}
            aria-pressed={mode === "template"}
            className={
              mode === "template" ? "selected" : "secondary-button"
            }
            onClick={() => setMode("template")}
          >
            Din sesiune salvata
          </button>
        </div>
      )}

      {!editing && mode === "template" ? (
        <section className="template-list">
          <h3>Sesiunile mele salvate</h3>
          <p className="muted">
            Alege data, apoi foloseste o sesiune salvata pentru a o adauga
            direct in plan. Poti edita apoi exercitiile si greutatile din
            sesiunile saptamanii, fara sa modifici sablonul.
          </p>
          <label>
            Data sesiunii
            <input
              type="date"
              required
              disabled={busy}
              value={form.day}
              onChange={(event) => updateForm("day", event.target.value)}
            />
          </label>
          

          {!templates.length && (
            <p>
              Nu ai sesiuni salvate. Creeaza o sesiune si bifeaza
              salvarea ca sablon reutilizabil.
            </p>
          )}

          {templates.map((template) => (
            <article className="template-card" key={template.id}>
              <div>
                <strong>{template.name}</strong>
                <p className="meta">{template.sport}</p>
              </div>

              <div className="actions">
                <button
                  type="button"
                  disabled={busy || !form.day}
                  onClick={() => useTemplate(template)}
                >
                  Foloseste si adauga
                </button>

                <button
                  type="button"
                  className="danger-button"
                  disabled={busy}
                  onClick={() => deleteTemplate(template)}
                >
                  Sterge sablonul
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <form onSubmit={submit}>
          <div className="form-grid">
            <label>
              Data
              <input
                type="date"
                required
                disabled={busy}
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
                disabled={busy}
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
                disabled={busy}
                value={form.sport}
                onChange={(event) => changeSport(event.target.value)}
              >
                <option value="">Alege sportul</option>

                {form.sport && !selectedSport && (
                  <option value={form.sport}>
                    {form.sport} (indisponibil in catalog)
                  </option>
                )}

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
              disabled={busy}
              maxLength={2000}
              value={form.notes}
              placeholder="Observatii despre sesiune"
              onChange={(event) =>
                updateForm("notes", event.target.value)
              }
            />
          </label>

          {catalogError && (
            <p className="error" role="alert">
              {catalogError}
            </p>
          )}

          {loadingExercises && (
            <p role="status">Se incarca exercitiile sportului...</p>
          )}

          {/* Butonul ramane deasupra tuturor exercitiilor. */}
          <div className="actions">
            <button
              type="button"
              className="secondary-button"
              disabled={
                busy ||
                loadingExercises ||
                !selectedSport ||
                form.exercises.length >= 100
              }
              onClick={addExercise}
            >
              + Adauga exercitiu
            </button>
          </div>

          <div className="exercise-form-list">
            {visibleExercises.map(({ exercise, index }) => (
              <fieldset
                className="exercise-fieldset"
                key={exercise.clientKey}
                disabled={busy}
              >
                <legend>Exercitiul {index + 1}</legend>

                <div className="form-grid">
                  <label>
                    Exercitiu
                    <select
                      required
                      disabled={loadingExercises}
                      value={exercise.exercise_id ?? ""}
                      onChange={(event) =>
                        selectExercise(
                          exercise.clientKey,
                          event.target.value
                        )
                      }
                    >
                      <option value="">Alege exercitiul</option>

                      {exercise.exercise_id != null &&
                        !exerciseCatalog.some(
                          (item) =>
                            String(item.id) ===
                            String(exercise.exercise_id)
                        ) && (
                          <option value={exercise.exercise_id}>
                            {exercise.name} (salvat anterior)
                          </option>
                        )}

                      {exerciseCatalog.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  {NUMBER_FIELDS.map((field) => (
                    <label key={field.key}>
                      {field.label}
                      <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        required={field.required}
                        value={exercise[field.key] ?? ""}
                        onChange={(event) =>
                          updateExercise(exercise.clientKey, {
                            [field.key]:
                              event.target.value === ""
                                ? null
                                : Number(event.target.value),
                          })
                        }
                      />
                    </label>
                  ))}
                </div>

                <label>
                  Detalii
                  <input
                    maxLength={500}
                    value={exercise.notes}
                    placeholder="Observatii pentru exercitiu"
                    onChange={(event) =>
                      updateExercise(exercise.clientKey, {
                        notes: event.target.value,
                      })
                    }
                  />
                </label>

                <button
                  type="button"
                  className="danger-button"
                  onClick={() => removeExercise(exercise.clientKey)}
                >
                  Elimina exercitiul
                </button>
              </fieldset>
            ))}
          </div>

          {!editing && (
            <fieldset className="template-options" disabled={busy}>
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
            <button
              type="submit"
              disabled={busy || loadingExercises}
            >
              {busy ? "Se salveaza..." : submitLabel}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}