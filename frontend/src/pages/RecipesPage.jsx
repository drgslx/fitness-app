import React, { useEffect, useState } from "react";
import { api, send } from "../api/client";

const blankRecipe = () => ({
  name: "",
  servings: 1,
  cooked_total_grams: "",
  notes: "",
  ingredients: [],
});

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [foodSearch, setFoodSearch] = useState("");
  const [recipe, setRecipe] = useState(blankRecipe);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function loadRecipes(query = search) {
    setRecipes(await api("/recipes?q=" + encodeURIComponent(query)));
  }

  useEffect(() => {
    loadRecipes().catch((err) => setError(err.message));
  }, []);

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

  function searchFoods() {
    action(async () =>
      setFoods(await api("/foods?q=" + encodeURIComponent(foodSearch)))
    );
  }

  function addIngredient(food) {
    if (recipe.ingredients.some((item) => item.food_id === food.id)) return;
    setRecipe({
      ...recipe,
      ingredients: [
        ...recipe.ingredients,
        { food_id: food.id, name: food.name, grams: 100 },
      ],
    });
  }

  function edit(item) {
    setEditingId(item.id);
    setRecipe({
      name: item.name,
      servings: item.servings,
      cooked_total_grams: item.cooked_total_grams ?? "",
      notes: item.notes,
      ingredients: item.ingredients.map((ingredient) => ({
        food_id: ingredient.food_id,
        name: ingredient.name,
        grams: ingredient.grams,
      })),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit(event) {
    event.preventDefault();
    action(async () => {
      const payload = {
        ...recipe,
        servings: Number(recipe.servings),
        cooked_total_grams:
          recipe.cooked_total_grams === ""
            ? null
            : Number(recipe.cooked_total_grams),
        ingredients: recipe.ingredients.map((item) => ({
          food_id: item.food_id,
          grams: Number(item.grams),
        })),
      };
      await send(
        editingId ? `/recipes/${editingId}` : "/recipes",
        editingId ? "PUT" : "POST",
        payload
      );
      setRecipe(blankRecipe());
      setEditingId(null);
      setFoods([]);
      await loadRecipes();
    });
  }

  const rawTotal = recipe.ingredients.reduce(
    (sum, item) => sum + Number(item.grams || 0),
    0
  );

  return (
    <section>
      <h2>Retete</h2>
      <p>
        Adauga ingrediente din catalog. Cantitatea cruda se calculeaza automat;
        cantitatea dupa gatire este optionala.
      </p>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-400/30 bg-[#321a18] px-3 py-2 text-[#ffaaaa]"
        >
          {error}
        </p>
      )}

      <form
        className="my-4 flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-surface/90 p-4 shadow-xl"
        onSubmit={submit}
      >
        <h3>{editingId ? "Editeaza reteta" : "Reteta noua"}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label>
            Nume
            <input
              required
              maxLength={180}
              value={recipe.name}
              onChange={(event) =>
                setRecipe({ ...recipe, name: event.target.value })
              }
            />
          </label>
          <label>
            Portii
            <input
              required
              type="number"
              min=".1"
              step=".1"
              value={recipe.servings}
              onChange={(event) =>
                setRecipe({ ...recipe, servings: event.target.value })
              }
            />
          </label>
          <label>
            Cantitate dupa gatire (g, optional)
            <input
              type="number"
              min=".1"
              step=".1"
              value={recipe.cooked_total_grams}
              onChange={(event) =>
                setRecipe({ ...recipe, cooked_total_grams: event.target.value })
              }
            />
          </label>
        </div>
        <p>
          Cantitate totala ingrediente: <strong>{rawTotal.toFixed(1)} g</strong>
        </p>
        <label>
          Note
          <textarea
            maxLength={1000}
            value={recipe.notes}
            onChange={(event) =>
              setRecipe({ ...recipe, notes: event.target.value })
            }
          />
        </label>

        <div className="my-4 flex flex-wrap items-end gap-3 [&_label]:min-w-[180px] [&_label]:flex-1">
          <label>
            Cauta ingredient
            <input
              value={foodSearch}
              onChange={(event) => setFoodSearch(event.target.value)}
              placeholder="pui, orez, rosie..."
            />
          </label>
          <button
            type="button"
            disabled={!foodSearch.trim() || busy}
            onClick={searchFoods}
          >
            Cauta aliment
          </button>
        </div>
        {foods.length > 0 && (
          <div className="my-3 flex flex-wrap items-center gap-2">
            {foods.map((food) => (
              <button
                type="button"
                key={food.id}
                onClick={() => addIngredient(food)}
              >
                + {food.name} ({food.calories} kcal/100 g)
              </button>
            ))}
          </div>
        )}

        {recipe.ingredients.length > 0 && (
          <div className="my-4 w-full overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Gramaj</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recipe.ingredients.map((item, index) => (
                  <tr key={item.food_id}>
                    <td>{item.name}</td>
                    <td>
                      <input
                        type="number"
                        min=".1"
                        step=".1"
                        value={item.grams}
                        onChange={(event) =>
                          setRecipe({
                            ...recipe,
                            ingredients: recipe.ingredients.map(
                              (value, position) =>
                                position === index
                                  ? { ...value, grams: event.target.value }
                                  : value
                            ),
                          })
                        }
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          setRecipe({
                            ...recipe,
                            ingredients: recipe.ingredients.filter(
                              (_, position) => position !== index
                            ),
                          })
                        }
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!recipe.ingredients.length && <p>Adauga cel putin un ingredient.</p>}
        <button disabled={busy || !recipe.ingredients.length}>
          {editingId ? "Salveaza reteta" : "Creeaza reteta"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setRecipe(blankRecipe());
            }}
          >
            Anuleaza editarea
          </button>
        )}
      </form>

      <form
        className="my-4 flex flex-wrap items-end gap-3 [&_label]:min-w-[180px] [&_label]:flex-1"
        onSubmit={(event) => {
          event.preventDefault();
          action(() => loadRecipes());
        }}
      >
        <label>
          Cauta reteta
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <button disabled={busy}>Cauta</button>
      </form>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        {recipes.map((item) => (
          <article
            className="overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-lg transition-colors hover:border-accent/30"
            key={item.id}
          >
            <div className="p-4">
              <h3>{item.name}</h3>
              <p>
                {item.total_calories} kcal total - {item.calories_per_serving}{" "}
                kcal/portie
              </p>
              <p>
                {item.raw_total_grams} g ingrediente
                {item.cooked_total_grams
                  ? ` -> ${item.cooked_total_grams} g gatit`
                  : ""}
              </p>
              <p>{item.servings} portii</p>
              <button type="button" onClick={() => edit(item)}>
                Editeaza
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  action(async () => {
                    if (!window.confirm(`Stergi reteta ${item.name}?`)) return;
                    await send(`/recipes/${item.id}`, "DELETE");
                    await loadRecipes();
                  })
                }
              >
                Sterge
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
