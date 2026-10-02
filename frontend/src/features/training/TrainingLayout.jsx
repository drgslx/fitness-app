import React from "react";
import { Outlet } from "react-router-dom";
import RouteTabs from "../../components/ui/RouteTabs";
export default function TrainingLayout() {
  return (
    <main>
      <header>
        <h1>Antrenamente</h1>
        <p className="text-sm text-muted">
          Alege sesiunile zilnice sau configureaza sporturile si exercitiile.
        </p>
      </header>
      <RouteTabs
        label="Sectiuni antrenamente"
        items={[
          ["/workouts/sessions", "Sesiuni"],
          ["/workouts/catalog", "Catalog sporturi"],
          ["/workouts/sports/new", "Adauga sport"],
          ["/workouts/reports", "Rapoarte"],
        ]}
      />
      <Outlet />
    </main>
  );
}
