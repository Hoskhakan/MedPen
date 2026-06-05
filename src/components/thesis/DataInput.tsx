'use client';

import { useState, useRef, useCallback } from 'react';
import { parseTableText } from '@/lib/thesis/parseTable';
import { ParsedTable } from '@/lib/thesis/types';
import { SAMPLE_DATA } from '@/lib/thesis/sampleData';

interface Props {
  onTableParsed: (table: ParsedTable) => void;
}

type OcrStatus = 'idle' | 'loading' | 'done' | 'error';

interface OcrProgress {
  status: string;
  progress: number; // 0–1
}

export default function DataInput({ onTableParsed }: Props) {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload' | 'image' | 'sample'>('paste');
  const [pasteText, setPasteText] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Image OCR state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>('idle');
  const [ocrProgress, setOcrProgress] = useState<OcrProgress>({ status: '', progress: 0 });
  const [ocrText, setOcrText] = useState('');
  const [ocrError, setOcrError] = useState('');
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  // ── Text/CSV/Excel upload ──────────────────────────────────────────────────

  const handleParse = () => {
    if (!pasteText.trim()) return;
    onTableParsed(parseTableText(pasteText));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setIsLoading(true);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (ext === 'csv' || ext === 'txt') {
        const Papa = (await import('papaparse')).default;
        Papa.parse(file, {
          complete: (results) => {
            const rows = results.data as string[][];
            const text = rows.map(r => r.join('\t')).join('\n');
            setPasteText(text);
            onTableParsed(parseTableText(text));
            setIsLoading(false);
          },
          error: () => { setUploadError('Failed to parse CSV file.'); setIsLoading(false); },
        });
      } else if (ext === 'xlsx' || ext === 'xls') {
        const XLSX = await import('xlsx');
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 }) as string[][];
        const text = rows.map(r => r.join('\t')).join('\n');
        setPasteText(text);
        onTableParsed(parseTableText(text));
        setIsLoading(false);
      } else {
        setUploadError('Please upload a CSV, TXT, XLSX, or XLS file.');
        setIsLoading(false);
      }
    } catch {
      setUploadError('Failed to read file. Please try pasting the table instead.');
      setIsLoading(false);
    }
  };

  // ── OCR image processing ───────────────────────────────────────────────────

  const processImage = useCallback(async (file: File) => {
    setOcrError('');
    setOcrText('');
    setOcrStatus('loading');
    setOcrProgress({ status: 'Initializing OCR engine...', progress: 0 });

    // Show preview
    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const Tesseract = await import('tesseract.js');

      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            setOcrProgress({
              status: `Reading text... ${Math.round(m.progress * 100)}%`,
              progress: m.progress,
            });
          } else if (m.status === 'loading tesseract core') {
            setOcrProgress({ status: 'Loading OCR engine...', progress: 0.1 });
          } else if (m.status === 'initializing tesseract') {
            setOcrProgress({ status: 'Initializing...', progress: 0.2 });
          } else if (m.status === 'loading language traineddata') {
            setOcrProgress({ status: 'Loading language data...', progress: 0.3 });
          } else if (m.status === 'initialized tesseract') {
            setOcrProgress({ status: 'Analyzing image...', progress: 0.5 });
          }
        },
      });

      const rawText = result.data.text;
      const cleaned = cleanOcrText(rawText);
      setOcrText(cleaned);
      setOcrStatus('done');
    } catch (err) {
      console.error('OCR error:', err);
      setOcrError('OCR failed. Please try a clearer image or paste the table manually.');
      setOcrStatus('error');
    }
  }, []);

  // Clean and normalize OCR output into a parseable table format
  function cleanOcrText(raw: string): string {
    return raw
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      // Normalize common OCR misreads in medical tables
      .map(line =>
        line
          .replace(/\s{2,}/g, '\t')      // multiple spaces → tab
          .replace(/[|｜]/g, '\t')        // pipes → tab
          .replace(/['']/g, "'")          // smart quotes
          .replace(/[""]/g, '"')
          .replace(/±/g, '±')            // ensure ± preserved
          .replace(/[—–]/g, '-')          // em/en dash → hyphen
          .replace(/(\d)\s+\.\s*(\d)/g, '$1.$2')  // fix "25 . 3" → "25.3"
          .replace(/\bo\b/gi, '0')        // OCR 'o' misread as zero in numeric context
      )
      .join('\n');
  }

  const handleImageFile = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/bmp', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
      setOcrError('Please upload a PNG, JPG, WEBP, BMP, or TIFF image.');
      return;
    }
    processImage(file);
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleOcrAnalyze = () => {
    if (!ocrText.trim()) return;
    const table = parseTableText(ocrText);
    onTableParsed(table);
    // Switch to paste tab so user can review/edit the OCR result
    setPasteText(ocrText);
    setActiveTab('paste');
  };

  // ── Sample data ────────────────────────────────────────────────────────────

  const handleSample = (text: string) => {
    setPasteText(text);
    setActiveTab('paste');
    onTableParsed(parseTableText(text));
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const tabs = [
    { id: 'paste', label: 'Paste Table' },
    { id: 'upload', label: 'Upload File' },
    { id: 'image', label: '📷 Image / Screenshot' },
    { id: 'sample', label: 'Sample Data' },
  ] as const;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-3 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-[#1a5276] border-b-2 border-[#1a5276] bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">

        {/* ── Paste ── */}
        {activeTab === 'paste' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              Paste your table from Word, Excel, or SPSS output. Supports tabs, spaces, pipes, and comma-separated formats.
            </p>
            <textarea
              value={pasteText}
              onChange={e => setPasteText(e.target.value)}
              placeholder={`Example:\nGender\tFrequency\tPercentage\nMale\t30\t60%\nFemale\t20\t40%`}
              className="w-full h-44 font-mono text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent placeholder-gray-300"
            />
            <button
              onClick={handleParse}
              disabled={!pasteText.trim()}
              className="w-full py-2.5 bg-[#1a5276] text-white text-sm font-semibold rounded-lg hover:bg-[#154360] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Analyze Table →
            </button>
          </div>
        )}

        {/* ── File Upload ── */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              Upload a CSV, Excel (.xlsx/.xls), or TXT file containing your table.
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#1a5276] hover:bg-blue-50 transition-colors"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400 mt-1">CSV, Excel (.xlsx), TXT</p>
            </div>
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls,.txt" className="hidden" onChange={handleFileUpload} />
            {isLoading && <p className="text-sm text-blue-600 text-center">Parsing file...</p>}
            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
          </div>
        )}

        {/* ── Image / OCR ── */}
        {activeTab === 'image' && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 font-semibold mb-1">How to use:</p>
              <ol className="text-xs text-blue-700 space-y-0.5 list-decimal list-inside">
                <li>Take a screenshot of your Word/SPSS table (or use a photo)</li>
                <li>Upload the image here — OCR will extract the text automatically</li>
                <li>Review the extracted text, then click &quot;Analyze Table&quot;</li>
              </ol>
            </div>

            {/* Drop zone */}
            {ocrStatus === 'idle' && !imagePreview && (
              <div
                onClick={() => imageRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setIsDraggingImage(true); }}
                onDragLeave={() => setIsDraggingImage(false)}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDraggingImage
                    ? 'border-[#1a5276] bg-blue-50'
                    : 'border-gray-200 hover:border-[#1a5276] hover:bg-blue-50'
                }`}
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                  📷
                </div>
                <p className="text-sm font-medium text-gray-700">Upload table image or screenshot</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, BMP, TIFF</p>
                <p className="text-xs text-gray-400">or drag & drop here</p>
              </div>
            )}
            <input
              ref={imageRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/tiff"
              className="hidden"
              onChange={handleImageInputChange}
            />

            {/* Image preview */}
            {imagePreview && (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Uploaded table"
                    className="w-full object-contain max-h-64"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setOcrText('');
                      setOcrStatus('idle');
                      setOcrError('');
                      if (imageRef.current) imageRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 shadow border border-gray-200 text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* OCR progress */}
                {ocrStatus === 'loading' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{ocrProgress.status}</span>
                      <span>{Math.round(ocrProgress.progress * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 bg-[#1a5276] rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(5, ocrProgress.progress * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      First run may take ~20 seconds to load the OCR engine
                    </p>
                  </div>
                )}

                {/* OCR error */}
                {ocrStatus === 'error' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-700">{ocrError}</p>
                    <button
                      onClick={() => { setOcrStatus('idle'); setImagePreview(null); if (imageRef.current) imageRef.current.value = ''; }}
                      className="mt-2 text-xs text-red-600 underline"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {/* OCR result */}
                {ocrStatus === 'done' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-600">Extracted Text — review & correct if needed:</p>
                      <button
                        onClick={() => processImage(imageRef.current?.files?.[0] as File)}
                        className="text-xs text-[#1a5276] hover:underline"
                      >
                        Re-scan
                      </button>
                    </div>
                    <textarea
                      value={ocrText}
                      onChange={e => setOcrText(e.target.value)}
                      rows={8}
                      className="w-full font-mono text-xs border border-gray-200 rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                      spellCheck={false}
                    />

                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs text-amber-800">
                        <strong>Tip:</strong> OCR works best with clear, high-contrast screenshots. Check that numbers, ± signs, and column separations look correct before analyzing.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleOcrAnalyze}
                        disabled={!ocrText.trim()}
                        className="flex-1 py-2.5 bg-[#1a5276] text-white text-sm font-semibold rounded-lg hover:bg-[#154360] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Analyze Table →
                      </button>
                      <button
                        onClick={() => { setImagePreview(null); setOcrText(''); setOcrStatus('idle'); if (imageRef.current) imageRef.current.value = ''; }}
                        className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}

                {/* Re-upload button when idle with preview */}
                {ocrStatus === 'idle' && imagePreview && (
                  <button
                    onClick={() => imageRef.current?.click()}
                    className="w-full py-2 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    Upload different image
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Sample Data ── */}
        {activeTab === 'sample' && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 mb-3">
              Select a sample table to see ThesisChart Pro in action:
            </p>
            {SAMPLE_DATA.map((sample, i) => (
              <button
                key={i}
                onClick={() => handleSample(sample.text)}
                className="w-full text-left px-4 py-3 rounded-lg border border-gray-100 hover:border-[#1a5276] hover:bg-blue-50 transition-colors group"
              >
                <p className="text-sm font-semibold text-gray-800 group-hover:text-[#1a5276]">{sample.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sample.description}</p>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
