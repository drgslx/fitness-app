import RecipeList from "./components/RecipeList";
import RecipeEditor from "./components/RecipeEditor";
import { blankRecipe } from "./recipeDefaults";
import Button from "../../components/ui/Button";
import React, { useEffect, useState } from "react";
import { api, send } from "../../api/client";

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
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
      cooked_total_grams: item.cooked_total_grams ?? item.raw_total_grams,
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
        cooked_total_grams: Number(recipe.cooked_total_grams),
        ingredients: recipe.ingredients.map((item) => ({
          food_id: item.food_id,
          grams: Number(item.grams),
        })),
      };
      await send(
        editingId ? `/recipes/${editingId}` : "/recipes",
        editingId ? "PUT" : "POST",
        payload,
      );
      setRecipe(blankRecipe());
      setEditingId(null);
      await loadRecipes();
    });
  }

  const rawTotal = recipe.ingredients.reduce(
    (sum, item) => sum + Number(item.grams || 0),
    0,
  );
  const finalTotal = Number(recipe.cooked_total_grams);
  const gramsPerServing =
    finalTotal > 0 && Number(recipe.servings) > 0
      ? finalTotal / Number(recipe.servings)
      : null;

  return (
    <section>
      <h2>Retete</h2>
      <p>
        Adauga ingredientele, gramajul total al retetei si numarul de portii. In
        jurnal vei putea alege portii sau grame.
      </p>
      {error && (
        <p role="alert" className="notice-error">
          {error}
        </p>
      )}

      <RecipeEditor
        {...{
          recipe,
          setRecipe,
          editingId,
          setEditingId,
          busy,
          submit,
          addIngredient,
          rawTotal,
          gramsPerServing,
        }}
      />

      <form
        className="search-row"
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
        <Button disabled={busy}>Cauta</Button>
      </form>
      <RecipeList {...{ recipes, busy, edit, action, loadRecipes }} />
    </section>
  );
}
