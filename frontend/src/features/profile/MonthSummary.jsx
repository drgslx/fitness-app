import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import Metric from "../../components/ui/Metric";
import { ranges, formatValue } from "../../components/reports/periods";
const panel = "panel my-0";
export default function MonthSummary({ today, revision }) {
  const [month, setMonth] = useState(today.slice(0, 7));
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const range = ranges(`${month}-01`, "month");
  const end = range.end > today ? today : range.end;
  useEffect(() => {
    const controller = new AbortController();
    setResult(null);
    setError("");
    api(
      `/profile/summary?${new URLSearchParams({ start: range.start, end })}`,
      { signal: controller.signal },
    )
      .then((next) => {
        if (!controller.signal.aborted) setResult(next);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message);
      });
    return () => controller.abort();
  }, [range.start, end, revision]);
  return (
    <section className={panel} aria-labelledby="profile-summary-title">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="profile-summary-title" className="text-xl">
            Activitatea mea
          </h2>
          <p className="text-sm text-muted">
            {range.start} – {end}. Date din jurnal si sesiunile executate.
          </p>
        </div>
        <label>
          Luna
          <input
            type="month"
            required
            max={today.slice(0, 7)}
            value={month}
            onChange={(event) =>
              event.target.value && setMonth(event.target.value)
            }
          />
        </label>
      </div>
      {error ? (
        <p role="alert">{error}</p>
      ) : !result ? (
        <p role="status">Se incarca activitatea...</p>
      ) : (
        <>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Sesiuni executate" value={result.sessions} />
            <Metric
              label="Zile cu jurnal"
              value={result.logged_days}
              detail={`${result.entries} inregistrari`}
            />
            <Metric
              label="Consum mediu / zi cu jurnal"
              value={`${formatValue(result.average_calories)} kcal`}
            />
            <Metric
              label="Consum minus tinta / zi"
              value={`${formatValue(result.average_difference)} kcal`}
              detail={`${result.days_with_target} zile cu jurnal si tinta`}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {result.sports.map((sport) => (
              <span key={sport.name}>
                {sport.name}: {sport.sessions} sesiuni
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            Zilele fara jurnal nu sunt considerate zero. Diferenta fata de tinta
            nu reprezinta deficitul energetic real.
          </p>
        </>
      )}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link to="/workouts/reports">Rapoarte antrenamente →</Link>
        <Link to="/nutrition/reports">Rapoarte nutritionale →</Link>
        <Link to="/nutrition/journal">Jurnal si istoric obiective →</Link>
      </div>
    </section>
  );
}
