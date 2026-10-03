import { useCallback, useEffect, useState } from "react";
import { api, send, localDate } from "../../../api/client";

export default function useNutritionJournal() {
  const [day, setDay] = useState(localDate());
  const [goals, setGoals] = useState([]);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [entry, setEntry] = useState({ grams: 100, meal: "Mic dejun" });
  const [entryId, setEntryId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [recipeUnit, setRecipeUnit] = useState("servings");
  const [details, setDetails] = useState(null);
  const entryType = selected?.type || "food";

  const loadDiary = useCallback(async () => {
    setEntries(await api("/diary?day=" + day));
  }, [day]);

  useEffect(() => {
    api("/goals")
      .then(setGoals)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    setEntryId(null);
    loadDiary().catch((err) => setError(err.message));
  }, [loadDiary]);

  async function action(work) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await work();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function selectItem(item) {
    setSelected(item);
    setEntryId(null);
    setRecipeUnit(item.type === "recipe" ? "servings" : "grams");
    setEntry((current) => ({
      ...current,
      grams: item.type === "recipe" ? 1 : 100,
    }));
  }

  function editItem(item) {
    setEntryId(item.id);
    setRecipeUnit(item.quantity_unit || "grams");
    setSelected(
      item.entry_type === "recipe"
        ? {
            id: item.recipe_id,
            name: item.snapshot.name,
            type: "recipe",
            calories_per_100: item.snapshot.calories,
            calories_per_serving: item.servings
              ? (item.snapshot.calories * item.grams) / (100 * item.servings)
              : null,
          }
        : { ...item.snapshot, id: item.food_id, type: "food" },
    );
    setEntry({ grams: item.servings ?? item.grams, meal: item.meal });
  }

  function removeItem(item) {
    return action(async () => {
      await send(
        item.entry_type === "recipe"
          ? `/recipe-diary/${item.id}`
          : `/diary/${item.id}`,
        "DELETE",
      );
      await loadDiary();
    });
  }

  function submitEntry(event) {
    event.preventDefault();
    return action(async () => {
      if (!selected) throw new Error("Cauta si alege un aliment sau o reteta.");
      if (entryType === "food") {
        await send(
          entryId ? `/diary/${entryId}` : "/diary",
          entryId ? "PUT" : "POST",
          { food_id: selected.id, grams: entry.grams, meal: entry.meal, day },
        );
      } else {
        await send(
          entryId ? `/recipe-diary/${entryId}` : "/recipe-diary",
          entryId ? "PUT" : "POST",
          {
            recipe_id: selected.id,
            amount: entry.grams,
            unit: recipeUnit,
            meal: entry.meal,
            day,
          },
        );
      }
      setEntryId(null);
      await loadDiary();
    });
  }

  const total = entries.reduce(
    (sum, item) => sum + (item.snapshot.calories * item.grams) / 100,
    0,
  );
  const protein = entries.reduce(
    (sum, item) =>
      sum + ((item.snapshot.nutrients.protein || 0) * item.grams) / 100,
    0,
  );
  const latestGoal = goals.find((item) => item.effective_from <= day);
  const activeGoal =
    latestGoal && (!latestGoal.valid_until || latestGoal.valid_until >= day)
      ? latestGoal
      : null;
  const amount = Number(entry.grams);
  const estimatedCalories =
    selected && amount > 0
      ? entryType === "food"
        ? (selected.calories * amount) / 100
        : recipeUnit === "servings"
          ? selected.calories_per_serving == null
            ? null
            : selected.calories_per_serving * amount
          : selected.calories_per_100 == null
            ? null
            : (selected.calories_per_100 * amount) / 100
      : null;

  return {
    day,
    setDay,
    entries,
    error,
    busy,
    entry,
    setEntry,
    entryId,
    entryType,
    selected,
    recipeUnit,
    setRecipeUnit,
    details,
    setDetails,
    total,
    protein,
    activeGoal,
    estimatedCalories,
    loadDiary,
    selectItem,
    editItem,
    removeItem,
    submitEntry,
    cancelEdit: () => setEntryId(null),
  };
}
