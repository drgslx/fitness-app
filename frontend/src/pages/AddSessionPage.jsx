import React from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import WorkoutSessionForm from "../features/training/components/workouts/WorkoutSessionForm";
import { send } from "../api/client";

export default function AddSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = useParams();

  const editingSession = location.state?.session ?? null;
  const editing = Boolean(sessionId);

  if (editing && !editingSession) {
    return (
      <section className="panel">
        <h2>Sesiunea nu este disponibila</h2>

        <p>
          Deschide sesiunea din lista saptamanii pentru a o edita.
        </p>

        <Link className="button" to="/workouts/sessions">
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

    navigate("/workouts/sessions", {
      replace: true,
      state: {
        message: editing
          ? "Sesiunea a fost actualizata."
          : "Sesiunea a fost adaugata.",
      },
    });
  }

  return (
    <section className="panel session-editor-page">
      <div className="page-heading">
        <div>
          <span className="section-eyebrow">
            {editing ? "Editare plan" : "Plan nou"}
          </span>

          <h2>
            {editing ? "Editeaza sesiunea" : "Adauga sesiune"}
          </h2>

          <p>
            Configureaza sportul, exercitiile si valorile urmarite.
          </p>
        </div>

        <Link
          className="button secondary-button"
          to="/workouts/sessions"
        >
          Inapoi la sesiuni
        </Link>
      </div>

      <WorkoutSessionForm
        initialSession={editingSession}
        editing={editing}
        submitLabel={
          editing ? "Salveaza modificarile" : "Salveaza sesiunea"
        }
        onSubmit={saveSession}
      />
    </section>
  );
}