'use client';

import { useState, useCallback, useMemo } from 'react';
import { diff_match_patch, Diff } from 'diff-match-patch';
import CodeEditor from '../CodeEditor';
import { SplitPanel, SectionLabel } from '../ui';

const dmp = new diff_match_patch();

const DEFAULT_ORIGINAL = `// Paste your original code here
function hello() {
  console.log("Original version");
  return true;
}
`;

const DEFAULT_MODIFIED = `// Paste your modified code here
function hello() {
  console.log("Modified version");
  return false;
}
`;

export default function DiffEditorTool() {
  const [original, setOriginal] = useState(DEFAULT_ORIGINAL);
  const [modified, setModified] = useState(DEFAULT_MODIFIED);
  const [diffResult, setDiffResult] = useState<Diff[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompare = useCallback(() => {
    setIsProcessing(true);
    // Use requestAnimationFrame to ensure the UI stays responsive
    requestAnimationFrame(() => {
      try {
        const diffs = dmp.diff_main(original, modified);
        dmp.diff_cleanupSemantic(diffs);
        setDiffResult(diffs);
      } catch (err) {
        console.error("Diff failed:", err);
      } finally {
        setIsProcessing(false);
      }
    });
  }, [original, modified]);

  const handleClear = () => {
    setOriginal('');
    setModified('');
    setDiffResult(null);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Action Toolbar */}
      <div className="flex items-center mb-4 gap-4 px-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCompare}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl bg-[var(--accent)] text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
            )}
            {isProcessing ? 'Processing...' : 'Run Hyper-Diff'}
          </button>
          <button
            onClick={handleClear}
            title="Clear Inputs"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] hover:border-red-500/50 hover:text-red-400 transition-all shadow-sm group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0 gap-6">
        <SplitPanel className="h-[240px] shrink-0">
          <div className="flex flex-col h-full">
            <SectionLabel className="px-1">Original Source</SectionLabel>
            <CodeEditor
              placeholder="Paste original text here..."
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex flex-col h-full">
            <SectionLabel className="px-1">Modified Source</SectionLabel>
            <CodeEditor
              placeholder="Paste modified text here..."
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              className="flex-1"
            />
          </div>
        </SplitPanel>

        <div className="flex flex-col flex-1 min-h-0">
          <SectionLabel className="px-1">Visual Comparison (Hyper-Diff Mode)</SectionLabel>
          <div className="tool-viewport flex-1 min-h-0 border border-[var(--border)] bg-[var(--bg-2)]/50 overflow-auto p-4 font-mono text-sm">
            {!diffResult ? (
              <div className="flex h-full items-center justify-center text-[var(--text-muted)] text-xs uppercase tracking-widest italic">
                Click "Run Hyper-Diff" to see changes
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-all leading-relaxed">
                {diffResult.map(([type, text], i) => {
                  let bgColor = 'transparent';
                  let textColor = 'var(--text)';
                  let decoration = 'none';

                  if (type === 1) { // Inserted
                    bgColor = 'rgba(34, 197, 94, 0.2)';
                    textColor = '#4ade80';
                  } else if (type === -1) { // Deleted
                    bgColor = 'rgba(239, 68, 68, 0.2)';
                    textColor = '#f87171';
                    decoration = 'line-through';
                  }

                  return (
                    <span 
                      key={i} 
                      style={{ 
                        backgroundColor: bgColor, 
                        color: textColor,
                        textDecoration: decoration,
                        borderRadius: '2px',
                        padding: '1px 0'
                      }}
                    >
                      {text}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
