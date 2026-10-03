import React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import WorkoutSessionForm from "./components/workouts/WorkoutSessionForm";
import { send } from "../../api/client";

export default function SessionEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = useParams();

  const editingSession = location.state?.session ?? null;
  const editing = Boolean(sessionId);

  if (editing && !editingSession) {
    return (
      <section className="panel">
        <h2>Sesiunea nu este disponibila</h2>

        <p>Deschide sesiunea din lista saptamanii pentru a o edita.</p>

        <Link className="btn btn-primary" to="/workouts/sessions">
          Inapoi la sesiuni
        </Link>
      </section>
    );
  }

  async function saveSession(payload) {
    if (editing) {
      await send(`/workouts/${sessionId}`, "PUT", payload);
    } else {
      await send("/workouts", "POST", payload);
    }

    navigate(`/workouts/sessions?day=${encodeURIComponent(payload.day)}`, {
      replace: true,
      state: {
        message: editing
          ? "Sesiunea a fost actualizata."
          : "Sesiunea a fost adaugata.",
      },
    });
  }

  return (
    <section className="panel min-w-0">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-3 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="eyebrow">
            {editing ? "Editare plan" : "Plan nou"}
          </span>

          <h2>{editing ? "Editeaza sesiunea" : "Adauga sesiune"}</h2>

          <p>Configureaza sportul, exercitiile si valorile urmarite.</p>
        </div>

        <Link className="btn btn-primary btn-secondary" to="/workouts/sessions">
          Inapoi la sesiuni
        </Link>
      </div>

      <WorkoutSessionForm
        initialSession={editingSession}
        editing={editing}
        submitLabel={editing ? "Salveaza modificarile" : "Salveaza sesiunea"}
        onSubmit={saveSession}
      />
    </section>
  );
}
