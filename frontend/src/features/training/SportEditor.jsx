import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SportForm from "./components/SportForm";
import { createSport } from "./api";

export default function SportEditor() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function addSport(values) {
    if (saving) return false;

    setSaving(true);
    setError("");

    try {
      await createSport(values);

      navigate("/workouts/catalog", {
        replace: true,
        state: {
          message: "Sportul a fost adaugat.",
        },
      });

      return true;
    } catch (currentError) {
      setError(currentError.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-3 md:flex-row md:items-start md:justify-between">
        <h2>Adauga sport</h2>

        <p>
          Creeaza un sport personal. Dupa salvare vei putea configura
          exercitiile sale din catalog.
        </p>
      </div>

      {error && (
        <p className="notice-error" role="alert">
          {error}
        </p>
      )}

      <div className="w-full max-w-[720px] rounded-xl border border-white/10 bg-ink/70 p-4">
        <SportForm onSubmit={addSport} disabled={saving} />
      </div>
    </section>
  );
}
