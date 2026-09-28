import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";

const features = [
  {
    icon: "🏋️",
    title: "Planifică antrenamentele",
    description:
      "Creează sesiuni, urmărește exercițiile și construiește un program adaptat obiectivelor tale.",
  },
  {
    icon: "🍽️",
    title: "Urmărește alimentația",
    description:
      "Adaugă mese, urmărește caloriile și macronutrienții și păstrează totul într-un singur loc.",
  },
  {
    icon: "📈",
    title: "Vezi-ți progresul",
    description:
      "Monitorizează greutatea, activitatea și evoluția în timp prin date și statistici clare.",
  },
  {
    icon: "📚",
    title: "Citește articole",
    description:
      "Accesează informații despre antrenament, nutriție, recuperare și progres.",
  },
];

const progressBars = [
  72,
  68,
  63,
  66,
  59,
  55,
  58,
  49,
  46,
  43,
  39,
  36,
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="pointer-events-none absolute left-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.4fr]">
          {/* HERO COPY */}
          <div className="relative z-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-accent sm:text-sm">
              Mai mult decât un plan.
              <br />
              Un tu mai puternic.
            </p>

            <h1 className="max-w-[680px] text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
              Construiește-ți
              <br />
              progresul cu
              <br />
              <span className="text-accent">ATHLETICA</span>
            </h1>

            <p className="mt-6 max-w-[650px] text-lg leading-8 text-muted sm:text-xl">
              Planifică antrenamentele, urmărește alimentația și vezi-ți
              progresul — totul într-un singur loc.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/workouts/sessions"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-accent bg-accent px-5 py-3 font-semibold text-ink no-underline transition duration-200 hover:-translate-y-0.5 hover:bg-[#8cf7ac] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span aria-hidden="true">🏋️</span>
                Antrenamente
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                to="/nutrition"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white no-underline transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
              >
                <span aria-hidden="true">🍽️</span>
                Alimentație
              </Link>

              <Link
                to="/articles"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white no-underline transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
              >
                <span aria-hidden="true">📖</span>
                Articole
              </Link>

              {!user ? (
                <Link
                  to="/login"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white no-underline transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
                >
                  <span aria-hidden="true">👤</span>
                  Intră în cont
                </Link>
              ) : (
                <Link
                  to="/profile"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white no-underline transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
                >
                  <span aria-hidden="true">👤</span>
                  Profil
                </Link>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <span className="text-accent">✓</span>
                Planuri personalizate
              </span>

              <span className="inline-flex items-center gap-2">
                <span className="text-accent">✓</span>
                Urmărire progres
              </span>

              <span className="inline-flex items-center gap-2">
                <span className="text-accent">✓</span>
                Nutriție
              </span>

              <span className="inline-flex items-center gap-2">
                <span className="text-accent">✓</span>
                Articole și sfaturi
              </span>
            </div>
          </div>

          {/* IMAGE CARDS */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* TRAINING */}
            <Link
              to="/workouts/sessions"
              className="group relative min-h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-surface no-underline shadow-2xl md:min-h-[500px]"
            >
              <img
                src="/images/home-training.jpg"
                alt="Antrenament de forță în sala de fitness"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/5" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  🏋️ Antrenamente
                </p>

                <h2 className="mt-2 text-xl font-bold text-white">
                  Planifică și urmărește
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/75">
                  Creează sesiuni, urmărește exercițiile și vezi ce ai executat.
                </p>
              </div>
            </Link>

            {/* NUTRITION */}
            <Link
              to="/nutrition"
              className="group relative min-h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-surface no-underline shadow-2xl md:min-h-[500px]"
            >
              <img
                src="/images/home-nutrition.jpg"
                alt="Masă sănătoasă cu proteine și legume"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/5" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  🍽️ Alimentație
                </p>

                <h2 className="mt-2 text-xl font-bold text-white">
                  Urmărește ce mănânci
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/75">
                  Monitorizează mesele, caloriile și macronutrienții zilnici.
                </p>
              </div>
            </Link>

            {/* PROGRESS */}
            <Link
              to="/profile"
              className="group relative min-h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-surface no-underline shadow-2xl md:min-h-[500px]"
            >
              <img
                src="/images/home-progress.jpg"
                alt="Alergare și progres sportiv"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/5" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  📈 Progres
                </p>

                <h2 className="mt-2 text-xl font-bold text-white">
                  Vezi cum evoluezi
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/75">
                  Urmărește greutatea, activitatea și progresul tău în timp.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* MAIN FEATURES */}
      <section className="mx-auto max-w-[1500px] px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-surface/90 p-5 shadow-2xl backdrop-blur-sm sm:p-7 lg:p-8">
          <div className="grid gap-8 xl:grid-cols-[0.72fr_1.15fr_0.9fr]">
            {/* INTRO */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                  Funcționalități principale
                </p>

                <h2 className="mt-4 text-4xl font-black leading-tight text-white lg:text-5xl">
                  Tot ce ai nevoie pentru un{" "}
                  <span className="text-accent">
                    stil de viață mai sănătos
                  </span>
                </h2>

                <p className="mt-5 max-w-[520px] leading-7 text-muted">
                  ATHLETICA aduce într-un singur loc antrenamentele,
                  alimentația, progresul și informațiile de care ai nevoie
                  pentru a-ți urmări obiectivele.
                </p>
              </div>

              <div>
                <Link
                  to={user ? "/profile" : "/login"}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-ink no-underline transition duration-200 hover:-translate-y-0.5 hover:bg-[#8cf7ac]"
                >
                  {user ? "Vezi progresul tău" : "Începe acum"}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* FEATURE GRID */}
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-[#0c1812] p-5 transition duration-200 hover:-translate-y-1 hover:border-accent/30 hover:bg-[#0f1d15]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-accent/15 bg-accent/10 text-xl">
                    {feature.icon}
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>

            {/* DASHBOARD PREVIEW */}
            <div className="rounded-2xl border border-white/10 bg-[#09130e] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    Progres
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-white">
                    Progresul meu
                  </h3>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted">
                  Ultimele 3 luni
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <p className="text-xs text-muted">
                    Greutate
                  </p>

                  <strong className="mt-1 block text-lg text-white">
                    76.4 kg
                  </strong>

                  <span className="text-xs font-semibold text-accent">
                    -4.2 kg
                  </span>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <p className="text-xs text-muted">
                    Sesiuni
                  </p>

                  <strong className="mt-1 block text-lg text-white">
                    12
                  </strong>

                  <span className="text-xs text-muted">
                    antrenamente
                  </span>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <p className="text-xs text-muted">
                    Calorii
                  </p>

                  <strong className="mt-1 block text-lg text-white">
                    2340
                  </strong>

                  <span className="text-xs text-muted">
                    medie / zi
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex h-40 items-end gap-2">
                  {progressBars.map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      className="flex-1 rounded-t bg-accent/70 transition hover:bg-accent"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  ))}
                </div>

                <div className="mt-3 flex justify-between text-xs text-muted">
                  <span>Ian</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted">
                Urmărește greutatea, activitatea și evoluția ta în timp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECONDARY CTA */}
      <section className="mx-auto max-w-[1500px] px-4 pb-14 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[30px] border border-accent/20 bg-gradient-to-br from-accent/10 via-surface to-surface p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                ATHLETICA
              </p>

              <h2 className="mt-3 max-w-[700px] text-3xl font-black text-white sm:text-4xl">
                Fă-ți progresul vizibil.
              </h2>

              <p className="mt-3 max-w-[700px] leading-7 text-muted">
                Planifică, înregistrează și urmărește ce faci. Datele tale devin
                mai utile atunci când le vezi împreună.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/workouts/sessions"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 py-3 font-semibold text-ink no-underline transition hover:bg-[#8cf7ac]"
              >
                Vezi antrenamentele
              </Link>

              <Link
                to={user ? "/profile" : "/login"}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white no-underline transition hover:bg-white/10"
              >
                {user ? "Profilul meu" : "Creează cont"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}