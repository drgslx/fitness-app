import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";

const features = [
  {
    icon: "🏋",
    title: "Planifică antrenamentele",
    description:
      "Creează sesiuni, urmărește exercițiile și construiește un program adaptat obiectivelor tale.",
  },
  {
    icon: "🍴",
    title: "Urmărește alimentația",
    description:
      "Adaugă mese, urmărește caloriile și macronutrienții și păstrează totul într-un singur loc.",
  },
  {
    icon: "📈",
    title: "Vezi-ți progresul",
    description:
      "Monitorizează greutatea, activitatea și evoluția ta într-un mod simplu și vizual.",
  },
  {
    icon: "📚",
    title: "Citește articole",
    description:
      "Descoperă informații despre antrenament, nutriție, recuperare și progres.",
  },
];

const chartPoints = [82, 79, 76, 78, 74, 73, 75, 70, 68, 67, 65, 63];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#06100b] text-white">
      {/* BACKGROUND LIGHT */}
      <div className="pointer-events-none absolute left-[15%] top-[-180px] h-[650px] w-[650px] rounded-full bg-[#72f29c]/[0.04] blur-[140px]" />

      <div className="pointer-events-none absolute right-[-150px] top-[50px] h-[600px] w-[600px] rounded-full bg-[#72f29c]/[0.06] blur-[150px]" />

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative mx-auto w-full max-w-[1720px] px-5 pb-8 pt-10 sm:px-8 lg:px-10 xl:px-14 xl:pb-14 xl:pt-12">
        <div className="grid items-center gap-10 xl:grid-cols-[0.78fr_1.35fr] xl:gap-4">
          {/* LEFT HERO */}
          <div className="relative z-30 max-w-[680px]">
            <p className="mb-5 text-xs font-bold uppercase leading-6 tracking-[0.38em] text-[#72f29c]">
              Mai mult decât un plan.
              <br />
              Un tu mai puternic.
            </p>

            <h1 className="text-[clamp(3.4rem,5.3vw,6rem)] font-black leading-[0.91] tracking-[-0.045em]">
              Construiește-ți
              <br />
              progresul cu
              <br />

              <span className="text-[#72f29c]">ATHLETICA</span>
            </h1>

            <p className="mt-7 max-w-[610px] text-base leading-7 text-[#aab7af] sm:text-lg lg:text-xl lg:leading-8">
              Planifică antrenamente, urmărește alimentația și vezi-ți progresul
              — totul într-un singur loc.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/workouts/sessions"
                className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#72f29c] px-5 py-3 font-bold text-[#07110b] no-underline transition duration-200 hover:-translate-y-0.5 hover:bg-[#91f7af]"
              >
                <span>🏋</span>
                Antrenamente
                <span>→</span>
              </Link>

              <Link
                to="/nutrition"
                className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 font-semibold text-white no-underline transition duration-200 hover:border-white/20 hover:bg-white/[0.08]"
              >
                <span>🍴</span>
                Alimentație
              </Link>

              <Link
                to="/articles"
                className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 font-semibold text-white no-underline transition duration-200 hover:border-white/20 hover:bg-white/[0.08]"
              >
                <span>▣</span>
                Articole
              </Link>

              {!user ? (
                <Link
                  to="/login"
                  className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 font-semibold text-white no-underline transition duration-200 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  Intră în cont
                </Link>
              ) : (
                <Link
                  to="/profile"
                  className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 font-semibold text-white no-underline transition duration-200 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  Profil
                </Link>
              )}
            </div>

            {/* BENEFITS */}
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#8d9d94]">
              <span>
                <strong className="mr-2 text-[#72f29c]">✓</strong>
                Planuri personalizate
              </span>

              <span>
                <strong className="mr-2 text-[#72f29c]">✓</strong>
                Urmărire progres
              </span>

              <span>
                <strong className="mr-2 text-[#72f29c]">✓</strong>
                Rețete și nutriție
              </span>

              <span>
                <strong className="mr-2 text-[#72f29c]">✓</strong>
                Articole și sfaturi
              </span>
            </div>
          </div>

          {/* ================================================= */}
          {/* PHOTO COLLAGE */}
          {/* ================================================= */}

          <div className="relative mt-4 min-h-[530px] w-full xl:mt-0 xl:h-[590px]">
            {/* MOBILE / TABLET */}
            <div className="grid gap-4 md:grid-cols-3 xl:hidden">
              <PhotoCard
                to="/workouts/sessions"
                src="/images/home-training.webp"
                alt="Antrenament de forță în sala de fitness"
                eyebrow="ANTRENAMENTE"
                title="Planifică și urmărește"
                description="Planuri eficiente pentru obiectivele tale."
                eager
              />

              <PhotoCard
                to="/nutrition"
                src="/images/home-nutrition.webp"
                alt="Masă sănătoasă cu proteine și legume"
                eyebrow="ALIMENTAȚIE"
                title="Urmărește ce mănânci"
                description="Rețete sănătoase și urmărire macronutrienți."
              />

              <PhotoCard
                to="/profile"
                src="/images/home-progress.webp"
                alt="Alergare și progres sportiv"
                eyebrow="PROGRES"
                title="Vezi cum evoluezi"
                description="Urmărește-ți evoluția și rămâi motivat."
              />
            </div>

            {/* DESKTOP ANGLED PANELS */}
            <div className="absolute inset-0 hidden xl:block">
              {/* TRAINING */}
              <Link
                to="/workouts/sessions"
                className="group absolute bottom-0 left-0 top-0 w-[39%] overflow-hidden bg-[#0b1510] no-underline"
                style={{
                  clipPath:
                    "polygon(14% 0%, 100% 0%, 86% 100%, 0% 100%)",
                }}
              >
                <img
                  src="/images/home-training.webp"
                  alt="Antrenament de forță în sala de fitness"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#020604] via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-[14%] right-[11%] z-10 pb-9">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#72f29c]">
                    🏋 Antrenamente
                  </p>

                  <p className="mt-3 max-w-[220px] text-base leading-6 text-white/80">
                    Planuri eficiente pentru obiectivele tale.
                  </p>
                </div>
              </Link>

              {/* NUTRITION */}
              <Link
                to="/nutrition"
                className="group absolute bottom-0 left-[32.5%] top-0 z-10 w-[39%] overflow-hidden bg-[#0b1510] no-underline"
                style={{
                  clipPath:
                    "polygon(14% 0%, 100% 0%, 86% 100%, 0% 100%)",
                }}
              >
                <img
                  src="/images/home-nutrition.webp"
                  alt="Masă sănătoasă cu proteine și legume"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#020604] via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-[15%] right-[11%] z-10 pb-9">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#72f29c]">
                    🍴 Alimentație
                  </p>

                  <p className="mt-3 max-w-[220px] text-base leading-6 text-white/80">
                    Rețete sănătoase și urmărire macronutrienți.
                  </p>
                </div>
              </Link>

              {/* PROGRESS */}
              <Link
                to="/profile"
                className="group absolute bottom-0 left-[65%] top-0 z-20 w-[37%] overflow-hidden bg-[#0b1510] no-underline"
                style={{
                  clipPath:
                    "polygon(14% 0%, 100% 0%, 100% 100%, 0% 100%)",
                }}
              >
                <img
                  src="/images/home-progress.webp"
                  alt="Alergare și progres sportiv"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#020604] via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-[17%] right-[8%] z-10 pb-9">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#72f29c]">
                    📈 Progres
                  </p>

                  <p className="mt-3 max-w-[200px] text-base leading-6 text-white/80">
                    Urmărește-ți evoluția și rămâi motivat.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FEATURES */}
      {/* ===================================================== */}

      <section className="relative mx-auto w-full max-w-[1720px] px-5 pb-16 sm:px-8 lg:px-10 xl:px-14">
        <div className="rounded-[30px] border border-white/[0.08] bg-[#0a1510]/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.32)] lg:p-8">
          <div className="grid gap-8 xl:grid-cols-[0.72fr_1.16fr_0.9fr]">
            {/* LEFT */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#72f29c]">
                  Funcționalități principale
                </p>

                <h2 className="mt-5 max-w-[460px] text-4xl font-black leading-[1.08] tracking-tight md:text-5xl">
                  Tot ce ai nevoie pentru un{" "}
                  <span className="text-[#72f29c]">
                    stil de viață mai sănătos
                  </span>
                </h2>

                <p className="mt-6 max-w-[500px] text-base leading-7 text-[#9baaa1]">
                  ATHLETICA îți oferă un set complet de instrumente pentru
                  antrenamente, alimentație, progres și educație, ca să îți
                  urmărești obiectivele mai simplu.
                </p>
              </div>

              <Link
                to={user ? "/profile" : "/login"}
                className="mt-8 inline-flex w-fit items-center gap-3 rounded-xl bg-[#72f29c] px-6 py-3 font-bold text-[#07110b] no-underline transition hover:bg-[#91f7af]"
              >
                Descoperă toate funcționalitățile
                <span>→</span>
              </Link>
            </div>

            {/* FEATURE CARDS */}
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-white/[0.08] bg-[#0c1812] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#72f29c]/30 hover:bg-[#0e1c15]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#72f29c]/10 bg-[#72f29c]/10 text-xl">
                    {feature.icon}
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#8f9d95]">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>

            {/* DASHBOARD */}
            <div className="relative rounded-2xl border border-white/[0.09] bg-[#07110c] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#72f29c]">
                    Progres
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    Progresul meu
                  </h3>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[#89978f]">
                  Ultimele 3 luni
                </span>
              </div>

              {/* STATS */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                <StatCard
                  label="Greutate"
                  value="76.4 kg"
                  detail="-4.2 kg"
                  accent
                />

                <StatCard
                  label="Sesiuni"
                  value="12"
                  detail="antrenamente"
                />

                <StatCard
                  label="Calorii"
                  value="2340"
                  detail="medie / zi"
                />
              </div>

              {/* CHART */}
              <div className="relative mt-5 rounded-xl border border-white/[0.08] bg-[#050d09] px-4 pb-3 pt-6">
                <div className="flex h-[190px] items-end gap-[7px]">
                  {chartPoints.map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-sm bg-[#72f29c]/75 transition hover:bg-[#72f29c]"
                      style={{
                        height: `${value}%`,
                      }}
                    />
                  ))}
                </div>

                <div className="mt-4 flex justify-between text-xs text-[#69766f]">
                  <span>Ian</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                </div>

                <div className="absolute right-4 top-4 rounded-xl border border-[#72f29c]/20 bg-[#10281a]/95 px-3 py-2 shadow-xl">
                  <strong className="block text-lg text-[#72f29c]">
                    +12% ↗
                  </strong>

                  <span className="text-xs text-[#98a69e]">
                    Performanță
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#89978f]">
                Urmărește greutatea, activitatea și evoluția ta în timp.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ========================================================= */
/* COMPONENTS */
/* ========================================================= */

function PhotoCard({
  to,
  src,
  alt,
  eyebrow,
  title,
  description,
  eager = false,
}) {
  return (
    <Link
      to={to}
      className="group relative min-h-[420px] overflow-hidden rounded-[26px] border border-white/10 bg-[#0a140f] no-underline"
    >
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/15 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#72f29c]">
          {eyebrow}
        </p>

        <h3 className="mt-3 text-xl font-bold text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/70">
          {description}
        </p>
      </div>
    </Link>
  );
}

function StatCard({
  label,
  value,
  detail,
  accent = false,
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.06] bg-white/[0.055] p-3">
      <p className="truncate text-[11px] text-[#819087]">
        {label}
      </p>

      <strong className="mt-2 block text-base text-white sm:text-lg">
        {value}
      </strong>

      <span
        className={`mt-1 block truncate text-[10px] ${
          accent
            ? "font-semibold text-[#72f29c]"
            : "text-[#7c8982]"
        }`}
      >
        {detail}
      </span>
    </div>
  );
}