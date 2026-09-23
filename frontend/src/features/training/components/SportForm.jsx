import React, { useState } from "react";

export default function SportForm({
  onSubmit,
  disabled = false,
  initialValues = { name: "" },
  submitLabel = "Adauga sport",
  resetOnSuccess = true,
}) {
  const [name, setName] = useState(initialValues.name);

  async function submit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName || disabled) return;

    const success = await onSubmit({ name: trimmedName });

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

      <button type="submit" disabled={disabled || !name.trim()}>
        {submitLabel}
      </button>
    </form>
  );
}