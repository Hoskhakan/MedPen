import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ThesisChart Pro — Academic Chart Generator for Medical Theses',
  description: 'Convert medical thesis result tables into publication-ready charts for Egyptian master\'s and PhD dissertations.',
};

export default function ThesisChartProLayout({ children }: { children: React.ReactNode }) {
  return children;
}
