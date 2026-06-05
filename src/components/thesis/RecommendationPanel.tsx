'use client';

import { ChartRecommendation, ChartType, ChartSettings } from '@/lib/thesis/types';
import { getChartLabel } from '@/lib/thesis/recommendChart';

interface Props {
  recommendation: ChartRecommendation;
  currentChartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

const CHART_ICONS: Record<ChartType, string> = {
  bar: '▊',
  horizontal_bar: '▬',
  pie: '◑',
  doughnut: '◎',
  clustered_bar: '▤',
  stacked_bar: '▦',
  line: '📈',
  error_bar: '⊤',
  box_plot: '□',
  scatter: '⁚',
};

export default function RecommendationPanel({ recommendation, currentChartType, onChartTypeChange }: Props) {
  const allTypes: ChartType[] = [
    'bar', 'horizontal_bar', 'pie', 'doughnut',
    'clustered_bar', 'stacked_bar', 'line',
    'error_bar', 'box_plot', 'scatter',
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        <h2 className="text-sm font-semibold text-gray-800">Chart Recommendation</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Primary recommendation */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-lg">{CHART_ICONS[recommendation.primary]}</span>
            <span className="text-sm font-bold text-[#1a5276]">
              Recommended: {getChartLabel(recommendation.primary)}
            </span>
            {currentChartType === recommendation.primary && (
              <span className="ml-auto text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Active</span>
            )}
          </div>
          <p className="text-xs text-blue-800 italic">&quot;{recommendation.academicNote}&quot;</p>
        </div>

        {/* Quick apply buttons */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">Quick Select:</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onChartTypeChange(recommendation.primary)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                currentChartType === recommendation.primary
                  ? 'bg-[#1a5276] text-white border-[#1a5276]'
                  : 'bg-white text-[#1a5276] border-[#1a5276] hover:bg-blue-50'
              }`}
            >
              ★ {getChartLabel(recommendation.primary)}
            </button>
            {recommendation.alternatives.map(alt => (
              <button
                key={alt}
                onClick={() => onChartTypeChange(alt)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  currentChartType === alt
                    ? 'bg-gray-700 text-white border-gray-700'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {getChartLabel(alt)}
              </button>
            ))}
          </div>
        </div>

        {/* All chart types */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">All Chart Types:</p>
          <div className="grid grid-cols-2 gap-1.5">
            {allTypes.map(type => (
              <button
                key={type}
                onClick={() => onChartTypeChange(type)}
                className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-colors ${
                  currentChartType === type
                    ? 'bg-[#1a5276] text-white border-[#1a5276]'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{CHART_ICONS[type]}</span>
                <span>{getChartLabel(type)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
