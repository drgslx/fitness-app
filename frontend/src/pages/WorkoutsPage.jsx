import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function tabClass({ isActive }) {
  return `inline-flex min-h-10 items-center justify-center rounded-lg border border-[#315044] bg-[#14261d] px-4 py-2 font-semibold text-copy no-underline hover:border-accent hover:bg-[#193329] hover:text-accent ${isActive ? "!border-accent !bg-accent !text-ink hover:!bg-[#8affad] hover:!text-ink" : ""}`;
}

export default function WorkoutsPage() {
  return (
    <main>
      <section className="space-y-2">
        <h1>Antrenamente</h1>

        <p>
          Alege sesiunile zilnice sau configureaza sporturile si exercitiile.
        </p>

        <nav className="mt-4 flex flex-wrap gap-2" aria-label="Sectiuni antrenamente">
          <NavLink
            to="/workouts/sessions"
            className={tabClass}
          >
            Sesiuni
          </NavLink>

          <NavLink
            to="/workouts/catalog"
            className={tabClass}
          >
            Catalog sporturi
          </NavLink>

          <NavLink
            to="/workouts/sports/new"
            className={tabClass}
          >
            Adauga sport
          </NavLink>
          <NavLink
            to="/workouts/reports"
            className={tabClass}
          >
            Rapoarte
          </NavLink>
        </nav>
      </section>

      <Outlet />
    </main>
  );
}