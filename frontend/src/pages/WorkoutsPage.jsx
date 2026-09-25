import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function tabClass({ isActive }) {
  return `workout-tab${isActive ? " selected" : ""}`;
}

export default function WorkoutsPage() {
  return (
    <main>
      <section className="workouts-heading">
        <h1>Antrenamente</h1>

        <p>
          Alege sesiunile zilnice sau configureaza sporturile si exercitiile.
        </p>

        <nav className="workout-tabs" aria-label="Sectiuni antrenamente">
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