'use client';

interface MarkdownPreviewProps {
  html: string;
  className?: string;
  minHeight?: string;
}

export default function MarkdownPreview({
  html,
  className = '',
  minHeight, // Ignored in favor of h-full
}: MarkdownPreviewProps) {
  return (
    <div
      className={`markdown-preview h-full flex-1 min-h-[300px] overflow-y-auto rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 ${className}`}
    >
      {html ? (
        <div
          className="markdown-preview prose max-w-none text-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="text-[var(--text-muted)]">Preview will appear here.</p>
      )}
    </div>
  );
}
