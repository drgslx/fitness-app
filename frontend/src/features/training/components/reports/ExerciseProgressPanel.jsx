import React, { useEffect, useState } from "react";
import { api, localDate } from "../../../../api/client";
import PeriodSelector from "../../../../components/reports/PeriodSelector";
import TrendChart from "../../../../components/reports/TrendChart";
import ProgressTable from "../../../../components/reports/ProgressTable";
import { formatValue } from "../../../../components/reports/periods";

function ExerciseResults({ sport, exerciseKey, period, anchor }) {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [metric, setMetric] = useState("weight_kg");
  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({
      sport,
      exercise_key: exerciseKey,
      period,
      anchor,
    });
    api(`/training-progress?${params}`)
      .then((data) => {
        if (active) setReport(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [sport, exerciseKey, period, anchor]);
  if (error)
    return (
      <p role="alert" className="error">
        {error}
      </p>
    );
  if (!report) return <p role="status">Se calculeaza progresul...</p>;
  const available = Object.entries(report.metrics).filter(
    ([, value]) => value.current !== null || value.previous !== null
  );
  const chosen = available.some(([key]) => key === metric)
    ? metric
    : available[0]?.[0] ?? "weight_kg";
  const summary = report.metrics[chosen];
  const difference = summary.delta;
  return (
    <>
      <p>
        {report.start} – {report.end}. Comparatie cu {report.previous_start} –{" "}
        {report.previous_end}.
      </p>
      <label>
        Indicator
        <select
          value={chosen}
          onChange={(event) => setMetric(event.target.value)}
        >
          {(available.length ? available : Object.entries(report.metrics)).map(
            ([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            )
          )}
        </select>
      </label>
      <div className="progress-summary">
        <div>
          Perioada aleasa
          <strong>
            {formatValue(summary.current)} {summary.unit}
          </strong>
          {report.sessions} sesiuni executate
        </div>
        <div>
          Perioada precedenta
          <strong>
            {formatValue(summary.previous)} {summary.unit}
          </strong>
          {report.previous_sessions} sesiuni executate
        </div>
        <div>
          Diferenta
          <strong>
            {difference > 0 ? "+" : ""}
            {formatValue(difference)} {summary.unit}
          </strong>
        </div>
      </div>
      <p role="note">
        {difference === null
          ? "Nu sunt suficiente valori in ambele perioade pentru comparatie."
          : `${summary.label}: ${difference > 0 ? "+" : ""}${formatValue(
              difference
            )} ${summary.unit} fata de ${
              period === "month" ? "luna" : "saptamana"
            } precedenta.`}{" "}
        Greutatea reprezinta maximul inregistrat. Repetarile sunt suma seturi ×
        repetari. Minutele sunt insumate asa cum au fost introduse, fara
        inmultire cu seturile. Perioada curenta poate fi incompleta; compara si
        numarul de sesiuni, seturile si repetarile.
      </p>
      {summary.missing_current > 0 && (
        <p role="note">
          {summary.missing_current} inregistrari nu au aceasta valoare
          completata si nu intra in calcul.
        </p>
      )}
      <TrendChart
        key={chosen}
        title={summary.label}
        unit={summary.unit}
        data={report.points.map((point) => ({
          day: point.day,
          value: point[chosen],
        }))}
        series={[{ key: "value", label: summary.label, color: "#72f29c" }]}
      />
      <ProgressTable
        caption="Detaliile sesiunilor executate"
        rows={report.rows}
        rowKey={(row) => `${row.log_id}-${row.index}`}
        columns={[
          { key: "day", label: "Data" },
          { key: "session", label: "Sesiune" },
          {
            key: "name",
            label: "Exercitiu",
            render: (row) => row.exercise.name,
          },
          {
            key: "sets",
            label: "Seturi / runde",
            render: (row) => formatValue(row.exercise.sets),
          },
          {
            key: "reps",
            label: "Repetari / set",
            render: (row) => formatValue(row.exercise.reps),
          },
          {
            key: "weight",
            label: "Kg",
            render: (row) => formatValue(row.exercise.weight_kg),
          },
          {
            key: "minutes",
            label: "Minute",
            render: (row) => formatValue(row.exercise.minutes),
          },
          ...(report.metrics.distance_km.current !== null
            ? [
                {
                  key: "distance",
                  label: "Km",
                  render: (row) => formatValue(row.exercise.distance_km),
                },
              ]
            : []),
          {
            key: "notes",
            label: "Note",
            render: (row) => row.exercise.notes || "—",
          },
        ]}
      />
    </>
  );
}

export default function ExerciseProgressPanel() {
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState("");
  const [sport, setSport] = useState("");
  const [exerciseKey, setExerciseKey] = useState("");
  const [period, setPeriod] = useState("month");
  const [anchor, setAnchor] = useState(localDate());
  useEffect(() => {
    let active = true;
    api("/training-progress/catalog")
      .then((data) => {
        if (active) setCatalog(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, []);
  const exercises =
    catalog?.find((item) => item.name === sport)?.exercises ?? [];
  return (
    <section className="panel progress-report">
      <h2>Verifica progresul</h2>
      <p>
        Alege sportul si exercitiul. Raportul foloseste valorile salvate cand ai
        bifat sesiunea ca executata.
      </p>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {!catalog && !error && <p role="status">Se incarca sporturile...</p>}
      {catalog?.length === 0 && (
        <p>
          Nu exista exercitii in sesiuni executate. Completeaza o sesiune si
          bifeaz-o ca executata pentru a incepe istoricul.
        </p>
      )}
      <div className="progress-filters">
        <label>
          Alege sport
          <select
            value={sport}
            onChange={(e) => {
              setSport(e.target.value);
              setExerciseKey("");
            }}
          >
            <option value="">Alege sportul</option>
            {catalog?.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Alege exercitiu
          <select
            disabled={!sport}
            value={exerciseKey}
            onChange={(e) => setExerciseKey(e.target.value)}
          >
            <option value="">Alege exercitiul</option>
            {exercises.map((item) => (
              <option key={item.key} value={item.key}>
                {item.name}
                {item.legacy ? " (istoric fara ID)" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>
      <PeriodSelector
        period={period}
        anchor={anchor}
        onPeriodChange={setPeriod}
        onAnchorChange={setAnchor}
      />
      {sport && exerciseKey && (
        <ExerciseResults
          key={`${sport}|${exerciseKey}|${period}|${anchor}`}
          {...{ sport, exerciseKey, period, anchor }}
        />
      )}
    </section>
  );
}
