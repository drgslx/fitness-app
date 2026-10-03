import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { api, send, localDate } from "../api/client";
import WorkoutCompletionDialog, { INTENSITY_LABELS } from "../features/training/components/workouts/WorkoutCompletionDialog";

function weekRange(day) {
  const start = new Date(day + "T12:00:00");
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return {
    start: localDate(start),
    end: localDate(end),
  };
}

function ExerciseSummary({ exercise }) {
  const details = [`${exercise.sets} seturi`];

  if (exercise.reps != null) {
    details.push(`${exercise.reps} repetari`);
  }

  if (exercise.minutes != null) {
    details.push(`${exercise.minutes} min`);
  }

  if (exercise.weight_kg != null) {
    details.push(`${exercise.weight_kg} kg`);
  }

  return (
    <li>
      <strong>{exercise.name}</strong>
      <span> - {details.join(", ")}</span>
      {exercise.notes && <span> - {exercise.notes}</span>}
    </li>
  );
}

export default function WorkoutSessionsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const requestedDay = searchParams.get("day");

  const parsedDay = requestedDay ? new Date(`${requestedDay}T12:00:00`) : null;

  const validDay =
    requestedDay &&
    /^\d{4}-\d{2}-\d{2}$/.test(requestedDay) &&
    !Number.isNaN(parsedDay.getTime()) &&
    localDate(parsedDay) === requestedDay;

  const day = validDay ? requestedDay : localDate();

  function setDay(value) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set("day", value);
        return next;
      },
      { replace: true }
    );
  }
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [completionSession, setCompletionSession] = useState(null);

  const range = useMemo(() => weekRange(day), [day]);

  async function load() {
    const query = `?start=${range.start}&end=${range.end}`;
    const plansResult = await api("/workouts" + query);

    setPlans(plansResult);
  }

  useEffect(() => {
    setError("");

    load().catch((currentError) => setError(currentError.message));
  }, [range.start, range.end]);

  async function action(operation) {
    if (busy) return;

    setBusy(true);
    setError("");

    try {
      await operation();
      await load();
    } catch (currentError) {
      setError(currentError.message);
    } finally {
      setBusy(false);
    }
  }

  function editSession(plan) {
    navigate(`/workouts/sessions/${plan.id}/edit`, {
      state: {
        session: plan,
      },
    });
  }

  function deleteSession(plan) {
    if (!window.confirm(`Stergi sesiunea "${plan.title}"?`)) {
      return;
    }

    action(() => send(`/workouts/${plan.id}`, "DELETE"));
  }

  async function saveCompletion(values) {
    setBusy(true);
    setError("");
    try {
      await send(`/workouts/${completionSession.id}/completion`, "PUT", values);
      await load();
      setCompletionSession(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-w-0">
      <section className="my-4 flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-surface/90 p-4 shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="min-w-0 flex-1 [&_p]:text-muted">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[.14em] text-accent">Planificare</span>

            <h2>Sesiunile saptamanii</h2>

            <p>Consulta planurile si marcheaza antrenamentele executate.</p>
          </div>

          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 font-semibold text-ink no-underline transition-colors hover:bg-[#8cf7ac] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent w-full shrink-0 whitespace-nowrap sm:w-auto"
            to="/workouts/sessions/new"
          >
            + Adauga sesiune
          </Link>
        </div>

        {location.state?.message && (
          <p role="status">{location.state.message}</p>
        )}

        {error && (
          <p className="rounded-lg border border-red-400/30 bg-[#321a18] px-3 py-2 text-[#ffaaaa]" role="alert">
            {error}
          </p>
        )}

        <div className="grid items-end gap-3 md:grid-cols-[minmax(260px,1fr)_auto]">
          <label>
            Saptamana care contine
            <input
              type="date"
              required
              value={day}
              onChange={(event) => {
                if (event.target.value) {
                  setDay(event.target.value);
                }
              }}
            />
          </label>

          <div className="grid gap-1 rounded-lg border border-white/10 bg-[#09130e] p-3 [&_span]:text-xs [&_span]:text-muted">
            <span>Interval selectat</span>

            <strong>
              {range.start} - {range.end}
            </strong>
          </div>
        </div>
      </section>

      {!plans.length ? (
        <section className="my-4 rounded-2xl border border-white/10 bg-surface p-5">
          <h3>Nu ai sesiuni planificate</h3>

          <p>Nu exista planuri pentru saptamana selectata.</p>

          <Link className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 font-semibold text-ink no-underline transition-colors hover:bg-[#8cf7ac] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" to="/workouts/sessions/new">
            Adauga prima sesiune
          </Link>
        </section>
      ) : (
        <section className="my-4 flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-surface/90 p-4 shadow-xl w-full min-w-0 overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-3 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="mb-2 block text-xs font-bold uppercase tracking-[.14em] text-accent">Program</span>
              <h2>Planul saptamanii</h2>
              <p>Deschide o sesiune pentru a vedea exercitiile si notele.</p>
            </div>

            <span className="shrink-0 rounded-full bg-raised px-3 py-1 text-sm text-accent">
              {plans.filter((plan) => plan.completed).length} / {plans.length}{" "}
              executate
            </span>
          </div>

          <div className="grid min-w-0 gap-3">
            {plans.map((plan) => (
              <article key={plan.id} aria-label={`Sesiune ${plan.title} din ${plan.day}`}
                className={`min-w-0 overflow-hidden rounded-xl border ${plan.completed ? "border-accent/30 bg-[#102419]" : "border-white/10 bg-ink/40"}`}>
                <details name="week-sessions" className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-4 focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                    <span aria-hidden="true" className="shrink-0 text-xl text-accent transition-transform group-open:rotate-90">›</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted"><time dateTime={plan.day}>{plan.day}</time> · {plan.sport}</p>
                      <strong className={`block break-words ${plan.completed ? "text-muted line-through" : ""}`}>{plan.title}</strong>
                      <small className="block text-muted">{plan.exercises.length} exercitii</small>
                      {plan.completed && plan.duration_minutes && <small className="block text-muted">
                        {plan.duration_minutes} min · {INTENSITY_LABELS[plan.intensity] || "Intensitate lipsa"}
                      </small>}
                    </div>
                    <span className={`shrink-0 rounded-full border px-2 py-1 text-xs font-bold ${plan.completed
                      ? "border-accent bg-accent text-ink" : "border-[#65756c] bg-[#18241d] text-[#cbd5cf]"}`}>
                      {plan.completed ? "Executat" : "Planificat"}
                    </span>
                  </summary>
                  <div className="grid gap-3 border-t border-white/10 p-4">
                    {plan.notes && <p className="break-words text-sm text-muted">{plan.notes}</p>}
                    {plan.exercises.length ? <ul className="grid min-w-0 list-none gap-2 p-0 sm:grid-cols-2 [&_li]:grid [&_li]:min-w-0 [&_li]:gap-1 [&_li]:break-words [&_li]:rounded-lg [&_li]:border [&_li]:border-white/10 [&_li]:bg-[#111f17] [&_li]:p-3 [&_li_span]:text-xs [&_li_span]:text-[#adbbb2]">
                      {plan.exercises.map((exercise, index) => <ExerciseSummary key={`${plan.id}-${index}`} exercise={exercise} />)}
                    </ul> : <p className="text-sm text-muted">Sesiune fara exercitii individuale.</p>}
                  </div>
                </details>
                {plan.can_complete === false && <p className="px-4 pb-3 text-xs text-muted">
                  Sesiune planificata in viitor. Executarea va fi disponibila din {plan.day}.
                  {plan.has_completion && " Executarea inregistrata anterior nu este inclusa in rapoarte; o poti anula."}
                </p>}
                <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3 [&_button]:px-3 [&_button]:py-2 [&_button]:text-xs">
                  <button type="button" disabled={busy || (!(plan.completed || plan.has_completion) && plan.can_complete === false)}
                    onClick={() => plan.completed || plan.has_completion
                    ? action(() => send(`/workouts/${plan.id}/completion`, "DELETE"))
                    : setCompletionSession(plan)}>
                    {plan.completed || plan.has_completion ? "Anuleaza" : "Executat"}
                  </button>
                  {plan.completed && <button type="button" disabled={busy} onClick={() => setCompletionSession(plan)}>
                    Durata si intensitate
                  </button>}
                  <button type="button" className="!border-[#3c6654] !bg-[#193329] !text-copy hover:!border-accent hover:!bg-[#204333]"
                    disabled={busy} onClick={() => editSession(plan)}>Editeaza</button>
                  <button type="button" className="!border-[#82433f] !bg-[#321a18] !text-[#ffaaa3] hover:!border-[#ff766e] hover:!bg-[#46211e]"
                    disabled={busy} onClick={() => deleteSession(plan)}>Sterge</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      {completionSession && <WorkoutCompletionDialog key={completionSession.id} session={completionSession}
        onSave={saveCompletion} onCancel={() => setCompletionSession(null)} />}
    </div>
  );
}
