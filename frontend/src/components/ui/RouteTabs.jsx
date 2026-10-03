import React from "react";
import { NavLink } from "react-router-dom";

export default function RouteTabs({ items, label }) {
  return (
    <nav className="section-tabs" aria-label={label}>
      {items.map(([to, title]) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `tab ${isActive ? "tab-active" : ""}`}
        >
          {title}
        </NavLink>
      ))}
    </nav>
  );
}
