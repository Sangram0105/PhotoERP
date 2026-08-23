import { ReactNode } from 'react';

export interface TableColumn<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
}

const Table = <T,>({
  columns,
  data,
  emptyMessage = 'No data found.',
}: TableProps<T>) => {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full">

        {/* Header */}
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-t transition hover:bg-slate-50"
              >
                {columns.map((column, columnIndex) => (
                  <td
                    key={columnIndex}
                    className="px-6 py-4 text-sm text-slate-700"
                  >
                    {column.render
                      ? column.render(row)
                      : column.accessor
                        ? String(row[column.accessor] ?? '-')
                        : '-'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
};

export default Table;