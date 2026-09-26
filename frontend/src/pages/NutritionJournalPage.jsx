import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, send, localDate } from "../api/client";
import { useAuth } from "../auth";
import NutritionProgressPanel from "../features/nutrition/NutritionProgressPanel";


export default function NutritionJournalPage() {
  const { user, admin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("diary");
  const [day, setDay] = useState(localDate());
  const [foods, setFoods] = useState([]);
  const [nutrients, setNutrients] = useState([]);
  const [types, setTypes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [entry, setEntry] = useState({ grams: 100, meal: "Mic dejun" });
  const [entryId, setEntryId] = useState(null);
  const [entryType, setEntryType] = useState("food");
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recipeUnit, setRecipeUnit] = useState("servings");
  const [goal, setGoal] = useState({
    effective_from: localDate(),
    goal_type: "maintain",
    calories: 2000,
    protein: 100,
    pace_kg_week: null,
    notes: "",
  });
  const [start, setStart] = useState(
    localDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  );
  const [end, setEnd] = useState(localDate());
  const [report, setReport] = useState(null);

  async function loadCatalog(search = query) {
    const [foodList, nutrientList, goalTypes, goalList] = await Promise.all([
      api("/foods?q=" + encodeURIComponent(search)),
      api("/nutrients"),
      api("/goal-types"),
      api("/goals"),
    ]);
    setFoods(foodList);
    setNutrients(nutrientList);
    setTypes(goalTypes);
    setGoals(goalList);
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
  const activeGoal = goals.find((item) => item.effective_from <= day);
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

  function searchJournal() {
    action(async () => {
      const [foodMatches, recipeMatches] = await Promise.all([
        api("/foods?q=" + encodeURIComponent(searchTerm)),
        api("/recipes?q=" + encodeURIComponent(searchTerm)),
      ]);
      setSearchResults([
        ...foodMatches.map((item) => ({ ...item, type: "food" })),
        ...recipeMatches.map((item) => ({ ...item, type: "recipe" })),
      ]);
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

  function deleteFood(food) {
    if (!window.confirm(`Stergi definitiv alimentul "${food.name}"?`)) return;
    action(async () => {
      await send(`/foods/${food.id}`, "DELETE");
      await loadCatalog();
    });
  }

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
            onClick={() => setTab(key)}
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
            <div className="my-4 flex flex-wrap items-end gap-3 [&_label]:min-w-[180px] [&_label]:flex-1">
              <label>
                Cauta aliment sau reteta
                <input
                  required
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="pui, orez, omleta..."
                />
              </label>
              <button
                type="button"
                disabled={busy || !searchTerm.trim()}
                onClick={searchJournal}
              >
                Cauta
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="my-3 flex flex-wrap items-center gap-2">
                {searchResults.map((item) => (
                  <button
                    type="button"
                    key={`${item.type}-${item.id}`}
                    onClick={() => selectJournalItem(item)}
                  >
                    {item.type === "food" ? "Aliment" : "Reteta"}: {item.name} -{" "}
                    {item.type === "food"
                      ? item.calories
                      : item.calories_per_serving}{" "}
                    kcal/{item.type === "food" ? "100 g" : "portie"}
                    {item.type === "recipe" &&
                      ` · ${item.calories_per_100} kcal/100 g`}
                  </button>
                ))}
              </div>
            )}
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
          {!foods.length && <p>Adauga mai intai un produs in catalog.</p>}
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
                    <td>{item.snapshot.name}</td>
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
                                  name: item.snapshot.name,
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

      {tab === "foods" && (
        <>
          <form
            className="my-4 flex flex-wrap items-end gap-3 [&_label]:min-w-[180px] [&_label]:flex-1"
            onSubmit={(event) => {
              event.preventDefault();
              action(() => loadCatalog());
            }}
          >
            <label>
              Cauta in catalog
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <button disabled={busy}>Cauta</button>
          </form>
          <p>
            Catalogul este comun tuturor utilizatorilor. Rezultatele sunt
            limitate la 200.
          </p>
          <div className="my-4 w-full overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Produs</th>
                  <th>kcal</th>
                  <th>Proteine</th>
                  <th>Grasimi</th>
                  <th>Fibre</th>
                  <th>Carbohidrati</th>
                  <th>Sare</th>
                  <th>Zaharuri</th>
                  <th>Actiuni</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food.id}>
                    <td>{food.name}</td>
                    <td>{food.calories}</td>
                    <td>{food.nutrients.protein ?? "-"}</td>
                    <td>{food.nutrients.fat ?? "-"}</td>
                    <td>{food.nutrients.fiber ?? "-"}</td>
                    <td>{food.nutrients.carbohydrates ?? "-"}</td>
                    <td>{food.nutrients.salt ?? "-"}</td>
                    <td>{food.nutrients.sugar ?? "-"}</td>
                    <td>
                      {(admin || food.user_id === user.uid) && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/nutrition/foods/${food.id}/edit`)
                            }
                          >
                            Editeaza
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => deleteFood(food)}
                          >
                            Sterge
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "goals" && (
        <>
          <form
            className="my-4 flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-surface/90 p-4 shadow-xl"
            onSubmit={(event) => {
              event.preventDefault();
              action(async () => {
                await send("/goals", "PUT", goal);
                await loadCatalog();
              });
            }}
          >
            <h2>Seteaza obiectivul</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <label>
                Incepand cu
                <input
                  required
                  type="date"
                  value={goal.effective_from}
                  onChange={(event) =>
                    setGoal({ ...goal, effective_from: event.target.value })
                  }
                />
              </label>
              <label>
                Tip
                <select
                  value={goal.goal_type}
                  onChange={(event) =>
                    setGoal({ ...goal, goal_type: event.target.value })
                  }
                >
                  {types.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                kcal/zi
                <input
                  required
                  type="number"
                  min="1"
                  value={goal.calories}
                  onChange={(event) =>
                    setGoal({ ...goal, calories: Number(event.target.value) })
                  }
                />
              </label>
              <label>
                Proteine g/zi
                <input
                  required
                  type="number"
                  min="0"
                  value={goal.protein}
                  onChange={(event) =>
                    setGoal({ ...goal, protein: Number(event.target.value) })
                  }
                />
              </label>
              <label>
                Ritm kg/saptamana
                <input
                  type="number"
                  min="-10"
                  max="10"
                  step=".1"
                  value={goal.pace_kg_week ?? ""}
                  onChange={(event) =>
                    setGoal({
                      ...goal,
                      pace_kg_week:
                        event.target.value === ""
                          ? null
                          : Number(event.target.value),
                    })
                  }
                />
              </label>
            </div>
            <label>
              Note
              <textarea
                maxLength={1000}
                value={goal.notes}
                onChange={(event) =>
                  setGoal({ ...goal, notes: event.target.value })
                }
              />
            </label>
            <button disabled={busy}>Salveaza obiectivul</button>
          </form>
          <h2>Istoric obiective</h2>
          {goals.map((item) => (
            <p key={item.id}>
              {item.effective_from} -{" "}
              {types.find((type) => type.key === item.goal_type)?.label ||
                item.goal_type}{" "}
              - {item.calories} kcal - {item.protein} g proteine{" "}
              <button
                type="button"
                onClick={() =>
                  setGoal({
                    effective_from: item.effective_from,
                    goal_type: item.goal_type,
                    calories: item.calories,
                    protein: item.protein,
                    pace_kg_week: item.pace_kg_week,
                    notes: item.notes,
                  })
                }
              >
                Editeaza
              </button>
            </p>
          ))}
        </>
      )}

      {tab === "reports" && <NutritionProgressPanel />}
    </section>
  );
}
