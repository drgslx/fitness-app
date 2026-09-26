import React, { useId, useState } from "react";
import { formatValue } from "./periods";

// Null represents missing data, never zero. Secondary series use their own scale.
function bounds(values) {
  const low = Math.min(...values);
  const high = Math.max(...values);
  const padding = Math.max((high - low) * 0.12, high === low ? Math.max(Math.abs(high) * 0.1, 1) : 0);
  return [Math.max(0, low - padding), high + padding];
}

// Move crowded labels only; the small tick stays at the real value.
function placedLabels(values, position, top, bottom) {
  const labels = [...new Set(values)].sort((a, b) => b - a)
    .map((value) => ({ value, actualY: position(value), labelY: position(value) }));
  for (let index = 1; index < labels.length; index++) {
    labels[index].labelY = Math.max(labels[index].labelY, labels[index - 1].labelY + 15);
  }
  if (labels.length && labels.at(-1).labelY > bottom) {
    labels.at(-1).labelY = bottom;
    for (let index = labels.length - 2; index >= 0; index--) {
      labels[index].labelY = Math.min(labels[index].labelY, labels[index + 1].labelY - 15);
    }
  }
  if (labels.length && labels[0].labelY < top) {
    const shift = top - labels[0].labelY;
    labels.forEach((label) => { label.labelY += shift; });
  }
  return labels;
}

