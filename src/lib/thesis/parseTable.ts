import { ParsedTable, ParsedRow, ParsedCell } from './types';

// ─── Cell parsers ────────────────────────────────────────────────────────────

function parsePValue(raw: string): number | undefined {
  const cleaned = raw.trim().replace(/[<>≤≥]/g, '').replace(/\s/g, '');
  const n = parseFloat(cleaned);
  if (!isNaN(n) && n >= 0 && n <= 1) return n;
  if (raw.toLowerCase().includes('ns') || raw.toLowerCase().includes('n.s')) return 1;
  return undefined;
}

function parseCell(raw: string): ParsedCell {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '-' || trimmed === '–' || trimmed === 'N/A') {
    return { raw: trimmed, needsReview: false };
  }

  // p-value column detection
  if (/^[<>≤≥]?\s*0?\.\d+$/.test(trimmed) || trimmed.toLowerCase() === 'ns' || trimmed.toLowerCase() === 'n.s.') {
    const pv = parsePValue(trimmed);
    if (pv !== undefined) return { raw: trimmed, pValue: pv };
  }

  // Mean ± SD  e.g. "25.3 ± 4.1" or "25.3±4.1"
  const meanSDMatch = trimmed.match(/^([\d.]+)\s*[±+\-]\s*([\d.]+)$/);
  if (meanSDMatch) {
    return { raw: trimmed, mean: parseFloat(meanSDMatch[1]), sd: parseFloat(meanSDMatch[2]) };
  }

  // Median [IQR] e.g. "12.0 [8-16]" or "12 (8–16)"
  const medianIQRMatch = trimmed.match(/^([\d.]+)\s*[\[(]([\d.]+)\s*[-–]\s*([\d.]+)[\])]/);
  if (medianIQRMatch) {
    return {
      raw: trimmed,
      median: parseFloat(medianIQRMatch[1]),
      iqrLow: parseFloat(medianIQRMatch[2]),
      iqrHigh: parseFloat(medianIQRMatch[3]),
    };
  }

  // Frequency (percentage%) e.g. "30 (60.0%)" or "30 (60%)"
  const freqPctMatch = trimmed.match(/^(\d+)\s*\((\d+\.?\d*)%?\)$/);
  if (freqPctMatch) {
    return { raw: trimmed, numeric: parseInt(freqPctMatch[1]), percentage: parseFloat(freqPctMatch[2]) };
  }

  // Pure percentage e.g. "60.0%" or "60%"
  const pctMatch = trimmed.match(/^([\d.]+)%$/);
  if (pctMatch) {
    return { raw: trimmed, percentage: parseFloat(pctMatch[1]) };
  }

  // Plain number
  const num = parseFloat(trimmed.replace(',', ''));
  if (!isNaN(num)) {
    return { raw: trimmed, numeric: num };
  }

  // Could not parse numerically — mark for review if it looks like it should be numeric
  const looksNumeric = /[\d.±%]/.test(trimmed);
  return { raw: trimmed, needsReview: looksNumeric, reviewNote: looksNumeric ? 'Value format not recognized' : undefined };
}

// ─── Row classification ──────────────────────────────────────────────────────

function isFootnoteLine(line: string): boolean {
  return /^[\*†‡§]|^Note:|^Abbreviation|^SD\s*=|^IQR\s*=|^p\s*value/i.test(line.trim());
}

function isTotalRow(label: string): boolean {
  return /^total|^grand total/i.test(label.trim());
}

function isHeaderLike(cells: string[]): boolean {
  // A header row has mostly non-numeric cells
  const numeric = cells.filter(c => /^[\d.±%\[\]()]+$/.test(c.trim())).length;
  return numeric < cells.length / 2;
}

// ─── Split line into cells ───────────────────────────────────────────────────

function splitLine(line: string): string[] {
  // Try tab-separated first
  if (line.includes('\t')) return line.split('\t').map(c => c.trim());
  // Pipe-separated
  if (line.includes('|')) return line.split('|').map(c => c.trim()).filter(Boolean);
  // Multiple spaces (≥2) as delimiter
  return line.split(/\s{2,}/).map(c => c.trim()).filter(Boolean);
}

// ─── Main parser ─────────────────────────────────────────────────────────────

export function parseTableText(text: string): ParsedTable {
  const warnings: string[] = [];
  const lines = text.split('\n').map(l => l.trimEnd()).filter(l => l.trim());

  if (lines.length < 2) {
    return { headers: [], rows: [], rawText: text, warnings: ['Table appears too short. Please provide at least 2 rows.'] };
  }

  const splitLines = lines.map(splitLine);

  // Determine column count from most common row width
  const widths = splitLines.map(r => r.length);
  const colCount = widths.reduce((a, b, _, arr) =>
    arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b, widths[0]);

  let headerIdx = 0;
  let headers: string[] = [];

  // Find first header row
  for (let i = 0; i < Math.min(3, splitLines.length); i++) {
    if (isHeaderLike(splitLines[i]) && splitLines[i].length >= 2) {
      headers = splitLines[i];
      headerIdx = i;
      break;
    }
  }

  if (!headers.length) {
    // Synthetic headers
    headers = splitLines[0].length >= 2 ? splitLines[0] : Array.from({ length: colCount }, (_, i) => i === 0 ? 'Variable' : `Group ${i}`);
    headerIdx = splitLines[0].length >= 2 ? 0 : -1;
    if (!splitLines[0].some(c => /[a-zA-Z]/.test(c))) {
      warnings.push('No clear header row detected. First row assumed to be data.');
    }
  }

  const rows: ParsedRow[] = [];
  let pctSumCheck: Record<number, number> = {};

  for (let i = headerIdx + 1; i < splitLines.length; i++) {
    const cols = splitLines[i];
    if (!cols.length) continue;

    const line = lines[i];

    if (isFootnoteLine(line)) {
      rows.push({ label: line.trim(), cells: [], isFootnote: true });
      continue;
    }

    const label = cols[0] || '';
    const dataCols = cols.slice(1);

    // Pad or trim to expected column count
    while (dataCols.length < headers.length - 1) dataCols.push('');

    const cells: ParsedCell[] = dataCols.map(c => parseCell(c));

    const isTotal = isTotalRow(label);

    // Track percentage sums for validation
    cells.forEach((cell, ci) => {
      if (cell.percentage !== undefined) {
        pctSumCheck[ci] = (pctSumCheck[ci] || 0) + cell.percentage;
      }
    });

    rows.push({ label, cells, isTotal });
  }

  // Validate percentage totals
  for (const [colIdx, sum] of Object.entries(pctSumCheck)) {
    const tolerance = 2;
    if (sum > 0 && Math.abs(sum - 100) > tolerance && sum < 200) {
      warnings.push(`Column "${headers[parseInt(colIdx) + 1] || colIdx}" percentages sum to ${sum.toFixed(1)}% (expected ~100%). Please verify.`);
    }
  }

  // Check for review-needed cells
  const reviewCount = rows.flatMap(r => r.cells).filter(c => c.needsReview).length;
  if (reviewCount > 0) {
    warnings.push(`${reviewCount} cell(s) could not be fully parsed and are marked for review.`);
  }

  return { headers, rows, rawText: text, warnings };
}
