'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import CodeEditor from '../CodeEditor';
import { SplitPanel, SectionLabel } from '../ui';

const MonacoDiffEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.DiffEditor),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] animate-pulse"
        style={{ minHeight: 400 }}
      >
        <span className="text-xs font-bold uppercase tracking-widest">Initializing Diff Engine...</span>
      </div>
    ),
  }
);

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
  
  // Decoupled states for the diff engine to prevent lag during typing
  const [diffState, setDiffState] = useState({
    original: DEFAULT_ORIGINAL,
    modified: DEFAULT_MODIFIED,
  });

  const handleCompare = () => {
    setDiffState({ original, modified });
  };

  const handleClear = () => {
    setOriginal('');
    setModified('');
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Action Toolbar */}
      <div className="flex items-center mb-4 gap-4 px-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCompare}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[var(--accent)] text-white text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
            Run Comparison
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
              aria-label="Original text"
            />
          </div>
          <div className="flex flex-col h-full">
            <SectionLabel className="px-1">Modified Source</SectionLabel>
            <CodeEditor
              placeholder="Paste modified text here..."
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              className="flex-1"
              aria-label="Modified text"
            />
          </div>
        </SplitPanel>

        <div className="flex flex-col flex-1 min-h-0">
          <SectionLabel className="px-1">Visual Comparison</SectionLabel>
          <div className="tool-viewport flex-1 min-h-0 border border-[var(--border)] bg-[var(--bg-2)]/50">
            <MonacoDiffEditor
              original={diffState.original}
              modified={diffState.modified}
              language="javascript"
              theme="vs-dark"
              height="100%"
              options={{
                readOnly: true,
                renderSideBySide: true,
                enableSplitViewResizing: true,
                scrollBeyondLastLine: false,
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                renderOverviewRuler: true,
                diffWordWrap: 'on',
                automaticLayout: true,
                padding: { top: 16, bottom: 16 }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
