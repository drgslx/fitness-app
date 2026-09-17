import React, { useEffect, useState } from "react";
import { api, send, localDate } from "../api/client";

const blankExercise = () => ({
  exercise_id: null,
  name: "",
  sets: 1,
  reps: null,
  minutes: null,
  weight_kg: null,
  notes: "",
});

const blank = (day) => ({
  day,
  title: "",
  sport: "",
  notes: "",
  exercises: [blankExercise()],
});

function weekRange(day) {
  const start = new Date(day + "T12:00:00");
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start: localDate(start), end: localDate(end) };
}

export default function WorkoutSessionsPage() {
  const [sports, setSports] = useState([]);
  const [exerciseCatalog, setExerciseCatalog] = useState([]);
  const [day, setDay] = useState(localDate());
  const [form, setForm] = useState(blank(localDate()));
  const [editing, setEditing] = useState(null);
  const [plans, setPlans] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const range = weekRange(day);
  const selectedSport = sports.find((sport) => sport.name === form.sport);

  async function load() {
    const query = `?start=${range.start}&end=${range.end}`;
    const [plansResult, historyResult] = await Promise.all([
      api("/workouts" + query),
      api("/workout-history" + query),
    ]);
    setPlans(plansResult);
    setHistory(historyResult);
  }

  async function loadSports() {
    setSports(await api("/sport-types"));
  }

  async function loadExercises(sportId) {
    if (!sportId) {
      setExerciseCatalog([]);
      return;
    }
    setExerciseCatalog(await api(`/sport-types/${sportId}/exercises`));
  }

  async function action(fn) {
    setBusy(true);
    setError("");
    try {
      await fn();
      await load();
    } catch (currentError) {
      setError(currentError.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load().catch((currentError) => setError(currentError.message));
  }, [range.start, range.end]);

  useEffect(() => {
    loadSports().catch((currentError) => setError(currentError.message));
  }, []);

  useEffect(() => {
    loadExercises(selectedSport?.id).catch((currentError) =>
      setError(currentError.message)
    );
  }, [selectedSport?.id]);

  function updateExercise(index, key, value) {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise, exerciseIndex) =>
        exerciseIndex === index ? { ...exercise, [key]: value } : exercise
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

  function edit(plan) {
    setEditing(plan.id);
    setForm({
      day: plan.day,
      title: plan.title,
      sport: plan.sport,
      notes: plan.notes,
      exercises: plan.exercises,
    });
    document.getElementById("workout-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function submit(event) {
    event.preventDefault();
    action(async () => {
      await send(
        editing ? `/workouts/${editing}` : "/workouts",
        editing ? "PUT" : "POST",
        form
      );
      setEditing(null);
      setForm(blank(day));
    });
  }

  return (
    <>
      <section className="panel">
        <h2>Sesiunile saptamanii</h2>
        <label>
          Saptamana care contine
          <input
            type="date"
            required
            value={day}
            onChange={(event) => event.target.value && setDay(event.target.value)}
          />
        </label>
        <p>{range.start} - {range.end}</p>
        {error && <p className="error" role="alert">{error}</p>}
      </section>

      <div className="grid">
        {plans.map((plan) => (
          <section className="card card-body" key={plan.id}>
            <p className="meta">{plan.day} - {plan.sport}</p>
            <h2>{plan.title}</h2>
            <ul>
              {plan.exercises.map((exercise, index) => (
                <li key={index}>
                  {exercise.name}: {exercise.sets} seturi
                  {exercise.reps && `, ${exercise.reps} repetari`}
                  {exercise.minutes && `, ${exercise.minutes} min`}
                  {exercise.weight_kg != null && `, ${exercise.weight_kg} kg`}
                  {exercise.notes && ` - ${exercise.notes}`}
                </li>
              ))}
            </ul>
            <p>{plan.notes}</p>
            <div className="actions">
              <button
                disabled={busy}
                onClick={() =>
                  action(() =>
                    send(
                      `/workouts/${plan.id}/completion`,
                      plan.completed ? "DELETE" : "PUT"
                    )
                  )
                }
              >
                {plan.completed ? "Executat - anuleaza" : "Bifeaza executat"}
              </button>
              <button disabled={busy} onClick={() => edit(plan)}>Editeaza</button>
              <button
                disabled={busy}
                onClick={() => action(() => send(`/workouts/${plan.id}`, "DELETE"))}
              >
                Sterge planul
              </button>
            </div>
          </section>
        ))}
      </div>

      {!plans.length && <p>Nu ai sesiuni planificate pentru aceasta saptamana.</p>}

      <section className="panel" id="workout-form">
        <h2>{editing ? "Editeaza sesiunea" : "Adauga sesiune"}</h2>
        <form onSubmit={submit}>
          <div className="form-grid">
            <label>
              Data
              <input
                type="date"
                required
                value={form.day}
                onChange={(event) => setForm({ ...form, day: event.target.value })}
              />
            </label>
            <label>
              Titlu
              <input
                required
                maxLength={160}
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />
            </label>
            <label>
              Sport
              <select
                required
                value={form.sport}
                onChange={(event) =>
                  setForm({
                    ...form,
                    sport: event.target.value,
                    exercises: [blankExercise()],
                  })
                }
              >
                <option value="">Alege sportul</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.name}>{sport.name}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Note
            <textarea
              maxLength={2000}
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
            />
          </label>

          {form.exercises.map((exercise, index) => (
            <fieldset key={index}>
              <legend>Exercitiul {index + 1}</legend>
              <div className="form-grid">
                <label>
                  Exercitiu
                  <select
                    required
                    value={exercise.exercise_id ?? ""}
                    onChange={(event) => selectExercise(index, event.target.value)}
                  >
                    <option value="">Alege exercitiul</option>
                    {exerciseCatalog.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </label>

                {["sets", "reps", "minutes", "weight_kg"].map((key, fieldIndex) => (
                  <label key={key}>
                    {["Seturi", "Repetari", "Minute", "Kg"][fieldIndex]}
                    <input
                      type="number"
                      step={key === "sets" || key === "reps" ? "1" : "0.1"}
                      min={key === "weight_kg" ? 0 : 1}
                      required={key === "sets"}
                      value={exercise[key] ?? ""}
                      onChange={(event) =>
                        updateExercise(
                          index,
                          key,
                          event.target.value === "" ? null : Number(event.target.value)
                        )
                      }
                    />
                  </label>
                ))}
              </div>

              <label>
                Detalii
                <input
                  value={exercise.notes}
                  maxLength={500}
                  onChange={(event) =>
                    updateExercise(index, "notes", event.target.value)
                  }
                />
              </label>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    exercises: form.exercises.filter(
                      (_, exerciseIndex) => exerciseIndex !== index
                    ),
                  })
                }
              >
                Elimina exercitiul
              </button>
            </fieldset>
          ))}

          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                exercises: [...form.exercises, blankExercise()],
              })
            }
          >
            + Exercitiu
          </button>
          <button disabled={busy}>
            {editing ? "Salveaza modificarile" : "Adauga plan"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(blank(day));
              }}
            >
              Anuleaza editarea
            </button>
          )}
        </form>
      </section>

      <section className="panel">
        <h2>Istoricul saptamanii - {history.length} sesiuni</h2>
        <p>
          Bifarea pastreaza o copie a sesiunii. Editarea sau stergerea planului
          nu rescrie acea copie. Anularea bifarii sterge inregistrarea de executie.
        </p>
        {history.map((item) => (
          <details key={item.id}>
            <summary>
              {item.day} - {item.snapshot.title} - {item.snapshot.sport}
            </summary>
            <ul>
              {item.snapshot.exercises.map((exercise, index) => (
                <li key={index}>
                  {exercise.name} - {exercise.sets} seturi -{" "}
                  {exercise.reps ?? "-"} repetari - {exercise.minutes ?? "-"} min
                </li>
              ))}
            </ul>
          </details>
        ))}
      </section>
    </>
  );
}
