import Button from "../ui/Button";
import React, { useRef, useState } from "react";
import { localDate, send } from "../../api/client";
import FoodDialog from "./FoodDialog";

export default function QuickAddFood({
  food,
  day = localDate(),
  meal = "Mic dejun",
  grams = 100,
  onAdded,
  onClose,
}) {
  const [values, setValues] = useState({ day, meal, grams });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const saving = useRef(false);
  async function submit(event) {
    event.preventDefault();
    if (saving.current) return;
    saving.current = true;
    setBusy(true);
    setError("");
    try {
      const saved = await send("/diary", "POST", {
        food_id: food.id,
        ...values,
        grams: Number(values.grams),
      });
      // A refresh failure must not allow the already saved portion to be submitted twice.
      onClose();
      await onAdded?.(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  return (
    <FoodDialog
      title={`Adauga in jurnal: ${food.name}`}
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <form onSubmit={submit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            Data
            <input
              type="date"
              required
              value={values.day}
              onChange={(e) => setValues({ ...values, day: e.target.value })}
            />
          </label>
          <label>
            Masa
            <input
              required
              maxLength={60}
              value={values.meal}
              onChange={(e) => setValues({ ...values, meal: e.target.value })}
            />
          </label>
          <label>
            Grame
            <input
              type="number"
              required
              min="0.1"
              max="10000"
              step="0.1"
              value={values.grams}
              onChange={(e) => setValues({ ...values, grams: e.target.value })}
            />
          </label>
        </div>
        {Number(values.grams) > 0 && (
          <p>
            {((food.calories * Number(values.grams)) / 100).toLocaleString(
              "ro-RO",
              { maximumFractionDigits: 1 },
            )}{" "}
            kcal
          </p>
        )}
        {error && <p role="alert">{error}</p>}
        <Button disabled={busy}>
          {busy ? "Se salveaza…" : "Salveaza in jurnal"}
        </Button>
      </form>
    </FoodDialog>
  );
}
