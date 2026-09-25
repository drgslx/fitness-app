export function isoDate(value) {
  return [value.getFullYear(), String(value.getMonth() + 1).padStart(2, '0'), String(value.getDate()).padStart(2, '0')].join('-');
}
export function ranges(anchor, period) {
  const day = new Date(`${anchor}T12:00:00`);
  let start, end, previousStart, previousEnd;
  if (period === 'week') {
    start = new Date(day); start.setDate(day.getDate() - (day.getDay() + 6) % 7);
    end = new Date(start); end.setDate(start.getDate() + 6);
    previousStart = new Date(start); previousStart.setDate(start.getDate() - 7);
    previousEnd = new Date(start); previousEnd.setDate(start.getDate() - 1);
  } else {
    start = new Date(day.getFullYear(), day.getMonth(), 1, 12);
    end = new Date(day.getFullYear(), day.getMonth() + 1, 0, 12);
    previousStart = new Date(day.getFullYear(), day.getMonth() - 1, 1, 12);
    previousEnd = new Date(day.getFullYear(), day.getMonth(), 0, 12);
  }
  return { start: isoDate(start), end: isoDate(end), previousStart: isoDate(previousStart), previousEnd: isoDate(previousEnd) };
}
export function dayList(start, end) {
  const values = []; const day = new Date(`${start}T12:00:00`);
  while (isoDate(day) <= end) { values.push(isoDate(day)); day.setDate(day.getDate() + 1); }
  return values;
}
export const formatValue = (value) => typeof value === 'number' && Number.isFinite(value)
  ? new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 2 }).format(value) : '—';
