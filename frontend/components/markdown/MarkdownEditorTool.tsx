'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { marked } from 'marked';
import EditorWithLineNumbers from './EditorWithLineNumbers';
import MarkdownPreview from './MarkdownPreview';
import { SectionLabel } from '../ui';

export default function MarkdownEditorTool() {
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [splitPct, setSplitPct] = useState(50);

  useEffect(() => {
    const parse = async () => {
      if (!markdown.trim()) { setHtml(''); return; }
      const result = await marked.parse(markdown);
      setHtml(typeof result === 'string' ? result : '');
    };
    parse();
  }, [markdown]);

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

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Mobile Toggle */}
      <div className="flex md:hidden mb-4 p-1 bg-[var(--bg-2)] rounded-xl border border-[var(--border)]">
        <button
          onClick={() => setView('edit')}
          className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all ${view === 'edit' ? 'bg-[var(--accent)] text-white shadow-lg' : 'text-[var(--text-muted)]'}`}
        >
          Editor
        </button>
        <button
          onClick={() => setView('preview')}
          className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all ${view === 'preview' ? 'bg-[var(--accent)] text-white shadow-lg' : 'text-[var(--text-muted)]'}`}
        >
          Preview
        </button>
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
        <div className={`flex-col min-w-0 overflow-hidden flex-1 ${view === 'preview' ? 'flex' : 'hidden md:flex'}`}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-2)]/50">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Live Preview</span>
            <span className="text-[10px] font-mono text-[var(--accent)]/60">Rendering Marked.js</span>
          </div>
          {html ? (
            <MarkdownPreview html={html} />
          ) : (
            <div className="flex flex-1 items-center justify-center bg-[var(--bg)]/50">
              <span className="font-mono text-xs text-[var(--text-muted)]/30 tracking-tight">
                WAITING FOR CONTENT...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
