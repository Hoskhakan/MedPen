import { TransformedChartData, ChartSettings, ParsedTable } from './types';

export async function exportAsPNG(elementId: string, filename: string, width: number, height: number): Promise<void> {
  try {
    const { toBlob } = await import('html-to-image');
    const { saveAs } = await import('file-saver');
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Chart element not found');

    const blob = await toBlob(element, { width, height, pixelRatio: 2, backgroundColor: '#ffffff' });
    if (blob) saveAs(blob, `${filename}.png`);
  } catch (err) {
    console.error('PNG export failed:', err);
    throw err;
  }
}

export async function exportAsSVG(elementId: string, filename: string): Promise<void> {
  try {
    const { toSvg } = await import('html-to-image');
    const { saveAs } = await import('file-saver');
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Chart element not found');

    const svgData = await toSvg(element, { backgroundColor: '#ffffff' });
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    saveAs(blob, `${filename}.svg`);
  } catch (err) {
    console.error('SVG export failed:', err);
    throw err;
  }
}

export async function exportAsPDF(elementId: string, filename: string, title: string): Promise<void> {
  try {
    const { toCanvas } = await import('html-to-image');
    const { jsPDF } = await import('jspdf');
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Chart element not found');

    const canvas = await toCanvas(element, { pixelRatio: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Add title
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, pdfWidth / 2, 15, { align: 'center' });

    const imgWidth = pdfWidth - 20;
    const imgHeight = (canvas.height / canvas.width) * imgWidth;
    const y = Math.max(25, (pdfHeight - imgHeight) / 2);

    pdf.addImage(imgData, 'PNG', 10, y, imgWidth, Math.min(imgHeight, pdfHeight - y - 10));
    pdf.save(`${filename}.pdf`);
  } catch (err) {
    console.error('PDF export failed:', err);
    throw err;
  }
}

export function exportAsCSV(data: TransformedChartData, filename: string): void {
  const { saveAs } = require('file-saver');
  const headers = ['Category', ...data.keys];
  const rows = data.data.map(d => [d.name, ...data.keys.map(k => String(d[k] ?? ''))]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
}

export function exportAsJSON(projectData: unknown, filename: string): void {
  const { saveAs } = require('file-saver');
  const json = JSON.stringify(projectData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  saveAs(blob, `${filename}.json`);
}
