import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, useAuth } from "../auth";

function navItemClass({ isActive }) {
  return `inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm font-medium text-[#d7dfd9] no-underline transition-colors hover:border-accent/30 hover:bg-[#203629] hover:text-white focus-visible:outline-2 focus-visible:outline-accent ${isActive ? "!border-accent !bg-accent !text-ink hover:!bg-[#8affad] hover:!text-ink" : ""}`;
}

function FeatureMenu({ label, pathPrefix, items }) {
  const location = useLocation();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const selected = location.pathname.startsWith(pathPrefix);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    function closeOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target))
        setOpen(false);
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
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm font-medium text-[#d7dfd9] no-underline transition-colors hover:border-accent/30 hover:bg-[#203629] hover:text-white focus-visible:outline-2 focus-visible:outline-accent ${selected ? "!border-accent !bg-accent !text-ink hover:!bg-[#8affad] hover:!text-ink" : ""}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        {label}
        <span className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}>v</span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-[1000] flex w-[min(300px,calc(100vw-32px))] flex-col gap-1 rounded-xl border border-white/15 bg-[#14221a] p-2 shadow-2xl [&_a]:flex [&_a]:w-full [&_a]:flex-col [&_a]:items-start [&_a]:text-left [&_small]:text-xs [&_small]:text-muted" role="menu">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={navItemClass}
              role="menuitem"
            >
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
    <nav className="sticky top-0 z-50 flex min-h-[64px] flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#09100cee] px-4 py-2 backdrop-blur-lg md:px-[5vw]">
      <Link className="font-bold tracking-[.12em] text-accent no-underline" to="/">
        ATHLETICA
      </Link>

      <div className="flex flex-wrap items-center gap-1">
        <NavLink to="/articles" className={navItemClass}>
          Articole
        </NavLink>

        <FeatureMenu
          label="Antrenamente"
          pathPrefix="/workouts"
          items={[
            {
              to: "/workouts/sessions",
              title: "Sesiuni",
              description: "Planuri si istoric",
            },
            {
              to: "/workouts/catalog",
              title: "Catalog sporturi",
              description: "Sporturi si exercitii aferente",
            },
            {
              to: "/workouts/reports",
              title: "Rapoarte",
              description: "Progresul exercitiilor pe saptamana sau luna",
            },
            {
              to: "/workouts/sports/new",
              title: "Adauga sport",
              description: "Creeaza un nou sport in catalog",
            },
            {
              to: "/workouts/sessions/new",
              title: "Adauga sesiune",
              description: "Creeaza o noua sesiune in catalog",
            },
          ]}
        />

        <FeatureMenu
          label="Alimentatie"
          pathPrefix="/nutrition"
          items={[
            {
              to: "/nutrition/journal",
              title: "Jurnal nutritional",
              description: "Jurnal, catalog, obiective si rapoarte",
            },
            {
              to: "/nutrition/recipes",
              title: "Retete",
              description: "Ingrediente, portii si gramaj gatit",
            },
            {
              to: "/nutrition/foods/new",
              title: "Adauga aliment",
              description: "Creeaza un aliment in catalog",
            },
            {
              to: "/nutrition/reports",
              title: "Rapoarte nutritionale",
              description: "Calorii, nutrienti si comparatii intre perioade",
            },
          ]}
        />

        {admin && (
          <NavLink to="/admin" className={navItemClass}>
            Admin
          </NavLink>
        )}

        {user ? (
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm font-medium text-[#d7dfd9] no-underline transition-colors hover:border-accent/30 hover:bg-[#203629] hover:text-white focus-visible:outline-2 focus-visible:outline-accent"
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
