import React from "react";

// Native buttons support Tab, Enter and Space without imitating ARIA menu widgets.
export default function SectionTabs({
  items,
  value,
  onChange,
  label = "Sectiuni",
  idPrefix,
}) {
  return (
    <nav aria-label={label} className="section-tabs">
      {items.map(([key, text]) => (
        <button
          key={key}
          type="button"
          id={idPrefix ? `${idPrefix}-tab-${key}` : undefined}
          aria-controls={idPrefix ? `${idPrefix}-panel-${key}` : undefined}
          aria-pressed={value === key}
          className={`tab ${value === key ? "tab-active" : ""}`}
          onClick={() => onChange(key)}
        >
          {text}
        </button>
      ))}
    </nav>
  );
}
