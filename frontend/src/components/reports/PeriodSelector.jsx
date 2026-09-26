import React from 'react';
export default function PeriodSelector({ period, anchor, onPeriodChange, onAnchorChange, className = "grid grid-cols-1 items-end gap-3 sm:grid-cols-2" }) {
  return <div className={className}>
    <label>Perioada<select value={period} onChange={e => onPeriodChange(e.target.value)}>
      <option value="week">Saptamana</option><option value="month">Luna</option>
    </select></label>
    <label>Data din perioada analizata<input type="date" required value={anchor}
      onChange={e => { if (e.target.value) onAnchorChange(e.target.value); }} /></label>
  </div>;
}
