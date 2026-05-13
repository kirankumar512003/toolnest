'use client';

import { useState, useRef, useCallback } from 'react';
import { Button, SectionLabel, SplitPanel } from '../ui';
import CodeEditor from '../CodeEditor';

type StudioMode = 'merge' | 'extract';

export default function PdfStudio() {
  const [mode, setMode] = useState<StudioMode>('extract');
  const [files, setFiles] = useState<File[]>([]);
  const [extractedData, setExtractedData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
      if (mode === 'extract') {
        setFiles(newFiles.slice(0, 1)); // only one file for extraction
      } else {
        setFiles(prev => [...prev, ...newFiles]);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleExtract = async () => {
    if (files.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      // Connect to the FastAPI backend running on port 8000
      const res = await fetch('http://127.0.0.1:8000/api/pdf/extract', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Extraction failed');
      
      const data = await res.json();
      setExtractedData(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const res = await fetch('http://127.0.0.1:8000/api/pdf/merge', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Merge failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="flex gap-4 mb-6 border-b border-[var(--border)] pb-4">
        <button
          onClick={() => { setMode('extract'); setFiles([]); setExtractedData(''); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'extract' ? 'bg-[var(--accent)] text-black' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)]'}`}
        >
          Smart Extractor
        </button>
        <button
          onClick={() => { setMode('merge'); setFiles([]); setExtractedData(''); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'merge' ? 'bg-[var(--accent)] text-black' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)]'}`}
        >
          PDF Merger
        </button>
      </div>

      <SplitPanel>
        <div className="flex flex-col flex-1 h-full min-h-0 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)] p-6">
          <SectionLabel>{mode === 'extract' ? 'Upload PDF to Extract' : 'Upload PDFs to Merge'}</SectionLabel>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 flex-1 border-2 border-dashed border-[var(--border)] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-colors"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf" 
              multiple={mode === 'merge'} 
              onChange={handleFileChange}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-muted)] mb-4">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M12 18v-6" />
              <path d="m9 15 3-3 3 3" />
            </svg>
            <p className="text-[var(--text)] font-medium">Click to browse or drag files here</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {mode === 'extract' ? 'Only 1 PDF file allowed' : 'Select at least 2 PDF files'}
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]">
                  <span className="text-sm truncate mr-4">{file.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="text-red-400 hover:text-red-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            {error && <span className="text-red-400 text-sm">{error}</span>}
            <div className="ml-auto">
              {mode === 'extract' ? (
                <Button onClick={handleExtract} disabled={files.length === 0 || isLoading}>
                  {isLoading ? 'Extracting...' : 'Extract Content'}
                </Button>
              ) : (
                <Button onClick={handleMerge} disabled={files.length < 2 || isLoading}>
                  {isLoading ? 'Merging...' : 'Merge PDFs'}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 h-full min-h-0 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)] p-6">
          <SectionLabel>Results</SectionLabel>
          <div className="flex-1 mt-4 rounded-lg overflow-hidden border border-[var(--border)] bg-[#0d1117] h-full flex flex-col">
             {mode === 'extract' ? (
                <CodeEditor
                  value={extractedData || '// Extracted JSON/text will appear here...'}
                  readOnly
                  className="!border-none !rounded-none !h-full"
                />
             ) : (
                <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] text-sm p-6 text-center">
                   Your merged PDF will download automatically once complete.<br/>Check your downloads folder.
                </div>
             )}
          </div>
        </div>
      </SplitPanel>
    </div>
  );
}
