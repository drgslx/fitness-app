import React from "react";
import { formatValue } from "../../components/reports/periods";
import { panel, goalLabels } from "./constants";
export default function ProfileRecommendation({
  recommendation,
  data,
  isDirty,
}) {
  return (
    <section
      className={`${panel} space-y-3`}
      aria-labelledby="profile-estimate-title"
    >
      <h2 id="profile-estimate-title" className="text-xl">
        Recomandare estimata
      </h2>
      {isDirty && (
        <p className="text-sm text-amber-200">
          Calculul de mai jos foloseste datele salvate. Salveaza modificarile
          pentru recalculare.
        </p>
      )}
      {recommendation.available ? (
        <>
          <p className="text-sm text-muted">
            {goalLabels[recommendation.effective_goal]} · greutate din{" "}
            {recommendation.weight_day}
          </p>
          <p className="text-3xl font-bold text-accent">
            {formatValue(recommendation.target_kcal)}{" "}
            <span className="text-base">kcal/zi</span>
          </p>
          <p className="text-sm">
            Repaus estimat: {formatValue(recommendation.resting_kcal)} kcal.
            Mentinere: {formatValue(recommendation.maintenance_kcal)} kcal.
            {recommendation.adjustment_percent !== 0 &&
              ` Ajustare: ${recommendation.adjustment_percent > 0 ? "+" : ""}${recommendation.adjustment_percent}%.`}
          </p>
          {recommendation.options.length > 1 && (
            <div className="overflow-x-auto">
              <table className="text-sm">
                <caption className="pb-2 text-left text-muted">
                  Comparatie la aceleasi date personale
                </caption>
                <thead>
                  <tr>
                    <th>Ajustare</th>
                    <th>kcal/zi</th>
                    {recommendation.effective_goal === "lose" && (
                      <th>Echivalent / 30 zile*</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {recommendation.options.map((option) => (
                    <tr
                      key={option.percent}
                      className={
                        option.percent === recommendation.adjustment_percent
                          ? "bg-accent/10"
                          : ""
                      }
                    >
                      <td>
                        {option.percent > 0 ? "+" : ""}
                        {option.percent}%
                      </td>
                      <td>
                        {option.allowed
                          ? formatValue(option.calories)
                          : "Indisponibil"}
                      </td>
                      {recommendation.effective_goal === "lose" && (
                        <td>
                          {formatValue(option.energy_equivalent_kg_30_days)} kg
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {recommendation.effective_goal === "lose" && (
            <p className="text-xs text-muted">
              * Echivalent energetic simplificat (7.700 kcal/kg), nu o predictie
              a kilogramelor pierdute. Apa, compozitia corporala si adaptarea
              metabolica schimba evolutia reala.
            </p>
          )}
          {recommendation.warnings.map((warning) => (
            <p key={warning} className="text-sm text-amber-200">
              {warning}
            </p>
          ))}
        </>
      ) : (
        <p>{recommendation.reason}</p>
      )}
      <p className="text-sm text-accent">
        {recommendation.maintenance_source === "activity_average"
          ? "Baza: media activitatii inregistrate"
          : "Baza: estimare initiala; completeaza activitatea zilnica"}
      </p>
      <p className="text-xs text-muted">
        Estimare Mifflin–St Jeor. Dupa minimum 4 zile complete din ultimele 7,
        mentinerea foloseste media activitatii declarate. Pana atunci folosim
        factorul initial. Nevoile individuale pot diferi.
      </p>
      <p className="text-xs text-muted">
        {data.profile?.auto_calories
          ? "Sincronizare automata activata."
          : "Tinta din jurnal ramane manuala sau fixata la ultima valoare."}{" "}
        {data.active_goal?.protein
          ? `Tinta de proteine pastrata: ${formatValue(data.active_goal.protein)} g/zi.`
          : "Poti configura separat tinta de proteine in jurnal."}
      </p>
    </section>
  );
}
