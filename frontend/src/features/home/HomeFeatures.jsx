import React from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/ui/Icon";
import ProgressPreview from "./ProgressPreview";
import { features } from "./content";
export default function HomeFeatures() {
  return (
    <section
      aria-labelledby="features-title"
      className="relative mt-3 grid gap-5 rounded-2xl border border-white/5 bg-gradient-to-br from-[#162723] to-[#0c1612] p-5 sm:p-6 lg:grid-cols-[.85fr_1.25fr_1.05fr] lg:gap-5 lg:p-7"
    >
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[.3em] text-[#80b495]">
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
              <p className="text-xs leading-4 text-muted">{feature.text}</p>
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
  );
}
