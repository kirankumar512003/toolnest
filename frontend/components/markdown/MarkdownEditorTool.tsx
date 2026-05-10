'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { marked } from 'marked';
import EditorWithLineNumbers from './EditorWithLineNumbers';
import MarkdownPreview from './MarkdownPreview';
import { SectionLabel } from '@/components/ui';

export default function MarkdownEditorTool() {
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');
  const [splitPct, setSplitPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

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
    setSplitPct(Math.min(80, Math.max(20, pct)));
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
    <div ref={containerRef} className="flex flex-1 min-h-0 overflow-hidden">
      {/* Left: Editor */}
      <div className="flex flex-col min-w-0 overflow-hidden" style={{ width: `${splitPct}%` }}>
        <SectionLabel>Editor</SectionLabel>
        <EditorWithLineNumbers
          value={markdown}
          onChange={setMarkdown}
          placeholder="Start writing markdown here..."
        />
      </div>

      {/* Draggable Divider */}
      <div
        onMouseDown={onMouseDown}
        className="group relative flex w-2 shrink-0 cursor-col-resize items-center justify-center"
      >
        <div className="h-full w-px bg-[var(--border)] group-hover:bg-[var(--accent)] transition-colors" />
        <div className="absolute flex flex-col gap-1 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-8 w-1 rounded-full bg-[var(--accent)]" />
        </div>
      </div>

      {/* Right: Preview */}
      <div className="flex flex-col min-w-0 overflow-hidden flex-1">
        <SectionLabel>Preview</SectionLabel>
        {html ? (
          <MarkdownPreview html={html} />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <span className="font-mono text-sm text-[var(--text-muted)]/40 select-none">
              Nothing to preview yet...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
