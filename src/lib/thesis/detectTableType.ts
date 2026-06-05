import { ParsedTable, DetectedTableInfo, TableType } from './types';

export function detectTableType(table: ParsedTable): DetectedTableInfo {
  const { headers, rows } = table;
  const dataRows = rows.filter(r => !r.isTotal && !r.isFootnote && !r.isHeader);

  // Aggregate cell stats
  let hasPercentages = false;
  let hasMeanSD = false;
  let hasMedianIQR = false;
  let hasPValues = false;
  let totalN: number | undefined;

  for (const row of dataRows) {
    for (const cell of row.cells) {
      if (cell.percentage !== undefined) hasPercentages = true;
      if (cell.mean !== undefined && cell.sd !== undefined) hasMeanSD = true;
      if (cell.median !== undefined) hasMedianIQR = true;
      if (cell.pValue !== undefined) hasPValues = true;
      if (cell.numeric !== undefined && row.isTotal) totalN = cell.numeric;
    }
  }

  // Detect p-value column in headers
  const pValueHeaderIdx = headers.findIndex(h => /p[- ]?val|significance/i.test(h));
  if (pValueHeaderIdx >= 0) hasPValues = true;

  // Count data columns (excluding label col and p-value col)
  const dataColCount = headers.length - 1 - (pValueHeaderIdx >= 0 ? 1 : 0);

  // Detect time-point / longitudinal patterns
  const timeKeywords = /baseline|month|week|day|year|follow[- ]?up|pre|post|before|after/i;
  const isLongitudinal = headers.some(h => timeKeywords.test(h)) ||
    dataRows.some(r => timeKeywords.test(r.label));

  const timePoints = headers.slice(1).filter(h => timeKeywords.test(h));

  // Detect groups
  const groupKeywords = /group|case|control|male|female|arm|study|intervention|comparison/i;
  const groups = headers.slice(1).filter(h => groupKeywords.test(h) && !timeKeywords.test(h));

  // Detect pre/post
  const prePostKeywords = /pre|before|post|after/i;
  const isPrePost = headers.some(h => prePostKeywords.test(h)) ||
    dataRows.some(r => prePostKeywords.test(r.label));

  // Count rows & columns
  const rowCount = dataRows.length;

  // ─── Classification ───────────────────────────────────────────────────────

  let type: TableType = 'unclear';
  let typeLabel = 'Unknown Table Type';
  let description = '';
  let confidence = 0.5;

  if (hasMeanSD && isLongitudinal) {
    type = 'longitudinal_followup';
    typeLabel = 'Longitudinal Follow-up Table';
    description = 'Continuous measurements (Mean ± SD) across multiple time points.';
    confidence = 0.9;
  } else if (hasMeanSD && isPrePost) {
    type = 'pre_post_comparison';
    typeLabel = 'Pre/Post Comparison Table';
    description = 'Continuous variable compared before and after intervention.';
    confidence = 0.9;
  } else if (hasMeanSD && dataColCount >= 2) {
    type = 'continuous_variable_comparison';
    typeLabel = 'Continuous Variable Comparison Table';
    description = 'Means ± SD compared across groups.';
    confidence = 0.85;
  } else if (hasMedianIQR) {
    type = 'continuous_variable_comparison';
    typeLabel = 'Continuous Variable Comparison (Median/IQR)';
    description = 'Medians with IQR compared across groups.';
    confidence = 0.85;
  } else if (isLongitudinal && hasPercentages) {
    type = 'longitudinal_followup';
    typeLabel = 'Longitudinal Follow-up Table';
    description = 'Categorical outcomes tracked across multiple time points.';
    confidence = 0.85;
  } else if (isPrePost && hasPercentages) {
    type = 'pre_post_comparison';
    typeLabel = 'Pre/Post Comparison Table';
    description = 'Categorical outcomes compared before and after intervention.';
    confidence = 0.85;
  } else if (dataColCount >= 2 && hasPercentages && groups.length >= 2) {
    type = 'grouped_categorical_comparison';
    typeLabel = 'Grouped Categorical Comparison Table';
    description = 'Categorical frequencies compared across two or more independent groups.';
    confidence = 0.85;
  } else if (dataColCount === 1 && hasPercentages && rowCount <= 2) {
    type = 'binary_categorical';
    typeLabel = 'Binary Categorical Table';
    description = 'Distribution of a binary variable (e.g. gender, presence/absence).';
    confidence = 0.9;
  } else if (dataColCount === 1 && hasPercentages && rowCount >= 3) {
    type = 'multi_category_distribution';
    typeLabel = 'Multi-Category Distribution Table';
    description = 'Distribution of a categorical variable across multiple categories.';
    confidence = 0.88;
  } else if (dataColCount === 1 && rowCount >= 2) {
    type = 'categorical_frequency';
    typeLabel = 'Categorical Frequency Table';
    description = 'Simple frequency distribution of a categorical variable.';
    confidence = 0.8;
  } else if (hasMeanSD && dataColCount === 1) {
    type = 'continuous_variable_comparison';
    typeLabel = 'Continuous Variable Summary Table';
    description = 'Summary statistics for continuous variables.';
    confidence = 0.75;
  } else if (dataColCount >= 2 && rowCount >= 2) {
    type = 'multi_group_clinical';
    typeLabel = 'Multi-Group Clinical Comparison Table';
    description = 'Multiple variables compared across groups.';
    confidence = 0.7;
  }

  return {
    type,
    typeLabel,
    confidence,
    description,
    variables: dataRows.map(r => r.label).filter(Boolean),
    groups: groups.length ? groups : undefined,
    hasPercentages,
    hasMeanSD,
    hasMedianIQR,
    hasPValues,
    isLongitudinal,
    timePoints: timePoints.length ? timePoints : undefined,
    totalN,
  };
}
