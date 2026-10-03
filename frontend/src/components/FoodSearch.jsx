import FoodResultCard from "./foods/FoodResultCard";
import Button from "./ui/Button";
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
          }?${new URLSearchParams({ q: term, page })}`,
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
          [current, recipeResponse.reason.message].filter(Boolean).join(" "),
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
        food.is_favorite ? "DELETE" : "PUT",
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
                  : [updated],
            ),
          },
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
        `Elimini ${ids.length} produs(e) din catalogul activ? Istoricul ramane salvat; codurile excluse nu se reimporta.`,
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
              })}`,
            )
          : await api(
              `/food-catalog/local?${new URLSearchParams({
                q: searched,
                page: result.page,
              })}`,
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
      <Button
        type="button"
        onClick={() => {
          setDetails(null);
          setAdding(food);
        }}
      >
        Adauga in jurnal
      </Button>
      <Button
        type="button"
        disabled={busy}
        variant="secondary"
        aria-pressed={!!food.is_favorite}
        onClick={() => favorite(food)}
      >
        {food.is_favorite ? "Elimina din favorite" : "Adauga la favorite"}
      </Button>
    </>
  );
  return (
    <div className="my-3 min-w-0 space-y-3">
      <div className="flex flex-wrap gap-2" aria-label="Sursa alimentelor">
        <Button
          type="button"
          disabled={busy}
          variant={mode === "search" ? "primary" : "secondary"}
          aria-pressed={mode === "search"}
          onClick={() => {
            setMode("search");
            setResult(null);
            setRecipes([]);
            setChecked([]);
          }}
        >
          Catalog
        </Button>
        <Button
          type="button"
          disabled={busy}
          variant={mode === "favorites" ? "primary" : "secondary"}
          aria-pressed={mode === "favorites"}
          onClick={() => {
            setQuery("");
            search(1, "favorites", "");
          }}
        >
          Favoritele mele
        </Button>
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
        <Button
          type="button"
          disabled={busy || (mode === "search" && query.trim().length < 3)}
          onClick={() => search()}
        >
          {busy ? "Se cauta…" : "Cauta aliment"}
        </Button>
        <Button
          variant="secondary"
          type="button"
          disabled={busy}
          onClick={() => setScanner(true)}
        >
          Scaneaza codul
        </Button>
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
            <Button
              type="button"
              disabled={busy}
              variant="danger"
              onClick={() => archive(checked)}
            >
              Elimina selectate ({checked.length})
            </Button>
          )}
          <div className="grid gap-2 md:grid-cols-2">
            {result.items.map((food) => (
              <FoodResultCard
                key={food.id}
                {...{
                  food,
                  admin,
                  checked,
                  busy,
                  setChecked,
                  setDetails,
                  foodActions,
                  onSelect,
                  renderActions,
                  search,
                  result,
                  archive,
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {result.page > 1 && (
              <Button
                type="button"
                disabled={busy}
                onClick={() => search(result.page - 1)}
              >
                Inapoi
              </Button>
            )}
            {result.has_more && (
              <Button
                type="button"
                disabled={busy}
                onClick={() => search(result.page + 1)}
              >
                Urmatoarele 20
              </Button>
            )}
          </div>
        </>
      )}
      {recipes.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Retete gasite">
          {recipes.map((recipe) => (
            <Button
              type="button"
              key={recipe.id}
              onClick={() => onSelect?.({ ...recipe, type: "recipe" })}
            >
              Reteta: {recipe.name} · {recipe.calories_per_serving} kcal/portie
            </Button>
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
                `Portia este salvata, dar actualizarea afisarii a esuat: ${e.message}`,
              );
            }
          }}
        />
      )}
    </div>
  );
}
