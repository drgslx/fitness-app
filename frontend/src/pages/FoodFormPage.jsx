import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, send } from "../api/client";

const blankFood = () => ({
  name: "",
  calories: "",
  nutrients: { carbohydrates: 0, protein: 0, fat: 0, salt: 0 },
});

export default function FoodFormPage() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(foodId);
  const [food, setFood] = useState(blankFood);
  const [nutrients, setNutrients] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [catalog, nutrientList] = await Promise.all([api("/foods"), api("/nutrients")]);
        setNutrients(nutrientList);

        if (editing) {
          const existing = catalog.find((item) => String(item.id) === foodId);
          if (!existing) throw new Error("Alimentul nu a fost gasit in catalog.");
          setFood({ name: existing.name, calories: existing.calories, nutrients: existing.nutrients });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [editing, foodId]);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      await send(editing ? `/foods/${foodId}` : "/foods", editing ? "PUT" : "POST", {
        ...food,
        calories: Number(food.calories),
      });
      navigate("/nutrition/journal");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <section className="my-4 flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-surface/90 p-4 shadow-xl"><p>Se incarca formularul...</p></section>;

  return (
    <section className="my-4 flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-surface/90 p-4 shadow-xl">
      <p><Link className="text-accent hover:underline" to="/nutrition/journal">Inapoi la jurnal nutritional</Link></p>
      <h2>{editing ? "Editeaza alimentul" : "Adauga un aliment"}</h2>
      <p>Toate valorile sunt pentru 100 g. Completeaza nutrientii pe care ii cunosti.</p>
      {error && <p role="alert" className="rounded-lg border border-red-400/30 bg-[#321a18] px-3 py-2 text-[#ffaaaa]">{error}</p>}

      <form onSubmit={submit}>
        <div className="grid gap-3 md:grid-cols-2">
          <label>
            Nume
            <input required maxLength={180} value={food.name} onChange={(event) => setFood({ ...food, name: event.target.value })} />
          </label>
          <label>
            Calorii (kcal)
            <input type="number" required min="0" step=".01" value={food.calories} onChange={(event) => setFood({ ...food, calories: event.target.value })} />
          </label>

          {nutrients.map((nutrient) => (
            <label key={nutrient.key}>
              {nutrient.label} ({nutrient.unit})
              <input
                type="number"
                min="0"
                step=".001"
                required={["carbohydrates", "protein", "fat", "salt"].includes(nutrient.key)}
                value={food.nutrients[nutrient.key] ?? ""}
                onChange={(event) => {
                  const values = { ...food.nutrients };
                  if (event.target.value === "") delete values[nutrient.key];
                  else values[nutrient.key] = Number(event.target.value);
                  setFood({ ...food, nutrients: values });
                }}
              />
            </label>
          ))}
        </div>

        <button disabled={busy}>{busy ? "Se salveaza..." : "Salveaza alimentul"}</button>
        <Link className="text-accent hover:underline" to="/nutrition/journal">Anuleaza</Link>
      </form>
    </section>
  );
}
