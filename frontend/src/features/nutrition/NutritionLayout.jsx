import React from "react";
import { Outlet } from "react-router-dom";
import RouteTabs from "../../components/ui/RouteTabs";
export default function NutritionLayout() {
  return (
    <main>
      <header>
        <h1>Alimentatie</h1>
        <p className="text-sm text-muted">
          Urmareste mesele, obiectivele si alimentele tale intr-un catalog
          comun.
        </p>
      </header>
      <RouteTabs
        label="Sectiuni alimentatie"
        items={[
          ["/nutrition/journal", "Jurnal nutritional"],
          ["/nutrition/recipes", "Retete"],
          ["/nutrition/foods/new", "Adauga aliment"],
        ]}
      />
      <Outlet />
    </main>
  );
}
