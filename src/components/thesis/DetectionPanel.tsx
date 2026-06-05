'use client';

import { DetectedTableInfo } from '@/lib/thesis/types';

interface Props {
  info: DetectedTableInfo;
}

const CONFIDENCE_LABELS: Record<string, string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
};

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {children}
    </span>
  );
}

export default function DetectionPanel({ info }: Props) {
  const confidenceLevel = info.confidence >= 0.8 ? 'high' : info.confidence >= 0.6 ? 'medium' : 'low';
  const confidenceColor = confidenceLevel === 'high'
    ? 'text-green-700 bg-green-50 border-green-200'
    : confidenceLevel === 'medium'
    ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-red-700 bg-red-50 border-red-200';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
        <h2 className="text-sm font-semibold text-gray-800">Table Type Detection</h2>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-bold text-[#1a5276]">{info.typeLabel}</p>
            <p className="text-xs text-gray-500 mt-1">{info.description}</p>
          </div>
          <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full border font-medium ${confidenceColor}`}>
            {Math.round(info.confidence * 100)}% {CONFIDENCE_LABELS[confidenceLevel]}
          </span>
        </div>

        {/* Confidence bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${
              confidenceLevel === 'high' ? 'bg-green-500' : confidenceLevel === 'medium' ? 'bg-amber-400' : 'bg-red-400'
            }`}
            style={{ width: `${info.confidence * 100}%` }}
          />
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-1.5">
          {info.hasPercentages && <Badge color="bg-blue-50 text-blue-700">Has Percentages</Badge>}
          {info.hasMeanSD && <Badge color="bg-purple-50 text-purple-700">Mean ± SD</Badge>}
          {info.hasMedianIQR && <Badge color="bg-indigo-50 text-indigo-700">Median [IQR]</Badge>}
          {info.hasPValues && <Badge color="bg-green-50 text-green-700">p-values Present</Badge>}
          {info.isLongitudinal && <Badge color="bg-orange-50 text-orange-700">Longitudinal</Badge>}
          {info.totalN && <Badge color="bg-gray-100 text-gray-600">N = {info.totalN}</Badge>}
        </div>

        {info.groups && info.groups.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1.5">Detected Groups:</p>
            <div className="flex flex-wrap gap-1">
              {info.groups.map((g, i) => (
                <span key={i} className="text-xs bg-[#1a5276]/10 text-[#1a5276] px-2 py-0.5 rounded">{g}</span>
              ))}
            </div>
          </div>
        )}

        {info.timePoints && info.timePoints.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1.5">Time Points:</p>
            <div className="flex flex-wrap gap-1">
              {info.timePoints.map((tp, i) => (
                <span key={i} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded">{tp}</span>
              ))}
            </div>
          </div>
        )}

        {info.type === 'unclear' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              The table structure could not be confidently detected. Please review the parsed data and select the appropriate chart type manually.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
