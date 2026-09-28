import EnergyFields from "../../../components/activity/EnergyFields";
import { localDate } from "../../../api/client";
import React, { useState } from "react";

export default function SportForm({
  onSubmit,
  disabled = false,
  initialValues = { name: "" },
  submitLabel = "Adauga sport",
  resetOnSuccess = true,
}) {
  const [name, setName] = useState(initialValues.name);
  const [energy, setEnergy] = useState({ activity_type: initialValues.activity_type ?? null,
    duration_minutes: initialValues.default_duration_minutes ?? null, intensity: initialValues.default_intensity || "moderate" });

  async function submit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName || disabled) return;

    const success = await onSubmit({ name: trimmedName, activity_type: energy.activity_type, default_duration_minutes: energy.duration_minutes, default_intensity: energy.intensity });

    if (success && resetOnSuccess) {
      setName("");
    }
  }

  return (
    <form onSubmit={submit}>
      <label>
        Nume
        <input
          required
          disabled={disabled}
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex: Sport de contact"
        />
      </label>

      <EnergyFields value={energy} onChange={(changes) => setEnergy((current) => ({ ...current, ...changes }))} disabled={disabled} day={localDate()} template />
      <button type="submit" disabled={disabled || !name.trim()}>
        {submitLabel}
      </button>
    </form>
  );
}