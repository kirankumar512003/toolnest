'use client';

import { useRef, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { downloadBlob } from '@/lib/file';

const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then((mod) => mod.Excalidraw),
  { ssr: false }
);

type ExcalidrawAPI = {
  getSceneElements: () => readonly unknown[];
  getAppState: () => Record<string, unknown>;
  getFiles: () => Record<string, unknown>;
  resetScene: () => void;
};

export default function DrawboardTool() {
  const excalidrawRef = useRef<ExcalidrawAPI | null>(null);
  const [exportReady, setExportReady] = useState(false);

  const handleExportPng = useCallback(async () => {
    const api = excalidrawRef.current;
    if (!api) return;
    const elements = api.getSceneElements() ?? [];
    const appState = api.getAppState?.() ?? {};
    const files = api.getFiles?.() ?? {};
    const { exportToBlob } = await import('@excalidraw/excalidraw');
    const blob = await exportToBlob({
      elements: elements as never[],
      appState: appState as never,
      files: files as never,
      mimeType: 'image/png',
    });
    downloadBlob(blob, 'toolnest-drawing.png');
  }, []);

  const handleClear = useCallback(() => {
    const api = excalidrawRef.current;
    if (api?.resetScene) {
      api.resetScene();
    }
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-[var(--bg)]">
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2">
        <Link
          href="/"
          className="text-sm font-semibold text-[var(--text)] no-underline hover:text-[var(--accent)]"
        >
          ToolNest · Drawboard
        </Link>
        <div className="flex items-center gap-2">
          <Button onClick={handleExportPng} disabled={!exportReady}>
            Export PNG
          </Button>
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </header>
      <div className="min-h-0 flex-1">
        <Excalidraw
          excalidrawAPI={(api) => {
            excalidrawRef.current = api as ExcalidrawAPI;
            setExportReady(true);
          }}
          theme="dark"
          initialData={{ appState: { viewBackgroundColor: '#0d1117' } }}
        />
      </div>
    </div>
  );
}
