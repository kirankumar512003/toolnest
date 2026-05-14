'use client';

import { useRef, useCallback, useMemo, useState, useEffect } from 'react';

interface EditorWithLineNumbersProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const LINE_HEIGHT = 24;
const PADDING_X = 16;
const PADDING_Y = 16;

export default function EditorWithLineNumbers({
  value,
  onChange,
  placeholder = '',
  className = '',
}: EditorWithLineNumbersProps) {
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(40);

  // Track container height to fill gutter with blank line numbers
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const h = entry.contentRect.height;
        const lines = Math.floor((h - PADDING_Y * 2) / LINE_HEIGHT);
        setVisibleLines(Math.max(lines, 1));
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const contentLineCount = useMemo(() => {
    if (value === '') return 1;
    return value.split('\n').length;
  }, [value]);

  // Always show enough lines to fill the gutter
  const lineCount = Math.max(contentLineCount, visibleLines);

  const handleScroll = useCallback(() => {
    const ta = textareaRef.current;
    const ln = lineNumbersRef.current;
    if (ta && ln) ln.scrollTop = ta.scrollTop;
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-1 min-h-0 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg)] ${className}`}
    >
      {/* Line numbers gutter */}
      <div
        ref={lineNumbersRef}
        aria-hidden
        className="select-none shrink-0 overflow-hidden border-r border-[var(--border)] bg-[var(--bg-elevated)] font-mono text-sm text-[var(--text-muted)]"
        style={{
          width: 52,
          lineHeight: `${LINE_HEIGHT}px`,
          paddingLeft: PADDING_X,
          paddingRight: PADDING_X,
          paddingTop: PADDING_Y,
          paddingBottom: PADDING_Y,
        }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i}
            style={{ height: LINE_HEIGHT }}
            className={i < contentLineCount ? 'text-[var(--text-muted)]' : 'text-[var(--text-muted)]/25'}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        placeholder={placeholder}
        spellCheck={false}
        className="flex-1 min-w-0 resize-none bg-transparent pl-4 pr-4 font-mono text-sm text-[var(--text)] placeholder-[var(--text-muted)]/40 caret-[var(--accent)] focus:outline-none overflow-auto"
        style={{
          lineHeight: `${LINE_HEIGHT}px`,
          paddingTop: PADDING_Y,
          paddingBottom: PADDING_Y,
        }}
      />
    </div>
  );
}
