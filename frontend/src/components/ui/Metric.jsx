import React from "react";

export default function Metric({ label, value, detail }) {
  return (
    <div className="metric">
      <p className="text-sm text-muted">{label}</p>
      <strong className="metric-value">{value}</strong>
      {detail != null && <p className="text-xs text-muted">{detail}</p>}
    </div>
  );
}
