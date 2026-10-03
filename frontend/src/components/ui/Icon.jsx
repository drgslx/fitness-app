import React from "react";
export default function Icon({ name, className = "h-5 w-5" }) {
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
