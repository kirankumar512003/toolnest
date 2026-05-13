'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import CodeEditor from '../CodeEditor';
import { SplitPanel, SectionLabel } from '../ui';

const MonacoDiffEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.DiffEditor),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)]"
        style={{ minHeight: 360 }}
      >
        Loading diff editor…
      </div>
    ),
  }
);

const DEFAULT_ORIGINAL = `function hello() {
  console.log("Original version");
  return true;
}
`;

const DEFAULT_MODIFIED = `function hello() {
  console.log("Modified version");
  return false;
}
`;

export default function DiffEditorTool() {
  const [original, setOriginal] = useState(DEFAULT_ORIGINAL);
  const [modified, setModified] = useState(DEFAULT_MODIFIED);

  return (
    <div className="flex flex-col gap-4">
      <SplitPanel>
        <CodeEditor
          label="Original"
          placeholder="Paste or type original text..."
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          className="min-h-[160px]"
          aria-label="Original text"
        />
        <CodeEditor
          label="Modified"
          placeholder="Paste or type modified text..."
          value={modified}
          onChange={(e) => setModified(e.target.value)}
          className="min-h-[160px]"
          aria-label="Modified text"
        />
      </SplitPanel>
      <div className="flex min-w-0 flex-col">
        <SectionLabel>Diff view</SectionLabel>
        <div className="overflow-hidden rounded-md border border-[var(--border)]">
          <MonacoDiffEditor
            original={original}
            modified={modified}
            language="javascript"
            theme="vs-dark"
            height={360}
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
            }}
          />
        </div>
      </div>
    </div>
  );
}
