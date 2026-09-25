import React, { useEffect, useState } from 'react';
import { api, localDate } from '../../api/client';
import PeriodSelector from '../../components/reports/PeriodSelector';
import TrendChart from '../../components/reports/TrendChart';
import ProgressTable from '../../components/reports/ProgressTable';
import { ranges, dayList, formatValue } from '../../components/reports/periods';

function NutritionResults({ period, anchor }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [metric, setMetric] = useState('calories');
  const range = ranges(anchor, period);
  useEffect(() => {
    let active = true;
    const get = (start, end) => api(`/nutrition-report?${new URLSearchParams({ start, end })}`);
    Promise.all([get(range.start, range.end), get(range.previousStart, range.previousEnd), api('/nutrients')])
      .then(([current, previous, nutrients]) => { if (active) setData({ current, previous, nutrients }); })
      .catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [range.start, range.end, range.previousStart, range.previousEnd]);
  if (error) return <p role="alert" className="error">{error}</p>;
  if (!data) return <p role="status">Se incarca raportul nutritional...</p>;
  const { nutrients } = data;
  const current = data.current.days.filter(day => day.entries > 0);
  const previous = data.previous.days.filter(day => day.entries > 0);
  const definition = metric === 'calories' ? { label: 'Calorii consumate', unit: 'kcal' }
    : nutrients.find(item => item.key === metric);
  const getValue = day => metric === 'calories' ? day.calories : day.nutrients[metric] ?? null;
  const numeric = value => typeof value === 'number' && Number.isFinite(value);
  const values = current.map(getValue).filter(numeric);
  const previousValues = previous.map(getValue).filter(numeric);
  const total = values.length ? values.reduce((sum, value) => sum + value, 0) : null;
  const average = values.length ? total / values.length : null;
  const previousAverage = previousValues.length ? previousValues.reduce((sum, value) => sum + value, 0) / previousValues.length : null;
  const delta = average !== null && previousAverage !== null ? average - previousAverage : null;
  const currentByDay = new Map(current.map(day => [day.day, day]));
  const points = dayList(range.start, range.end).map(day => {
    const row = currentByDay.get(day);
    return { day, value: row ? getValue(row) : null, entries: row?.entries ?? null,
      target: row ? (metric === 'calories' ? row.target : metric === 'protein' ? row.protein_target : null) : null };
  });
  const series = [{ key: 'value', label: definition.label, color: '#72f29c' }];
  if (points.some(point => numeric(point.target))) series.push({ key: 'target', label: 'Obiectiv', color: '#eabc6a', dashed: true });
  return <>
    <p>{range.start} – {range.end}. Comparatie cu {range.previousStart} – {range.previousEnd}.</p>
    <label>Indicator<select value={metric} onChange={e => setMetric(e.target.value)}>
      <option value="calories">Calorii consumate</option>{nutrients.map(item => <option key={item.key} value={item.key}>{item.label} ({item.unit})</option>)}
    </select></label>
    <div className="progress-summary">
      <div>Total inregistrat<strong>{formatValue(total)} {definition.unit}</strong></div>
      <div>Medie / zi cu valori<strong>{formatValue(average)} {definition.unit}</strong>{values.length} zile cu valori / {current.length} zile cu jurnal</div>
      <div>Schimbarea mediei<strong>{delta > 0 ? '+' : ''}{formatValue(delta)} {definition.unit}</strong>{previousValues.length} zile cu valori in perioada precedenta</div>
    </div>
    <p role="note">Zilele fara jurnal nu sunt considerate zero. Comparatia foloseste media zilelor cu valori,
      iar perioadele pot avea un numar diferit de zile inregistrate. Mai multe sau mai putine calorii nu inseamna automat progres;
      compara consumul cu obiectivul tau. Linia obiectivului foloseste tinta valabila la data respectiva.</p>
    <TrendChart key={metric} title={definition.label} unit={definition.unit} data={points} series={series} />
    <ProgressTable caption="Jurnalul perioadei — numai zilele inregistrate" rows={current} rowKey={row => row.day} columns={[
      { key: 'day', label: 'Data' }, { key: 'entries', label: 'Inregistrari' },
      { key: 'calories', label: 'kcal', render: row => formatValue(row.calories) },
      { key: 'target', label: 'Obiectiv kcal', render: row => formatValue(row.target) },
      { key: 'difference', label: 'Consum minus obiectiv', render: row => formatValue(row.difference) },
      ...nutrients.map(item => ({ key: item.key, label: `${item.label} (${item.unit})`, render: row => formatValue(row.nutrients[item.key]) })),
    ]} />
    <ProgressTable caption="Comparatia perioadelor" rowKey={row => row.interval} rows={[
      { interval: `${range.start} – ${range.end}`, count: values.length, total, average },
      { interval: `${range.previousStart} – ${range.previousEnd}`, count: previousValues.length,
        total: previousValues.length ? previousValues.reduce((sum, value) => sum + value, 0) : null, average: previousAverage },
    ]} columns={[
      { key: 'interval', label: 'Perioada' }, { key: 'count', label: 'Zile cu valori' },
      { key: 'total', label: `Total ${definition.unit}`, render: row => formatValue(row.total) },
      { key: 'average', label: `Medie ${definition.unit}/zi`, render: row => formatValue(row.average) },
    ]} />
  </>;
}

export default function NutritionProgressPanel() {
  const [period, setPeriod] = useState('month');
  const [anchor, setAnchor] = useState(localDate());
  return <section className="panel progress-report">
    <h2>Progres nutritional</h2>
    <PeriodSelector {...{ period, anchor }} onPeriodChange={setPeriod} onAnchorChange={setAnchor} />
    <NutritionResults key={`${period}|${anchor}`} {...{ period, anchor }} />
  </section>;
}
