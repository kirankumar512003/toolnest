'use client';

import { useState, useCallback } from 'react';
import CodeEditor from '../CodeEditor';
import { Button, Toolbar, SplitPanel } from '../ui';
import { useToolMessage } from '../../hooks';
import { tryParseJson } from '../../lib/jsonify';

export default function JsonifyTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [message, setMessage, clearMessage] = useToolMessage();

  const [view, setView] = useState<'input' | 'output'>('input');

  const handleFormat = useCallback(() => {
    clearMessage();
    const result = tryParseJson(input);
    if (!result.ok) {
      setMessage({ type: 'error', text: result.error });
      return;
    }
    setOutput(JSON.stringify(result.value, null, 2));
    setMessage({ type: 'success', text: 'Formatted successfully.' });
    if (typeof window !== 'undefined' && window.innerWidth < 768) setView('output');
  }, [input, clearMessage, setMessage]);

  const handleMinify = useCallback(() => {
    clearMessage();
    const result = tryParseJson(input);
    if (!result.ok) {
      setMessage({ type: 'error', text: result.error });
      return;
    }
    setOutput(JSON.stringify(result.value));
    setMessage({ type: 'success', text: 'Minified successfully.' });
    if (typeof window !== 'undefined' && window.innerWidth < 768) setView('output');
  }, [input, clearMessage, setMessage]);

  const handleValidate = useCallback(() => {
    clearMessage();
    const result = tryParseJson(input);
    if (result.ok) {
      setMessage({ type: 'success', text: 'Valid JSON.' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  }, [input, clearMessage, setMessage]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setMessage(null);
    setView('input');
  }, [setMessage]);

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-6">
      <Toolbar message={message} className="glass-panel p-2 flex-wrap justify-center md:justify-start gap-2">
        <Button onClick={handleFormat} className="text-xs py-1.5 px-4 font-bold tracking-wide uppercase">Format</Button>
        <Button onClick={handleMinify} className="text-xs py-1.5 px-4 font-bold tracking-wide uppercase">Minify</Button>
        <Button onClick={handleValidate} className="text-xs py-1.5 px-4 font-bold tracking-wide uppercase">Validate</Button>
        <div className="w-px h-6 bg-[var(--border)] mx-1" />
        <Button variant="secondary" onClick={handleClear} className="text-xs py-1.5 px-4 font-bold tracking-wide uppercase">Clear</Button>
      </Toolbar>

      {/* Mobile Toggle */}
      <div className="flex md:hidden p-1 bg-[var(--bg-2)] rounded-xl border border-[var(--border)]">
        <button
          onClick={() => setView('input')}
          className={`flex-1 py-2 px-4 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${view === 'input' ? 'bg-[var(--accent)] text-white shadow-lg' : 'text-[var(--text-muted)]'}`}
        >
          Input
        </button>
        <button
          onClick={() => setView('output')}
          className={`flex-1 py-2 px-4 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${view === 'output' ? 'bg-[var(--accent)] text-white shadow-lg' : 'text-[var(--text-muted)]'}`}
        >
          Result
        </button>
      </div>

      <div className="tool-viewport flex flex-1 min-h-0">
        <div className={`flex-1 flex-col min-w-0 ${view === 'input' ? 'flex' : 'hidden md:flex'}`}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-2)]/50">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Source JSON</span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]/40">Raw Input</span>
          </div>
          <CodeEditor
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="JSON input"
          />
        </div>
        
        <div className="hidden md:block w-px bg-[var(--border)]" />

        <div className={`flex-1 flex-col min-w-0 ${view === 'output' ? 'flex' : 'hidden md:flex'}`}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-2)]/50">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Processed Output</span>
            <span className="text-[10px] font-mono text-[var(--accent)]/60">Formatted</span>
          </div>
          <CodeEditor
            placeholder="Result will appear here..."
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            aria-label="JSON output"
          />
        </div>
      </div>
    </div>
  );
}
