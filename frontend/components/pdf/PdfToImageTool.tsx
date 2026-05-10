'use client';

import { useState, useRef } from 'react';

export default function PdfToImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setImages([]);
      setError(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/pdf/to-images', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Conversion failed');
      }
      const data = await res.json();
      setImages(data.images); // base64 PNG strings
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAll = () => {
    images.forEach((b64, idx) => {
      const a = document.createElement('a');
      a.href = `data:image/png;base64,${b64}`;
      a.download = `page-${idx + 1}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  };

  const handleDownloadOne = (b64: string, idx: number) => {
    const a = document.createElement('a');
    a.href = `data:image/png;base64,${b64}`;
    a.download = `page-${idx + 1}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col min-h-0 gap-4">
      {/* Upload */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-elevated)] p-8 text-center transition-all hover:border-[var(--accent)] hover:bg-[var(--accent)]/5"
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
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[var(--text)]">Click to upload PDF</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Each page will become a high-resolution PNG image</p>
          </>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="flex-1 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">{images.length} page(s) converted</p>
            <button onClick={handleDownloadAll} className="flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((b64, idx) => (
              <div key={idx} className="group relative rounded-lg border border-[var(--border)] bg-white overflow-hidden">
                <img src={`data:image/png;base64,${b64}`} alt={`Page ${idx + 1}`} className="w-full object-contain" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold">Page {idx + 1}</span>
                  <button onClick={() => handleDownloadOne(b64, idx)} className="rounded bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-black hover:scale-105 transition-transform">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-4">
        <div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!error && <p className="text-sm text-[var(--text-muted)]">{file ? `Ready: ${file.name}` : 'No file selected'}</p>}
        </div>
        <button
          onClick={handleConvert}
          disabled={isLoading || !file}
          className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_16px_rgba(245,158,11,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Converting...' : 'Convert to Images'}
        </button>
      </div>
    </div>
  );
}
