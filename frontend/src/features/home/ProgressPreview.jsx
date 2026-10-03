import React from "react";
import Icon from "../../components/ui/Icon";
export default function ProgressPreview() {
  return (
    <div className="relative min-w-0 rounded-2xl border border-white/10 bg-[#172322]/90 p-4 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-bold text-white">Progresul meu</span>
        <span className="rounded-full border border-white/15 px-2 py-1 text-xs text-muted">
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
            <span className="text-xs text-muted">Din profilul tău</span>
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
    </div>
  );
}
