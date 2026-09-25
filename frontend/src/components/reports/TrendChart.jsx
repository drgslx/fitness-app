import React, { useId, useState } from "react";
import { formatValue } from "./periods";
import "./reports.css";

// Each series uses the same unit. Null represents missing data, never zero.
export default function TrendChart({ title, unit, data, series }) {
  const titleId = useId();
  const [focused, setFocused] = useState(null);
  const numeric = (value) =>
    typeof value === "number" && Number.isFinite(value);
  const values = data.flatMap((point) =>
    series.map((line) => point[line.key]).filter(numeric)
  );
  if (!values.length)
    return (
      <div className="progress-chart">
        <h3>{title}</h3>
        <p>Nu exista valori inregistrate pentru acest indicator.</p>
      </div>
    );
  const width = 900,
    height = 310,
    left = 76,
    right = 26,
    top = 25,
    bottom = 48;
  const maximum = Math.max(1, ...values) * 1.12;
  const minimum = Math.min(0, ...values);
  const x = (index) =>
    left + (index * (width - left - right)) / Math.max(1, data.length - 1);
  const y = (value) =>
    top + ((maximum - value) * (height - top - bottom)) / (maximum - minimum);
  const ticks = [
    ...new Set([
      0,
      Math.floor((data.length - 1) / 4),
      Math.floor((data.length - 1) / 2),
      Math.floor((3 * (data.length - 1)) / 4),
      data.length - 1,
    ]),
  ];
  const active = focused == null ? null : data[focused];
  // The first series is the observed value. Additional series (e.g. a goal) do
  // not turn an unlogged day into an actual observation.
  const observations = data.filter((point) => numeric(point[series[0]?.key]));
  return (
    <figure className="progress-chart">
      <figcaption id={titleId}>
        {title} ({unit})
      </figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="group"
        aria-labelledby={titleId}
      >
        {Array.from({ length: 5 }, (_, index) => {
          const value = minimum + ((maximum - minimum) * index) / 4;
          return (
            <g key={index}>
              <line
                x1={left}
                x2={width - right}
                y1={y(value)}
                y2={y(value)}
                stroke="#304638"
              />
              <text
                x={left - 10}
                y={y(value) + 4}
                textAnchor="end"
                fill="#c2d0c7"
                fontSize="12"
              >
                {formatValue(value)}
              </text>
            </g>
          );
        })}
        {ticks.map((index) => (
          <text
            key={index}
            x={x(index)}
            y={height - 15}
            textAnchor="middle"
            fill="#c2d0c7"
            fontSize="12"
          >
            {data[index]?.day.slice(5)}
          </text>
        ))}
        {series.map((line) => {
          // Link recorded values across unlogged days; keep their real positions on the date axis.
          // Missing days are never converted to zero or counted as observations.
          const recorded = data.flatMap((point, index) =>
            numeric(point[line.key])
              ? [`${x(index)},${y(point[line.key])}`]
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
                      cy={y(point[line.key])}
                      r="5"
                      fill={line.color}
                      tabIndex="0"
                      aria-label={`${point.day}, ${line.label}: ${formatValue(
                        point[line.key]
                      )} ${unit}`}
                      onMouseEnter={() => setFocused(index)}
                      onFocus={() => setFocused(index)}
                    >
                      <title>
                        {point.day}: {formatValue(point[line.key])} {unit}
                      </title>
                    </circle>
                  )
              )}
            </g>
          );
        })}
      </svg>
      <div className="progress-legend">
        {series.map((line) => (
          <span key={line.key}>
            <i style={{ background: line.color }} />
            {line.label}
          </span>
        ))}
      </div>
      <div
        className="progress-observations"
        aria-label="Valori inregistrate pe zile"
      >
        {observations.map((point) => (
          <div className="progress-observation" key={point.day}>
            <time dateTime={point.day}>{point.day}</time>
            <strong>
              {formatValue(point[series[0].key])} {unit}
            </strong>
            {Number.isInteger(point.entries) && (
              <small>
                {point.entries}{" "}
                {point.entries === 1 ? "inregistrare" : "inregistrari"}
              </small>
            )}
          </div>
        ))}
      </div>
      <p className="progress-readout" role="status">
        {active
          ? `${active.day}: ${series
              .filter((line) => numeric(active[line.key]))
              .map(
                (line) =>
                  `${line.label} ${formatValue(active[line.key])} ${unit}`
              )
              .join(" / ")}`
          : "Treci peste un punct sau selecteaza-l cu Tab pentru detalii. Linia leaga valorile inregistrate; zilele dintre ele nu au valori masurate."}
      </p>
    </figure>
  );
}
