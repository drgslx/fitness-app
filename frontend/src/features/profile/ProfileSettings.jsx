import React from "react";
import Button from "../../components/ui/Button";
import { activityOptions, panel } from "./constants";
import PersonalProfileFields from "./PersonalProfileFields";
export default function ProfileSettings({
  form,
  today,
  busy,
  editing,
  initialSetup,
  permissions,
  activitySummary,
  startEdit,
  cancelEdit,
  change,
  saveProfile,
}) {
  return (
    <section className={panel} aria-labelledby="profile-settings-title">
      <h2 id="profile-settings-title" className="text-xl">
        Date personale si obiectiv
      </h2>
      {initialSetup ? (
        <p className="text-sm text-muted">
          Completeaza profilul pentru prima data. Sexul, data nasterii si nivelul ales se pastreaza
          dupa salvare. Inaltimea poate fi actualizata doar pana la 18 ani.
        </p>
      ) : (
        <p className="text-sm text-muted">
          Sexul si data nasterii sunt stabilite la crearea profilului.
          Poti edita obiectivul{permissions.height_cm ? " si inaltimea, pana la 18 ani" : ""}.
        </p>
      )}
      {activitySummary && (
        <div className="mb-3 space-y-1" aria-label="Activitatea din ultimele 7 zile">
          <h3 className="text-lg">Nivel de activitate curent</h3>
          <p className="text-xl font-bold text-accent">
            Nivel stabilit automat
            {": "}{activityOptions.find(([value]) => value === activitySummary.activity_level)?.[1]}
          </p>
          <p className="text-xs text-muted">
            {activitySummary.eligible_sessions_7} antrenamente finalizate de peste{" "}
            {activitySummary.min_duration_minutes} minute in ultimele 7 zile
            {" ("}{activitySummary.start}{" – "}{activitySummary.end}{")."}
          </p>
          <p className="text-xs text-muted">
            Nivelul se actualizeaza automat dupa antrenamentele finalizate din acest
            interval. Fara antrenamente de peste 15 minute, nivelul este Sedentar.
          </p>
          {activitySummary.missing_duration_sessions > 0 && <p className="text-xs text-amber-200">
            {activitySummary.missing_duration_sessions} antrenamente fara durata nu intra
            in acest calcul. Completeaza durata lor in lista sesiunilor.
          </p>}
        </div>
      )}
      <form onSubmit={saveProfile}>
        <fieldset disabled={busy || !editing} className="border-0 p-0">
          <PersonalProfileFields
            form={form}
            today={today}
            change={change}
            permissions={permissions}
            initialSetup={initialSetup}
            activitySummary={activitySummary}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {form.goal === "lose" && (
              <label>
                Deficit caloric
                <select
                  value={form.deficit_percent}
                  onChange={(e) =>
                    change("deficit_percent", Number(e.target.value))
                  }
                >
                  <option value={10}>10% — usor</option>
                  <option value={15}>15% — moderat</option>
                  <option value={20}>20% — mai pronuntat, maxim</option>
                </select>
              </label>
            )}
            {form.goal === "gain" && (
              <label>
                Surplus caloric
                <select
                  value={form.surplus_percent}
                  onChange={(e) =>
                    change("surplus_percent", Number(e.target.value))
                  }
                >
                  <option value={5}>5% — conservator / avansati</option>
                  <option value={10}>10% — punct de pornire</option>
                  <option value={15}>15% — surplus mai mare</option>
                  <option value={20}>20% — maxim</option>
                </select>
              </label>
            )}
            {form.goal !== "maintain" && (
              <label>
                Greutate tinta (kg, optional)
                <input
                  type="number"
                  min="25"
                  max="400"
                  step="0.1"
                  value={form.target_weight_kg}
                  onChange={(e) => change("target_weight_kg", e.target.value)}
                />
              </label>
            )}
          </div>
          <p className="text-xs text-muted">
            Nivelul curent se stabileste dupa antrenamentele finalizate de peste
            15 minute in ultimele 7 zile. Estimarea nu masoara direct necesarul caloric.
          </p>
          {form.goal === "gain" && (
            <p className="text-xs text-muted">
              Pentru culturism, literatura descrie aproximativ 10–20% la
              incepatori/intermediari si o abordare mai conservatoare la
              avansati. Incepe prudent si ajusteaza dupa evolutia masurata.{" "}
              <a
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6680710/"
                target="_blank"
                rel="noreferrer"
              >
                Sursa
              </a>
            </p>
          )}
          <p className="text-sm text-muted">Setari pentru calculul si sincronizarea caloriilor</p>
          <label className="flex items-start gap-2">
            <input
              className="mt-1 shrink-0"
              type="checkbox"
              checked={form.pregnant_or_breastfeeding}
              onChange={(e) =>
                change("pregnant_or_breastfeeding", e.target.checked)
              }
            />
            Sarcina sau alaptare — opreste estimarea automata
          </label>
          <label className="flex items-start gap-2">
            <input
              className="mt-1 shrink-0"
              type="checkbox"
              checked={form.auto_calories}
              onChange={(e) => change("auto_calories", e.target.checked)}
            />
            Sincronizeaza automat tinta calorica in jurnal
          </label>
          <p className="text-xs text-muted">
            La salvarea profilului sau greutatii, tinta se aplica de azi.
            Corectiile din aceeasi zi actualizeaza tinta zilei. Zilele trecute
            raman in istoric. O tinta manuala din jurnal opreste sincronizarea.
          </p>
          {editing && (
            <Button type="submit">
              {busy ? "Se salveaza..." : "Salveaza profilul"}
            </Button>
          )}
        </fieldset>
        {!editing && (
          <Button type="button" disabled={busy} onClick={startEdit}>
            Editeaza profilul
          </Button>
        )}
        {editing && !initialSetup && (
          <Button type="button" variant="secondary" className="mt-2" disabled={busy} onClick={cancelEdit}>
            Anuleaza
          </Button>
        )}
      </form>
    </section>
  );
}
