import React from "react";
import { activityOptions, goalLabels } from "./constants";

export default function PersonalProfileFields({ form, change, today, permissions, registration = false, initialSetup = false, activitySummary }) {
  const allowed = (key) => permissions?.[key] !== false;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label>
        {registration ? "Sex" : "Sex folosit in calcul"}
        <select required value={form.sex} disabled={!allowed("sex")}
          onChange={(e) => change("sex", e.target.value)}>
          <option value="">Alege</option>
          <option value="female">Femeie</option>
          <option value="male">Barbat</option>
        </select>
      </label>
      <label>
        Data nasterii
        <input type="date" required max={today} value={form.birth_date}
          disabled={!allowed("birth_date")}
          onChange={(e) => change("birth_date", e.target.value)} />
      </label>
      <label>
        Inaltime (cm)
        <input type="number" required min="100" max="250" step="0.1"
          placeholder="176" value={form.height_cm} disabled={!allowed("height_cm")}
          onChange={(e) => change("height_cm", e.target.value)} />
      </label>
      <label>
        Obiectiv
        <select aria-label="Obiectiv" value={form.goal} disabled={!allowed("goal")}
          onChange={(e) => change("goal", e.target.value)}>
          {Object.entries(goalLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      {registration || initialSetup ? <label className="sm:col-span-2">
        Nivel de activitate la inregistrare
        <select required value={form.activity_level} disabled={!allowed("activity_level")}
          onChange={(e) => change("activity_level", e.target.value)}>
          <option value="">Alege nivelul aproximativ</option>
          {activityOptions.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label> : <>
        <label className="sm:col-span-2">
          Nivel de activitate curent
          <input readOnly value={activityOptions.find(([value]) => value === activitySummary?.activity_level)?.[1] || "Se determina din antrenamente"} />
        </label>
        <div className="sm:col-span-2 text-sm text-muted" aria-label="Nivel ales la inregistrare">
          <p className="mb-1">Nivel ales la inregistrare</p>
          <p className="mb-1">{activityOptions.find(([value]) => value === form.activity_level)?.[1]}</p>
          <p className="text-xs">Valoare istorica, aleasa o singura data la crearea profilului.</p>
        </div>
      </>}
    </div>
  );
}