export default function TrendChart({ title, unit, data, series }) {
  const titleId = useId();
  const [focused, setFocused] = useState(null);
  const numeric = (value) =>
    typeof value === "number" && Number.isFinite(value);
  const values = data.flatMap((point) =>
    series.filter((line) => !line.secondary).map((line) => point[line.key]).filter(numeric)
  );
  const secondaryValues = data.flatMap((point) => series.filter((line) => line.secondary).map((line) => point[line.key]).filter(numeric));
  const measuredValues = data.map((point) => point[series[0]?.key]).filter(numeric);
  if (!values.length && !secondaryValues.length)
    return (
      <div className="m-0 min-w-0 rounded-xl border border-[#294238] bg-[#0d1a14] p-3 [&_figcaption]:font-bold [&_svg]:block [&_svg]:h-auto [&_svg]:w-full">
        <h3>{title}</h3>
        <p>Nu exista valori inregistrate pentru acest indicator.</p>
      </div>
    );
  const uniqueCount = Math.max(new Set(measuredValues).size, new Set(secondaryValues).size);
  const width = 900,
    height = Math.max(280, uniqueCount * 16 + 100),
    left = 94,
    right = secondaryValues.length ? 88 : 26,
    top = 25,
    bottom = 78;
  const [minimum, maximum] = bounds(values.length ? values : secondaryValues);
  const [secondaryMin, secondaryMax] = secondaryValues.length ? bounds(secondaryValues) : [0, 1];
  const x = (index) =>
    left + (index * (width - left - right)) / Math.max(1, data.length - 1);
  const y = (value) =>
    top + ((maximum - value) * (height - top - bottom)) / (maximum - minimum);
  const secondaryY = (value) =>
    top + ((secondaryMax - value) * (height - top - bottom)) / (secondaryMax - secondaryMin);
  const lineY = (line, value) => line.secondary
    ? secondaryY(value)
    : y(value);
  const primaryLabels = placedLabels(measuredValues, y, top + 5, height - bottom - 5);
  const secondaryLabels = placedLabels(secondaryValues, secondaryY, top + 5, height - bottom - 5);
  const recordedDates = data.flatMap((point, index) =>
    series.some((line) => numeric(point[line.key])) ? [index] : []
  );
  const active = focused == null ? null : data[focused];
  // The first series is the observed value. Additional series (e.g. a goal) do
  // not turn an unlogged day into an actual observation.
  const observations = data.filter((point) => series.some(line => numeric(point[line.key])));
  return (
    <figure className="m-0 min-w-0 rounded-xl border border-[#294238] bg-[#0d1a14] p-3 [&_figcaption]:font-bold [&_svg]:block [&_svg]:h-auto [&_svg]:w-full">
      <figcaption id={titleId}>
        {title} ({unit})
      </figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="group"
        aria-labelledby={titleId}
      >
        {primaryLabels.map(({ value, actualY, labelY }) => (
          <g key={`primary-${value}`}>
            <line x1={left - 4} x2={left + 5} y1={actualY} y2={actualY} stroke="#526b5b" />
            {Math.abs(actualY - labelY) > 2 &&
              <line x1={left - 5} x2={left - 11} y1={actualY} y2={labelY} stroke="#526b5b" />}
            <text x={left - 13} y={labelY + 4} textAnchor="end" fill="#c2d0c7" fontSize="12">
              {formatValue(value)}
            </text>
          </g>
        ))}
        {recordedDates.map((index) => (
          <text
            key={index}
            x={x(index)}
            y={height - 47}
            textAnchor="end"
            transform={`rotate(-70 ${x(index)} ${height - 47})`}
            fill="#c2d0c7"
            fontSize="12"
          >
            {data[index]?.day.slice(5)}
          </text>
        ))}
        {secondaryLabels.map(({ value, actualY, labelY }) => (
          <g key={`secondary-${value}`}>
            <line x1={width - right - 5} x2={width - right + 4}
              y1={actualY} y2={actualY} stroke="#eabc6a" />
            {Math.abs(actualY - labelY) > 2 &&
              <line x1={width - right + 5} x2={width - right + 11}
                y1={actualY} y2={labelY} stroke="#eabc6a" />}
            <text x={width - right + 13} y={labelY + 4}
              fill="#eabc6a" fontSize="12">{formatValue(value)}</text>
          </g>
        ))}
        {series.map((line) => {
          // Link recorded values across unlogged days; keep their real positions on the date axis.
          // Missing days are never converted to zero or counted as observations.
          const recorded = data.flatMap((point, index) =>
            numeric(point[line.key])
              ? [`${x(index)},${lineY(line, point[line.key])}`]
              : []
          );
          return (
            <g key={line.key}>
              {recorded.length >= 2 && (
                <polyline
                  points={recorded.join(" ")}
                  fill="none"
                  stroke={line.color}
                  strokeWidth="2.5"
                  strokeDasharray={line.dashed ? "6 5" : undefined}
                />
              )}
              {data.map(
                (point, index) =>
                  numeric(point[line.key]) && (
                    <circle
                      key={point.day}
                      cx={x(index)}
                      cy={lineY(line, point[line.key])}
                      r="5"
                      fill={line.color}
                      tabIndex="0"
                      aria-label={`${point.day}, ${line.label}: ${formatValue(
                        point[line.key]
                      )} ${line.unit || unit}`}
                      onMouseEnter={() => setFocused(index)}
                      onFocus={() => setFocused(index)}
                    >
                      <title>
                        {point.day}: {formatValue(point[line.key])} {line.unit || unit}
                      </title>
                    </circle>
                  )
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-2 [&_span]:inline-flex [&_span]:items-center [&_span]:gap-2 [&_i]:h-3 [&_i]:w-3 [&_i]:rounded-full">
        {series.map((line) => (
          <span key={line.key}>
            <i style={{ background: line.color }} />
            {line.label} ({line.unit || unit})
          </span>
        ))}
      </div>
      <div
        className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]"
        aria-label="Valori inregistrate pe zile"
      >
        {observations.map((point) => (
          <div className="flex flex-col gap-1 rounded-lg border border-[#294238] p-2 [&_small]:text-muted" key={point.day}>
            <time dateTime={point.day}>{point.day}</time>
            {series.filter(line => numeric(point[line.key])).map(line => (
              <strong key={line.key}>{line.label}: {formatValue(point[line.key])} {line.unit || unit}</strong>
            ))}
            {Number.isInteger(point.entries) && (
              <small>
                {point.entries}{" "}
                {point.entries === 1 ? "inregistrare" : "inregistrari"}
              </small>
            )}
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm text-[#bfcec5]" role="status">
        {active
          ? `${active.day}: ${series
              .filter((line) => numeric(active[line.key]))
              .map(
                (line) =>
                  `${line.label} ${formatValue(active[line.key])} ${line.unit || unit}`
              )
              .join(" / ")}`
          : "Treci peste un punct sau selecteaza-l cu Tab pentru detalii. Linia leaga valorile inregistrate; zilele dintre ele nu au valori masurate."}
      </p>
    </figure>
  );
}
