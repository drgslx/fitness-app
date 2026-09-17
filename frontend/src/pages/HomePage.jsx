import { Link } from "react-router-dom";
import React from "react";


export default function HomePage() {
  return (
    <main className="home-page">
      <section className="hero">
        <p>SPORT • NUTRITIE • PROGRES</p>

        <h1>Construieste-ti progresul cu ATHLETICA</h1>

        <p>
          Citeste articole, planifica antrenamentele si urmareste alimentatia
          intr-un singur loc.
        </p>

        <div className="hero-actions">
          <Link className="button" to="/workouts/sessions">
            Antrenamente
          </Link>

          <Link className="button" to="/nutrition">
            Alimentatie
          </Link>

          <Link className="button" to="/articles">
            Articole
          </Link>
        </div>
      </section>
    </main>
  );
}