import React from "react";
import Button from "../../components/ui/Button";
import { send } from "../../api/client";
import TrendChart from "../../components/reports/TrendChart";
import { formatValue } from "../../components/reports/periods";
import { panel, secondary, danger } from "./constants";
export default function WeightProgress({
  data,
  today,
  weight,
  setWeight,
  busy,
  mutate,
  weights,
  chartWeights,
  chartPoints,
  visibleWeights,
  setVisibleWeights,
  setMessage,
}) {
  return (
    <section
      className={`${panel} space-y-3`}
      aria-labelledby="profile-weight-title"
    >
      <h2 id="profile-weight-title" className="text-xl">
        Greutate si progres
      </h2>
      {!data.profile ? (
        <p>Salveaza datele profilului, apoi adauga prima cantarire.</p>
      ) : (
        <form
          className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            mutate(
              () =>
                send("/profile/weights", "PUT", {
                  day: weight.day,
                  weight_kg: Number(weight.weight_kg),
                }),
              "Greutatea a fost salvata. Recomandarea si tinta automata au fost reevaluate.",
            );
          }}
        >
          <label>
            Data cantaririi
            <input
              type="date"
              required
              min={data.profile.birth_date}
              max={today}
              value={weight.day}
              onChange={(e) => setWeight({ ...weight, day: e.target.value })}
            />
          </label>
          <label>
            Greutate (kg)
            <input
              type="number"
              required
              min="25"
              max="400"
              step="0.1"
              value={weight.weight_kg}
              onChange={(e) =>
                setWeight({ ...weight, weight_kg: e.target.value })
              }
            />
          </label>
          <Button disabled={busy}>Salveaza greutatea</Button>
        </form>
      )}
      <p className="text-xs text-muted">
        O valoare pe zi. Daca data exista deja, salvarea corecteaza acea
        masuratoare. Adauga o cantarire noua cel putin lunar.
      </p>
      {weights.length > 0 && (
        <>
          <details>
            <summary className="cursor-pointer text-accent">
              Grafic — ultimele {chartWeights.length} masuratori
            </summary>
            <div className="mt-3">
              <TrendChart
                key={weights.map((w) => `${w.day}:${w.weight_kg}`).join("|")}
                title="Evolutia greutatii"
                unit="kg"
                data={chartPoints}
                series={[{ key: "value", label: "Greutate", color: "#72f29c" }]}
              />
            </div>
          </details>
          <div className="overflow-x-auto">
            <table className="text-sm">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Greutate</th>
                  <th>Actiuni</th>
                </tr>
              </thead>
              <tbody>
                {weights.slice(0, visibleWeights).map((item) => (
                  <tr key={item.id}>
                    <td>
                      <time dateTime={item.day}>{item.day}</time>
                    </td>
                    <td>{formatValue(item.weight_kg)} kg</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          className={`${secondary} min-h-8 px-2 py-1 text-xs`}
                          disabled={busy}
                          onClick={() => {
                            setWeight({
                              day: item.day,
                              weight_kg: item.weight_kg,
                            });
                            setMessage(
                              `Editeaza greutatea din ${item.day} in formularul de mai sus.`,
                            );
                          }}
                        >
                          Editeaza
                        </Button>
                        <Button
                          type="button"
                          className={`${danger} min-h-8 px-2 py-1 text-xs`}
                          disabled={busy}
                          onClick={() => {
                            if (
                              window.confirm(
                                `Stergi greutatea din ${item.day}? Recomandarea se va recalcula.`,
                              )
                            )
                              mutate(
                                () =>
                                  send(`/profile/weights/${item.id}`, "DELETE"),
                                "Masuratoare stearsa. Recomandarea a fost reevaluata.",
                              );
                          }}
                        >
                          Sterge
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {visibleWeights < weights.length && (
            <Button
              type="button"
              className={secondary}
              onClick={() => setVisibleWeights((count) => count + 12)}
            >
              Mai multe masuratori
            </Button>
          )}
        </>
      )}
    </section>
  );
}
