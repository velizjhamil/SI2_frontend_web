/**
 * DataTable — tabla de datos CoopIA.
 *
 * Props:
 *   columns: Array<{ key: string, label: string, className?: string }>
 *   rows:    Array<{ id, [key]: any | node }>
 *   emptyMessage: string
 *
 * Para celdas con contenido complejo, pasa el nodo directamente como valor.
 */
export default function DataTable({ columns = [], rows = [], emptyMessage = 'Sin datos.' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-left">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${col.className ?? ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-sm text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="transition-colors hover:bg-slate-50/80"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-6 py-3.5 text-slate-700 ${col.cellClassName ?? ''}`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
