import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import { api, localDate, send } from "../api/client";
import TrendChart from "../components/reports/TrendChart";
import { dayList, formatValue, ranges } from "../components/reports/periods";

const panel = "min-w-0 rounded-xl border border-white/10 bg-surface/90 p-3 md:p-4";
const secondary = "border-white/20 bg-transparent text-copy hover:bg-raised";
const danger = "border-red-400/30 bg-transparent text-red-200 hover:bg-red-950";
const activityOptions = [
  ["sedentary", "Sedentar — fara antrenamente, predominant asezat"],
  ["light", "Usor activ — aproximativ 1–3 antrenamente / saptamana"],
  ["moderate", "Moderat — aproximativ 3–5 antrenamente / saptamana"],
  ["high", "Foarte activ — aproximativ 6–7 antrenamente / saptamana"],
  ["very_high", "Extrem de activ — munca fizica si antrenamente intense"],
];
const goalLabels = { lose: "Slabire", maintain: "Mentinere", gain: "Crestere masa musculara" };
const blankProfile = () => ({
  sex: "", birth_date: "", height_cm: "", activity_level: "", goal: "maintain",
  deficit_percent: 10, surplus_percent: 10, target_weight_kg: "",
  pregnant_or_breastfeeding: false, auto_calories: true,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Bucharest",
});
function editable(profile) {
  const result = blankProfile();
  for (const key of Object.keys(result)) if (profile?.[key] !== undefined) result[key] = profile[key] ?? "";
  return result;
}
function Metric({ label, value, detail }) {
  return <div className="min-w-0 rounded-lg border border-white/10 bg-raised/60 p-3">
    <p className="text-sm text-muted">{label}</p>
    <strong className="block text-xl text-accent">{value}</strong>
    {detail && <p className="text-xs text-muted">{detail}</p>}
  </div>;
}
function MonthSummary({ today, revision }) {
  const [month, setMonth] = useState(today.slice(0, 7));
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const range = ranges(`${month}-01`, "month");
  const end = range.end > today ? today : range.end;
  useEffect(() => {
    const controller = new AbortController();
    setResult(null);
    setError("");
    api(`/profile/summary?${new URLSearchParams({ start: range.start, end })}`, { signal: controller.signal })
      .then((next) => { if (!controller.signal.aborted) setResult(next); })
      .catch((err) => { if (!controller.signal.aborted) setError(err.message); });
    return () => controller.abort();
  }, [range.start, end, revision]);
  return <section className={panel} aria-labelledby="profile-summary-title">
    <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
      <div><h2 id="profile-summary-title" className="text-xl">Activitatea mea</h2>
        <p className="text-sm text-muted">{range.start} – {end}. Date din jurnal si sesiunile executate.</p></div>
      <label>Luna<input type="month" required max={today.slice(0, 7)} value={month}
        onChange={(event) => event.target.value && setMonth(event.target.value)} /></label>
    </div>
    {error ? <p role="alert">{error}</p> : !result ? <p role="status">Se incarca activitatea...</p> : <>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Sesiuni executate" value={result.sessions} />
        <Metric label="Zile cu jurnal" value={result.logged_days} detail={`${result.entries} inregistrari`} />
        <Metric label="Consum mediu / zi cu jurnal" value={`${formatValue(result.average_calories)} kcal`} />
        <Metric label="Consum minus tinta / zi" value={`${formatValue(result.average_difference)} kcal`}
          detail={`${result.days_with_target} zile cu jurnal si tinta`} />
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {result.sports.map((sport) => <span key={sport.name}>{sport.name}: {sport.sessions} sesiuni</span>)}
      </div>
      <p className="mt-2 text-xs text-muted">Zilele fara jurnal nu sunt considerate zero. Diferenta fata de tinta nu reprezinta deficitul energetic real.</p>
    </>}
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
      <Link to="/workouts/reports">Rapoarte antrenamente →</Link>
      <Link to="/nutrition/reports">Rapoarte nutritionale →</Link>
      <Link to="/nutrition/journal">Jurnal si istoric obiective →</Link>
    </div>
  </section>;
}

