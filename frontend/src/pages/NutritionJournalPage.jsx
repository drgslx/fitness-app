import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, send, localDate } from "../api/client";
import { useAuth } from "../auth";
import FoodSearch, { FoodAttribution } from "../components/FoodSearch";
import FoodDetails from "../components/foods/FoodDetails";
import NutritionProgressPanel from "../features/nutrition/NutritionProgressPanel";


export default function NutritionJournalPage() {
  const { user, admin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("diary");
  const [day, setDay] = useState(localDate());
  const [goals, setGoals] = useState([]);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [entry, setEntry] = useState({ grams: 100, meal: "Mic dejun" });
  const [entryId, setEntryId] = useState(null);
  const [entryType, setEntryType] = useState("food");
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [recipeUnit, setRecipeUnit] = useState("servings");
  async function loadCatalog() {
    setGoals(await api("/goals"));
  }

  async function loadDiary() {
    setEntries(await api("/diary?day=" + day));
  }

  useEffect(() => {
    loadCatalog().catch((err) => setError(err.message));
  }, []);
  useEffect(() => {
    setEntryId(null);
    loadDiary().catch((err) => setError(err.message));
  }, [day]);

  async function action(work) {
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

  const total = entries.reduce(
    (sum, item) => sum + (item.snapshot.calories * item.grams) / 100,
    0
  );
  const latestGoal = goals.find((item) => item.effective_from <= day);
  const activeGoal = latestGoal && (!latestGoal.valid_until || latestGoal.valid_until >= day) ? latestGoal : null;
  const protein = entries.reduce(
    (sum, item) =>
      sum + ((item.snapshot.nutrients.protein || 0) * item.grams) / 100,
    0
  );

  function submitEntry(event) {
    event.preventDefault();
    action(async () => {
      if (!selected) throw new Error("Cauta si alege un aliment sau o reteta.");
      if (selected.type === "food") {
        await send(
          entryId ? `/diary/${entryId}` : "/diary",
          entryId ? "PUT" : "POST",
          { food_id: selected.id, grams: entry.grams, meal: entry.meal, day }
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
          }
        );
      }
      setEntryId(null);
      await loadDiary();
    });
  }

  function selectJournalItem(item) {
    setSelected(item);
    setEntryType(item.type);
    setEntryId(null);
    setRecipeUnit(item.type === "recipe" ? "servings" : "grams");
    setEntry((current) => ({ ...current, grams: item.type === "recipe" ? 1 : 100 }));
  }

  const amount = Number(entry.grams);
  const estimatedCalories =
    selected && amount > 0
      ? selected.type === "food"
        ? (selected.calories * amount) / 100
        : recipeUnit === "servings"
          ? selected.calories_per_serving == null
            ? null
            : selected.calories_per_serving * amount
          : selected.calories_per_100 == null
            ? null
            : (selected.calories_per_100 * amount) / 100
      : null;

  return (
    <section>
      <p>Produse per 100 g, portii in grame si obiective cu istoric.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          ["diary", "Jurnal zilnic"],
          ["foods", "Catalog alimente"],
          ["goals", "Obiective"],
          ["reports", "Rapoarte"],
        ].map(([key, label]) => (
          <button
            type="button"
            aria-pressed={tab === key}
            key={key}
            onClick={() => key === "goals" ? navigate("/profile") : setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="rounded-lg border border-red-400/30 bg-[#321a18] px-3 py-2 text-[#ffaaaa]">
          {error}
        </p>
      )}

      <FoodAttribution />
      {tab === "diary" && (
        <>
          <label>
            Ziua
            <input
              type="date"
              required
              value={day}
              onChange={(event) =>
                event.target.value && setDay(event.target.value)
              }
            />
          </label>
          <div className="my-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 [&_section]:rounded-xl [&_section]:bg-[#13251a] [&_section]:p-4 [&_strong]:text-xl [&_strong]:text-accent">
            <section>
              <strong>{total.toFixed(1)} kcal</strong>
              <p>Tinta: {activeGoal?.calories ?? "nesetata"} kcal</p>
            </section>
            <section>
              <strong>{protein.toFixed(1)} g proteine</strong>
              <p>Tinta: {activeGoal?.protein ?? "nesetata"} g</p>
            </section>
            <section>
              <strong>
                {activeGoal ? (total - activeGoal.calories).toFixed(1) : "-"}{" "}
                kcal
              </strong>
              <p>Consum minus tinta</p>
            </section>
          </div>
          <form className="my-4 flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-surface/90 p-4 shadow-xl" onSubmit={submitEntry}>
            <h2>{entryId ? "Editeaza portia" : "Adauga o portie"}</h2>
            <FoodSearch includeRecipes onSelect={selectJournalItem} day={day} meal={entry.meal} grams={entryType === "food" ? entry.grams : 100} onAdded={loadDiary} />
            {selected && (
              <p>
                <strong>Selectat:</strong> {selected.name} (
                {entryType === "food" ? "aliment" : "reteta"})
                {entryType === "recipe" && selected.basis_grams > 0 && selected.servings > 0 && (
                  <> · 1 portie = {(selected.basis_grams / selected.servings).toFixed(1)} g</>
                )}
                {estimatedCalories !== null && (
                  <> · {estimatedCalories.toFixed(1)} kcal pentru cantitatea aleasa</>
                )}
              </p>
            )}
            <div className="grid gap-3 md:grid-cols-2">
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
                  onChange={(event) =>
                    setEntry({ ...entry, grams: Number(event.target.value) })
                  }
                />
              </label>
              {entryType === "recipe" && (
                <label>
                  Unitate
                  <select
                    value={recipeUnit}
                    onChange={(event) => {
                      setRecipeUnit(event.target.value);
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
                  onChange={(event) =>
                    setEntry({ ...entry, meal: event.target.value })
                  }
                />
              </label>
            </div>
            {entryType === "recipe" && recipeUnit === "grams" && (
              <p className="text-sm text-muted">
                {selected?.cooked_total_grams
                  ? "Gramele sunt din preparatul gatit."
                  : selected?.raw_total_grams
                    ? "Reteta nu are gramaj gatit: calculul foloseste gramajul ingredientelor."
                    : "Calculul foloseste gramajul definit pentru reteta."}
              </p>
            )}
            <button disabled={busy}>
              {entryId ? "Salveaza portia" : "Adauga in jurnal"}
            </button>
            {entryId && (
              <button type="button" onClick={() => setEntryId(null)}>
                Anuleaza editarea
              </button>
            )}
          </form>
          <div className="my-4 w-full overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Masa</th>
                  <th>Tip</th>
                  <th>Aliment / reteta</th>
                  <th>Cantitate</th>
                  <th>kcal</th>
                  <th>Actiuni</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((item) => (
                  <tr key={`${item.entry_type}-${item.id}`}>
                    <td>{item.meal}</td>
                    <td>
                      {item.entry_type === "recipe" ? "Reteta" : "Aliment"}
                    </td>
                    <td><button type="button" onClick={() => setDetails(item)}>{item.snapshot.name}</button></td>
                    <td>
                      {item.entry_type === "recipe" && item.servings
                        ? `${item.servings} portii`
                        : `${item.grams.toFixed(1)} g`}
                    </td>
                    <td>
                      {((item.snapshot.calories * item.grams) / 100).toFixed(1)}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          setEntryId(item.id);
                          setEntryType(item.entry_type);
                          setRecipeUnit(item.quantity_unit || "grams");
                          setSelected(
                            item.entry_type === "recipe"
                              ? {
                                  id: item.recipe_id,
                                  name: item.snapshot.name,
                                  type: "recipe",
                                  calories_per_100: item.snapshot.calories,
                                  calories_per_serving: item.servings
                                    ? (item.snapshot.calories * item.grams) /
                                      (100 * item.servings)
                                    : null,
                                }
                              : {
                                  id: item.food_id,
                                  ...item.snapshot,
                                  type: "food",
                                }
                          );
                          setEntry({
                            grams: item.servings ?? item.grams,
                            meal: item.meal,
                          });
                        }}
                      >
                        Editeaza
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          action(async () => {
                            await send(
                              item.entry_type === "recipe"
                                ? `/recipe-diary/${item.id}`
                                : `/diary/${item.id}`,
                              "DELETE"
                            );
                            await loadDiary();
                          })
                        }
                      >
                        Sterge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "foods" && <section className="my-4 rounded-xl border border-white/10 p-4">
        <h2>Catalog alimente</h2>
        <FoodSearch day={day} meal={entry.meal} onAdded={loadDiary} renderActions={food => <>
          {food.source !== "openfoodfacts" && (food.user_id === user?.uid || admin) && <Link className="text-accent" to={`/nutrition/foods/${food.id}/edit`}>Editeaza</Link>}
        </>} />
      </section>}

      {details && <FoodDetails food={details.snapshot} grams={details.grams} historical onClose={() => setDetails(null)} />}
      {tab === "reports" && <NutritionProgressPanel />}
    </section>
  );
}
