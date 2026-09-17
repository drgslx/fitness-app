import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function WorkoutsPage() {
  return (
    <main>
      <h1>Antrenamente</h1>
      <p>Alege sesiunile zilnice sau configureaza sporturile si exercitiile.</p>

      <div className="actions">
        <NavLink to="/workouts/sessions">Sesiuni</NavLink>
        <NavLink to="/workouts/catalog">Catalog sporturi</NavLink>
      </div>

      <Outlet />
    </main>
  );
}
