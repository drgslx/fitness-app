import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export function FoodAttribution() {
  return <p className="text-xs text-muted">Produse importate: <a href="https://world.openfoodfacts.org" target="_blank" rel="noreferrer">Open Food Facts</a> · <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noreferrer">ODbL</a> · <a href={(import.meta.env.VITE_API_URL || "/api/v1") + "/food-catalog/export"} target="_blank" rel="noreferrer">Export catalog</a>. Verifica valorile de pe ambalaj.</p>;
}
export default function FoodSearch({ onSelect, renderActions }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function search(page = 1) {
    const term = page === 1 ? query.trim() : searched;
    if (term.length < 3 || busy) return;
    setBusy(true); setError("");
    try {
      const data = await api(`/foods/search?${new URLSearchParams({q:term, page})}`);
      setResult(data); setSearched(term);
    } catch (e) { setError(e.message); setResult(null); }
    finally { setBusy(false); }
  }
  return <div className="my-3 space-y-3 min-w-0">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <label className="flex-1">Nume, marca sau cod de bare<input value={query} maxLength={180} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if(e.key === "Enter") { e.preventDefault(); search(); } }} /></label>
      <button type="button" disabled={busy || query.trim().length < 3} onClick={() => search()}>{busy ? "Se cauta…" : "Cauta aliment"}</button>
    </div>
    <p className="text-sm text-muted">Minimum 3 caractere. Cautam intai local, apoi in Open Food Facts daca nu exista rezultate.</p>
    {error && <p role="alert">{error}</p>}
    {result && <>
      <p role="status">{result.items.length} rezultate · {result.source === "openfoodfacts" ? "importate din Open Food Facts" : "catalog local / cache"}. {result.message}</p>
      <div className="grid gap-2 md:grid-cols-2">{result.items.map(food => <article key={food.id} className="min-w-0 rounded-lg border border-white/10 p-3 space-y-2">
        <strong>{food.name}</strong><p className="text-sm">{food.calories} kcal / 100 g · P {food.nutrients.protein} g · C {food.nutrients.carbohydrates} g · G {food.nutrients.fat} g · Sare {food.nutrients.salt} g</p>
        <p className="text-xs text-muted">{food.catalog_data?.brands} {food.barcode && ` · ${food.barcode}`} {food.catalog_data?.nutriscore && ` · Nutri-Score ${food.catalog_data.nutriscore}`}</p>
        {food.catalog_data?.categories && <p className="text-xs break-words">{food.catalog_data.categories}</p>}
        {food.catalog_data?.nova_group && <p className="text-xs">NOVA: {food.catalog_data.nova_group}</p>}
        {food.source === "openfoodfacts" && <a className="text-xs text-accent" href={food.catalog_data.url} target="_blank" rel="noreferrer">Sursa si detalii produs ↗</a>}
        <div className="flex flex-wrap gap-2">{onSelect && <button type="button" onClick={() => onSelect(food)}>Alege</button>}{renderActions?.(food, () => search(result.page))}</div>
      </article>)}</div>
      <div className="flex gap-2">{result.page > 1 && <button type="button" disabled={busy} onClick={() => search(result.page-1)}>Inapoi</button>}{result.has_more && <button type="button" disabled={busy} onClick={() => search(result.page+1)}>Urmatoarele 20</button>}</div>
    </>}
    <Link className="inline-block text-accent" to="/nutrition/foods/new">Nu gasesti produsul? Adauga manual</Link>
    <FoodAttribution />
  </div>;
}
