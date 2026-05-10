import { forwardRef, TextareaHTMLAttributes } from 'react';

interface CodeEditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
}

const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  ({ label, error = false, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-1 flex-col min-w-0">
        {label != null && (
          <label className="mb-1.5 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          spellCheck={false}
          className={`
            h-full min-h-[150px] flex-1 min-w-0 w-full resize-none rounded-md border bg-[var(--bg)] px-3 py-2.5 font-mono text-sm
            text-[var(--text)] placeholder-[var(--text-muted)] caret-[var(--accent)]
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50
            ${error ? 'border-red-500/80' : 'border-[var(--border)]'}
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;
