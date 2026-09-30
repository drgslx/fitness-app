import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api, send } from "../api/client";
import { useAuth } from "../auth";
import BarcodeScanner from "./foods/BarcodeScanner";
import FoodDetails from "./foods/FoodDetails";
import QuickAddFood from "./foods/QuickAddFood";

export function FoodAttribution() {
  return (
    <p className="text-xs text-muted">
      Produse importate:{" "}
      <a
        href="https://world.openfoodfacts.org"
        target="_blank"
        rel="noreferrer"
      >
        Open Food Facts
      </a>{" "}
      ·{" "}
      <a
        href="https://opendatacommons.org/licenses/odbl/1-0/"
        target="_blank"
        rel="noreferrer"
      >
        ODbL
      </a>{" "}
      ·{" "}
      <a
        href={
          (import.meta.env.VITE_API_URL || "/api/v1") + "/food-catalog/export"
        }
        target="_blank"
        rel="noreferrer"
      >
        Export catalog
      </a>
      . Verifica valorile de pe ambalaj.
    </p>
  );
}
export default function FoodSearch({
  onSelect,
  renderActions,
  includeRecipes = false,
  day,
  meal,
  grams,
  onAdded,
  onBarcode,
}) {
  const { admin } = useAuth();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [searched, setSearched] = useState("");
  const [mode, setMode] = useState("search");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [scanner, setScanner] = useState(false);
  const [details, setDetails] = useState(null);
  const [adding, setAdding] = useState(null);
  const [checked, setChecked] = useState([]);

  async function search(page = 1, nextMode = mode, override) {
    const term = override ?? (page === 1 ? query.trim() : searched);
    if (lock.current || (nextMode === "search" && term.length < 3)) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    setMode(nextMode);
    setChecked([]);
    setRecipes([]);
    try {
      const [foodResponse, recipeResponse] = await Promise.allSettled([
        api(
          `/foods/${
            nextMode === "favorites" ? "favorites" : "search"
          }?${new URLSearchParams({ q: term, page })}`
        ),
        includeRecipes && nextMode === "search" && page === 1
          ? api("/recipes?q=" + encodeURIComponent(term))
          : Promise.resolve([]),
      ]);
      if (foodResponse.status === "fulfilled") setResult(foodResponse.value);
      else {
        setResult(null);
        setError(foodResponse.reason.message);
      }
      if (recipeResponse.status === "fulfilled")
        setRecipes(recipeResponse.value.slice(0, 20));
      else
        setError((current) =>
          [current, recipeResponse.reason.message].filter(Boolean).join(" ")
        );
      setSearched(term);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function favorite(food) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      await send(
        `/foods/${food.id}/favorite`,
        food.is_favorite ? "DELETE" : "PUT"
      );
      const updated = { ...food, is_favorite: !food.is_favorite };
      setResult(
        (current) =>
          current && {
            ...current,
            items: current.items.flatMap((item) =>
              item.id !== food.id
                ? [item]
                : mode === "favorites" && !updated.is_favorite
                ? []
                : [updated]
            ),
          }
      );
      setDetails((current) => (current?.id === food.id ? updated : current));
    } catch (e) {
      setError(e.message);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function archive(ids) {
    if (
      lock.current ||
      !window.confirm(
        `Elimini ${ids.length} produs(e) din catalogul activ? Istoricul ramane salvat; codurile excluse nu se reimporta.`
      )
    )
      return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      await send("/food-catalog/archive", "POST", { ids });
      // Reload only the local page, never trigger OFF after a moderation action.
      const local =
        mode === "favorites"
          ? await api(
              `/foods/favorites?${new URLSearchParams({
                q: searched,
                page: result.page,
              })}`
            )
          : await api(
              `/food-catalog/local?${new URLSearchParams({
                q: searched,
                page: result.page,
              })}`
            );
      setResult(local);
      setChecked([]);
      setDetails(null);
      setMessage("Produsele au fost eliminate din catalogul activ.");
    } catch (e) {
      setError(e.message);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const foodActions = (food) => (
    <>
      <button
        type="button"
        onClick={() => {
          setDetails(null);
          setAdding(food);
        }}
      >
        Adauga in jurnal
      </button>
      <button
        type="button"
        disabled={busy}
        aria-pressed={!!food.is_favorite}
        onClick={() => favorite(food)}
      >
        {food.is_favorite ? "Elimina din favorite" : "Adauga la favorite"}
      </button>
    </>
  );
  return (
    <div className="my-3 min-w-0 space-y-3">
      <div className="flex flex-wrap gap-2" aria-label="Sursa alimentelor">
        <button
          type="button"
          disabled={busy}
          aria-pressed={mode === "search"}
          onClick={() => {
            setMode("search");
            setResult(null);
            setRecipes([]);
            setChecked([]);
          }}
        >
          Catalog
        </button>
        <button
          type="button"
          disabled={busy}
          aria-pressed={mode === "favorites"}
          onClick={() => {
            setQuery("");
            search(1, "favorites", "");
          }}
        >
          Favoritele mele
        </button>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="min-w-0 flex-1">
          {includeRecipes
            ? "Cauta aliment sau reteta"
            : "Nume, marca sau cod de bare"}
          <input
            value={query}
            maxLength={180}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                search();
              }
            }}
          />
        </label>
        <button
          type="button"
          disabled={busy || (mode === "search" && query.trim().length < 3)}
          onClick={() => search()}
        >
          {busy ? "Se cauta…" : "Cauta aliment"}
        </button>
        <button type="button" disabled={busy} onClick={() => setScanner(true)}>
          Scaneaza codul
        </button>
      </div>
      <p className="text-sm text-muted">
        {mode === "favorites"
          ? "Favorite personale, salvate in contul tau."
          : "Minimum 3 caractere. Cautam intai local, apoi in Open Food Facts daca nu exista rezultate."}{" "}
        Poti introduce codul de bare manual.
      </p>
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      {result && (
        <>
          <p role="status">
            {result.items.length} rezultate ·{" "}
            {result.source === "openfoodfacts"
              ? "importate din Open Food Facts"
              : mode === "favorites"
              ? "favorite"
              : "catalog local / cache"}
            . {result.message}
          </p>
          {admin && checked.length > 0 && (
            <button
              type="button"
              disabled={busy}
              onClick={() => archive(checked)}
            >
              Elimina selectate ({checked.length})
            </button>
          )}
          <div className="grid gap-2 md:grid-cols-2">
            {result.items.map((food) => (
              <article
                key={food.id}
                className="min-w-0 space-y-2 rounded-lg border border-white/10 p-3"
              >
                {admin && food.is_public && (
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={checked.includes(food.id)}
                      disabled={busy}
                      onChange={(e) =>
                        setChecked((current) =>
                          e.target.checked
                            ? [...current, food.id]
                            : current.filter((id) => id !== food.id)
                        )
                      }
                    />
                    Selecteaza pentru eliminare: {food.name}
                  </label>
                )}
                <strong className="break-words">{food.name}</strong>
                <p className="text-sm">
                  {food.calories} kcal / 100 g · P{" "}
                  {food.nutrients?.protein ?? "—"} g · C{" "}
                  {food.nutrients?.carbohydrates ?? "—"} g · G{" "}
                  {food.nutrients?.fat ?? "—"} g
                </p>
                <p className="break-words text-xs text-muted">
                  {food.catalog_data?.brands}{" "}
                  {food.barcode && ` · ${food.barcode}`}{" "}
                  {food.catalog_data?.nutriscore &&
                    ` · Nutri-Score ${food.catalog_data.nutriscore}`}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setDetails(food)}>
                    Detalii
                  </button>
                  {foodActions(food)}
                  {onSelect && (
                    <button
                      type="button"
                      onClick={() => onSelect({ ...food, type: "food" })}
                    >
                      Alege
                    </button>
                  )}
                  {renderActions?.(food, () => search(result.page))}
                  {admin && food.is_public && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => archive([food.id])}
                    >
                      Elimina din catalog
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="flex gap-2">
            {result.page > 1 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => search(result.page - 1)}
              >
                Inapoi
              </button>
            )}
            {result.has_more && (
              <button
                type="button"
                disabled={busy}
                onClick={() => search(result.page + 1)}
              >
                Urmatoarele 20
              </button>
            )}
          </div>
        </>
      )}
      {recipes.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Retete gasite">
          {recipes.map((recipe) => (
            <button
              type="button"
              key={recipe.id}
              onClick={() => onSelect?.({ ...recipe, type: "recipe" })}
            >
              Reteta: {recipe.name} · {recipe.calories_per_serving} kcal/portie
            </button>
          ))}
        </div>
      )}
      <Link className="inline-block text-accent" to="/nutrition/foods/new">
        Nu gasesti produsul? Adauga manual
      </Link>
      <FoodAttribution />
      {scanner && (
        <BarcodeScanner
          onClose={() => setScanner(false)}
          onCode={(code) => {
            setScanner(false);
            setQuery(code);
            onBarcode?.(code);
            search(1, "search", code);
          }}
        />
      )}
      {details && (
        <FoodDetails
          food={details}
          onClose={() => setDetails(null)}
          actions={
            <>
              {foodActions(details)}
              {error && <p role="alert">{error}</p>}
            </>
          }
        />
      )}
      {adding && (
        <QuickAddFood
          food={adding}
          day={day}
          meal={meal}
          grams={grams}
          onClose={() => setAdding(null)}
          onAdded={async (saved) => {
            setMessage(`Aliment adaugat: ${saved.day}, ${saved.meal}.`);
            try {
              await onAdded?.(saved);
            } catch (e) {
              setError(
                `Portia este salvata, dar actualizarea afisarii a esuat: ${e.message}`
              );
            }
          }}
        />
      )}
    </div>
  );
}
