'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

import ThesisHeader from '@/components/thesis/ThesisHeader';
import DataInput from '@/components/thesis/DataInput';
import ParsedTablePreview from '@/components/thesis/ParsedTablePreview';
import DetectionPanel from '@/components/thesis/DetectionPanel';
import RecommendationPanel from '@/components/thesis/RecommendationPanel';
import ChartEditor from '@/components/thesis/ChartEditor';
import ExportPanel from '@/components/thesis/ExportPanel';
import CaptionGenerator from '@/components/thesis/CaptionGenerator';

import { parseTableText } from '@/lib/thesis/parseTable';
import { detectTableType } from '@/lib/thesis/detectTableType';
import { recommendChart } from '@/lib/thesis/recommendChart';
import { transformChartData } from '@/lib/thesis/transformChartData';
import {
  ParsedTable, DetectedTableInfo, ChartRecommendation,
  ChartSettings, TransformedChartData, ChartType, DEFAULT_CHART_SETTINGS,
} from '@/lib/thesis/types';

// Load chart preview without SSR (Recharts needs browser)
const ChartPreview = dynamic(() => import('@/components/thesis/ChartPreview'), { ssr: false });

export default function ThesisChartProPage() {
  const [parsedTable, setParsedTable] = useState<ParsedTable | null>(null);
  const [detectedInfo, setDetectedInfo] = useState<DetectedTableInfo | null>(null);
  const [recommendation, setRecommendation] = useState<ChartRecommendation | null>(null);
  const [chartSettings, setChartSettings] = useState<ChartSettings>(DEFAULT_CHART_SETTINGS);
  const [transformedData, setTransformedData] = useState<TransformedChartData | null>(null);
  const [caption, setCaption] = useState('');
  const [activeSection, setActiveSection] = useState<'input' | 'chart'>('input');

  const handleTableParsed = useCallback((table: ParsedTable) => {
    const info = detectTableType(table);
    const rec = recommendChart(info);
    const settings: ChartSettings = {
      ...DEFAULT_CHART_SETTINGS,
      chartType: rec.primary,
    };
    const data = transformChartData(table, info, settings);

    setParsedTable(table);
    setDetectedInfo(info);
    setRecommendation(rec);
    setChartSettings(settings);
    setTransformedData(data);
    setActiveSection('chart');
  }, []);

  const handleSettingsChange = useCallback((settings: ChartSettings) => {
    setChartSettings(settings);
    if (parsedTable && detectedInfo) {
      setTransformedData(transformChartData(parsedTable, detectedInfo, settings));
    }
  }, [parsedTable, detectedInfo]);

  const handleChartTypeChange = useCallback((type: ChartType) => {
    const newSettings = { ...chartSettings, chartType: type };
    setChartSettings(newSettings);
    if (parsedTable && detectedInfo) {
      setTransformedData(transformChartData(parsedTable, detectedInfo, newSettings));
    }
  }, [chartSettings, parsedTable, detectedInfo]);

  const hasData = parsedTable && detectedInfo && recommendation && transformedData;

  return (
    <div className="min-h-screen bg-gray-50">
      <ThesisHeader />

      {/* Hero strip */}
      <div className="bg-[#1a5276] text-white py-6 px-4">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-xl font-bold">Convert Your Thesis Table into a Publication-Ready Chart</h2>
          <p className="text-sm text-blue-200 mt-1">
            Paste any results table → Automatic detection → Professional academic chart → Export for your dissertation
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Section tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveSection('input')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeSection === 'input' ? 'bg-[#1a5276] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            1. Input Data
          </button>
          <button
            onClick={() => setActiveSection('chart')}
            disabled={!hasData}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              activeSection === 'chart' ? 'bg-[#1a5276] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            2. Chart & Export
          </button>
        </div>

        {/* Step 1: Data input */}
        {activeSection === 'input' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <DataInput onTableParsed={handleTableParsed} />
            </div>

            <div className="space-y-6">
              {parsedTable ? (
                <ParsedTablePreview table={parsedTable} />
              ) : (
                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500">Parsed table preview appears here</p>
                  <p className="text-xs text-gray-400 mt-1">Paste a table or select sample data to get started</p>
                </div>
              )}

              {detectedInfo && (
                <DetectionPanel info={detectedInfo} />
              )}
            </div>
          </div>
        )}

        {/* Step 2: Chart & Export */}
        {activeSection === 'chart' && hasData && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left: Controls */}
            <div className="xl:col-span-1 space-y-6">
              <RecommendationPanel
                recommendation={recommendation}
                currentChartType={chartSettings.chartType}
                onChartTypeChange={handleChartTypeChange}
              />
              <ChartEditor settings={chartSettings} onChange={handleSettingsChange} />
            </div>

            {/* Right: Preview + Export */}
            <div className="xl:col-span-2 space-y-6">
              {/* Table detection summary */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1a5276]"></span>
                    <h2 className="text-sm font-semibold text-gray-800">Live Chart Preview</h2>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    {detectedInfo.typeLabel}
                  </span>
                </div>
                <div className="p-4">
                  <ChartPreview data={transformedData} settings={chartSettings} />
                </div>
              </div>

              <CaptionGenerator
                info={detectedInfo}
                chartType={chartSettings.chartType}
                figureNumber={1}
                onCaptionChange={setCaption}
              />

              <ExportPanel
                data={transformedData}
                settings={chartSettings}
                table={parsedTable}
                info={detectedInfo}
                caption={caption}
              />

              {/* Data table toggle */}
              <ParsedTablePreview table={parsedTable} />
            </div>
          </div>
        )}

        {/* Empty state for chart section */}
        {activeSection === 'chart' && !hasData && (
          <div className="text-center py-20">
            <p className="text-gray-500">Please input and parse a table first.</p>
            <button
              onClick={() => setActiveSection('input')}
              className="mt-4 px-4 py-2 bg-[#1a5276] text-white text-sm rounded-lg hover:bg-[#154360]"
            >
              ← Go to Data Input
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">Supported Table Formats</h3>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Category + frequency + percentage</li>
                <li>• Group comparison tables</li>
                <li>• Mean ± SD tables</li>
                <li>• Pre/post intervention tables</li>
                <li>• Follow-up tables (multiple time points)</li>
                <li>• Tables with p-values</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">Chart Types</h3>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Bar, Horizontal Bar, Pie, Doughnut</li>
                <li>• Clustered & Stacked Bar</li>
                <li>• Line Chart (longitudinal)</li>
                <li>• Error Bar (Mean ± SD)</li>
                <li>• Scatter Plot</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">Future Features</h3>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• AI-powered SPSS output interpretation</li>
                <li>• Auto Results paragraph generator</li>
                <li>• Word/PowerPoint export with caption</li>
                <li>• Saved projects & templates</li>
                <li>• Cloud collaboration for research teams</li>
              </ul>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400">
            ThesisChart Pro — Built for Egyptian Medical Researchers | Part of MedPen Academic Suite
          </p>
        </div>
      </footer>
    </div>
  );
}