function ProfileDashboard({ user }) {
  const [data, setData] = useState(null);
  const [form, setForm] = useState(blankProfile);
  const [weight, setWeight] = useState({ day: localDate(), weight_kg: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [visibleWeights, setVisibleWeights] = useState(12);
  const dirty = useRef(false);
  const saving = useRef(false);
  const request = useRef(0);
  const mounted = useRef(false);
  const initial = useRef(true);

  const refresh = useCallback(async () => {
    if (saving.current) return;
    const id = ++request.current;
    try {
      const next = await api("/profile");
      if (!mounted.current || id !== request.current) return;
      setData(next);
      if (!dirty.current) setForm(editable(next.profile));
      if (initial.current) {
        setWeight({ day: next.today, weight_kg: "" });
        initial.current = false;
      }
      setError("");
      setRevision((value) => value + 1);
    } catch (err) {
      if (mounted.current && id === request.current) setError(err.message);
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    refresh();
    const visible = () => { if (document.visibilityState === "visible") refresh(); };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", visible);
    return () => {
      mounted.current = false;
      request.current++;
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [refresh]);
  function change(key, value) {
    dirty.current = true;
    setForm((current) => ({ ...current, [key]: value }));
  }
  async function mutate(work, success, hydrate = false) {
    if (saving.current) return;
    saving.current = true;
    request.current++;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const next = await work();
      if (!mounted.current) return;
      setData(next);
      if (hydrate) { dirty.current = false; setForm(editable(next.profile)); }
      setRevision((value) => value + 1);
      setMessage(success);
    } catch (err) {
      if (mounted.current) setError(err.message);
    } finally {
      saving.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  function saveProfile(event) {
    event.preventDefault();
    mutate(() => send("/profile", "PUT", {
      ...form, height_cm: Number(form.height_cm),
      target_weight_kg: form.target_weight_kg === "" ? null : Number(form.target_weight_kg),
    }), "Profil salvat. Recomandarea si tinta automata au fost reevaluate.", true);
  }
  const today = data?.today || localDate();
  const recommendation = data?.recommendation;
  const weights = data?.weights || [];
  const latest = weights[0];
  const chartWeights = weights.slice(0, 12).reverse();
  const chartMap = new Map(chartWeights.map((item) => [item.day, item.weight_kg]));
  // Keep real date spacing, even when measurements are months apart.
  const chartPoints = chartWeights.length ? dayList(chartWeights[0].day, chartWeights.at(-1).day)
    .map((day) => ({ day, value: chartMap.get(day) ?? null })) : [];

  return <main className="space-y-4">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="mb-1 text-3xl">Profilul meu</h1>
        <p className="text-muted">{user.displayName || "Cont ATHLETICA"}{user.email && ` · ${user.email}`}</p></div>
      <button type="button" className={secondary} disabled={busy} onClick={refresh}>Actualizeaza datele</button>
    </header>
    {error && <p role="alert" className="rounded-lg border border-red-400/30 bg-red-950/40 p-3 text-red-200">{error}</p>}
    {message && <p role="status">{message}</p>}
    {!data ? <p role="status">{error ? "Profilul nu a putut fi incarcat. Reincearca actualizarea." : "Se incarca profilul..."}</p> : <>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Greutate actuala" value={`${formatValue(latest?.weight_kg)} kg`} detail={latest?.day} />
        <Metric label="Schimbare de la prima masuratoare" value={`${formatValue(data.weight_change_kg)} kg`} detail={weights.at(-1)?.day} />
        <Metric label="Mentinere estimata" value={`${formatValue(recommendation?.maintenance_kcal)} kcal/zi`} />
        <Metric label="Tinta activa in jurnal" value={`${formatValue(data.active_goal?.calories)} kcal/zi`}
          detail={data.active_goal ? `Din ${data.active_goal.effective_from} · ${data.active_goal.source === "profile" ? "din profil" : "manuala"}` : "Nicio tinta activa"} />
      </div>

      <div className="grid items-start gap-3 xl:grid-cols-[1.3fr_1fr]">
        <section className={panel} aria-labelledby="profile-settings-title">
          <h2 id="profile-settings-title" className="text-xl">Date personale si obiectiv</h2>
          <form onSubmit={saveProfile}>
            <fieldset disabled={busy} className="border-0 p-0">
              <div className="grid gap-3 sm:grid-cols-2">
                <label>Sex folosit in calcul<select required value={form.sex} onChange={(e) => change("sex", e.target.value)}>
                  <option value="">Alege</option><option value="female">Femeie</option><option value="male">Barbat</option>
                </select></label>
                <label>Data nasterii<input type="date" required max={today} value={form.birth_date} onChange={(e) => change("birth_date", e.target.value)} /></label>
                <label>Inaltime (cm)<input type="number" required min="100" max="250" step="0.1" placeholder="176" value={form.height_cm} onChange={(e) => change("height_cm", e.target.value)} /></label>
                <label>Obiectiv<select aria-label="Obiectiv" value={form.goal} onChange={(e) => change("goal", e.target.value)}>
                  {Object.entries(goalLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select></label>
                <label className="sm:col-span-2">Nivel de activitate<select required value={form.activity_level} onChange={(e) => change("activity_level", e.target.value)}>
                  <option value="">Alege nivelul aproximativ</option>
                  {activityOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select></label>
                {form.goal === "lose" && <label>Deficit caloric<select value={form.deficit_percent} onChange={(e) => change("deficit_percent", Number(e.target.value))}>
                  <option value={10}>10% — usor</option><option value={15}>15% — moderat</option><option value={20}>20% — mai pronuntat, maxim</option>
                </select></label>}
                {form.goal === "gain" && <label>Surplus caloric<select value={form.surplus_percent} onChange={(e) => change("surplus_percent", Number(e.target.value))}>
                  <option value={5}>5% — conservator / avansati</option><option value={10}>10% — punct de pornire</option>
                  <option value={15}>15% — surplus mai mare</option><option value={20}>20% — maxim</option>
                </select></label>}
                {form.goal !== "maintain" && <label>Greutate tinta (kg, optional)<input type="number" min="25" max="400" step="0.1" value={form.target_weight_kg} onChange={(e) => change("target_weight_kg", e.target.value)} /></label>}
              </div>
              <p className="text-xs text-muted">Alege activitatea totala, inclusiv mersul si munca zilnica. Frecventa salii este doar un reper; necesarul nu este masurat direct.</p>
              {form.goal === "gain" && <p className="text-xs text-muted">Pentru culturism, literatura descrie aproximativ 10–20% la incepatori/intermediari si o abordare mai conservatoare la avansati. Incepe prudent si ajusteaza dupa evolutia masurata. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6680710/" target="_blank" rel="noreferrer">Sursa</a></p>}
              <label className="flex items-start gap-2"><input className="mt-1 shrink-0" type="checkbox" checked={form.pregnant_or_breastfeeding} onChange={(e) => change("pregnant_or_breastfeeding", e.target.checked)} />Sarcina sau alaptare — opreste estimarea automata</label>
              <label className="flex items-start gap-2"><input className="mt-1 shrink-0" type="checkbox" checked={form.auto_calories} onChange={(e) => change("auto_calories", e.target.checked)} />Sincronizeaza automat tinta calorica in jurnal</label>
              <p className="text-xs text-muted">La salvarea profilului sau greutatii, tinta se aplica de azi. Corectiile din aceeasi zi actualizeaza tinta zilei. Zilele trecute raman in istoric. O tinta manuala din jurnal opreste sincronizarea.</p>
              <button type="submit">{busy ? "Se salveaza..." : "Salveaza profilul"}</button>
            </fieldset>
          </form>
        </section>

        <section className={`${panel} space-y-3`} aria-labelledby="profile-estimate-title">
          <h2 id="profile-estimate-title" className="text-xl">Recomandare estimata</h2>
          {dirty.current && <p className="text-sm text-amber-200">Calculul de mai jos foloseste datele salvate. Salveaza modificarile pentru recalculare.</p>}
          {recommendation.available ? <>
            <p className="text-sm text-muted">{goalLabels[recommendation.effective_goal]} · greutate din {recommendation.weight_day}</p>
            <p className="text-3xl font-bold text-accent">{formatValue(recommendation.target_kcal)} <span className="text-base">kcal/zi</span></p>
            <p className="text-sm">Repaus estimat: {formatValue(recommendation.resting_kcal)} kcal. Mentinere: {formatValue(recommendation.maintenance_kcal)} kcal.
              {recommendation.adjustment_percent !== 0 && ` Ajustare: ${recommendation.adjustment_percent > 0 ? "+" : ""}${recommendation.adjustment_percent}%.`}</p>
            {recommendation.options.length > 1 && <div className="overflow-x-auto"><table className="text-sm">
              <caption className="pb-2 text-left text-muted">Comparatie la aceleasi date personale</caption>
              <thead><tr><th>Ajustare</th><th>kcal/zi</th>{recommendation.effective_goal === "lose" && <th>Echivalent / 30 zile*</th>}</tr></thead>
              <tbody>{recommendation.options.map((option) => <tr key={option.percent} className={option.percent === recommendation.adjustment_percent ? "bg-accent/10" : ""}>
                <td>{option.percent > 0 ? "+" : ""}{option.percent}%</td><td>{option.allowed ? formatValue(option.calories) : "Indisponibil"}</td>
                {recommendation.effective_goal === "lose" && <td>{formatValue(option.energy_equivalent_kg_30_days)} kg</td>}
              </tr>)}</tbody>
            </table></div>}
            {recommendation.effective_goal === "lose" && <p className="text-xs text-muted">* Echivalent energetic simplificat (7.700 kcal/kg), nu o predictie a kilogramelor pierdute. Apa, compozitia corporala si adaptarea metabolica schimba evolutia reala.</p>}
            {recommendation.warnings.map((warning) => <p key={warning} className="text-sm text-amber-200">{warning}</p>)}
          </> : <p>{recommendation.reason}</p>}
          <p className="text-xs text-muted">Estimare Mifflin–St Jeor × activitate. Se recalculeaza din ultima greutate la salvare. Pentru adulti; nevoile individuale pot diferi. Caloriile antrenamentelor nu se adauga separat peste factorul de activitate.</p>
          <p className="text-xs text-muted">{data.profile?.auto_calories ? "Sincronizare automata activata." : "Tinta din jurnal ramane manuala sau fixata la ultima valoare."} {data.active_goal?.protein ? `Tinta de proteine pastrata: ${formatValue(data.active_goal.protein)} g/zi.` : "Poti configura separat tinta de proteine in jurnal."}</p>
        </section>
      </div>

      <section className={`${panel} space-y-3`} aria-labelledby="profile-weight-title">
        <h2 id="profile-weight-title" className="text-xl">Greutate si progres</h2>
        {!data.profile ? <p>Salveaza datele profilului, apoi adauga prima cantarire.</p> : <form className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={(event) => {
          event.preventDefault();
          mutate(() => send("/profile/weights", "PUT", { day: weight.day, weight_kg: Number(weight.weight_kg) }), "Greutatea a fost salvata. Recomandarea si tinta automata au fost reevaluate.");
        }}>
          <label>Data cantaririi<input type="date" required min={data.profile.birth_date} max={today} value={weight.day} onChange={(e) => setWeight({ ...weight, day: e.target.value })} /></label>
          <label>Greutate (kg)<input type="number" required min="25" max="400" step="0.1" value={weight.weight_kg} onChange={(e) => setWeight({ ...weight, weight_kg: e.target.value })} /></label>
          <button disabled={busy}>Salveaza greutatea</button>
        </form>}
        <p className="text-xs text-muted">O valoare pe zi. Daca data exista deja, salvarea corecteaza acea masuratoare. Adauga o cantarire noua cel putin lunar.</p>
        {weights.length > 0 && <>
          <details><summary className="cursor-pointer text-accent">Grafic — ultimele {chartWeights.length} masuratori</summary>
            <div className="mt-3"><TrendChart key={weights.map((w) => `${w.day}:${w.weight_kg}`).join("|")}
              title="Evolutia greutatii" unit="kg" data={chartPoints}
              series={[{ key: "value", label: "Greutate", color: "#72f29c" }]} /></div>
          </details>
          <div className="overflow-x-auto"><table className="text-sm">
            <thead><tr><th>Data</th><th>Greutate</th><th>Actiuni</th></tr></thead>
            <tbody>{weights.slice(0, visibleWeights).map((item) => <tr key={item.id}>
              <td><time dateTime={item.day}>{item.day}</time></td><td>{formatValue(item.weight_kg)} kg</td>
              <td><div className="flex flex-wrap gap-2">
                <button type="button" className={`${secondary} min-h-8 px-2 py-1 text-xs`} disabled={busy} onClick={() => { setWeight({ day: item.day, weight_kg: item.weight_kg }); setMessage(`Editeaza greutatea din ${item.day} in formularul de mai sus.`); }}>Editeaza</button>
                <button type="button" className={`${danger} min-h-8 px-2 py-1 text-xs`} disabled={busy} onClick={() => {
                  if (window.confirm(`Stergi greutatea din ${item.day}? Recomandarea se va recalcula.`))
                    mutate(() => send(`/profile/weights/${item.id}`, "DELETE"), "Masuratoare stearsa. Recomandarea a fost reevaluata.");
                }}>Sterge</button>
              </div></td>
            </tr>)}</tbody>
          </table></div>
          {visibleWeights < weights.length && <button type="button" className={secondary} onClick={() => setVisibleWeights((count) => count + 12)}>Mai multe masuratori</button>}
        </>}
      </section>
      <MonthSummary today={today} revision={revision} />
    </>}
  </main>;
}

export default function ProfilePage() {
  const { user } = useAuth();
  return user ? <ProfileDashboard key={user.uid} user={user} /> : null;
}
