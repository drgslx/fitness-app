import React from "react";

export default function ResponsiveTable({
  columns,
  rows,
  rowKey,
  caption,
  empty = "Nu exista inregistrari pentru aceasta perioada.",
}) {
  if (!rows.length) return <p className="empty-state">{empty}</p>;
  const render = (column, row) =>
    column.render ? column.render(row) : (row[column.key] ?? "—");
  return (
    <div className="min-w-0">
      <div
        className="table-scroll hidden md:block"
        tabIndex={0}
        role="region"
        aria-label={caption || "Tabel de date"}
      >
        <table>
          {caption && <caption>{caption}</caption>}
          <thead>
            <tr>
              {columns.map((column) => (
                <th scope="col" key={column.key}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((column) => (
                  <td key={column.key}>{render(column, row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section
        className="space-y-3 md:hidden"
        aria-label={caption || "Lista de date"}
      >
        {caption && <h3 className="text-base">{caption}</h3>}
        {rows.map((row) => (
          <dl className="card p-3" key={rowKey(row)}>
            {columns.map((column) => (
              <div className="data-row" key={column.key}>
                <dt className="text-xs text-muted">{column.label}</dt>
                <dd className="min-w-0 text-sm">{render(column, row)}</dd>
              </div>
            ))}
          </dl>
        ))}
      </section>
    </div>
  );
}
