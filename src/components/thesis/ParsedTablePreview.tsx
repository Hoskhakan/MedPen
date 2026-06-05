'use client';

import { ParsedTable } from '@/lib/thesis/types';

interface Props {
  table: ParsedTable;
  onEdit?: (table: ParsedTable) => void;
}

export default function ParsedTablePreview({ table, onEdit }: Props) {
  const { headers, rows, warnings } = table;
  const dataRows = rows.filter(r => !r.isFootnote);
  const footnotes = rows.filter(r => r.isFootnote);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <h2 className="text-sm font-semibold text-gray-800">Parsed Table Preview</h2>
        </div>
        <span className="text-xs text-gray-400">{dataRows.length} rows × {headers.length} cols</span>
      </div>

      {warnings.length > 0 && (
        <div className="m-3 p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
          {warnings.map((w, i) => (
            <p key={i} className="text-xs text-amber-800 flex gap-2">
              <span className="shrink-0">⚠</span>
              <span>{w}</span>
            </p>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#1a5276] text-white">
              {headers.map((h, i) => (
                <th key={i} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap border-r border-[#154360] last:border-r-0">
                  {h || `Column ${i + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr
                key={ri}
                className={`border-b border-gray-100 ${
                  row.isTotal ? 'bg-gray-50 font-semibold' : ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                }`}
              >
                <td className="px-3 py-2 font-medium text-gray-800 border-r border-gray-100">
                  {row.label || <span className="text-gray-300 italic">—</span>}
                  {row.isTotal && <span className="ml-1 text-xs text-gray-400">(total)</span>}
                </td>
                {row.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-3 py-2 text-center border-r border-gray-100 last:border-r-0 ${
                      cell.needsReview ? 'bg-red-50 text-red-700' : 'text-gray-700'
                    }`}
                    title={cell.reviewNote}
                  >
                    {cell.raw || <span className="text-gray-300">—</span>}
                    {cell.needsReview && (
                      <span className="ml-1 text-red-400" title={cell.reviewNote}>⚠</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footnotes.length > 0 && (
        <div className="px-3 py-2 border-t border-gray-100">
          {footnotes.map((fn, i) => (
            <p key={i} className="text-xs text-gray-400 italic">{fn.label}</p>
          ))}
        </div>
      )}
    </div>
  );
}
