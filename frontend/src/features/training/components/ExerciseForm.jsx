import React, { useState } from "react";

const emptyExercise = () => ({
  name: "",
  tracking_type: "strength",
});

export default function ExerciseForm({
  onSubmit,
  disabled = false,
  initialValues,
  submitLabel = "Adauga exercitiul",
  resetOnSuccess = true,
}) {
  const [values, setValues] = useState(() => ({
    ...emptyExercise(),
    ...initialValues,
  }));

  async function submit(event) {
    event.preventDefault();

    const name = values.name.trim();
    if (!name || disabled) return;

    const success = await onSubmit({ ...values, name });

    if (success && resetOnSuccess) {
      setValues(emptyExercise());
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        <label>
          Nume exercitiu
          <input
            required
            disabled={disabled}
            maxLength={160}
            value={values.name}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
          />
        </label>

        <label>
          Cum este masurat
          <select
            disabled={disabled}
            value={values.tracking_type}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                tracking_type: event.target.value,
              }))
            }
          >
            <option value="strength">Seturi, repetari si kg</option>
            <option value="repetitions">Repetari</option>
            <option value="duration">Runde / minute</option>
            <option value="distance">Distanta si timp</option>
            <option value="mixed">Mixt</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={disabled || !values.name.trim()}
      >
        {submitLabel}
      </button>
    </form>
  );
}