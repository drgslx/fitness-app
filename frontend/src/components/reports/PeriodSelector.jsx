import React from 'react';
export default function PeriodSelector({ period, anchor, onPeriodChange, onAnchorChange }) {
  return <div className="progress-filters">
    <label>Perioada<select value={period} onChange={e => onPeriodChange(e.target.value)}>
      <option value="week">Saptamana</option><option value="month">Luna</option>
    </select></label>
    <label>Data din perioada analizata<input type="date" required value={anchor}
      onChange={e => { if (e.target.value) onAnchorChange(e.target.value); }} /></label>
  </div>;
}
