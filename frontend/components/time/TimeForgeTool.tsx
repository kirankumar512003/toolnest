'use client';

import { useState, useCallback, useMemo } from 'react';
import CodeEditor from '../CodeEditor';
import { Button, Toolbar, SplitPanel, SectionLabel } from '../ui';
import { useToolMessage } from '../../hooks';
import { parseTimestampInput, formatTimestampResult } from '../../lib/time';

interface FormatRowProps {
  label: string;
  value: string;
}

function FormatRow({ label, value }: FormatRowProps) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
      <span className="min-w-[5rem] text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </span>
      <code className="break-all font-mono text-sm text-[var(--text)]">
        {value}
      </code>
    </div>
  );
}

export default function TimeForgeTool() {
  const [input, setInput] = useState('');

  const parsed = useMemo(() => {
    const trimmed = input.trim();
    if (trimmed === '') return null;
    return parseTimestampInput(input);
  }, [input]);

  const result =
    parsed?.ok === true ? formatTimestampResult(parsed.value) : null;
  const error = parsed?.ok === false ? parsed.error : null;

  const handleClear = useCallback(() => setInput(''), []);

  return (
    <div className="flex flex-col gap-4">
      <Toolbar message={error ? { type: 'error', text: error } : undefined}>
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </Toolbar>
      <SplitPanel>
        <div className="flex min-w-0 flex-1 flex-col">
          <CodeEditor
            label="Input — Epoch (s or ms) or date string"
            placeholder="e.g. 1699900000 or 2023-11-14T12:00:00Z"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Timestamp or date input"
            className="min-h-[120px]"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <SectionLabel>Output — Readable formats</SectionLabel>
          <div className="flex min-h-[120px] flex-col gap-3 rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-3 font-mono text-sm">
            {result == null ? (
              <p className="text-[var(--text-muted)]">
                Enter an epoch timestamp or date above.
              </p>
            ) : (
              <>
                <FormatRow label="ISO" value={result.iso} />
                <FormatRow label="UTC" value={result.utc} />
                <FormatRow label="Local" value={result.local} />
                <FormatRow label="Epoch (ms)" value={String(result.epochMs)} />
                <FormatRow label="Epoch (s)" value={String(result.epochSec)} />
              </>
            )}
          </div>
        </div>
      </SplitPanel>
    </div>
  );
}
