import { Link } from "react-router-dom";
import React from "react";


export default function HomePage() {
  return (
    <main className="min-h-[60vh]">
      <section className="max-w-[900px] py-9 md:py-12 [&_h1]:max-w-[900px] [&_h1]:text-5xl [&_h1]:tracking-tight md:[&_h1]:text-7xl [&_p]:max-w-[700px] [&_p]:text-muted">
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

          <Link className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent bg-accent px-4 py-2 font-semibold text-ink no-underline transition-colors hover:bg-[#8cf7ac] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" to="/login">
            Conectare
          </Link>
        </div>
      </section>
    </main>
  );
}