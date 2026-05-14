'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { marked } from 'marked';
import EditorWithLineNumbers from './EditorWithLineNumbers';
import MarkdownPreview from './MarkdownPreview';
import { SectionLabel } from '../ui';

// Dynamic import for html2pdf to avoid SSR issues
let html2pdf: any;
if (typeof window !== 'undefined') {
  import('html2pdf.js').then((mod) => {
    html2pdf = mod.default;
  });
}

export default function MarkdownEditorTool() {
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const containerRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [splitPct, setSplitPct] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const parse = async () => {
      if (!markdown.trim()) { setHtml(''); return; }
      const result = await marked.parse(markdown);
      setHtml(typeof result === 'string' ? result : '');
    };
    parse();
  }, [markdown]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setMarkdown(content);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitPct(Math.min(85, Math.max(15, pct)));
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const downloadPdf = () => {
    if (!previewContainerRef.current || !html2pdf) return;
    
    const element = previewContainerRef.current;
    const opt = {
      margin: 1,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const downloadDoc = () => {
    if (!previewContainerRef.current) return;
    
    const content = previewContainerRef.current.innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
                  "xmlns:w='urn:schemas-microsoft-com:office:word' " +
                  "xmlns='http://www.w3.org/TR/REC-html40'>" +
                  "<head><meta charset='utf-8'></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.doc';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".md,.txt"
        className="hidden"
      />

      <div className="flex items-center mb-4 gap-4 px-2">
        <div className="flex items-center gap-2">
          {/* Import */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import Markdown File"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shadow-sm group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
          </button>
          
          <div className="h-4 w-px bg-[var(--border)] mx-1" />

          {/* Export Group */}
          <button
            onClick={downloadPdf}
            title="Download as PDF"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[10px] font-black uppercase tracking-widest text-[var(--text)] hover:border-red-500/50 hover:text-red-400 transition-all shadow-sm group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PDF
          </button>
          <button
            onClick={downloadDoc}
            title="Download as Word Document"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[10px] font-black uppercase tracking-widest text-[var(--text)] hover:border-blue-500/50 hover:text-blue-400 transition-all shadow-sm group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            DOC
          </button>

          <div className="h-4 w-px bg-[var(--border)] mx-1" />

          {/* Clear */}
          <button
            onClick={() => setMarkdown('')}
            title="Clear Editor"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] hover:border-red-500/50 hover:text-red-400 transition-all shadow-sm group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden p-1 bg-[var(--bg-2)] rounded-xl border border-[var(--border)] ml-auto">
          <button
            onClick={() => setView('edit')}
            className={`flex-1 py-1.5 px-4 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${view === 'edit' ? 'bg-[var(--accent)] text-white shadow-lg' : 'text-[var(--text-muted)]'}`}
          >
            Editor
          </button>
          <button
            onClick={() => setView('preview')}
            className={`flex-1 py-1.5 px-4 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${view === 'preview' ? 'bg-[var(--accent)] text-white shadow-lg' : 'text-[var(--text-muted)]'}`}
          >
            Preview
          </button>
        </div>
      </div>

      <div ref={containerRef} className="tool-viewport flex flex-1 min-h-0">
        {/* Left: Editor */}
        <div 
          className={`flex-col min-w-0 overflow-hidden ${view === 'edit' ? 'flex' : 'hidden md:flex'}`} 
          style={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : `${splitPct}%` }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-2)]/50">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Markdown Editor</span>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
            </div>
          </div>
          <EditorWithLineNumbers 
            value={markdown} 
            onChange={setMarkdown} 
            placeholder="Start writing markdown here..."
          />
        </div>

        {/* Draggable Divider */}
        <div
          onMouseDown={onMouseDown}
          className="hidden md:flex group relative w-1 shrink-0 cursor-col-resize items-center justify-center bg-[var(--border)] hover:bg-[var(--accent)]/50 transition-colors"
        >
          <div className="absolute h-8 w-1 rounded-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Right: Preview */}
        <div 
          className={`flex-col min-w-0 overflow-hidden flex-1 ${view === 'preview' ? 'flex' : 'hidden md:flex'}`}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-2)]/50">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Live Preview</span>
            <span className="text-[10px] font-mono text-[var(--accent)]/60">Rendering Marked.js</span>
          </div>
          <div ref={previewContainerRef} className="flex-1 overflow-auto bg-[var(--bg)]/50">
            {html ? (
              <MarkdownPreview html={html} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-mono text-xs text-[var(--text-muted)]/30 tracking-tight">
                  WAITING FOR CONTENT...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
