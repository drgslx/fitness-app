import React, { useEffect, useState } from "react";
import { api, send, localDate } from "../api/client";
import { useAuth } from "../auth";

const emptyFood = {
  name: "",
  calories: null,
  nutrients: { carbohydrates: 0, protein: 0, fat: 0, salt: 0 },
};
export default function NutritionPage() {
  const { user, admin } = useAuth();
  const [tab, setTab] = useState("diary");
  const [day, setDay] = useState(localDate());
  const [foods, setFoods] = useState([]);
  const [nutrients, setNutrients] = useState([]);
  const [types, setTypes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [food, setFood] = useState(emptyFood);
  const [foodId, setFoodId] = useState(null);
  const [entry, setEntry] = useState({
    food_id: "",
    grams: 100,
    meal: "Mic dejun",
  });
  const [entryId, setEntryId] = useState(null);
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
  async function loadCatalog() {
    const [f, n, t, g] = await Promise.all([
      api("/foods?q=" + encodeURIComponent(query)),
      api("/nutrients"),
      api("/goal-types"),
      api("/goals"),
    ]);
    setFoods(f);
    setNutrients(n);
    setTypes(t);
    setGoals(g);
  }
  async function loadDiary() {
    setEntries(await api("/diary?day=" + day));
  }
  useEffect(() => {
    loadCatalog().catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    setEntryId(null);
    loadDiary().catch((e) => setError(e.message));
  }, [day]);
  async function action(fn) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const total = entries.reduce(
    (sum, e) => sum + (e.snapshot.calories * e.grams) / 100,
    0
  );
  const activeGoal = goals.find((g) => g.effective_from <= day);
  const protein = entries.reduce(
    (sum, e) => sum + ((e.snapshot.nutrients.protein || 0) * e.grams) / 100,
    0
  );
  function foodSubmit(e) {
    e.preventDefault();
    action(async () => {
      await send(
        foodId ? "/foods/" + foodId : "/foods",
        foodId ? "PUT" : "POST",
        food
      );
      setFood(emptyFood);
      setFoodId(null);
      await loadCatalog();
    });
  }
  function entrySubmit(e) {
    e.preventDefault();
    action(async () => {
      await send(
        entryId ? "/diary/" + entryId : "/diary",
        entryId ? "PUT" : "POST",
        { ...entry, food_id: Number(entry.food_id), day }
      );
      setEntryId(null);
      await loadDiary();
    });
  }

  function deleteFood(food) {
    if (!window.confirm(`Ștergi definitiv alimentul „${food.name}”?`)) {
      return;
    }

    action(async () => {
      await send("/foods/" + food.id, "DELETE");

      if (foodId === food.id) {
        setFoodId(null);
        setFood(emptyFood);
      }

      await loadCatalog();
    });
  }

  return (
    <main>
      <h1>Alimentație</h1>
      <p>Produse per 100 g, porții în grame și obiective cu istoric.</p>
      <div className="tabs">
        {[
          ["diary", "Jurnal zilnic"],
          ["foods", "Catalog alimente"],
          ["goals", "Obiective"],
          ["reports", "Rapoarte"],
        ].map(([key, label]) => (
          <button
            aria-pressed={tab === key}
            key={key}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="error">
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
              onChange={(e) => e.target.value && setDay(e.target.value)}
            />
          </label>
          <div className="stats">
            <section>
              <strong>{total.toFixed(1)} kcal</strong>
              <p>Țintă: {activeGoal?.calories ?? "nesetată"} kcal</p>
            </section>
            <section>
              <strong>{protein.toFixed(1)} g proteine</strong>
              <p>Țintă: {activeGoal?.protein ?? "nesetată"} g</p>
            </section>
            <section>
              <strong>
                {activeGoal ? (total - activeGoal.calories).toFixed(1) : "—"}{" "}
                kcal
              </strong>
              <p>Consum minus țintă</p>
            </section>
          </div>
          <form className="panel" onSubmit={entrySubmit}>
            <h2>{entryId ? "Editează porția" : "Adaugă o porție"}</h2>
            <div className="form-grid">
              <label>
                Aliment
                <select
                  required
                  value={entry.food_id}
                  onChange={(e) =>
                    setEntry({ ...entry, food_id: e.target.value })
                  }
                >
                  <option value="">Alege alimentul</option>
                  {foods.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} · {f.calories} kcal/100 g
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Grame
                <input
                  type="number"
                  min=".1"
                  step=".1"
                  required
                  value={entry.grams}
                  onChange={(e) =>
                    setEntry({ ...entry, grams: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Masă
                <input
                  required
                  maxLength={60}
                  value={entry.meal}
                  onChange={(e) => setEntry({ ...entry, meal: e.target.value })}
                />
              </label>
            </div>
            <button disabled={busy}>
              {entryId ? "Salvează porția" : "Adaugă în jurnal"}
            </button>
            {entryId && (
              <button type="button" onClick={() => setEntryId(null)}>
                Anulează editarea
              </button>
            )}
          </form>
          {!foods.length && (
            <p>Adaugă mai întâi un produs în Catalog alimente.</p>
          )}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Masă</th>
                  <th>Aliment</th>
                  <th>Grame</th>
                  <th>kcal</th>
                  <th>Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td>{e.meal}</td>
                    <td>{e.snapshot.name}</td>
                    <td>{e.grams}</td>
                    <td>
                      {((e.snapshot.calories * e.grams) / 100).toFixed(1)}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setEntryId(e.id);
                          setEntry({
                            food_id: e.food_id,
                            grams: e.grams,
                            meal: e.meal,
                          });
                        }}
                      >
                        Editează
                      </button>
                      <button
                        disabled={busy}
                        onClick={() =>
                          action(async () => {
                            await send("/diary/" + e.id, "DELETE");
                            await loadDiary();
                          })
                        }
                      >
                        Șterge
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
            className="search-row"
            onSubmit={(e) => {
              e.preventDefault();
              action(loadCatalog);
            }}
          >
            <label>
              Caută în catalog
              <input value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            <button disabled={busy}>Caută</button>
          </form>
          <p>
            Catalogul este comun tuturor utilizatorilor. Rezultatele sunt
            limitate la 200; folosește căutarea.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Produs</th>
                  <th>kcal/100 g</th>
                  <th>Proteine/100 g</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {foods.map((f) => (
                  <tr key={f.id}>
                    <td>{f.name}</td>
                    <td>{f.calories}</td>
                    <td>{f.nutrients.protein ?? "—"}</td>
                    <td>
                      {(admin || f.user_id === user.uid) && (
                        <button
                          onClick={() => {
                            setFoodId(f.id);
                            setFood({
                              name: f.name,
                              calories: f.calories,
                              nutrients: f.nutrients,
                            });
                          }}
                        >
                          Editează
                        </button>
                      )}

                      {(admin || f.user_id === user.uid) &&  (
                        <button disabled={busy} onClick={() => deleteFood(f)}>
                          Șterge
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form className="panel" onSubmit={foodSubmit}>
            <h2>{foodId ? "Editează alimentul" : "Adaugă un aliment"}</h2>
            <p>
              Toate valorile sunt pentru 100 g. Ia caloriile de pe etichetă;
              nutrienții opționali lipsă rămân necunoscuți, nu zero.
            </p>
            <div className="form-grid">
              <label>
                Nume
                <input
                  required
                  maxLength={180}
                  value={food.name}
                  onChange={(e) => setFood({ ...food, name: e.target.value })}
                />
              </label>
              <label>
                Calorii (kcal)
                <input
                  type="number"
                  required
                  min="0"
                  step=".01"
                  value={food.calories}
                  onChange={(e) =>
                    setFood({ ...food, calories: Number(e.target.value) })
                  }
                />
              </label>
              {nutrients.map((n) => (
                <label key={n.key}>
                  {n.label} ({n.unit})
                  <input
                    type="number"
                    min="0"
                    step=".001"
                    required={[
                      "carbohydrates",
                      "protein",
                      "fat",
                      "salt",
                    ].includes(n.key)}
                    value={food.nutrients[n.key] ?? ""}
                    onChange={(e) => {
                      const values = { ...food.nutrients };
                      if (e.target.value === "") delete values[n.key];
                      else values[n.key] = Number(e.target.value);
                      setFood({ ...food, nutrients: values });
                    }}
                  />
                </label>
              ))}
            </div>
            <button disabled={busy}>Salvează alimentul</button>
            {foodId && (
              <button
                type="button"
                onClick={() => {
                  setFoodId(null);
                  setFood(emptyFood);
                }}
              >
                Anulează editarea
              </button>
            )}
          </form>
        </>
      )}
      {tab === "goals" && (
        <>
          <form
            className="panel"
            onSubmit={(e) => {
              e.preventDefault();
              action(async () => {
                await send("/goals", "PUT", goal);
                await loadCatalog();
              });
            }}
          >
            <h2>Setează obiectivul</h2>
            <p>
              Țintele sunt introduse de tine. Ritmul în kg/săptămână este o notă
              de planificare, nu un calcul automat de deficit.
            </p>
            <div className="form-grid">
              <label>
                Începând cu
                <input
                  required
                  type="date"
                  value={goal.effective_from}
                  onChange={(e) =>
                    setGoal({ ...goal, effective_from: e.target.value })
                  }
                />
              </label>
              <label>
                Tip
                <select
                  value={goal.goal_type}
                  onChange={(e) =>
                    setGoal({ ...goal, goal_type: e.target.value })
                  }
                >
                  {types.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label}
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
                  onChange={(e) =>
                    setGoal({ ...goal, calories: Number(e.target.value) })
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
                  onChange={(e) =>
                    setGoal({ ...goal, protein: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Ritm kg/săptămână (− slăbire / + creștere)
                <input
                  type="number"
                  min="-10"
                  max="10"
                  step=".1"
                  value={goal.pace_kg_week ?? ""}
                  onChange={(e) =>
                    setGoal({
                      ...goal,
                      pace_kg_week:
                        e.target.value === "" ? null : Number(e.target.value),
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
                onChange={(e) => setGoal({ ...goal, notes: e.target.value })}
              />
            </label>
            <button disabled={busy}>Salvează obiectivul</button>
          </form>
          <h2>Istoric obiective</h2>
          <p>
            O dată nouă începe o perioadă nouă. Salvarea aceleiași date
            înlocuiește intenționat ținta pentru acea perioadă.
          </p>
          {goals.map((g) => (
            <p key={g.id}>
              {g.effective_from} ·{" "}
              {types.find((t) => t.key === g.goal_type)?.label || g.goal_type} ·{" "}
              {g.calories} kcal · {g.protein} g proteine{" "}
              <button
                onClick={() =>
                  setGoal({
                    effective_from: g.effective_from,
                    goal_type: g.goal_type,
                    calories: g.calories,
                    protein: g.protein,
                    pace_kg_week: g.pace_kg_week,
                    notes: g.notes,
                  })
                }
              >
                Editează
              </button>
            </p>
          ))}
        </>
      )}
      {tab === "reports" && (
        <>
          <form
            className="search-row"
            onSubmit={(e) => {
              e.preventDefault();
              action(async () =>
                setReport(
                  await api("/nutrition-report?start=" + start + "&end=" + end)
                )
              );
            }}
          >
            <label>
              De la
              <input
                type="date"
                required
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </label>
            <label>
              Până la
              <input
                type="date"
                required
                min={start}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </label>
            <button disabled={busy}>Calculează</button>
          </form>
          {report && (
            <>
              <h2>Pe zile</h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Zi</th>
                      <th>Porții</th>
                      <th>kcal</th>
                      <th>Țintă</th>
                      <th>Diferență</th>
                      {nutrients.map((n) => (
                        <th key={n.key}>
                          {n.label} ({n.unit})
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.days.map((d) => (
                      <tr key={d.day}>
                        <td>{d.day}</td>
                        <td>{d.entries}</td>
                        <td>{d.calories}</td>
                        <td>{d.target ?? "—"}</td>
                        <td>{d.difference ?? "—"}</td>
                        {nutrients.map((n) => (
                          <td key={n.key}>{d.nutrients[n.key] ?? "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h2>Pe săptămâni (luni–duminică)</h2>
              <p>
                Săptămânile de la capete pot fi parțiale. O zi fără înregistrări
                nu dovedește că nu ai mâncat. Nutrienții lipsă nu sunt estimați;
                totalul lor include doar valorile cunoscute.
              </p>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Luni</th>
                      <th>kcal total</th>
                      <th>Zile înregistrate</th>
                      <th>Medie toate zilele din interval</th>
                      <th>Medie zile înregistrate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.weeks.map((w) => (
                      <tr key={w.week_start}>
                        <td>{w.week_start}</td>
                        <td>{w.calories}</td>
                        <td>
                          {w.logged_days}/{w.days_in_range}
                        </td>
                        <td>{w.daily_average_all_days}</td>
                        <td>{w.daily_average_logged_days ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
