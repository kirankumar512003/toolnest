'use client';

import { useState, useRef } from 'react';

export default function PdfToDocTool() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ pages: number; text: string; filename: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setResult(null);
      setError(null);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/pdf/extract', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Extraction failed');
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.text], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename.replace('.pdf', '.txt');
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col min-h-0 gap-4">
      {/* Upload + Info */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 cursor-pointer rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-elevated)] p-8 text-center transition-all hover:border-[var(--accent)] hover:bg-[var(--accent)]/5"
        >
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
          {file ? (
            <>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <p className="text-sm font-semibold text-[var(--text)]">{file.name}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{(file.size / 1024).toFixed(0)} KB · Click to change</p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[var(--text)]">Click to upload PDF</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Extracts all text, preserving structure</p>
            </>
          )}
        </div>

        {result && (
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 sm:w-48">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Stats</p>
            <div>
              <p className="text-2xl font-black text-[var(--text)]">{result.pages}</p>
              <p className="text-xs text-[var(--text-muted)]">Pages</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[var(--text)]">{result.text.split(/\s+/).length.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-muted)]">Words</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[var(--text)]">{result.text.length.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-muted)]">Characters</p>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Text Output */}
      <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5 bg-[var(--bg-elevated)]">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Extracted Text</span>
          {result && (
            <button onClick={handleDownload} className="flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Save as .txt
            </button>
          )}
        </div>
        <textarea
          readOnly
          value={result?.text ?? ''}
          placeholder={isLoading ? 'Extracting text from PDF...' : 'Upload a PDF and click Extract to see content here.'}
          className="flex-1 h-full w-full resize-none bg-transparent p-4 font-mono text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none"
        />
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-4">
        <div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!error && <p className="text-sm text-[var(--text-muted)]">{file ? `Ready: ${file.name}` : 'No file selected'}</p>}
        </div>
        <button
          onClick={handleExtract}
          disabled={isLoading || !file}
          className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_16px_rgba(245,158,11,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Extracting...' : 'Extract Text'}
        </button>
      </div>
    </div>
  );
}
