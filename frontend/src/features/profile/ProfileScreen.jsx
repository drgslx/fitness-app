import { panel } from "./constants";
import WeightProgress from "./WeightProgress";
import ProfileRecommendation from "./ProfileRecommendation";
import ProfileSettings from "./ProfileSettings";
import MonthSummary from "./MonthSummary";
import Metric from "../../components/ui/Metric";
import SectionTabs from "../../components/ui/SectionTabs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth";
import { api, localDate, send } from "../../api/client";
import EnergyPanel from "../../components/activity/EnergyPanel";
import { dayList, formatValue } from "../../components/reports/periods";
import { blankProfile, editableProfile, profilePayload, profilePermissions } from "./profileForm";

function ProfileDashboard({ user }) {
  const [data, setData] = useState(null);
  const [form, setForm] = useState(blankProfile);
  const [weight, setWeight] = useState({ day: localDate(), weight_kg: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [visibleWeights, setVisibleWeights] = useState(12);
  const [tab, setTab] = useState("personal");
  const [editing, setEditing] = useState(false);
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
      if (!dirty.current) setForm(editableProfile(next.profile));
      else if (next.profile)
        setForm((current) => ({ ...current, activity_level: next.profile.activity_level }));
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
    const visible = () => {
      if (document.visibilityState === "visible") refresh();
    };
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
      if (hydrate) {
        dirty.current = false;
        setForm(editableProfile(next.profile));
        setEditing(false);
      }
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
    mutate(
      () =>
        send("/profile", "PUT", profilePayload({
          ...form,
          activity_level: data.profile?.activity_level ?? form.activity_level,
        })),
      "Profil salvat. Recomandarea si tinta automata au fost reevaluate.",
      true,
    );
  }
  const today = data?.today || localDate();
  const permissions = data?.edit_permissions || profilePermissions(data?.profile, today);
  function cancelEdit() {
    dirty.current = false;
    setForm(editableProfile(data.profile));
    setEditing(false);
    setError("");
    setMessage("");
  }
  const recommendation = data?.recommendation;
  const weights = data?.weights || [];
  const latest = weights[0];
  const chartWeights = weights.slice(0, 12).reverse();
  const chartMap = new Map(
    chartWeights.map((item) => [item.day, item.weight_kg]),
  );
  // Keep real date spacing, even when measurements are months apart.
  const chartPoints = chartWeights.length
    ? dayList(chartWeights[0].day, chartWeights.at(-1).day).map((day) => ({
        day,
        value: chartMap.get(day) ?? null,
      }))
    : [];

  return (
    <main className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1 text-3xl">Profilul meu</h1>
          <p className="text-muted">
            {user.displayName || "Cont ATHLETICA"}
            {user.email && ` · ${user.email}`}
          </p>
        </div>
      </header>
      <SectionTabs
        label="Sectiuni profil"
        idPrefix="profile"
        value={tab}
        onChange={setTab}
        items={[
          ["personal", "Date personale și obiectiv"],
          ["energy", "Energia și activitatea zilnică"],
          ["weight", "Greutate și progres"],
        ]}
      />
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-400/30 bg-red-950/40 p-3 text-red-200"
        >
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      {!data ? (
        <p role="status">
          {error
            ? "Profilul nu a putut fi incarcat. Reincearca actualizarea."
            : "Se incarca profilul..."}
        </p>
      ) : (
        <>
          <div
            id="profile-panel-personal"
            role="region"
            aria-labelledby="profile-tab-personal"
            hidden={tab !== "personal"}
            className={tab === "personal" ? "space-y-3" : "hidden"}
          >
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <Metric
                label="Greutate actuala"
                value={`${formatValue(latest?.weight_kg)} kg`}
                detail={latest?.day}
              />
              <Metric
                label="Schimbare de la prima masuratoare"
                value={`${formatValue(data.weight_change_kg)} kg`}
                detail={weights.at(-1)?.day}
              />
              <Metric
                label="Mentinere estimata"
                value={`${formatValue(recommendation?.maintenance_kcal)} kcal/zi`}
              />
              <Metric
                label="Tinta activa in jurnal"
                value={`${formatValue(data.active_goal?.calories)} kcal/zi`}
                detail={
                  data.active_goal
                    ? `Din ${data.active_goal.effective_from} · ${data.active_goal.source === "profile" ? "din profil" : "manuala"}`
                    : "Nicio tinta activa"
                }
              />
            </div>

            <div className="grid items-start gap-3 xl:grid-cols-[1.3fr_1fr]">
              <ProfileSettings
                form={form}
                today={today}
                busy={busy}
                editing={!data.profile || editing}
                initialSetup={!data.profile}
                permissions={permissions}
                activitySummary={data.activity_summary || {
                  activity_level: recommendation.activity_level,
                  eligible_sessions_7: recommendation.training_sessions_7,
                }}
                startEdit={() => setEditing(true)}
                cancelEdit={cancelEdit}
                change={change}
                saveProfile={saveProfile}
              />

              <ProfileRecommendation
                recommendation={recommendation}
                data={data}
                isDirty={dirty.current}
              />
            </div>

            <MonthSummary today={today} revision={revision} />
          </div>

          <div
            id="profile-panel-energy"
            role="region"
            aria-labelledby="profile-tab-energy"
            hidden={tab !== "energy"}
            className={tab === "energy" ? "space-y-3" : "hidden"}
          >
            <EnergyPanel today={today} revision={revision} onSaved={refresh} />
          </div>

          <div
            id="profile-panel-weight"
            role="region"
            aria-labelledby="profile-tab-weight"
            hidden={tab !== "weight"}
            className={tab === "weight" ? "space-y-3" : "hidden"}
          >
            <WeightProgress
              data={data}
              today={today}
              weight={weight}
              setWeight={setWeight}
              busy={busy}
              mutate={mutate}
              weights={weights}
              chartWeights={chartWeights}
              chartPoints={chartPoints}
              visibleWeights={visibleWeights}
              setVisibleWeights={setVisibleWeights}
              setMessage={setMessage}
            />
          </div>
        </>
      )}
    </main>
  );
}

export default function ProfileScreen() {
  const { user } = useAuth();
  return user ? <ProfileDashboard key={user.uid} user={user} /> : null;
}
