'use client';

import { useState } from 'react';
import { TransformedChartData, ChartSettings, ParsedTable, DetectedTableInfo, ChartRecommendation } from '@/lib/thesis/types';

interface Props {
  data: TransformedChartData;
  settings: ChartSettings;
  table: ParsedTable;
  info: DetectedTableInfo;
  caption: string;
}

type ExportStatus = 'idle' | 'loading' | 'done' | 'error';

interface ExportButton {
  label: string;
  format: string;
  description: string;
  color: string;
  handler: () => Promise<void> | void;
}

export default function ExportPanel({ data, settings, table, info, caption }: Props) {
  const [statuses, setStatuses] = useState<Record<string, ExportStatus>>({});

  const setStatus = (key: string, status: ExportStatus) =>
    setStatuses(prev => ({ ...prev, [key]: status }));

  const withStatus = async (key: string, fn: () => Promise<void>) => {
    setStatus(key, 'loading');
    try {
      await fn();
      setStatus(key, 'done');
      setTimeout(() => setStatus(key, 'idle'), 3000);
    } catch {
      setStatus(key, 'error');
      setTimeout(() => setStatus(key, 'idle'), 3000);
    }
  };

  const getFilename = () => {
    const title = settings.title.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').slice(0, 40);
    return title || 'ThesisChart';
  };

  const buttons: ExportButton[] = [
    {
      label: 'PNG (High-Res)',
      format: 'png',
      description: 'Best for Word & thesis',
      color: 'bg-[#1a5276] hover:bg-[#154360] text-white',
      handler: async () => {
        const { exportAsPNG } = await import('@/lib/thesis/exportChart');
        await exportAsPNG('thesis-chart-preview', getFilename(), settings.exportWidth, settings.exportHeight);
      },
    },
    {
      label: 'SVG (Vector)',
      format: 'svg',
      description: 'Scalable, for publications',
      color: 'bg-indigo-700 hover:bg-indigo-800 text-white',
      handler: async () => {
        const { exportAsSVG } = await import('@/lib/thesis/exportChart');
        await exportAsSVG('thesis-chart-preview', getFilename());
      },
    },
    {
      label: 'PDF',
      format: 'pdf',
      description: 'For presentations',
      color: 'bg-red-700 hover:bg-red-800 text-white',
      handler: async () => {
        const { exportAsPDF } = await import('@/lib/thesis/exportChart');
        await exportAsPDF('thesis-chart-preview', getFilename(), settings.title);
      },
    },
    {
      label: 'CSV Data',
      format: 'csv',
      description: 'Cleaned chart data',
      color: 'bg-green-700 hover:bg-green-800 text-white',
      handler: () => {
        const { exportAsCSV } = require('@/lib/thesis/exportChart');
        exportAsCSV(data, getFilename());
      },
    },
    {
      label: 'JSON Project',
      format: 'json',
      description: 'Save for later editing',
      color: 'bg-gray-700 hover:bg-gray-800 text-white',
      handler: () => {
        const { exportAsJSON } = require('@/lib/thesis/exportChart');
        exportAsJSON({ version: '1.0', createdAt: new Date().toISOString(), parsedTable: table, detectedInfo: info, chartSettings: settings, transformedData: data, caption }, getFilename());
      },
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <h2 className="text-sm font-semibold text-gray-800">Export Chart</h2>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-xs text-gray-500">
          Export your chart in multiple formats suitable for Egyptian medical theses, journal manuscripts, and presentations.
        </p>

        <div className="grid grid-cols-1 gap-2">
          {buttons.map(btn => {
            const status = statuses[btn.format] || 'idle';
            return (
              <button
                key={btn.format}
                onClick={() => withStatus(btn.format, btn.handler as () => Promise<void>)}
                disabled={status === 'loading'}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-70 ${btn.color}`}
              >
                <span className="flex items-center gap-2">
                  {status === 'loading' ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  ) : status === 'done' ? (
                    <span>✓</span>
                  ) : status === 'error' ? (
                    <span>✕</span>
                  ) : (
                    <span>↓</span>
                  )}
                  <span>
                    {status === 'loading' ? 'Exporting...' : status === 'done' ? 'Saved!' : status === 'error' ? 'Failed' : btn.label}
                  </span>
                </span>
                <span className="text-xs opacity-70">{btn.description}</span>
              </button>
            );
          })}
        </div>

        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 mb-1">Future Export Formats</p>
          <p className="text-xs text-gray-400">
            Editable PowerPoint (.pptx) and Word (.docx) with embedded caption — planned for next release.
          </p>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700">
            <strong>Tip:</strong> For Word thesis insertion, use PNG at 1200×800px or higher. For PowerPoint, SVG or PNG at 1600px width provides the sharpest result.
          </p>
        </div>
      </div>
    </div>
  );
}
