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
      <section className="my-4 flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-surface/90 p-4 shadow-xl">
        <h2>Sesiunea nu este disponibila</h2>

        <p>
          Deschide sesiunea din lista saptamanii pentru a o edita.
        </p>

        <Link className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 font-semibold text-ink no-underline transition-colors hover:bg-[#8cf7ac] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" to="/workouts/sessions">
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
    <section className="my-4 flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-surface/90 p-4 shadow-xl min-w-0">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-3 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[.14em] text-accent">
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
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 font-semibold text-ink no-underline transition-colors hover:bg-[#8cf7ac] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent !border-[#3c6654] !bg-[#193329] !text-copy hover:!border-accent hover:!bg-[#204333]"
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