export interface SampleEntry {
  label: string;
  description: string;
  text: string;
}

export const SAMPLE_DATA: SampleEntry[] = [
  {
    label: 'Gender Distribution',
    description: 'Simple binary categorical table (pie/bar)',
    text: `Gender\tFrequency\tPercentage
Male\t30\t60%
Female\t20\t40%
Total\t50\t100%`,
  },
  {
    label: 'Age Group Distribution',
    description: 'Multi-category frequency table',
    text: `Age Group\tFrequency\tPercentage
< 20 years\t8\t16.0%
20 – 30 years\t22\t44.0%
31 – 40 years\t12\t24.0%
> 40 years\t8\t16.0%
Total\t50\t100.0%`,
  },
  {
    label: 'Group Comparison (Two Groups)',
    description: 'Grouped categorical comparison with p-value',
    text: `Variable\tGroup A (n=30)\tGroup B (n=20)\tp-value
Male\t18 (60.0%)\t10 (50.0%)\t0.432
Female\t12 (40.0%)\t10 (50.0%)\t0.432
Hypertension\t12 (40.0%)\t14 (70.0%)\t0.031
Diabetes\t6 (20.0%)\t8 (40.0%)\t0.091`,
  },
  {
    label: 'Pre/Post Pain Scores',
    description: 'Pre/post comparison with Mean ± SD and p-value',
    text: `Variable\tPre-treatment\tPost-treatment\tp-value
Pain Score (VAS)\t7.2 ± 1.4\t2.8 ± 1.1\t<0.001
Anxiety Score\t14.5 ± 3.2\t8.3 ± 2.7\t0.002
Quality of Life\t42.1 ± 8.6\t68.4 ± 9.1\t<0.001`,
  },
  {
    label: 'Follow-up Table',
    description: 'Longitudinal follow-up across time points',
    text: `Outcome\tBaseline\t1 Month\t3 Months\t6 Months
Pain (Mean ± SD)\t7.5 ± 1.2\t5.1 ± 1.4\t3.2 ± 1.1\t1.8 ± 0.9
Function Score\t38.2 ± 6.4\t52.4 ± 7.1\t67.8 ± 8.3\t78.5 ± 7.6`,
  },
  {
    label: 'Clinical Comparison (Three Groups)',
    description: 'Multi-group clinical comparison',
    text: `Variable\tControl (n=30)\tGroup I (n=30)\tGroup II (n=30)\tp-value
Age (years)\t38.2 ± 6.1\t40.5 ± 7.3\t39.8 ± 5.9\t0.412
BMI (kg/m²)\t24.1 ± 3.2\t26.8 ± 4.1\t27.4 ± 3.8\t0.023
Hemoglobin\t13.2 ± 1.4\t11.8 ± 1.6\t10.9 ± 1.3\t<0.001`,
  },
];
