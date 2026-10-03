import Button from "../../../components/ui/Button";
import React from "react";

function calories(item) {
  return ((item.snapshot.calories * item.grams) / 100).toFixed(1);
}
function quantity(item) {
  return item.entry_type === "recipe" && item.servings
    ? `${item.servings} portii`
    : `${item.grams.toFixed(1)} g`;
}
function ItemName({ item, onDetails }) {
  return (
    <Button
      variant="ghost"
      type="button"
      onClick={() => onDetails(item)}
      className="min-h-0 max-w-full rounded-md border-transparent bg-transparent px-0 py-1 text-left font-semibold break-words whitespace-normal text-accent hover:bg-transparent hover:underline"
    >
      {item.snapshot.name}
    </Button>
  );
}
function ItemActions({ item, busy, onEdit, onRemove }) {
  return (
    <div className="diary-entry-actions flex flex-wrap items-center gap-3">
      <Button
        variant="secondary"
        type="button"
        disabled={busy}
        onClick={() => onEdit(item)}
        className="min-h-9 rounded-lg border-white/15 bg-[#203629] px-3 py-1.5 text-sm text-copy hover:border-accent/40 hover:bg-[#2d4b39]"
      >
        Editeaza
      </Button>
      <Button
        variant="danger"
        type="button"
        disabled={busy}
        onClick={() => onRemove(item)}
        className="min-h-9 rounded-lg border-red-400/25 bg-red-400/10 px-3 py-1.5 text-sm text-red-300 hover:border-red-400/50 hover:bg-red-400/20"
      >
        Sterge
      </Button>
    </div>
  );
}

export default function NutritionDiaryEntries({
  entries,
  busy,
  onDetails,
  onEdit,
  onRemove,
}) {
  const actions = (item) => (
    <ItemActions {...{ item, busy, onEdit, onRemove }} />
  );
  if (!entries.length)
    return (
      <div className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-muted">
        Nu exista inregistrari pentru aceasta zi. Cauta un aliment sau alege din
        favorite.
      </div>
    );

  return (
    <section className="min-w-0 space-y-3" aria-label="Inregistrarile zilei">
      <div className="flex items-center justify-between gap-2">
        <h3 className="mb-0 text-lg">Mesele zilei</h3>
        <span className="text-xs text-muted">
          {entries.length} inregistrari
        </span>
      </div>
      <div className="space-y-3 md:hidden">
        {entries.map((item) => (
          <article
            key={`${item.entry_type}-${item.id}`}
            className="min-w-0 space-y-3 rounded-xl border border-white/10 bg-surface p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <ItemName {...{ item, onDetails }} />
                <p className="text-sm text-muted break-words">
                  {item.meal} ·{" "}
                  {item.entry_type === "recipe" ? "Reteta" : "Aliment"}
                </p>
              </div>
              <strong className="shrink-0 text-sm text-accent">
                {calories(item)} kcal
              </strong>
            </div>
            <p className="text-sm">Cantitate: {quantity(item)}</p>
            <div className="border-t border-white/10 pt-3">{actions(item)}</div>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
        <table className="text-sm">
          <thead>
            <tr>
              {[
                "Masa",
                "Tip",
                "Aliment / reteta",
                "Cantitate",
                "kcal",
                "Actiuni",
              ].map((label) => (
                <th scope="col" key={label}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((item) => (
              <tr key={`${item.entry_type}-${item.id}`}>
                <td className="align-middle">{item.meal}</td>
                <td className="align-middle">
                  {item.entry_type === "recipe" ? "Reteta" : "Aliment"}
                </td>
                <td className="max-w-xs align-middle">
                  <ItemName {...{ item, onDetails }} />
                </td>
                <td className="whitespace-nowrap align-middle">
                  {quantity(item)}
                </td>
                <td className="whitespace-nowrap align-middle">
                  {calories(item)}
                </td>
                <td className="align-middle">{actions(item)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
