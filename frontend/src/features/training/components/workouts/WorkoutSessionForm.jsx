import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [message, setMessage] = useState("");
  const draftRef = useRef(null);
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
    if (mutationRef.current || !form.day) return;
    mutationRef.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const created = await send(
        `/workout-templates/${template.id}/sessions`, "POST", { day: form.day }
      );
      navigate(`/workouts/sessions?day=${encodeURIComponent(created.day)}`, {
        replace: true,
        state: { message: "Sesiunea a fost adaugata din sablon." },
      });
    } catch (currentError) {
      setError(currentError.message);
    } finally {
      mutationRef.current = false;
      setBusy(false);
    }
  }

  async function editTemplate(template) {
    if (mutationRef.current) return;
    mutationRef.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const current = await api(`/workout-templates/${template.id}`);
      draftRef.current = form;
      setForm(createSession({ ...current, title: current.name, day: form.day }));
      setEditingTemplate(current.id);
    } catch (currentError) {
      setError(currentError.message);
    } finally {
      mutationRef.current = false;
      setBusy(false);
    }
  }

  function closeTemplateEditor() {
    if (draftRef.current) setForm(draftRef.current);
    draftRef.current = null;
    setEditingTemplate(null);
    setMode("template");
    setError("");
  }

  function cancelTemplateEdit() {
    if (busy) return;
    if (!window.confirm("Renunti la modificarile nesalvate ale sablonului?")) return;
    closeTemplateEditor();
  }

  async function deleteTemplate(template) {
    if (mutationRef.current) return;
    if (!window.confirm(`Stergi sablonul "${template.name}"? Sesiunile deja adaugate in calendar raman neschimbate.`)) return;

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

    if (editingTemplate && !window.confirm(
      "Salvezi modificarile sablonului? Vor fi folosite la adaugarile viitoare. " +
      "Sesiunile deja planificate sau executate NU se modifica."
    )) return;

    mutationRef.current = true;
    setBusy(true);
    setError("");
    setMessage("");

    const payload = {
      ...form,
      title: form.title.trim(),
      // Eliminam cheia folosita exclusiv de interfata.
      exercises: form.exercises.map(({ clientKey, ...exercise }) => ({
        ...exercise,
        name: exercise.name.trim(),
      })),
      save_as_template: !editingTemplate && saveAsTemplate,
      template_name:
        !editingTemplate && saveAsTemplate
          ? templateName.trim() || form.title.trim()
          : null,
    };

    try {
      if (editingTemplate) {
        const updated = await send(`/workout-templates/${editingTemplate}`, "PUT", {
          name: payload.title,
          sport: payload.sport,
          notes: payload.notes,
          exercises: payload.exercises,
        });
        setTemplates((current) => current.map((item) =>
          item.id === updated.id ? updated : item
        ));
        closeTemplateEditor();
        setMessage("Sablonul a fost actualizat. Sesiunile din calendar au ramas neschimbate.");
      } else {
        await onSubmit(payload);
      }
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
    <div className="grid gap-4">
      {error && (
        <p className="rounded-lg border border-red-400/30 bg-[#321a18] px-3 py-2 text-[#ffaaaa]" role="alert">
          {error}
        </p>
      )}

      {message && <p role="status">{message}</p>}
      {editing && <p role="note">Editezi doar sesiunea din aceasta zi. Sablonul ramane neschimbat.</p>}
      {editingTemplate && (
        <aside className="my-4 flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-surface/90 p-4 shadow-xl" role="note">
          <h3>Editeaza sablonul</h3>
          <p>Modifici programul reutilizabil. Valorile noi vor fi folosite cand
          adaugi sesiuni pe viitor. Sesiunile deja planificate sau executate
          raman neschimbate.</p>
        </aside>
      )}
      {!editingTemplate && (
        <div className="my-3 flex flex-wrap items-center gap-3">
          {!editing && (
            <>
              <button
                type="button"
                disabled={busy}
                aria-pressed={mode === "new"}
                className={mode === "new" ? "!border-accent !bg-accent !text-ink hover:!bg-[#8affad] hover:!text-ink" : "!border-[#3c6654] !bg-[#193329] !text-copy hover:!border-accent"}
                onClick={() => setMode("new")}
              >
                Sesiune noua
              </button>

              <button
                type="button"
                disabled={busy}
                aria-pressed={mode === "template"}
                className={
                  mode === "template" ? "!border-accent !bg-accent !text-ink hover:!bg-[#8affad] hover:!text-ink" : "!border-[#3c6654] !bg-[#193329] !text-copy hover:!border-accent"
                }
                onClick={() => setMode("template")}
              >
                Din sesiune salvata
              </button>
            </>
          )}

          {(editing || mode === "new") && (
            <label className="ml-auto flex cursor-pointer items-center gap-2 rounded-lg border border-[#3c6654] bg-[#193329] px-3 py-2 text-sm text-copy">
              <input
                type="checkbox"
                className="min-h-0 w-4 accent-accent"
                disabled={busy}
                checked={saveAsTemplate}
                onChange={(event) => setSaveAsTemplate(event.target.checked)}
              />
              Salveaza ca sablon
            </label>
          )}
        </div>
      )}

      {!editing && !editingTemplate && mode === "template" ? (
        <section className="grid gap-3">
          <h3>Sesiunile mele salvate</h3>

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
          <p className="text-muted">
            Alege data, apoi foloseste o sesiune salvata pentru a o adauga
            direct in plan. Poti edita apoi exercitiile si greutatile din
            sesiunile saptamanii, fara sa modifici sablonul.
          </p>

          {!templates.length && (
            <p>
              Nu ai sesiuni salvate. Creeaza o sesiune si bifeaza
              salvarea ca sablon reutilizabil.
            </p>
          )}

          {templates.map((template) => (
            <article className="rounded-xl border border-white/10 bg-ink/70 p-4" key={template.id}>
              <div>
                <strong>{template.name}</strong>
                <p className="text-sm text-muted">{template.sport} / {template.exercises.length} exercitii</p>
                <details>
                  <summary>Vezi exercitiile salvate</summary>
                  <ul>
                    {template.exercises.map((exercise, index) => (
                      <li key={index}>
                        <strong>{exercise.name}</strong>
                        {" / "}{exercise.sets} seturi
                        {exercise.reps != null && ` / ${exercise.reps} repetari`}
                        {exercise.weight_kg != null && ` / ${exercise.weight_kg} kg`}
                        {exercise.minutes != null && ` / ${exercise.minutes} min`}
                        {exercise.notes && ` / ${exercise.notes}`}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>

              <div className="my-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={busy || !form.day}
                  onClick={() => useTemplate(template)}
                >
                  Adauga la data aleasa
                </button>

                <button type="button" className="!border-[#3c6654] !bg-[#193329] !text-copy hover:!border-accent hover:!bg-[#204333]"
                  disabled={busy} onClick={() => editTemplate(template)}>
                  Editeaza sablonul
                </button>

                <button
                  type="button"
                  className="!border-[#82433f] !bg-[#321a18] !text-[#ffaaa3] hover:!border-[#ff766e] hover:!bg-[#46211e]"
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
          <div className="grid gap-3 md:grid-cols-2">
            {!editingTemplate && <label>
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
            </label>}

            <label>
              {editingTemplate ? "Nume sablon" : "Titlu"}
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
            <p className="rounded-lg border border-red-400/30 bg-[#321a18] px-3 py-2 text-[#ffaaaa]" role="alert">
              {catalogError}
            </p>
          )}

          {loadingExercises && (
            <p role="status">Se incarca exercitiile sportului...</p>
          )}

          {/* Butonul ramane deasupra tuturor exercitiilor. */}
          <div className="my-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="!border-[#3c6654] !bg-[#193329] !text-copy hover:!border-accent hover:!bg-[#204333]"
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

          <div className="grid gap-3">
            {visibleExercises.map(({ exercise, index }) => (
              <fieldset
                className="rounded-xl border border-white/15 p-3"
                key={exercise.clientKey}
                disabled={busy}
              >
                <legend>Exercitiul {index + 1}</legend>

                <div className="grid gap-3 md:grid-cols-2">
                  <label>
                    Exercitiu
                    <select
                      required
                      disabled={loadingExercises}
                      value={exercise.exercise_id ?? (exercise.name ? "legacy" : "")}
                      onChange={(event) =>
                        selectExercise(
                          exercise.clientKey,
                          event.target.value
                        )
                      }
                    >
                      <option value="">Alege exercitiul</option>
                      {exercise.exercise_id == null && exercise.name && (
                        <option value="legacy">{exercise.name} (salvat anterior)</option>
                      )}

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
                  className="!border-[#82433f] !bg-[#321a18] !text-[#ffaaa3] hover:!border-[#ff766e] hover:!bg-[#46211e]"
                  onClick={() => removeExercise(exercise.clientKey)}
                >
                  Elimina exercitiul
                </button>
              </fieldset>
            ))}
          </div>

          {!editingTemplate && (
            <fieldset className="grid gap-3" disabled={busy}>
              <legend>Reutilizare</legend>

              <label className="flex items-center gap-2 [&_input]:w-auto">
                <input
                  type="checkbox"
                  checked={saveAsTemplate}
                  onChange={(event) =>
                    setSaveAsTemplate(event.target.checked)
                  }
                />
                <span>{editing ? "Creeaza si un sablon nou din aceasta sesiune" : "Salveaza si ca sablon reutilizabil"}</span>
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

          <div className="flex flex-wrap gap-2">
            {editingTemplate && (
              <button type="button" className="!border-[#3c6654] !bg-[#193329] !text-copy hover:!border-accent hover:!bg-[#204333]" disabled={busy}
                onClick={cancelTemplateEdit}>Anuleaza modificarile</button>
            )}
            <button
              type="submit"
              disabled={busy || loadingExercises}
            >
              {busy ? "Se salveaza..." : editingTemplate ? "Salveaza sablonul" : submitLabel}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
