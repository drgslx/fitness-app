import React from "react";
import Button from "../ui/Button";
export default function FoodResultCard({
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
}) {
  return (
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
                  : current.filter((id) => id !== food.id),
              )
            }
          />
          Selecteaza pentru eliminare: {food.name}
        </label>
      )}
      <strong className="break-words">{food.name}</strong>
      <p className="text-sm">
        {food.calories} kcal / 100 g · P {food.nutrients?.protein ?? "—"} g · C{" "}
        {food.nutrients?.carbohydrates ?? "—"} g · G{" "}
        {food.nutrients?.fat ?? "—"} g
      </p>
      <p className="break-words text-xs text-muted">
        {food.catalog_data?.brands} {food.barcode && ` · ${food.barcode}`}{" "}
        {food.catalog_data?.nutriscore &&
          ` · Nutri-Score ${food.catalog_data.nutriscore}`}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" type="button" onClick={() => setDetails(food)}>
          Detalii
        </Button>
        {foodActions(food)}
        {onSelect && (
          <Button
            type="button"
            onClick={() => onSelect({ ...food, type: "food" })}
          >
            Alege
          </Button>
        )}
        {renderActions?.(food, () => search(result.page))}
        {admin && food.is_public && (
          <Button
            type="button"
            disabled={busy}
            variant="danger"
            onClick={() => archive([food.id])}
          >
            Elimina din catalog
          </Button>
        )}
      </div>
    </article>
  );
}
