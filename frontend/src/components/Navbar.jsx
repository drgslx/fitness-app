import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, useAuth } from "../auth";
import "../navbar.css";

function navItemClass({ isActive }) {
  return `navbar-item${isActive ? " selected" : ""}`;
}

function FeatureMenu({ label, pathPrefix, items }) {
  const location = useLocation();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const selected = location.pathname.startsWith(pathPrefix);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    function closeOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
    }
    function closeWithEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, []);

  return (
    <div className="navbar-workouts" ref={containerRef}>
      <button
        type="button"
        className={`navbar-item navbar-workouts-trigger${selected ? " selected" : ""}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        {label}
        <span className={`navbar-chevron${open ? " open" : ""}`}>v</span>
      </button>

      {open && (
        <div className="navbar-workouts-menu" role="menu">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={navItemClass} role="menuitem">
              <strong>{item.title}</strong>
              <small>{item.description}</small>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, admin } = useAuth();

  return (
    <nav className="app-navbar">
      <Link className="navbar-brand" to="/">ATHLETICA</Link>

      <div className="navbar-links">
        <NavLink to="/articles" className={navItemClass}>Articole</NavLink>

        <FeatureMenu
          label="Antrenamente"
          pathPrefix="/workouts"
          items={[
            { to: "/workouts/sessions", title: "Sesiuni", description: "Planuri si istoric" },
            { to: "/workouts/catalog", title: "Catalog sporturi", description: "Sporturi si exercitii aferente" },
            { to: "/workouts/sports/new", title: "Adauga sport", description: "Creeaza un nou sport in catalog" },
            { to: "/workouts/sessions/new", title: "Adauga sesiune", description: "Creeaza o noua sesiune in catalog" },
          ]}
        />

        <FeatureMenu
          label="Alimentatie"
          pathPrefix="/nutrition"
          items={[
            { to: "/nutrition/journal", title: "Jurnal nutritional", description: "Jurnal, catalog, obiective si rapoarte" },
            { to: "/nutrition/recipes", title: "Retete", description: "Ingrediente, portii si gramaj gatit" },
            { to: "/nutrition/foods/new", title: "Adauga aliment", description: "Creeaza un aliment in catalog" },
          ]}
        />

        {admin && <NavLink to="/admin" className={navItemClass}>Admin</NavLink>}

        {user ? (
          <button type="button" className="navbar-item navbar-signout" onClick={() => signOut(auth)}>
            Deconectare
          </button>
        ) : (
          <NavLink to="/login" className={navItemClass}>Autentificare</NavLink>
        )}
      </div>
    </nav>
  );
}
