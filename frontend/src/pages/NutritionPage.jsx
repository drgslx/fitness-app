import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function NutritionPage() {
  return (
    <main>
      <h1>Alimentatie</h1>
      <p>Urmareste mesele, obiectivele si alimentele tale intr-un catalog comun.</p>

      <div className="hero-actions">
        <NavLink className="button" to="/nutrition/journal">Jurnal nutritional</NavLink>
        <NavLink className="button" to="/nutrition/foods/new">Adauga aliment</NavLink>
      </div>

      <Outlet />
    </main>
  );
}
