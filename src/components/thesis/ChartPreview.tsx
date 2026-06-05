'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, LabelList, ErrorBar, ScatterChart, Scatter,
} from 'recharts';
import { TransformedChartData, ChartSettings, THEME_COLORS } from '@/lib/thesis/types';

interface Props {
  data: TransformedChartData;
  settings: ChartSettings;
}

const RADIAN = Math.PI / 180;

// Custom label for pie slices
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.04) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
}

// Custom tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-lg text-xs">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="flex gap-2">
          <span>{p.name}:</span>
          <span className="font-semibold">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
        </p>
      ))}
    </div>
  );
}

// Custom data label formatter
/* eslint-disable-next-line */
function renderLabel(value: unknown) {
  const n = Number(value);
  if (isNaN(n)) return '';
  return n % 1 === 0 ? String(n) : n.toFixed(1);
}

export default function ChartPreview({ data, settings }: Props) {
  const colors = THEME_COLORS[settings.theme];
  const { chartType, showDataLabels, showLegend, showGridlines, fontSize, legendPosition } = settings;
  const { data: chartData, keys, xAxisLabel, yAxisLabel, title, footnote } = data;

  if (!chartData.length || !keys.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-sm text-gray-400">No chart data available. Please parse a table first.</p>
      </div>
    );
  }

  const commonAxisProps = {
    tick: { fontSize, fill: '#374151' },
    axisLine: { stroke: '#9CA3AF' },
    tickLine: { stroke: '#9CA3AF' },
  };

  const renderChart = () => {
    // ── Pie / Doughnut ──────────────────────────────────────────────
    if (chartType === 'pie' || chartType === 'doughnut') {
      const pieData = chartData.filter(d => !String(d.name).toLowerCase().includes('total')).map(d => ({
        name: d.name,
        value: (d[keys[0]] as number) || 0,
      }));
      const innerR = chartType === 'doughnut' ? '45%' : '0%';
      return (
        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="75%"
              innerRadius={innerR}
              labelLine={false}
              label={showDataLabels ? PieLabel : undefined}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} stroke="white" strokeWidth={2} />
              ))}
            </Pie>
            {showLegend && (
              <Legend
                formatter={(value) => <span style={{ fontSize: fontSize - 1, color: '#374151' }}>{value}</span>}
                wrapperStyle={{ paddingTop: 8 }}
              />
            )}
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    // ── Line chart ──────────────────────────────────────────────────
    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
            {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis dataKey="name" {...commonAxisProps} label={{ value: xAxisLabel, position: 'insideBottom', offset: -15, fontSize }} />
            <YAxis {...commonAxisProps} label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 10, fontSize }} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend verticalAlign={legendPosition === 'top' ? 'top' : 'bottom'} wrapperStyle={{ fontSize: fontSize - 1 }} />
            )}
            {keys.filter(k => !k.endsWith('_error') && !k.endsWith('_n') && !k.endsWith('_iqrLow') && !k.endsWith('_iqrHigh')).map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i % colors.length]}
                strokeWidth={2.5}
                dot={{ r: 5, fill: colors[i % colors.length], strokeWidth: 2, stroke: 'white' }}
                activeDot={{ r: 7 }}
              >
                {showDataLabels && <LabelList dataKey={key} position="top" formatter={renderLabel} style={{ fontSize: fontSize - 2 }} />}
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // ── Error bar chart ─────────────────────────────────────────────
    if (chartType === 'error_bar') {
      const displayKeys = keys.filter(k => !k.endsWith('_error') && !k.endsWith('_n') && !k.endsWith('_iqrLow') && !k.endsWith('_iqrHigh'));
      return (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 40 }}>
            {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />}
            <XAxis dataKey="name" {...commonAxisProps}
              label={{ value: xAxisLabel, position: 'insideBottom', offset: -25, fontSize }}
              tick={{ ...commonAxisProps.tick, width: 80 }}
            />
            <YAxis {...commonAxisProps} label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 10, fontSize }} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && displayKeys.length > 1 && (
              <Legend verticalAlign={legendPosition === 'top' ? 'top' : 'bottom'} wrapperStyle={{ fontSize: fontSize - 1 }} />
            )}
            {displayKeys.map((key, i) => (
              <Bar key={key} dataKey={key} fill={colors[i % colors.length]} barSize={displayKeys.length > 2 ? 30 : 50} radius={[3, 3, 0, 0]}>
                <ErrorBar dataKey={`${key}_error`} width={6} strokeWidth={2} stroke={colors[i % colors.length]} opacity={0.7} />
                {showDataLabels && <LabelList dataKey={key} position="top" formatter={renderLabel} style={{ fontSize: fontSize - 2, fontWeight: 'bold' }} />}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // ── Stacked bar ─────────────────────────────────────────────────
    if (chartType === 'stacked_bar') {
      const displayKeys = keys.filter(k => !k.endsWith('_error') && !k.endsWith('_n') && !k.endsWith('_iqrLow') && !k.endsWith('_iqrHigh'));
      return (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
            {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />}
            <XAxis dataKey="name" {...commonAxisProps}
              label={{ value: xAxisLabel, position: 'insideBottom', offset: -25, fontSize }}
            />
            <YAxis {...commonAxisProps} label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 10, fontSize }} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend verticalAlign={legendPosition === 'top' ? 'top' : 'bottom'} wrapperStyle={{ fontSize: fontSize - 1 }} />
            )}
            {displayKeys.map((key, i) => (
              <Bar key={key} dataKey={key} stackId="a" fill={colors[i % colors.length]}>
                {showDataLabels && <LabelList dataKey={key} position="inside" formatter={renderLabel} style={{ fontSize: fontSize - 3, fill: 'white', fontWeight: 'bold' }} />}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // ── Horizontal bar ──────────────────────────────────────────────
    if (chartType === 'horizontal_bar') {
      const displayKeys = keys.filter(k => !k.endsWith('_error') && !k.endsWith('_n') && !k.endsWith('_iqrLow') && !k.endsWith('_iqrHigh'));
      return (
        <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 50 + 80)}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 60, left: 10, bottom: 10 }}>
            {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />}
            <XAxis type="number" {...commonAxisProps} label={{ value: yAxisLabel, position: 'insideBottom', offset: -5, fontSize }} />
            <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: fontSize - 1, fill: '#374151' }} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && displayKeys.length > 1 && (
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: fontSize - 1 }} />
            )}
            {displayKeys.map((key, i) => (
              <Bar key={key} dataKey={key} fill={colors[i % colors.length]} barSize={displayKeys.length > 1 ? 20 : 28} radius={[0, 3, 3, 0]}>
                {showDataLabels && <LabelList dataKey={key} position="right" formatter={renderLabel} style={{ fontSize: fontSize - 2, fill: '#374151' }} />}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // ── Scatter ─────────────────────────────────────────────────────
    if (chartType === 'scatter') {
      const scatterData = chartData.map(d => ({ x: d.name, y: d[keys[0]] as number }));
      return (
        <ResponsiveContainer width="100%" height={360}>
          <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
            {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis dataKey="x" name={xAxisLabel || 'X'} {...commonAxisProps}
              label={{ value: xAxisLabel, position: 'insideBottom', offset: -20, fontSize }}
            />
            <YAxis dataKey="y" name={yAxisLabel || 'Y'} {...commonAxisProps}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 10, fontSize }}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={scatterData} fill={colors[0]} />
          </ScatterChart>
        </ResponsiveContainer>
      );
    }

    // ── Box plot placeholder ─────────────────────────────────────────
    if (chartType === 'box_plot') {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200 gap-3">
          <p className="text-sm font-semibold text-gray-600">Box Plot</p>
          <p className="text-xs text-gray-400 text-center max-w-xs">
            Box plot requires a specialized library (e.g. visx or d3). The data has been parsed correctly and includes Median/IQR values. Switch to Error Bar chart for a publication-ready alternative.
          </p>
          <button
            onClick={() => {}}
            className="text-xs text-[#1a5276] underline"
          >
            View parsed Median/IQR values above
          </button>
        </div>
      );
    }

    // ── Default: Vertical bar / Clustered bar ───────────────────────
    const displayKeys = keys.filter(k => !k.endsWith('_error') && !k.endsWith('_n') && !k.endsWith('_iqrLow') && !k.endsWith('_iqrHigh'));
    const barSize = displayKeys.length > 2 ? 22 : displayKeys.length > 1 ? 32 : 50;

    return (
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 50 }}>
          {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />}
          <XAxis
            dataKey="name"
            {...commonAxisProps}
            tick={{ ...commonAxisProps.tick, width: 100 }}
            label={{ value: xAxisLabel, position: 'insideBottom', offset: -35, fontSize }}
            interval={0}
            angle={chartData.length > 5 ? -30 : 0}
            textAnchor={chartData.length > 5 ? 'end' : 'middle'}
          />
          <YAxis
            {...commonAxisProps}
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 10, fontSize }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && displayKeys.length > 1 && (
            <Legend
              verticalAlign={legendPosition === 'top' ? 'top' : 'bottom'}
              wrapperStyle={{ fontSize: fontSize - 1, paddingTop: legendPosition === 'bottom' ? 20 : 0 }}
            />
          )}
          {displayKeys.map((key, i) => (
            <Bar key={key} dataKey={key} fill={colors[i % colors.length]} barSize={barSize} radius={[3, 3, 0, 0]}>
              {showDataLabels && (
                <LabelList
                  dataKey={key}
                  position="top"
                  formatter={renderLabel}
                  style={{ fontSize: fontSize - 2, fill: '#374151', fontWeight: 'bold' }}
                />
              )}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div id="thesis-chart-preview" className="bg-white rounded-xl p-6" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Title */}
      {title && (
        <p className="text-center font-bold text-gray-900 mb-4" style={{ fontSize: fontSize + 1 }}>
          {title}
        </p>
      )}

      {/* Chart */}
      {renderChart()}

      {/* Footnote */}
      {footnote && (
        <p className="text-center mt-3 text-gray-500 border-t border-gray-100 pt-2" style={{ fontSize: fontSize - 3 }}>
          {footnote}
        </p>
      )}
    </div>
  );
}
