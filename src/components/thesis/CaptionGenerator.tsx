'use client';

import { useState, useEffect } from 'react';
import { DetectedTableInfo, ChartType } from '@/lib/thesis/types';
import { getChartLabel } from '@/lib/thesis/recommendChart';

interface Props {
  info: DetectedTableInfo;
  chartType: ChartType;
  figureNumber: number;
  onCaptionChange: (caption: string) => void;
}

function generateCaption(info: DetectedTableInfo, chartType: ChartType, figNo: number): string {
  const chartDesc = getChartLabel(chartType).toLowerCase();
  const groups = info.groups?.join(' and ');
  const timePoints = info.timePoints?.join(', ');

  switch (info.type) {
    case 'binary_categorical':
    case 'categorical_frequency':
    case 'multi_category_distribution': {
      const varName = info.variables?.[0] || 'studied variable';
      return `Figure ${figNo}. ${chartDesc.charAt(0).toUpperCase() + chartDesc.slice(1)} showing distribution of studied patients according to ${varName.toLowerCase()}.`;
    }
    case 'grouped_categorical_comparison':
      return `Figure ${figNo}. Comparison of studied variables between ${groups || 'the studied groups'}.`;
    case 'continuous_variable_comparison': {
      const stat = info.hasMeanSD ? '(Mean ± SD)' : info.hasMedianIQR ? '(Median [IQR])' : '';
      return `Figure ${figNo}. Comparison of continuous variables ${stat} between ${groups || 'the studied groups'}.`;
    }
    case 'pre_post_comparison':
      return `Figure ${figNo}. Comparison of studied outcomes before and after intervention among the study population.`;
    case 'longitudinal_followup':
      return `Figure ${figNo}. Longitudinal changes in studied outcomes across follow-up time points ${timePoints ? `(${timePoints})` : ''}.`;
    case 'multi_group_clinical':
      return `Figure ${figNo}. Comparison of clinical characteristics between ${groups || 'the studied groups'}.`;
    default:
      return `Figure ${figNo}. Graphical representation of studied data.`;
  }
}

export default function CaptionGenerator({ info, chartType, figureNumber, onCaptionChange }: Props) {
  const [caption, setCaption] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const generated = generateCaption(info, chartType, figureNumber);
    setCaption(generated);
    onCaptionChange(generated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info, chartType, figureNumber]);

  const handleChange = (val: string) => {
    setCaption(val);
    onCaptionChange(val);
  };

  const handleRegenerate = () => {
    const generated = generateCaption(info, chartType, figureNumber);
    setCaption(generated);
    onCaptionChange(generated);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          <h2 className="text-sm font-semibold text-gray-800">Figure Caption</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRegenerate}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
          >
            Regenerate
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-[#1a5276] hover:text-[#154360] px-2 py-1 rounded border border-[#1a5276]/30 hover:bg-blue-50"
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="p-4">
        {isEditing ? (
          <textarea
            value={caption}
            onChange={e => handleChange(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
          />
        ) : (
          <p className="text-sm font-serif text-gray-800 leading-relaxed italic">&quot;{caption}&quot;</p>
        )}

        <div className="mt-3 flex items-start gap-2 p-2.5 bg-blue-50 rounded-lg">
          <span className="text-blue-500 shrink-0">ℹ</span>
          <p className="text-xs text-blue-700">
            Caption is auto-generated from detected table type. Only what is directly shown in the chart is described. Edit freely for your specific thesis context.
          </p>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <label className="text-xs text-gray-500">Figure number:</label>
          <input
            type="number"
            value={figureNumber}
            min={1}
            onChange={e => {
              const newCaption = generateCaption(info, chartType, parseInt(e.target.value));
              setCaption(newCaption);
              onCaptionChange(newCaption);
            }}
            className="w-16 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#1a5276]"
          />
        </div>
      </div>
    </div>
  );
}
