import React from "react";
import FoodDialog from "./FoodDialog";

const missing = "Nu este disponibilă";
const number = (value) => typeof value === "number" && Number.isFinite(value);
const display = (value) =>
  Array.isArray(value)
    ? value.join(", ") || missing
    : value === null || value === undefined || value === ""
      ? missing
      : String(value);
export default function FoodDetails({
  food,
  grams,
  historical = false,
  onClose,
  actions,
}) {
  const data = food.catalog_data || {};
  const values = [
    ["Energie", food.calories, "kcal"],
    ["Proteine", food.nutrients?.protein, "g"],
    ["Carbohidrati", food.nutrients?.carbohydrates, "g"],
    ["Grasimi", food.nutrients?.fat, "g"],
    ["Sare", food.nutrients?.salt, "g"],
  ];
  const offCode = /^[0-9]{8,14}$/.test(food.barcode || "")
    ? food.barcode
    : food.off_code;
  return (
    <FoodDialog title={food.name} onClose={onClose}>
      {historical && (
        <p className="mb-3 text-sm text-muted">
          Valorile salvate in jurnal la adaugare. Informatiile lipsa din
          istoricul vechi nu sunt completate cu datele actuale ale produsului.
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th scope="col">Nutrient</th>
              <th scope="col">Per 100 g</th>
              {number(grams) && <th scope="col">{grams} g</th>}
            </tr>
          </thead>
          <tbody>
            {values.map(([label, value, unit]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>
                  {number(value)
                    ? `${value.toLocaleString("ro-RO")} ${unit}`
                    : missing}
                </td>
                {number(grams) && (
                  <td>
                    {number(value)
                      ? `${((value * grams) / 100).toLocaleString("ro-RO", { maximumFractionDigits: 2 })} ${unit}`
                      : missing}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="my-3 grid gap-2 text-sm sm:grid-cols-2">
        {[
          ["Marca", data.brands],
          ["Barcode", food.barcode],
          ["Categorie", data.categories],
          ["Ingrediente", data.ingredients_text],
          ["Alergeni", data.allergens_tags],
          ["Nutri-Score", data.nutriscore],
          ["NOVA", data.nova_group],
          [
            "Sursa",
            food.source === "openfoodfacts"
              ? "Open Food Facts"
              : food.source === "manual"
                ? "Adaugat manual"
                : food.source === "recipe"
                  ? "Reteta personala"
                  : null,
          ],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 rounded-lg bg-white/5 p-2">
            <dt className="text-muted">{label}</dt>
            <dd className="break-words">{display(value)}</dd>
          </div>
        ))}
      </dl>
      {food.source === "openfoodfacts" && (
        <p className="text-xs">
          Open Food Facts ·{" "}
          <a
            href="https://opendatacommons.org/licenses/odbl/1-0/"
            target="_blank"
            rel="noreferrer"
          >
            ODbL
          </a>
          {offCode && (
            <>
              {" "}
              ·{" "}
              <a
                href={`https://world.openfoodfacts.org/product/${encodeURIComponent(offCode)}`}
                target="_blank"
                rel="noreferrer"
              >
                Vezi produsul in Open Food Facts ↗
              </a>
            </>
          )}
        </p>
      )}
      {food.source === "manual" && food.is_public && (
        <p className="text-xs">
          Catalog public ATHLETICA · ODbL / Database Contents License
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">{actions}</div>
    </FoodDialog>
  );
}
