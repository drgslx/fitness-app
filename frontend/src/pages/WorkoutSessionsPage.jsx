import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
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
    <div className="sessions-page">
      <section className="panel">
        <div className="sessions-heading">
          <div className="sessions-heading-content">
            <span className="section-eyebrow">Planificare</span>

            <h2>Sesiunile saptamanii</h2>

            <p>Consulta planurile si marcheaza antrenamentele executate.</p>
          </div>

          <Link
            className="button add-session-button"
            to="/workouts/sessions/new"
          >
            + Adauga sesiune
          </Link>
        </div>

        {location.state?.message && (
          <p role="status">{location.state.message}</p>
        )}

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <div className="week-filter">
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

          <div className="week-range">
            <span>Interval selectat</span>

            <strong>
              {range.start} - {range.end}
            </strong>
          </div>
        </div>
      </section>

      {!plans.length ? (
        <section className="empty-state">
          <h3>Nu ai sesiuni planificate</h3>

          <p>Nu exista planuri pentru saptamana selectata.</p>

          <Link className="button" to="/workouts/sessions/new">
            Adauga prima sesiune
          </Link>
        </section>
      ) : (
        <section className="panel sessions-table-panel">
          <div className="page-heading">
            <div>
              <span className="section-eyebrow">Program</span>
              <h2>Planul saptamanii</h2>
              <p>Sesiunile executate sunt taiate din lista.</p>
            </div>

            <span className="history-count">
              {plans.filter((plan) => plan.completed).length} / {plans.length}{" "}
              executate
            </span>
          </div>

          <div className="table-wrapper">
            <table className="sessions-table">
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
                      plan.completed ? "session-row completed" : "session-row"
                    }
                  >
                    <td>{plan.day}</td>

                    <td>
                      <strong>{plan.title}</strong>

                      {plan.notes && (
                        <small className="session-table-notes">
                          {plan.notes}
                        </small>
                      )}
                    </td>

                    <td>{plan.sport}</td>

                    <td>
                      <ul className="session-table-exercises">
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
                            ? "session-status completed"
                            : "session-status planned"
                        }
                      >
                        {plan.completed ? "Executat" : "Planificat"}
                      </span>
                    </td>

                    <td className="session-actions-cell">
                      <div className="session-table-actions">
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
                          className="secondary-button"
                          disabled={busy}
                          onClick={() => editSession(plan)}
                        >
                          Editeaza
                        </button>

                        <button
                          type="button"
                          className="danger-button"
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
