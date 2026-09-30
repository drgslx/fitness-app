import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";

const features = [
  {
    icon: "training",
    title: "Planifică antrenamentele",
    text:
      "Alege un sport, creează-ți programul și adaptează-l obiectivelor tale.",
    to: "/workouts/sessions",
  },
  {
    icon: "food",
    title: "Urmărește alimentația",
    text: "Adaugă mese, calculează calorii și urmărește nutrienții din jurnal.",
    to: "/nutrition",
  },
  {
    icon: "progress",
    title: "Vezi-ți progresul",
    text: "Greutate, activitate și obiective. Toate într-un singur loc.",
    to: "/profile",
  },
  {
    icon: "book",
    title: "Citește articole",
    text: "Informații despre antrenament, nutriție și recuperare.",
    to: "/articles",
  },
];

function Icon({ name, className = "h-5 w-5" }) {
  const paths = {
    training: (
      <>
        <path d="M6 7v10M3 9v6m15-8v10m3-8v6M6 12h12" />
      </>
    ),
    food: (
      <>
        <path d="M4 3v5a3 3 0 0 0 6 0V3M7 3v18m12 0V3c-4 3-4 10 0 10" />
      </>
    ),
    progress: (
      <>
        <path d="M5 20v-6m7 6V9m7 11V4" strokeWidth="3" />
      </>
    ),
    book: (
      <>
        <path d="M12 5v15m0-15C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
  };
  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const pill =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

function ProgressPreview() {
  return (
    <div className="relative min-w-0 rounded-2xl border border-white/10 bg-[#172322]/90 p-4 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-bold text-white">Progresul meu</span>
        <span className="rounded-full border border-white/15 px-2 py-1 text-[10px] text-muted">
          Previzualizare ilustrativă
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["user", "Greutate"],
          ["training", "Sesiuni"],
          ["food", "Calorii"],
        ].map(([icon, label]) => (
          <div
            key={label}
            className="rounded-lg border border-white/5 bg-white/5 p-2"
          >
            <Icon name={icon} className="mb-1 h-4 w-4 text-accent" />
            <span className="block text-xs font-semibold text-white">
              {label}
            </span>
            <span className="text-[10px] text-muted">Din profilul tău</span>
          </div>
        ))}
      </div>
      <svg
        className="mt-3 h-28 w-full"
        viewBox="0 0 300 110"
        role="img"
        aria-label="Ilustrație a unui grafic de progres, fără date personale"
      >
        {[20, 45, 70, 95].map((y) => (
          <path key={y} d={`M0 ${y}H300`} stroke="#ffffff0c" />
        ))}
        <path
          d="M0 22 18 35 34 39 50 34 67 50 85 52 100 47 118 62 135 60 151 71 170 68 188 82 205 76 222 84 240 80 257 89 275 85 300 93V110H0Z"
          fill="#72f29c0c"
        />
        <path
          d="M0 22 18 35 34 39 50 34 67 50 85 52 100 47 118 62 135 60 151 71 170 68 188 82 205 76 222 84 240 80 257 89 275 85 300 93"
          fill="none"
          stroke="#9df5b7"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <Link to="/profile" className="text-xs font-semibold">
        Descoperă profilul tău <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const accountPath = user ? "/profile" : "/login";
  return (
    <main className="w-full max-w-[1600px] overflow-hidden px-4 pb-6 pt-0 md:w-full md:px-6 md:pb-8 md:pt-0 lg:px-10">
      <section
        aria-labelledby="home-title"
        className="relative isolate grid items-center lg:min-h-[420px] lg:grid-cols-[.9fr_1.3fr] xl:min-h-[450px]"
      >
        <div className="relative z-10 py-8 lg:-mr-20 lg:py-10">
          <p className="mb-3 text-[10px] font-semibold uppercase leading-5 tracking-[.3em] text-[#9cbdad]">
            Mai mult decât un plan.
            <br />
            Un tu mai puternic.
          </p>
          <h1
            id="home-title"
            className="mb-3 max-w-[600px] text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.02] font-bold tracking-[-.045em]"
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
              className={`${pill} border-white/10 bg-[#182724] text-copy hover:border-accent/50`}
            >
              <Icon name="user" className="h-4 w-4" />
              {user ? "Profilul meu" : "Intră în cont"}
            </Link>
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-[#9baea4]">
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

      <section
        aria-labelledby="features-title"
        className="relative mt-3 grid gap-5 rounded-2xl border border-white/5 bg-gradient-to-br from-[#162723] to-[#0c1612] p-5 sm:p-6 lg:grid-cols-[.85fr_1.25fr_1.05fr] lg:gap-5 lg:p-7"
      >
        <div>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[.3em] text-[#80b495]">
            Funcționalități principale
          </p>
          <h2
            id="features-title"
            className="mb-3 text-2xl leading-[1.12] tracking-tight xl:text-[26px]"
          >
            Tot ce ai nevoie
            <br />
            pentru un stil de viață
            <br />
            <span className="text-[#a1e9b8]">mai sănătos</span>
          </h2>
          <p className="max-w-sm text-xs leading-5 text-muted">
            ATHLETICA îți oferă instrumente pentru antrenament, alimentație,
            progres și educație, ca să îți atingi obiectivele mai ușor și mai
            rapid.
          </p>
          <Link
            to={accountPath}
            className={`${pill} mt-4 border-accent bg-accent text-ink hover:bg-[#a0f8b9] hover:text-ink`}
          >
            {user ? "Deschide profilul" : "Începe acum"}{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="grid min-w-0 gap-2 sm:grid-cols-2">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.to}
              className="flex items-start gap-3 rounded-xl border border-white/5 bg-[#1a2b2a]/70 p-3 text-copy no-underline transition-colors hover:border-accent/30 hover:bg-[#203631]"
            >
              <span className="rounded-xl bg-accent/10 p-2 text-accent">
                <Icon name={feature.icon} />
              </span>
              <div className="min-w-0 pt-1">
                <h3 className="mb-1 font-sans text-xs font-bold leading-4">
                  {feature.title}
                </h3>
                <p className="text-[11px] leading-4 text-muted">
                  {feature.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="relative isolate min-w-0 self-center">
          <img
            src="/images/home/athletica-hero-640.jpg"
            width="640"
            height="427"
            loading="lazy"
            decoding="async"
            alt=""
            className="pointer-events-none absolute -right-4 -bottom-3 -z-10 h-full w-3/4 rounded-xl object-cover object-right opacity-20"
          />
          <ProgressPreview />
          <p className="mt-3 text-right text-xs italic text-muted">
            „Disciplina azi, rezultate mâine.”
          </p>
        </div>
      </section>
    </main>
  );
}
