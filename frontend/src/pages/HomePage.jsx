import { Link } from "react-router-dom";
import { useAuth } from "../auth";


import React from "react";


export default function HomePage() {
  const { user } = useAuth();
  return (
    <main className="min-h-[60vh]">
      <section className="max-w-225 py-9 md:py-12 [&_h1]:max-w-225 [&_h1]:text-5xl [&_h1]:tracking-tight md:[&_h1]:text-7xl [&_p]:max-w-175 [&_p]:text-muted">
        <p>SPORT • NUTRITIE • PROGRES</p>

        <h1>Construieste-ti progresul cu ATHLETICA</h1>

        <p>
          Citeste articole, planifica antrenamentele si urmareste alimentatia
          intr-un singur loc.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 font-semibold text-ink no-underline transition-colors hover:bg-[#8cf7ac] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" to="/workouts/sessions">
            Antrenamente
          </Link>

          <Link className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 font-semibold text-ink no-underline transition-colors hover:bg-[#8cf7ac] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" to="/nutrition">
            Alimentatie
          </Link>

          <Link className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 font-semibold text-ink no-underline transition-colors hover:bg-[#8cf7ac] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" to="/articles">
            Articole
          </Link>
          {!user && (
            <Link className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 font-semibold text-ink no-underline transition-colors hover:bg-[#8cf7ac] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" to="/login">
              Conectare
            </Link>
          )}

          {/*  DE ADAUGAT DUPA CE USER PROFILUL ESTE CREAT
          {user && (
            <Link className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 font-semibold text-ink no-underline transition-colors hover:bg-[#8cf7ac] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" to="/profile">
              Profil
            </Link>
          )}
          */}
          
        </div>
      </section>
    </main>
  );
}