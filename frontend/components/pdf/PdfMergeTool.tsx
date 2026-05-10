'use client';

import { useState, useRef } from 'react';

export default function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
      setFiles(prev => [...prev, ...newFiles]);
      setError(null);
      setSuccess(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles(prev => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  };

  const moveDown = (index: number) => {
    setFiles(prev => {
      if (index === prev.length - 1) return prev;
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const res = await fetch('/api/pdf/merge', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Merge failed');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col min-h-0 gap-6">
      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-elevated)] p-10 text-center transition-all hover:border-[var(--accent)] hover:bg-[var(--accent)]/5"
      >
        <input ref={fileInputRef} type="file" className="hidden" accept=".pdf" multiple onChange={handleFileChange} />
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)]/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" /><path d="M12 18v-6" /><path d="m9 15 3-3 3 3" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-[var(--text)]">Click to add PDFs</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">Add at least 2 PDF files. You can reorder them below.</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Merge Order ({files.length} files)</p>
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveUp(idx)} disabled={idx === 0} className="rounded p-0.5 text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30">▲</button>
                <button onClick={() => moveDown(idx)} disabled={idx === files.length - 1} className="rounded p-0.5 text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30">▼</button>
              </div>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xs font-bold text-[var(--accent)]">{idx + 1}</span>
              <span className="flex-1 truncate text-sm text-[var(--text)]">{file.name}</span>
              <span className="text-xs text-[var(--text-muted)]">{(file.size / 1024).toFixed(0)} KB</span>
              <button onClick={() => removeFile(idx)} className="rounded p-1 text-[var(--text-muted)] hover:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-4">
        <div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-green-400">✓ Merged PDF downloaded successfully!</p>}
          {!error && !success && <p className="text-sm text-[var(--text-muted)]">{files.length} file(s) queued</p>}
        </div>
        <button
          onClick={handleMerge}
          disabled={isLoading || files.length < 2}
          className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_16px_rgba(245,158,11,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Merging...' : 'Merge & Download'}
        </button>
      </div>
    </div>
  );
}
