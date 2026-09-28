import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api, send } from "../../api/client";
const blank = { steps: "", steps_scope: "total", complete: false };
const kcal = (v) => v == null ? "—" : `~${v.toLocaleString("ro-RO")} kcal`;

export default function EnergyPanel({ today, revision, onSaved }) {
  const [data, setData] = useState(null);
  const [day, setDay] = useState(today);
  const [form, setForm] = useState(blank);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const dirty = useRef(false);
  const working = useRef(false);
  const request = useRef(0);
  const refresh = useCallback(async () => {
    if (working.current) return;
    const id = ++request.current;
    try {
      const result = await api("/energy");
      if (id === request.current) { setData(result); setError(""); }
    } catch (e) { if (id === request.current) setError(e.message); }
  }, []);
  useEffect(() => {
    refresh();
    const visible = () => { if (document.visibilityState === "visible") refresh(); };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", visible);
    return () => { request.current++; window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", visible); };
  }, [refresh, revision]);
  useEffect(() => {
    if (!dirty.current) {
      const record = data?.days?.find((item) => item.day === day)?.observation;
      setForm(record ? { ...record, steps: record.steps ?? "" } : blank);
    }
  }, [day, data]);
  function change(key, value) { dirty.current = true; setForm((old) => ({ ...old, [key]: value })); }
  async function save(e, remove = false) {
    e.preventDefault();
    if (working.current) return;
    working.current = true; request.current++; setBusy(true); setError("");
    try {
      await send(`/daily-activity/${day}`, remove ? "DELETE" : "PUT", remove ? undefined : {
        ...form, steps: form.steps === "" ? null : Number(form.steps),
      });
      dirty.current = false;
      working.current = false;
      await refresh();
      onSaved?.();
    } catch (err) { setError(err.message); }
    finally { working.current = false; setBusy(false); }
  }
  const selected = data?.days?.find((item) => item.day === day);
  return <section className="grid min-w-0 gap-3 rounded-xl border border-white/10 bg-surface/90 p-3 md:p-4" aria-labelledby="energy-title">
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 id="energy-title" className="text-xl">Energia si activitatea zilnica</h2>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}>+ Adauga activitate</button></div>
    {error && <p role="alert" className="text-red-200">{error}</p>}
    {open && <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => document.getElementById("daily-steps")?.focus()}>Mers / pasi</button>
      <Link className="rounded-lg border border-white/20 px-3 py-2" to="/workouts/sessions/new?activity=strength">Forta</Link>
      <Link className="rounded-lg border border-white/20 px-3 py-2" to="/workouts/sessions/new?activity=cardio">Cardio</Link>
      <Link className="rounded-lg border border-white/20 px-3 py-2" to="/workouts/sessions/new?activity=combat">Sport</Link>
      <Link className="rounded-lg border border-white/20 px-3 py-2" to="/workouts/sessions/new?activity=other">Alta activitate</Link>
    </div>}
    {!data ? <p role="status">Se calculeaza energia...</p> : !data.available ? <p>{data.reason}</p> : <>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div><p className="text-sm text-muted">Consum estimat azi {data.today.complete ? "" : "· provizoriu"}</p><strong className="text-xl text-accent">{kcal(data.today.estimated_kcal)}</strong></div>
        <div><p className="text-sm text-muted">Media zilelor complete / ultimele 7 zile</p><strong className="text-xl text-accent">{kcal(data.week.average_maintenance_kcal)}/zi</strong><p className="text-xs">{data.week.complete_days}/7 zile complete; minimum 4 pentru planificare</p></div>
        <div><p className="text-sm text-muted">Pasi medii / zi completa</p><strong>{data.week.average_steps ?? "—"}</strong></div>
        <div><p className="text-sm text-muted">Sesiuni / ultimele 7 zile</p><strong>{data.week.sessions} · {data.week.training_minutes} minute</strong></div>
      </div>
      <p className="text-sm">Date disponibile: <strong>{{ basic: "Initiale", improving: "In completare", history: "Istoric extins" }[data.coverage.level]}</strong> · {data.coverage.complete_days_28}/28 zile complete. Personalizare din activitatea declarata; precizia nu este masurata, calibrarea dupa greutate nu este activa.</p>
      <form onSubmit={save} className="grid gap-2">
        <fieldset disabled={busy} className="grid gap-3 border-0 p-0 sm:grid-cols-3">
          <label>Ziua activitatii<input type="date" required min={data.days[0].day} max={today} value={day} onChange={(e) => {
            if (e.target.value) { dirty.current = false; setDay(e.target.value); }
          }} /></label>
          <label>Pasi inregistrati<input id="daily-steps" type="number" min="0" max="100000" step="1" placeholder="Ex: 8200" value={form.steps} onChange={(e) => change("steps", e.target.value)} /></label>
          <label>Ce includ pasii?<select value={form.steps_scope} onChange={(e) => change("steps_scope", e.target.value)}>
            <option value="total">Totalul zilei, inclusiv sport</option><option value="outside_workouts">Doar in afara antrenamentelor</option>
          </select></label>
        </fieldset>
        <label className="flex items-center gap-2"><input type="checkbox" disabled={busy} checked={form.complete} onChange={(e) => change("complete", e.target.checked)} />Am completat pasii si toate sesiunile executate ale zilei (inclusiv daca nu am facut sport).</label>
        <div className="flex flex-wrap gap-2"><button disabled={busy}>Salveaza activitatea zilei</button>
          {selected?.observation && <button type="button" disabled={busy} onClick={(e) => { if (window.confirm("Stergi pasii si confirmarea zilei? Sesiunile raman.")) save(e, true); }}>Sterge pasii zilei</button>}
          <Link className="px-2 py-2" to={`/workouts/sessions?day=${day}`}>Vezi / editeaza sesiunile →</Link></div>
      </form>
      {dirty.current && <p className="text-xs text-amber-200">Valorile de mai jos folosesc datele salvate.</p>}
      {selected && <div className="grid gap-2 rounded-lg bg-ink/60 p-3">
        <p><strong>{day}</strong> · {selected.mode === "fallback" ? "Estimare initiala din profil; activitate necompletata" : selected.complete ? "Zi completa" : "Estimare partiala / provizorie"}</p>
        {!selected.available && <p>{selected.reason}</p>}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <p>Repaus: {kcal(selected.resting_kcal)}</p><p>Mers separat: {kcal(selected.walking_net_kcal)}</p>
          <p>Sesiuni peste repaus: {kcal(selected.workout_net_kcal)}</p><p>Alte activitati de baza: {kcal(selected.other_baseline_kcal)}</p>
          <p>Digestie estimata: {kcal(selected.thermic_kcal)}</p><p>Total estimat: {kcal(selected.estimated_kcal)}</p>
        </div>
        {selected.sessions.map((session) => <p key={session.id} className="text-sm">{session.title}: {session.duration_minutes ?? "?"} min · {kcal(session.net_kcal)} <Link to={`/workouts/sessions?day=${day}`}>Editeaza</Link></p>)}
        {selected.issues.map((issue) => <p key={issue} className="text-sm text-amber-200">{issue}</p>)}
        {selected.stale_weight && <p className="text-sm text-amber-200">Greutatea folosita este mai veche de 30 zile.</p>}
      </div>}
    </>}
    <details className="text-sm"><summary className="cursor-pointer text-accent">Cum se calculeaza?</summary>
      <div className="mt-2 grid gap-2 text-muted">
        <p>Estimarea initiala foloseste Mifflin–St Jeor: 10 × kg + 6,25 × cm − 5 × varsta, apoi +5 pentru barbati sau −161 pentru femei. Este energie in repaus estimata (RMR, numita frecvent BMR), nu consumul total al zilei (TDEE).</p>
        <p>Fara activitate inregistrata folosim temporar factorul din profil. Cu date folosim repaus + activitate neta + o ipoteza de 10% din repaus pentru activitate nemers + digestie estimata la 10% din total. Nu adaugam pasi peste factorul initial.</p>
        <p>Mers: lungime aproximativa a pasului = 0,414 × inaltime; ~0,5 kcal/kg/km net. Sunt ipoteze pentru mers pe teren plat, nu masuratori. Sesiuni: (MET − 1) × kg × ore; MET-ul mediu include pauzele. Greutatea este ultima masurata pana la data activitatii.</p>
        <p>Pasii inclusi deja in sesiunile sportive se scad din totalul zilnic. Daca nu cunoastem suprapunerea, nu adaugam energia mersului si ziua nu intra in media pentru planificare. Lipsa datelor nu este zero.</p>
        <p>Media foloseste zile complete din ultimele 7, inclusiv zile de odihna. Minimum 4 este un prag de produs, nu validare stiintifica. Zilele partiale si cele fara date nu intra. Introducerea doar a zilelor active poate supraestima media.</p>
        <p>Mai multe date personalizeaza modelul, fara sa garanteze mai multa precizie. Istoricul greutatii si jurnalul raman disponibile pentru calibrare ulterioara; acum nu ajustam automat modelul dupa trend.</p>
        <p><a href="https://pubmed.ncbi.nlm.nih.gov/2305711/" target="_blank" rel="noreferrer">Studiul Mifflin–St Jeor</a> · <a href="https://pacompendium.com/" target="_blank" rel="noreferrer">Compendium: MET</a></p>
      </div>
    </details>
  </section>;
}
