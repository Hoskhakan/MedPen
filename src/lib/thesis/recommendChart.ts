import { DetectedTableInfo, ChartRecommendation, ChartType, TableType } from './types';

const CHART_LABELS: Record<ChartType, string> = {
  bar: 'Vertical Bar Chart',
  horizontal_bar: 'Horizontal Bar Chart',
  pie: 'Pie Chart',
  doughnut: 'Doughnut Chart',
  clustered_bar: 'Clustered Bar Chart',
  stacked_bar: 'Stacked Bar Chart',
  line: 'Line Chart',
  error_bar: 'Error Bar Chart (Mean ± SD)',
  box_plot: 'Box Plot',
  scatter: 'Scatter Plot',
};

export function getChartLabel(type: ChartType): string {
  return CHART_LABELS[type];
}

export function recommendChart(info: DetectedTableInfo): ChartRecommendation {
  const { type, variables = [], hasPercentages, hasMeanSD, hasMedianIQR, isLongitudinal } = info;
  const categoryCount = variables.length;
  const longLabels = variables.some(v => v.length > 25);

  const recommendations: Record<TableType, ChartRecommendation> = {
    categorical_frequency: {
      primary: categoryCount <= 5 && !longLabels ? 'pie' : 'bar',
      alternatives: ['bar', 'horizontal_bar', 'doughnut'],
      reason: 'This table shows the distribution of a categorical variable.',
      academicNote: categoryCount <= 5
        ? 'Pie chart is recommended for simple part-to-whole distributions with few categories. Bar chart is an acceptable alternative for easier value comparison.'
        : 'Bar chart is recommended when categories exceed 5, as bar charts allow more precise frequency comparisons than pie charts.',
    },
    binary_categorical: {
      primary: 'pie',
      alternatives: ['bar', 'doughnut'],
      reason: 'Binary variable — ideal for a part-to-whole display.',
      academicNote: 'Pie chart is appropriate for binary distributions (e.g. Male/Female). Doughnut chart is a modern variant suitable for presentations.',
    },
    multi_category_distribution: {
      primary: longLabels ? 'horizontal_bar' : 'bar',
      alternatives: ['horizontal_bar', 'pie', 'doughnut'],
      reason: 'Multi-category distribution table.',
      academicNote: longLabels
        ? 'Horizontal bar chart is recommended when category labels are long, to prevent label overlap and improve readability.'
        : 'Bar chart is the standard academic choice for multi-category frequency distributions.',
    },
    grouped_categorical_comparison: {
      primary: 'clustered_bar',
      alternatives: ['stacked_bar', 'horizontal_bar'],
      reason: 'Grouped data comparing categories across independent groups.',
      academicNote: 'Clustered (grouped) bar chart is the standard for comparing categorical frequencies across two or more independent groups. Stacked bar chart is an alternative when composition within groups is the focus.',
    },
    continuous_variable_comparison: {
      primary: hasMeanSD ? 'error_bar' : hasMedianIQR ? 'box_plot' : 'bar',
      alternatives: hasMeanSD ? ['bar', 'box_plot'] : ['bar', 'error_bar'],
      reason: 'Continuous variable data with summary statistics.',
      academicNote: hasMeanSD
        ? 'Error bar chart (Mean ± SD) is the standard academic format for comparing continuous variables across groups. It accurately represents both central tendency and variability.'
        : 'Box plot is preferred when median and IQR are available, as it represents the full distribution without assuming normality.',
    },
    pre_post_comparison: {
      primary: hasMeanSD ? 'error_bar' : 'clustered_bar',
      alternatives: ['line', 'bar'],
      reason: 'Pre/post intervention comparison.',
      academicNote: 'Error bar chart or clustered bar chart is recommended for pre/post comparisons to clearly show the change with variability. Line chart can also be used to emphasize the trajectory of change.',
    },
    longitudinal_followup: {
      primary: 'line',
      alternatives: ['error_bar', 'clustered_bar'],
      reason: 'Longitudinal data with multiple time points.',
      academicNote: 'Line chart is the standard academic choice for longitudinal data to clearly visualize trends over time. Error bars can be added to show variability at each time point.',
    },
    correlation: {
      primary: 'scatter',
      alternatives: ['bar'],
      reason: 'Correlation or association data.',
      academicNote: 'Scatter plot is the standard for displaying correlations or associations between two continuous variables.',
    },
    multi_group_clinical: {
      primary: longLabels ? 'horizontal_bar' : 'clustered_bar',
      alternatives: ['stacked_bar', 'bar'],
      reason: 'Multi-group clinical comparison with several variables.',
      academicNote: 'Clustered bar chart is recommended for multi-group clinical comparisons. Horizontal orientation is preferred when variable names are long.',
    },
    unclear: {
      primary: 'bar',
      alternatives: ['horizontal_bar', 'pie'],
      reason: 'Table structure is unclear — defaulting to bar chart.',
      academicNote: 'Bar chart is selected as a safe default. Please verify the table structure and select an alternative if needed.',
    },
  };

  return recommendations[type] || recommendations.unclear;
}
