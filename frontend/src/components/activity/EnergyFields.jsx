import React, { useEffect, useState } from "react";
import { api } from "../../api/client";

export default function EnergyFields({
  value,
  onChange,
  disabled = false,
  day,
  template = false,
}) {
  const [types, setTypes] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    api("/activity-types", { signal: controller.signal })
      .then(setTypes)
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setPreview(null);
    if (!day || !value.activity_type || !value.duration_minutes)
      return () => controller.abort();
    const timer = setTimeout(() => {
      api("/energy/preview", {
        method: "POST",
        signal: controller.signal,
        body: JSON.stringify({
          day,
          activity_type: value.activity_type,
          duration_minutes: Number(value.duration_minutes),
          intensity: value.intensity || "moderate",
        }),
      })
        .then((data) => {
          if (!controller.signal.aborted) {
            setPreview(data);
            setError("");
          }
        })
        .catch((e) => {
          if (!controller.signal.aborted) setError(e.message);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [day, value.activity_type, value.duration_minutes, value.intensity]);
  return (
    <fieldset
      disabled={disabled}
      className="my-3 grid gap-3 rounded-xl border border-white/10 p-3"
    >
      <legend className="px-1 text-accent">Energie estimata a sesiunii</legend>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label>
          Tip de activitate
          <select
            value={value.activity_type || ""}
            onChange={(e) => {
              const selected = types.find((t) => t.key === e.target.value);
              onChange({
                activity_type: selected?.key || null,
                duration_minutes: selected?.duration_minutes || null,
              });
            }}
          >
            <option value="">Fara estimare / date vechi</option>
            {types.map((type) => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Durata totala (minute)
          <input
            type="number"
            min="1"
            max="600"
            step="1"
            value={value.duration_minutes ?? ""}
            onChange={(e) =>
              onChange({
                duration_minutes:
                  e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
        </label>
        <label>
          Intensitate medie
          <select
            value={value.intensity || "moderate"}
            onChange={(e) => onChange({ intensity: e.target.value })}
          >
            <option value="moderate">Moderata</option>
            <option value="high">Ridicata</option>
            <option value="very_high">Foarte ridicata</option>
          </select>
        </label>
        {!template && (
          <label>
            Pasi ai sesiunii inclusi in total
            <input
              type="number"
              min="0"
              max="100000"
              step="1"
              placeholder="Necunoscut; 0 daca niciunul"
              value={value.steps_included ?? ""}
              onChange={(e) =>
                onChange({
                  steps_included:
                    e.target.value === "" ? null : Number(e.target.value),
                })
              }
            />
          </label>
        )}
      </div>
      <p className="text-sm text-muted">
        Durata include pauzele. Estimam sesiunea intreaga, nu fiecare set. Numai
        sesiunile executate contribuie la ziua respectiva.
      </p>
      {!template && (
        <p className="text-xs text-muted">
          Daca pasii zilnici includ antrenamentul, introdu aici pasii acelei
          sesiuni. Daca nu ii cunosti, poti inregistra in profil doar pasii din
          afara antrenamentelor.
        </p>
      )}
      {preview && (
        <p role="status" className="text-accent">
          {preview.net_kcal == null
            ? preview.reason
            : `~${preview.net_kcal} kcal active peste repaus — estimare`}
        </p>
      )}
      {error && <p role="alert">Estimare indisponibila: {error}</p>}
    </fieldset>
  );
}
