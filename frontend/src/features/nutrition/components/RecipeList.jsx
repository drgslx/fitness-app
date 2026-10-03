import React from "react";
import Button from "../../../components/ui/Button";
import { send } from "../../../api/client";
export default function RecipeList({
  recipes,
  busy,
  edit,
  action,
  loadRecipes,
}) {
  return (
    <div className="card-grid">
      {recipes.map((item) => (
        <article className="card" key={item.id}>
          <div className="p-4">
            <h3>{item.name}</h3>
            <p>
              {item.total_calories} kcal total - {item.calories_per_serving}{" "}
              kcal/portie
            </p>
            <p>
              {item.basis_grams} g total / {item.servings} portii (
              {(item.basis_grams / item.servings).toFixed(1)} g/portie)
            </p>
            <p>{item.raw_total_grams} g ingrediente</p>
            <div className="actions mt-3">
              <Button
                variant="secondary"
                type="button"
                onClick={() => edit(item)}
              >
                Editeaza
              </Button>
              <Button
                type="button"
                variant="danger"
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
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
