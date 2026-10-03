import WorkoutCompletionDialog from "./components/workouts/WorkoutCompletionDialog";
import SessionsList from "./components/SessionsList";
import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { api, send, localDate } from "../../api/client";

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

export default function SessionsScreen() {
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
      { replace: true },
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
      <section className="panel">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="min-w-0 flex-1 [&_p]:text-muted">
            <span className="eyebrow">Planificare</span>

            <h2>Sesiunile saptamanii</h2>

            <p>Consulta planurile si marcheaza antrenamentele executate.</p>
          </div>

          <Link
            className="btn btn-primary w-full shrink-0 whitespace-nowrap sm:w-auto"
            to="/workouts/sessions/new"
          >
            + Adauga sesiune
          </Link>
        </div>

        {location.state?.message && (
          <p role="status">{location.state.message}</p>
        )}

        {error && (
          <p className="notice-error" role="alert">
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

          <Link className="btn btn-primary" to="/workouts/sessions/new">
            Adauga prima sesiune
          </Link>
        </section>
      ) : (
        <section className="panel w-full min-w-0 overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-3 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="eyebrow">Program</span>
              <h2>Planul saptamanii</h2>
            </div>

            <span className="shrink-0 rounded-full bg-raised px-3 py-1 text-sm text-accent">
              {plans.filter((plan) => plan.completed).length} / {plans.length}{" "}
              executate
            </span>
          </div>

          <SessionsList
            plans={plans}
            busy={busy}
            onEdit={editSession}
            onDelete={deleteSession}
            onCompletion={setCompletionSession}
            onToggle={(plan) => plan.completed || plan.has_completion
              ? action(() => send(`/workouts/${plan.id}/completion`, "DELETE"))
              : setCompletionSession(plan)}
          />
        </section>
      )}
      {completionSession && <WorkoutCompletionDialog key={completionSession.id} session={completionSession}
        onSave={saveCompletion} onCancel={() => setCompletionSession(null)} />}
    </div>
  );
}
