import React from "react";
import { activityOptions, goalLabels } from "./constants";
import { ACTIVITY_LABELS } from "../../components/activity/activityLevels";
export function SavedField({ label, value }) {
  return <dl className="min-w-0 rounded-lg border border-white/10 bg-raised/40 p-3">
    <dt className="text-sm text-muted">{label}</dt>
    <dd className="mt-1 break-words font-semibold">{value}</dd>
  </dl>;
}
export default function PersonalProfileFields({ form, change, today, permissions, registration = false, initialSetup = false, activitySummary, editing = true }) {
  const creatingProfile = registration || initialSetup;
  const editingGoal = creatingProfile || editing;
  const canEditHeight = creatingProfile || (editing && permissions?.height_cm);
  const recommendation = { activity_level: activitySummary?.activity_level,
    training_sessions_7: activitySummary?.eligible_sessions_7 };
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {creatingProfile ? <label>{registration ? "Sex" : "Sex folosit in calcul"}<select required value={form.sex} onChange={(e) => change("sex", e.target.value)}>
        <option value="">Alege</option><option value="female">Femeie</option><option value="male">Barbat</option>
      </select></label> : <SavedField label="Sex folosit in calcul" value={form.sex === "female" ? "Femeie" : "Barbat"} />}
      {creatingProfile ? <label>Data nasterii<input type="date" required max={today} value={form.birth_date} onChange={(e) => change("birth_date", e.target.value)} /></label>
        : <SavedField label="Data nasterii" value={form.birth_date.split("-").reverse().join(".")} />}
      {canEditHeight ? <label>Inaltime (cm)<input type="number" required min="100" max="250" step="0.1" placeholder="176" value={form.height_cm} onChange={(e) => change("height_cm", e.target.value)} /></label>
        : <SavedField label="Inaltime (cm)" value={`${form.height_cm} cm`} />}
      {editingGoal ? <label>Obiectiv<select aria-label="Obiectiv" value={form.goal} onChange={(e) => change("goal", e.target.value)}>
        {Object.entries(goalLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select></label> : <SavedField label="Obiectiv" value={goalLabels[form.goal]} />}
      {creatingProfile ? <label className="sm:col-span-2">Nivel de activitate la inregistrare<select required value={form.activity_level} onChange={(e) => change("activity_level", e.target.value)}>
        <option value="">Alege nivelul aproximativ</option>
        {activityOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select></label> : <div className="sm:col-span-2" aria-label="Activitatea din ultimele 7 zile"><SavedField label="Nivel de activitate / ultimele 7 zile"
        value={`${ACTIVITY_LABELS[recommendation.activity_level] || "Sedentar"} · ${recommendation.training_sessions_7 ?? 0} sesiuni executate`} />
        <p className="mt-1 text-xs text-muted">Nivel orientativ: 0 sedentar; 1–2 usor; 3–4 moderat; 5–6 foarte activ; 7+ extrem. Consumul se estimeaza separat din sport, durata si intensitatea fiecarei sesiuni.</p>
        {activitySummary?.start && <p className="mt-1 text-xs text-muted">{activitySummary.start} – {activitySummary.end}</p>}
        {activitySummary?.missing_duration_sessions > 0 && <p className="mt-1 text-xs text-amber-200">
          {activitySummary.missing_duration_sessions} sesiuni fara durata. Completeaza detaliile pentru estimarea consumului lor.
        </p>}
      </div>}
    </div>
  );
}
