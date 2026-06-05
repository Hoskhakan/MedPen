'use client';

import { useState, useRef } from 'react';
import { parseTableText } from '@/lib/thesis/parseTable';
import { ParsedTable } from '@/lib/thesis/types';
import { SAMPLE_DATA } from '@/lib/thesis/sampleData';

interface Props {
  onTableParsed: (table: ParsedTable) => void;
}

export default function DataInput({ onTableParsed }: Props) {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload' | 'sample'>('paste');
  const [pasteText, setPasteText] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleParse = () => {
    if (!pasteText.trim()) return;
    const table = parseTableText(pasteText);
    onTableParsed(table);
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

  const handleSample = (text: string) => {
    setPasteText(text);
    setActiveTab('paste');
    onTableParsed(parseTableText(text));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['paste', 'upload', 'sample'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'text-[#1a5276] border-b-2 border-[#1a5276] bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'paste' ? 'Paste Table' : tab === 'upload' ? 'Upload File' : 'Sample Data'}
          </button>
        ))}
      </div>

      <div className="p-4">
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
