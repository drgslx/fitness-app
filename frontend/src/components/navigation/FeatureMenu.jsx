import React, { useEffect, useId, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export const navLinkClass = ({ isActive }) =>
  `nav-link ${isActive ? "nav-link-active" : ""}`;

export default function FeatureMenu({ label, pathPrefix, items }) {
  const { pathname } = useLocation();
  const ref = useRef(null);
  const trigger = useRef(null);
  const id = useId();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const outside = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  return (
    <div
      ref={ref}
      className="relative min-w-0"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className={`nav-link w-full justify-between ${pathname.startsWith(pathPrefix) ? "nav-link-active" : ""}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <span
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          ⌄
        </span>
      </button>
      {open && (
        <div
          id={id}
          className="mt-1 grid gap-1 rounded-xl border border-white/15 bg-surface p-2 lg:absolute lg:right-0 lg:top-full lg:z-50 lg:w-72 lg:shadow-xl"
        >
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              <span className="min-w-0">
                <strong className="block">{item.title}</strong>
                <small className="block text-xs opacity-80">
                  {item.description}
                </small>
              </span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
