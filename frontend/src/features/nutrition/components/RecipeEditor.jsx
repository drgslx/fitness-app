import React from "react";
import Button from "../../../components/ui/Button";
import FoodSearch from "../../../components/FoodSearch";
import { blankRecipe } from "../recipeDefaults";
export default function RecipeEditor({
  recipe,
  setRecipe,
  editingId,
  setEditingId,
  busy,
  submit,
  addIngredient,
  rawTotal,
  gramsPerServing,
}) {
  return (
    <form className="panel" onSubmit={submit}>
      <h3>{editingId ? "Editeaza reteta" : "Reteta noua"}</h3>
      <div className="form-grid">
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
          Gramaj total final (g)
          <input
            required
            type="number"
            min=".1"
            max="100000"
            step=".1"
            value={recipe.cooked_total_grams}
            onChange={(event) =>
              setRecipe({ ...recipe, cooked_total_grams: event.target.value })
            }
          />
        </label>
      </div>
      <p>
        Cantitate ingrediente: <strong>{rawTotal.toFixed(1)} g</strong>. Introdu
        greutatea intregii retete asa cum o vei cantari cand mananci; poate
        diferi dupa gatire.
      </p>
      {gramsPerServing !== null && (
        <p>
          O portie = <strong>{gramsPerServing.toFixed(1)} g</strong> din reteta
          finala.
        </p>
      )}
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

      <FoodSearch onSelect={addIngredient} />

      {recipe.ingredients.length > 0 && (
        <div className="table-scroll">
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
                                : value,
                          ),
                        })
                      }
                    />
                  </td>
                  <td>
                    <Button
                      type="button"
                      onClick={() =>
                        setRecipe({
                          ...recipe,
                          ingredients: recipe.ingredients.filter(
                            (_, position) => position !== index,
                          ),
                        })
                      }
                    >
                      Elimina
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!recipe.ingredients.length && <p>Adauga cel putin un ingredient.</p>}
      <Button disabled={busy || !recipe.ingredients.length}>
        {editingId ? "Salveaza reteta" : "Creeaza reteta"}
      </Button>
      {editingId && (
        <Button
          type="button"
          onClick={() => {
            setEditingId(null);
            setRecipe(blankRecipe());
          }}
        >
          Anuleaza editarea
        </Button>
      )}
    </form>
  );
}
