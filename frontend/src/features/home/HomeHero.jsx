import React from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/ui/Icon";
import { pill } from "./content";
export default function HomeHero({ user, accountPath }) {
  return (
    <section
      aria-labelledby="home-title"
      className="relative isolate grid items-center lg:min-h-[420px] lg:grid-cols-[.9fr_1.3fr] xl:min-h-[450px]"
    >
      <div className="relative z-10 py-8 lg:-mr-20 lg:py-10">
        <p className="mb-3 text-xs font-semibold uppercase leading-5 tracking-[.3em] text-[#9cbdad]">
          Mai mult decât un plan.
          <br />
          Un tu mai puternic.
        </p>
        <h1
          id="home-title"
          className="mb-3 max-w-[600px] text-[clamp(2rem,4.5vw,4.5rem)] leading-[1.02] font-bold tracking-[-.045em]"
        >
          Construiește-ți
          <br />
          progresul cu
          <br />
          <span className="text-accent">ATHLETICA</span>
        </h1>
        <p className="max-w-[420px] text-sm leading-6 text-[#a8b8b1] xl:text-base">
          Planifică antrenamente, urmărește alimentația
          <br className="hidden sm:block" /> și vezi-ți progresul — totul
          într-un singur loc.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/workouts/sessions"
            className={`${pill} border-accent bg-accent text-ink hover:bg-[#a0f8b9] hover:text-ink`}
          >
            <Icon name="training" className="h-4 w-4" />
            Antrenamente <span aria-hidden="true">→</span>
          </Link>
          <Link
            to="/nutrition"
            className={`${pill} border-white/10 bg-[#182724] text-copy hover:border-accent/50`}
          >
            <Icon name="food" className="h-4 w-4" />
            Alimentație
          </Link>
          <Link
            to="/articles"
            className={`${pill} border-white/10 bg-[#182724] text-copy hover:border-accent/50`}
          >
            <Icon name="book" className="h-4 w-4" />
            Articole
          </Link>
          <Link
            to={accountPath}
            className={`${pill} lg:hidden border-white/10 bg-[#182724] text-copy hover:border-accent/50`}
          >
            <Icon name="user" className="h-4 w-4" />
            {user ? "Profilul meu" : "Intră în cont"}
          </Link>
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#9baea4]">
          {[
            "Planuri personalizate",
            "Urmărire progres",
            "Rețete și nutriție",
            "Articole și sfaturi",
          ].map((label) => (
            <li key={label}>
              <span className="mr-1 text-accent" aria-hidden="true">
                ✓
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative -mx-4 aspect-[3/2] overflow-hidden rounded-t-2xl sm:mx-0 lg:-mr-10 lg:-ml-14 lg:aspect-auto lg:h-[420px] xl:h-[450px] lg:rounded-none">
        <img
          src="/images/home/athletica-hero-960.jpg"
          srcSet="/images/home/athletica-hero-640.jpg 640w, /images/home/athletica-hero-960.jpg 960w, /images/home/athletica-hero-1440.jpg 1440w"
          sizes="(min-width: 1600px) 900px, (min-width: 1024px) 60vw, 100vw"
          width="1440"
          height="960"
          alt="Antrenament cu gantere, un bol cu ingrediente proaspete și alergare în aer liber"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/5 bg-gradient-to-r from-ink to-transparent lg:block" />
      </div>
    </section>
  );
}
