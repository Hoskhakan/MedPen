import { ParsedTable, DetectedTableInfo, ChartSettings, TransformedChartData, ChartDataPoint } from './types';

export function transformChartData(
  table: ParsedTable,
  info: DetectedTableInfo,
  settings: ChartSettings,
): TransformedChartData {
  const dataRows = table.rows.filter(r => !r.isFootnote && !r.isHeader);
  const headers = table.headers;

  // Determine data column headers (everything except col 0 and p-value cols)
  const pValueColIndices = new Set<number>();
  headers.forEach((h, i) => {
    if (/p[- ]?val|significance/i.test(h)) pValueColIndices.add(i - 1); // i-1 because headers[0] is label col
  });

  const dataColHeaders = headers.slice(1).filter((_, i) => !pValueColIndices.has(i));

  // Collect p-values
  const pValues: { label: string; value: string }[] = [];

  const data: ChartDataPoint[] = [];

  for (const row of dataRows) {
    if (row.isTotal && !settings.showFrequencies) continue;
    const point: ChartDataPoint = { name: row.label || 'Unknown' };

    row.cells.forEach((cell, colIdx) => {
      if (pValueColIndices.has(colIdx)) {
        if (cell.pValue !== undefined) {
          const pLabel = row.label;
          const pDisplay = cell.pValue < 0.001 ? '<0.001' : cell.pValue.toFixed(3);
          pValues.push({ label: pLabel, value: `p = ${pDisplay}` });
        }
        return;
      }

      const colName = dataColHeaders[colIdx] || `Group ${colIdx + 1}`;

      // Decide which value to use for charting
      if (cell.mean !== undefined && cell.sd !== undefined) {
        point[colName] = cell.mean;
        point[`${colName}_error`] = cell.sd;
      } else if (cell.median !== undefined) {
        point[colName] = cell.median;
        if (cell.iqrLow !== undefined) point[`${colName}_iqrLow`] = cell.iqrLow;
        if (cell.iqrHigh !== undefined) point[`${colName}_iqrHigh`] = cell.iqrHigh;
      } else if (settings.showPercentages && cell.percentage !== undefined) {
        point[colName] = cell.percentage;
        if (settings.showFrequencies && cell.numeric !== undefined) {
          point[`${colName}_n`] = cell.numeric;
        }
      } else if (cell.numeric !== undefined) {
        point[colName] = cell.numeric;
      } else if (cell.percentage !== undefined) {
        point[colName] = cell.percentage;
      } else {
        point[colName] = 0;
      }
    });

    data.push(point);
  }

  // Determine axis labels
  const hasSD = data.some(d => Object.keys(d).some(k => k.endsWith('_error')));
  const hasPercentages = info.hasPercentages && settings.showPercentages;

  let yAxisLabel = settings.yAxisLabel || '';
  if (!yAxisLabel) {
    if (hasSD) yAxisLabel = 'Mean ± SD';
    else if (info.hasMedianIQR) yAxisLabel = 'Median [IQR]';
    else if (hasPercentages) yAxisLabel = 'Percentage (%)';
    else yAxisLabel = 'Frequency (n)';
  }

  // Build footnote
  let footnote = '';
  if (settings.showPValueFootnote && pValues.length > 0) {
    footnote = pValues.map(pv => `${pv.label}: ${pv.value}`).join('  |  ');
  }
  if (info.hasMeanSD) footnote = footnote ? `${footnote}  |  Values are Mean ± SD` : 'Values are Mean ± SD';
  if (info.hasMedianIQR) footnote = footnote ? `${footnote}  |  Values are Median [IQR]` : 'Values are Median [IQR]';

  return {
    data,
    keys: dataColHeaders,
    xAxisLabel: settings.xAxisLabel || '',
    yAxisLabel,
    title: settings.title,
    footnote: footnote || undefined,
    pValues: pValues.length ? pValues : undefined,
    totalN: info.totalN,
  };
}
