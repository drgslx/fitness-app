import React from "react";
import Button from "../../components/ui/Button";
import { panel, goalLabels, activityOptions } from "./constants";
export default function ProfileSettings({
  form,
  today,
  busy,
  change,
  saveProfile,
}) {
  return (
    <section className={panel} aria-labelledby="profile-settings-title">
      <h2 id="profile-settings-title" className="text-xl">
        Date personale si obiectiv
      </h2>
      <form onSubmit={saveProfile}>
        <fieldset disabled={busy} className="border-0 p-0">
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              Sex folosit in calcul
              <select
                required
                value={form.sex}
                onChange={(e) => change("sex", e.target.value)}
              >
                <option value="">Alege</option>
                <option value="female">Femeie</option>
                <option value="male">Barbat</option>
              </select>
            </label>
            <label>
              Data nasterii
              <input
                type="date"
                required
                max={today}
                value={form.birth_date}
                onChange={(e) => change("birth_date", e.target.value)}
              />
            </label>
            <label>
              Inaltime (cm)
              <input
                type="number"
                required
                min="100"
                max="250"
                step="0.1"
                placeholder="176"
                value={form.height_cm}
                onChange={(e) => change("height_cm", e.target.value)}
              />
            </label>
            <label>
              Obiectiv
              <select
                aria-label="Obiectiv"
                value={form.goal}
                onChange={(e) => change("goal", e.target.value)}
              >
                {Object.entries(goalLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="sm:col-span-2">
              Activitate initiala (doar fallback)
              <select
                required
                value={form.activity_level}
                onChange={(e) => change("activity_level", e.target.value)}
              >
                <option value="">Alege nivelul aproximativ</option>
                {activityOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
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
            Alege activitatea totala, inclusiv mersul si munca zilnica.
            Frecventa salii este doar un reper; necesarul nu este masurat
            direct.
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
          <Button type="submit">
            {busy ? "Se salveaza..." : "Salveaza profilul"}
          </Button>
        </fieldset>
      </form>
    </section>
  );
}
