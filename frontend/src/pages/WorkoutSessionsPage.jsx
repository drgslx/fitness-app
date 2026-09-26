import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
  NavLink,
} from "react-router-dom";
import { api, send, localDate } from "../api/client";

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
              <p>Sesiunile executate sunt taiate din lista.</p>
            </div>

            <span className="shrink-0 rounded-full bg-raised px-3 py-1 text-sm text-accent">
              {plans.filter((plan) => plan.completed).length} / {plans.length}{" "}
              executate
            </span>
          </div>

          <div className="w-full min-w-0 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[720px] table-fixed [&_td]:break-words [&_td]:whitespace-normal">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Sesiune</th>
                  <th>Sport</th>
                  <th>Exercitii</th>
                  <th>Status</th>
                  <th>Actiuni</th>
                </tr>
              </thead>

              <tbody>
                {plans.map((plan) => (
                  <tr
                    key={plan.id}
                    className={
                      plan.completed ? "bg-[#102419] [&_td:first-child]:shadow-[inset_4px_0_0_#72f29c]" : ""
                    }
                  >
                    <td>{plan.day}</td>

                    <td>
                      <strong>{plan.title}</strong>

                      {plan.notes && (
                        <small className="mt-1 block text-sm font-normal text-muted">
                          {plan.notes}
                        </small>
                      )}
                    </td>

                    <td>{plan.sport}</td>

                    <td>
                      <ul className="grid min-w-0 list-none gap-2 p-0 [&_li]:grid [&_li]:min-w-0 [&_li]:gap-1 [&_li]:break-words [&_li]:rounded-lg [&_li]:border [&_li]:border-white/10 [&_li]:bg-[#111f17] [&_li]:p-2 [&_li_span]:text-xs [&_li_span]:text-[#adbbb2]">
                        {plan.exercises.map((exercise, index) => (
                          <ExerciseSummary
                            key={`${plan.id}-${index}`}
                            exercise={exercise}
                          />
                        ))}
                      </ul>
                    </td>

                    <td>
                      <span
                        className={
                          plan.completed
                            ? "inline-flex rounded-full border border-accent bg-accent px-3 py-1 text-xs font-bold text-ink"
                            : "inline-flex rounded-full border border-[#65756c] bg-[#18241d] px-3 py-1 text-xs font-bold text-[#cbd5cf]"
                        }
                      >
                        {plan.completed ? "Executat" : "Planificat"}
                      </span>
                    </td>

                    <td className="align-top">
                      <div className="grid min-w-0 gap-2 [&_button]:w-full [&_button]:px-2 [&_button]:py-1 [&_button]:text-xs">
                        <button
                          type="button"
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
                          {plan.completed ? "Anuleaza" : "Executat"}
                        </button>

                        <button
                          type="button"
                          className="!border-[#3c6654] !bg-[#193329] !text-copy hover:!border-accent hover:!bg-[#204333]"
                          disabled={busy}
                          onClick={() => editSession(plan)}
                        >
                          Editeaza
                        </button>

                        <button
                          type="button"
                          className="!border-[#82433f] !bg-[#321a18] !text-[#ffaaa3] hover:!border-[#ff766e] hover:!bg-[#46211e]"
                          disabled={busy}
                          onClick={() => deleteSession(plan)}
                        >
                          Sterge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
