import { cn } from "../../lib/utils";

export default function Table({ columns, data, keyExtractor, renderRow }) {
  return (
    <div className="w-full max-w-full overflow-x-auto rounded-3xl glass border border-surfaceBorder shadow-sm relative mt-6 min-w-0">
      <table className="w-full text-left border-collapse relative z-10">
        <thead>
          <tr className="border-b border-surfaceBorder bg-surface/30">
            {columns.map((col, i) => (
              <th 
                key={i} 
                className="px-6 py-5 text-xs font-bold text-tmuted uppercase tracking-widest whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surfaceBorder">
          {data.length > 0 ? (
            data.map((item, i) => (
              <tr 
                key={keyExtractor ? keyExtractor(item) : i} 
                className="hover:bg-surface/50 transition-all duration-300 group"
              >
                {renderRow(item, i)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-tmuted">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center border border-surfaceBorder">
                    <span className="text-xl font-bold">!</span>
                  </div>
                  <span className="text-sm font-medium">No records found</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
