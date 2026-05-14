'use client';

import { useState, useCallback, useMemo } from 'react';
import { diff_match_patch, Diff } from 'diff-match-patch';
import CodeEditor from '../CodeEditor';
import { SplitPanel, SectionLabel } from '../ui';

const dmp = new diff_match_patch();

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

interface DiffLine {
  originalNum?: number;
  modifiedNum?: number;
  type: 'added' | 'deleted' | 'equal';
  content: string | Diff[];
}

export default function DiffEditorTool() {
  const [original, setOriginal] = useState(DEFAULT_ORIGINAL);
  const [modified, setModified] = useState(DEFAULT_MODIFIED);
  const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompare = useCallback(() => {
    setIsProcessing(true);
    requestAnimationFrame(() => {
      try {
        // 1. Line-based diff for the main structure
        const a = dmp.diff_linesToChars_(original, modified);
        const lineDiffs = dmp.diff_main(a.chars1, a.chars2, false);
        dmp.diff_charsToLines_(lineDiffs, a.lineArray);
        dmp.diff_cleanupSemantic(lineDiffs);

        // 2. Process into Bitbucket-style lines
        const processed: DiffLine[] = [];
        let leftLine = 1;
        let rightLine = 1;

        lineDiffs.forEach(([type, text]) => {
          const lines = text.split('\n');
          if (lines[lines.length - 1] === '') lines.pop();

          lines.forEach(line => {
            if (type === 0) { // Equal
              processed.push({ originalNum: leftLine++, modifiedNum: rightLine++, type: 'equal', content: line });
            } else if (type === 1) { // Added
              processed.push({ modifiedNum: rightLine++, type: 'added', content: line });
            } else if (type === -1) { // Deleted
              processed.push({ originalNum: leftLine++, type: 'deleted', content: line });
            }
          });
        });

        setDiffLines(processed);
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
    setDiffLines([]);
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
            {isProcessing ? 'Processing...' : 'Run Review Comparison'}
          </button>
          <button
            onClick={handleClear}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] hover:border-red-500/50 hover:text-red-400 transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0 gap-6">
        <SplitPanel className="h-[200px] shrink-0">
          <div className="flex flex-col h-full">
            <SectionLabel className="px-1">Original</SectionLabel>
            <CodeEditor placeholder="Source A" value={original} onChange={(e) => setOriginal(e.target.value)} className="flex-1" />
          </div>
          <div className="flex flex-col h-full">
            <SectionLabel className="px-1">Modified</SectionLabel>
            <CodeEditor placeholder="Source B" value={modified} onChange={(e) => setModified(e.target.value)} className="flex-1" />
          </div>
        </SplitPanel>

        <div className="flex flex-col flex-1 min-h-0">
          <SectionLabel className="px-1">Bitbucket Review Mode</SectionLabel>
          <div className="tool-viewport flex-1 min-h-0 border border-[var(--border)] bg-[var(--bg)] overflow-auto">
            {diffLines.length === 0 ? (
              <div className="flex h-full items-center justify-center text-[var(--text-muted)] text-[10px] uppercase tracking-widest italic">
                Compare to start review
              </div>
            ) : (
              <table className="w-full border-collapse font-mono text-[13px] leading-6 select-text">
                <tbody>
                  {diffLines.map((line, i) => (
                    <tr key={i} className={`group hover:bg-[var(--accent)]/5 ${
                      line.type === 'added' ? 'bg-green-500/10' : 
                      line.type === 'deleted' ? 'bg-red-500/10' : ''
                    }`}>
                      {/* Left Side Gutter */}
                      <td className="w-12 shrink-0 border-r border-[var(--border)] px-2 text-right text-[var(--text-muted)]/50 select-none bg-[var(--bg-elevated)]/30">
                        {line.originalNum || ''}
                      </td>
                      {/* Right Side Gutter */}
                      <td className="w-12 shrink-0 border-r border-[var(--border)] px-2 text-right text-[var(--text-muted)]/50 select-none bg-[var(--bg-elevated)]/30">
                        {line.modifiedNum || ''}
                      </td>
                      {/* Sign */}
                      <td className={`w-8 shrink-0 px-3 text-center font-bold select-none ${
                        line.type === 'added' ? 'text-green-500' : 
                        line.type === 'deleted' ? 'text-red-500' : 'text-[var(--text-muted)]/30'
                      }`}>
                        {line.type === 'added' ? '+' : line.type === 'deleted' ? '-' : ''}
                      </td>
                      {/* Code Content */}
                      <td className={`px-4 whitespace-pre break-all ${
                        line.type === 'added' ? 'text-green-400' : 
                        line.type === 'deleted' ? 'text-red-400' : 'text-[var(--text)]'
                      }`}>
                        {line.content as string}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
