import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, useAuth } from "../auth";
import "../navbar.css";

function navItemClass({ isActive }) {
  return `navbar-item${isActive ? " selected" : ""}`;
}

function WorkoutsMenu() {
  const location = useLocation();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const workoutsSelected = location.pathname.startsWith("/workouts");

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function closeOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
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
        className={`navbar-item navbar-workouts-trigger${
          workoutsSelected ? " selected" : ""
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        Antrenamente
        <span className={`navbar-chevron${open ? " open" : ""}`}>v</span>
      </button>

      {open && (
        <div className="navbar-workouts-menu" role="menu">
          <NavLink to="/workouts/sessions" className={navItemClass} role="menuitem">
            <strong>Sesiuni</strong>
            <small>Planuri si istoric</small>
          </NavLink>

          <NavLink to="/workouts/catalog" className={navItemClass} role="menuitem">
            <strong>Catalog sporturi</strong>
            <small>Sporturi si exercitii aferente</small>
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, admin } = useAuth();

  return (
    <nav className="app-navbar">
      <Link className="navbar-brand" to="/">
        ATHLETICA
      </Link>

      <div className="navbar-links">
        <NavLink to="/articles" className={navItemClass}>
          Articole
        </NavLink>

        <WorkoutsMenu />

        <NavLink to="/nutrition" className={navItemClass}>
          Alimentatie
        </NavLink>

        {admin && (
          <NavLink to="/admin" className={navItemClass}>
            Admin
          </NavLink>
        )}

        {user ? (
          <button
            type="button"
            className="navbar-item navbar-signout"
            onClick={() => signOut(auth)}
          >
            Deconectare
          </button>
        ) : (
          <NavLink to="/login" className={navItemClass}>
            Autentificare
          </NavLink>
        )}
      </div>
    </nav>
  );
}
