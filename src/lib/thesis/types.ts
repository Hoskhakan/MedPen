// Core types for ThesisChart Pro

export type TableType =
  | 'categorical_frequency'
  | 'binary_categorical'
  | 'multi_category_distribution'
  | 'grouped_categorical_comparison'
  | 'continuous_variable_comparison'
  | 'pre_post_comparison'
  | 'longitudinal_followup'
  | 'correlation'
  | 'multi_group_clinical'
  | 'unclear';

export type ChartType =
  | 'bar'
  | 'horizontal_bar'
  | 'pie'
  | 'doughnut'
  | 'clustered_bar'
  | 'stacked_bar'
  | 'line'
  | 'error_bar'
  | 'box_plot'
  | 'scatter';

export type ThemeType =
  | 'classic_egyptian'
  | 'medical_blue'
  | 'grayscale'
  | 'journal_minimal'
  | 'presentation';

export interface ParsedCell {
  raw: string;
  numeric?: number;
  percentage?: number;
  mean?: number;
  sd?: number;
  median?: number;
  iqrLow?: number;
  iqrHigh?: number;
  pValue?: number;
  needsReview?: boolean;
  reviewNote?: string;
}

export interface ParsedRow {
  label: string;
  cells: ParsedCell[];
  isTotal?: boolean;
  isHeader?: boolean;
  isFootnote?: boolean;
}

export interface ParsedTable {
  headers: string[];
  rows: ParsedRow[];
  rawText: string;
  warnings: string[];
}

export interface DetectedTableInfo {
  type: TableType;
  typeLabel: string;
  confidence: number; // 0-1
  description: string;
  variables?: string[];
  groups?: string[];
  hasPercentages: boolean;
  hasMeanSD: boolean;
  hasMedianIQR: boolean;
  hasPValues: boolean;
  isLongitudinal: boolean;
  timePoints?: string[];
  totalN?: number;
}

export interface ChartRecommendation {
  primary: ChartType;
  alternatives: ChartType[];
  reason: string;
  academicNote: string;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number | undefined;
}

export interface TransformedChartData {
  data: ChartDataPoint[];
  keys: string[];          // data keys (series names)
  xAxisLabel: string;
  yAxisLabel: string;
  title: string;
  footnote?: string;
  pValues?: { label: string; value: string }[];
  totalN?: number;
}

export interface ChartSettings {
  chartType: ChartType;
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  theme: ThemeType;
  fontSize: number;
  showDataLabels: boolean;
  showLegend: boolean;
  legendPosition: 'top' | 'bottom' | 'left' | 'right';
  showGridlines: boolean;
  showFrequencies: boolean;
  showPercentages: boolean;
  showPValueFootnote: boolean;
  orientation: 'vertical' | 'horizontal';
  exportWidth: number;
  exportHeight: number;
}

export interface ProjectFile {
  version: string;
  createdAt: string;
  parsedTable: ParsedTable;
  detectedInfo: DetectedTableInfo;
  chartSettings: ChartSettings;
  transformedData: TransformedChartData;
  caption: string;
}

export const DEFAULT_CHART_SETTINGS: ChartSettings = {
  chartType: 'bar',
  title: 'Figure 1.',
  xAxisLabel: '',
  yAxisLabel: 'Frequency (n)',
  theme: 'classic_egyptian',
  fontSize: 13,
  showDataLabels: true,
  showLegend: true,
  legendPosition: 'bottom',
  showGridlines: true,
  showFrequencies: true,
  showPercentages: true,
  showPValueFootnote: true,
  orientation: 'vertical',
  exportWidth: 1200,
  exportHeight: 800,
};

export const THEME_COLORS: Record<ThemeType, string[]> = {
  classic_egyptian: ['#1a5276', '#2e86c1', '#85c1e9', '#1e8449', '#82e0aa', '#d35400', '#f0b27a'],
  medical_blue: ['#003f72', '#0077b6', '#00b4d8', '#90e0ef', '#0096c7', '#48cae4', '#ade8f4'],
  grayscale: ['#1a1a1a', '#404040', '#666666', '#8c8c8c', '#b3b3b3', '#d9d9d9', '#f2f2f2'],
  journal_minimal: ['#2c3e50', '#7f8c8d', '#95a5a6', '#bdc3c7', '#34495e', '#ecf0f1', '#aab7b8'],
  presentation: ['#c0392b', '#e74c3c', '#8e44ad', '#2980b9', '#27ae60', '#f39c12', '#16a085'],
};
