import React from 'react';
export default function ProgressTable({ columns, rows, rowKey, caption }) {
  return <div className="max-w-full overflow-x-auto"><table className="w-full [&_caption]:py-2 [&_caption]:text-left [&_caption]:font-bold">
    {caption && <caption>{caption}</caption>}
    <thead><tr>{columns.map(column => <th scope="col" key={column.key}>{column.label}</th>)}</tr></thead>
    <tbody>{rows.map(row => <tr key={rowKey(row)}>{columns.map(column =>
      <td key={column.key}>{column.render ? column.render(row) : row[column.key] ?? '—'}</td>
    )}</tr>)}</tbody>
  </table>{!rows.length && <p>Nu exista inregistrari pentru aceasta perioada.</p>}</div>;
}
