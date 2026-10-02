import SectionTabs from "../../components/ui/SectionTabs";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FoodAttribution } from "../../components/FoodSearch";
import FoodDetails from "../../components/foods/FoodDetails";
import NutritionProgressPanel from "./NutritionProgressPanel";
import useNutritionJournal from "./hooks/useNutritionJournal";
import NutritionDiaryPanel from "./components/NutritionDiaryPanel";
import NutritionFoodCatalog from "./components/NutritionFoodCatalog";

const tabs = [
  ["diary", "Jurnal zilnic"],
  ["foods", "Catalog alimente"],
  ["goals", "Obiective"],
  ["reports", "Rapoarte"],
];

export default function JournalScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("diary");
  const journal = useNutritionJournal();
  return (
    <section className="min-w-0 space-y-4">
      <p className="text-sm text-muted">
        Produse per 100 g, portii in grame si obiective cu istoric.
      </p>
      <SectionTabs
        label="Sectiuni nutritie"
        items={tabs}
        value={tab}
        onChange={(key) =>
          key === "goals" ? navigate("/profile") : setTab(key)
        }
      />
      {journal.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-400/30 bg-[#321a18] px-3 py-2 text-sm text-[#ffaaaa]"
        >
          {journal.error}
        </p>
      )}
      <FoodAttribution />
      {tab === "diary" && <NutritionDiaryPanel journal={journal} />}
      {tab === "foods" && (
        <NutritionFoodCatalog
          day={journal.day}
          meal={journal.entry.meal}
          onAdded={journal.loadDiary}
        />
      )}
      {tab === "reports" && <NutritionProgressPanel />}
      {journal.details && (
        <FoodDetails
          food={journal.details.snapshot}
          grams={journal.details.grams}
          historical
          onClose={() => journal.setDetails(null)}
        />
      )}
    </section>
  );
}
