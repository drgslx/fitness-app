import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function NutritionPage() {
  return (
    <main>
      <h1>Alimentatie</h1>
      <p>Urmareste mesele, obiectivele si alimentele tale intr-un catalog comun.</p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <NavLink className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 font-semibold text-ink no-underline transition-colors hover:bg-[#8cf7ac] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" to="/nutrition/journal">Jurnal nutritional</NavLink>
        <NavLink className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 font-semibold text-ink no-underline transition-colors hover:bg-[#8cf7ac] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" to="/nutrition/recipes">Retete</NavLink>
        <NavLink className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 font-semibold text-ink no-underline transition-colors hover:bg-[#8cf7ac] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" to="/nutrition/foods/new">Adauga aliment</NavLink>
      </div>

      <Outlet />
    </main>
  );
}
