'use client'

export type Columna<T> = {
  header: string
  render: (row: T) => React.ReactNode
  className?: string
}

export default function DataTable<T extends { id: string }>({
  columnas,
  filas,
  acciones,
  vacio = 'No hay registros todavía.',
}: {
  columnas: Columna<T>[]
  filas: T[]
  acciones?: (row: T) => React.ReactNode
  vacio?: string
}) {
  if (filas.length === 0) {
    return <div className="card p-8 text-center text-sm text-zinc-500">{vacio}</div>
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-black/[0.02]">
            {columnas.map((col) => (
              <th key={col.header} className="text-left px-4 py-3 font-semibold text-zinc-600 whitespace-nowrap">
                {col.header}
              </th>
            ))}
            {acciones && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody>
          {filas.map((row) => (
            <tr key={row.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
              {columnas.map((col) => (
                <td key={col.header} className={`px-4 py-3 align-middle ${col.className ?? ''}`}>
                  {col.render(row)}
                </td>
              ))}
              {acciones && (
                <td className="px-4 py-3 align-middle text-right whitespace-nowrap">{acciones(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
