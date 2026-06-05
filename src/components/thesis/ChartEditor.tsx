'use client';

import { ChartSettings, ThemeType } from '@/lib/thesis/types';

interface Props {
  settings: ChartSettings;
  onChange: (settings: ChartSettings) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-600">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-colors w-full ${
        value ? 'bg-[#1a5276] text-white border-[#1a5276]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
      }`}
    >
      <span>{value ? '✓' : '○'}</span>
      {label}
    </button>
  );
}

const THEMES: { value: ThemeType; label: string }[] = [
  { value: 'classic_egyptian', label: 'Classic Egyptian Thesis' },
  { value: 'medical_blue', label: 'Medical Blue' },
  { value: 'grayscale', label: 'Grayscale Publication' },
  { value: 'journal_minimal', label: 'Journal Minimal' },
  { value: 'presentation', label: 'Presentation Style' },
];

export default function ChartEditor({ settings, onChange }: Props) {
  const set = <K extends keyof ChartSettings>(key: K, value: ChartSettings[K]) =>
    onChange({ ...settings, [key]: value });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
        <h2 className="text-sm font-semibold text-gray-800">Chart Customization</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Text fields */}
        <Field label="Chart Title">
          <input
            value={settings.title}
            onChange={e => set('title', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
            placeholder="Figure 1. Distribution of..."
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="X-Axis Label">
            <input
              value={settings.xAxisLabel}
              onChange={e => set('xAxisLabel', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
              placeholder="Categories"
            />
          </Field>
          <Field label="Y-Axis Label">
            <input
              value={settings.yAxisLabel}
              onChange={e => set('yAxisLabel', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
              placeholder="Frequency (n)"
            />
          </Field>
        </div>

        {/* Theme */}
        <Field label="Color Theme">
          <select
            value={settings.theme}
            onChange={e => set('theme', e.target.value as ThemeType)}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
          >
            {THEMES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>

        {/* Font size & legend */}
        <div className="grid grid-cols-2 gap-3">
          <Field label={`Font Size: ${settings.fontSize}px`}>
            <input
              type="range" min={10} max={18} value={settings.fontSize}
              onChange={e => set('fontSize', parseInt(e.target.value))}
              className="w-full accent-[#1a5276]"
            />
          </Field>
          <Field label="Legend Position">
            <select
              value={settings.legendPosition}
              onChange={e => set('legendPosition', e.target.value as ChartSettings['legendPosition'])}
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
            >
              {['top', 'bottom', 'left', 'right'].map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Toggles */}
        <Field label="Display Options">
          <div className="grid grid-cols-2 gap-1.5">
            <Toggle value={settings.showDataLabels} onChange={v => set('showDataLabels', v)} label="Data Labels" />
            <Toggle value={settings.showLegend} onChange={v => set('showLegend', v)} label="Legend" />
            <Toggle value={settings.showGridlines} onChange={v => set('showGridlines', v)} label="Gridlines" />
            <Toggle value={settings.showFrequencies} onChange={v => set('showFrequencies', v)} label="Frequencies" />
            <Toggle value={settings.showPercentages} onChange={v => set('showPercentages', v)} label="Percentages" />
            <Toggle value={settings.showPValueFootnote} onChange={v => set('showPValueFootnote', v)} label="P-value Note" />
          </div>
        </Field>

        {/* Export size */}
        <Field label="Export Size (px)">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-400 mb-1">Width</p>
              <input
                type="number" value={settings.exportWidth} min={600} max={3000} step={100}
                onChange={e => set('exportWidth', parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
              />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Height</p>
              <input
                type="number" value={settings.exportHeight} min={400} max={2000} step={100}
                onChange={e => set('exportHeight', parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
              />
            </div>
          </div>
        </Field>
      </div>
    </div>
  );
}
