import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, send } from "../api/client";

import FoodSearch from "../components/FoodSearch";

const blankFood = () => ({
  name: "",
  barcode: "",
  is_public: false,
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
        const [existing, nutrientList] = await Promise.all([editing ? api(`/foods/${foodId}`) : Promise.resolve(null), api("/nutrients")]);
        setNutrients(nutrientList);

        if (editing) {
          if (!existing) throw new Error("Alimentul nu a fost gasit in catalog.");
          setFood({ name: existing.name, calories: existing.calories, nutrients: existing.nutrients, barcode: existing.barcode || "", is_public: existing.is_public });
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
        barcode: food.barcode || null,
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

      {!editing && <FoodSearch onBarcode={barcode => setFood(current => ({ ...current, barcode }))} />}
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

        <label className="my-3 block">Cod de bare (optional)<input inputMode="numeric" pattern="[0-9]{8,14}" maxLength={14} value={food.barcode} onChange={e => setFood({...food, barcode:e.target.value})} /></label>
        <label className="my-3 flex items-center gap-2"><input type="checkbox" checked={food.is_public} onChange={e => setFood({...food, is_public:e.target.checked})} /> Publica alimentul in catalogul local</label>
        <p className="text-xs text-muted mb-3">Nebifat: vizibil doar pentru tine. Prin publicare confirmi ca poti distribui valorile introduse sub ODbL / Database Contents License. Nu trimitem automat date catre Open Food Facts.</p>
        <button disabled={busy}>{busy ? "Se salveaza..." : "Salveaza alimentul"}</button>
        <Link className="text-accent hover:underline" to="/nutrition/journal">Anuleaza</Link>
      </form>
      {editing && food.barcode && <details className="rounded-lg border border-white/10 p-3">
        <summary>Contribuie separat la Open Food Facts</summary>
        <p>Verifica produsul si valorile de pe ambalaj. Linkul deschide site-ul OFF, unde te autentifici si confirmi publicarea sub licentele lor. Datele nu sunt trimise de aplicatie.</p>
        <a className="text-accent" target="_blank" rel="noreferrer" href={`https://world.openfoodfacts.org/cgi/product.pl?type=edit&code=${encodeURIComponent(food.barcode)}`}>Adauga / completeaza produsul in OFF ↗</a>
        <pre className="whitespace-pre-wrap text-xs">{JSON.stringify({barcode:food.barcode, name:food.name, per_100g:{calories:food.calories, ...food.nutrients}}, null, 2)}</pre>
      </details>}
    </section>
  );
}
