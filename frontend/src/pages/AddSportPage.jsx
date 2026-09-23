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
    <section className="panel">
      <div className="page-heading">
        <h2>Adauga sport</h2>

        <p>
          Creeaza un sport personal. Dupa salvare vei putea configura
          exercitiile sale din catalog.
        </p>
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <div className="catalog-form-card">
        <SportForm onSubmit={addSport} disabled={saving} />
      </div>
    </section>
  );
}