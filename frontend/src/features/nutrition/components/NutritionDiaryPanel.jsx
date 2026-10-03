import Metric from "../../../components/ui/Metric";
import Button from "../../../components/ui/Button";
import React, { useRef } from "react";
import FoodSearch from "../../../components/FoodSearch";
import NutritionDiaryEntries from "./NutritionDiaryEntries";

export default function NutritionDiaryPanel({ journal }) {
  const formRef = useRef(null);
  const {
    day,
    setDay,
    total,
    protein,
    activeGoal,
    entry,
    setEntry,
    entryId,
    entryType,
    selected,
    recipeUnit,
    setRecipeUnit,
    estimatedCalories,
    busy,
    loadDiary,
    selectItem,
    submitEntry,
    cancelEdit,
  } = journal;

  return (
    <div className="min-w-0 space-y-6">
      <label className="max-w-sm">
        Ziua
        <input
          type="date"
          required
          value={day}
          onChange={(e) => {
            if (e.target.value) setDay(e.target.value);
          }}
        />
      </label>
      <div className="diary-metrics grid gap-3 sm:grid-cols-3">
        {[
          [
            "Consum",
            `${total.toFixed(1)} kcal`,
            `Tinta: ${activeGoal?.calories ?? "nesetata"} kcal`,
          ],
          [
            "Proteine",
            `${protein.toFixed(1)} g proteine`,
            `Tinta: ${activeGoal?.protein ?? "nesetata"} g`,
          ],
          [
            "Consum minus tinta",
            `${activeGoal ? (total - activeGoal.calories).toFixed(1) : "—"} kcal`,
            "Comparatie cu obiectivul zilei",
          ],
        ].map(([label, value, note]) => (
          <Metric key={label} label={label} value={value} detail={note} />
        ))}
      </div>
      <form
        ref={formRef}
        onSubmit={submitEntry}
        className="min-w-0 scroll-mt-24 gap-5 rounded-xl border border-white/10 bg-surface p-4 sm:p-5"
      >
        <h2 className="mb-0 text-xl">
          {entryId ? "Editeaza portia" : "Adauga o portie"}
        </h2>
        <FoodSearch
          includeRecipes
          onSelect={selectItem}
          day={day}
          meal={entry.meal}
          grams={entryType === "food" ? entry.grams : 100}
          onAdded={loadDiary}
        />
        {selected && (
          <p className="rounded-lg bg-white/5 p-3 text-sm break-words">
            <strong>Selectat:</strong> {selected.name} (
            {entryType === "food" ? "aliment" : "reteta"})
            {entryType === "recipe" &&
              selected.basis_grams > 0 &&
              selected.servings > 0 && (
                <>
                  {" "}
                  · 1 portie ={" "}
                  {(selected.basis_grams / selected.servings).toFixed(1)} g
                </>
              )}
            {estimatedCalories !== null && (
              <>
                {" "}
                · {estimatedCalories.toFixed(1)} kcal pentru cantitatea aleasa
              </>
            )}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            {entryType === "recipe" && recipeUnit === "servings"
              ? "Portii"
              : "Grame"}
            <input
              type="number"
              min=".1"
              step=".1"
              required
              value={entry.grams}
              onChange={(e) =>
                setEntry((current) => ({
                  ...current,
                  grams: Number(e.target.value),
                }))
              }
            />
          </label>
          {entryType === "recipe" && (
            <label>
              Unitate
              <select
                value={recipeUnit}
                onChange={(e) => {
                  setRecipeUnit(e.target.value);
                  setEntry((current) => ({ ...current, grams: "" }));
                }}
              >
                <option value="servings">Portii</option>
                <option value="grams">Grame</option>
              </select>
            </label>
          )}
          <label>
            Masa
            <input
              required
              maxLength={60}
              value={entry.meal}
              onChange={(e) =>
                setEntry((current) => ({ ...current, meal: e.target.value }))
              }
            />
          </label>
        </div>
        {entryType === "recipe" && recipeUnit === "grams" && (
          <p className="text-xs text-muted">
            {selected?.cooked_total_grams
              ? "Gramele sunt din preparatul gatit."
              : selected?.raw_total_grams
                ? "Reteta nu are gramaj gatit: calculul foloseste gramajul ingredientelor."
                : "Calculul foloseste gramajul definit pentru reteta."}
          </p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" disabled={busy} className="w-full sm:w-auto">
            {busy
              ? "Se salveaza…"
              : entryId
                ? "Salveaza portia"
                : "Adauga in jurnal"}
          </Button>
          {entryId && (
            <Button
              type="button"
              disabled={busy}
              onClick={cancelEdit}
              className="w-full border-white/15 bg-[#203629] text-copy hover:bg-[#2d4b39] sm:w-auto"
            >
              Anuleaza editarea
            </Button>
          )}
        </div>
      </form>
      <NutritionDiaryEntries
        entries={journal.entries}
        busy={busy}
        onDetails={journal.setDetails}
        onRemove={journal.removeItem}
        onEdit={(item) => {
          journal.editItem(item);
          formRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
      />
    </div>
  );
}
