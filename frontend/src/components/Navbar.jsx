import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, useAuth } from "../auth";
import FeatureMenu, { navLinkClass } from "./navigation/FeatureMenu";
import { trainingItems, nutritionItems } from "./navigation/items";

export default function Navbar() {
  const { user, admin } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const nav = useRef(null);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const close = (event) => {
      if (!nav.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return (
    <>
      <a
        href="#page-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-ink focus:p-3"
      >
        Sari la continut
      </a>
      <nav
        ref={nav}
        aria-label="Navigare principala"
        className="sticky top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur-lg"
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            setOpen(false);
            trigger.current?.focus();
          }
        }}
      >
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8 2xl:max-w-[1800px]">
          <Link
            className="py-2 font-display text-lg font-bold tracking-widest text-accent no-underline"
            to="/"
          >
            ATHLETICA
          </Link>
          <button
            ref={trigger}
            type="button"
            className="btn btn-secondary lg:hidden"
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true">{open ? "✕" : "☰"}</span>
            {open ? "Inchide meniul" : "Meniu"}
          </button>
          <div
            id="main-navigation"
            className={`${open ? "flex" : "hidden"} max-h-[calc(100dvh-76px)] w-full flex-col gap-1 overflow-y-auto pb-2 lg:flex lg:w-auto lg:flex-row lg:items-center lg:overflow-visible lg:pb-0`}
          >
            <NavLink to="/articles" className={navLinkClass}>
              Articole
            </NavLink>
            <FeatureMenu
              label="Antrenamente"
              pathPrefix="/workouts"
              items={trainingItems}
            />
            <FeatureMenu
              label="Alimentatie"
              pathPrefix="/nutrition"
              items={nutritionItems}
            />
            {admin && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            )}
            {user && (
              <NavLink to="/profile" className={navLinkClass}>
                Profil
              </NavLink>
            )}
            {user ? (
              <button
                type="button"
                className="nav-link"
                onClick={() => signOut(auth)}
              >
                Deconectare
              </button>
            ) : (
              <NavLink to="/login" className={navLinkClass}>
                Autentificare
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
