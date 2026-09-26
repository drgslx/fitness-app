import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SportForm from "../features/training/components/SportForm";
import { createSport } from "../features/training/api";

export default function AddSportPage() {
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
    <section className="my-4 flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-surface/90 p-4 shadow-xl">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-3 md:flex-row md:items-start md:justify-between">
        <h2>Adauga sport</h2>

        <p>
          Creeaza un sport personal. Dupa salvare vei putea configura
          exercitiile sale din catalog.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-400/30 bg-[#321a18] px-3 py-2 text-[#ffaaaa]" role="alert">
          {error}
        </p>
      )}

      <div className="w-full max-w-[720px] rounded-xl border border-white/10 bg-ink/70 p-4">
        <SportForm onSubmit={addSport} disabled={saving} />
      </div>
    </section>
  );
}