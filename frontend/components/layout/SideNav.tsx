'use client';

import Link from 'next/link';
import { TOOLS } from '../../utils/tools';
import type { ToolId } from '../../utils/tools';

function getIconForTool(toolId: ToolId) {
  switch (toolId) {
    case 'jsonify':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M4 12v6" />
          <path d="M8 12v6" />
        </svg>
      );
    case 'diff':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="15" x2="15" y2="15" />
          <line x1="12" y1="12" x2="12" y2="18" />
        </svg>
      );
    case 'encode':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'time':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'markdown':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 2H3v20h18V2z" />
          <path d="m8 16 3-4 3 4" />
          <path d="M11 12V6" />
        </svg>
      );
    case 'scratchpad':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case 'drawboard':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 16 4-4-4-4" />
          <path d="m6 8-4 4 4 4" />
          <path d="m14.5 4-5 16" />
        </svg>
      );
    case 'pdf-merge':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3" />
          <path d="M15 2H9a1 1 0 0 0-1 1v5" />
          <path d="m12 13 4 4-4 4" />
          <path d="M16 17H8" />
        </svg>
      );
    case 'pdf-to-doc':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
          <path d="M10 9H8" />
        </svg>
      );
    case 'pdf-to-image':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      );
  }
}

export default function SideNav() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-16 border-r border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur z-50 flex-col items-center py-6">
        <Link href="/" className="mb-8 block p-1 transition-transform hover:scale-105" title="ToolNest Home">
          <img src="/logo.png" alt="ToolNest" className="w-10 h-10 rounded-full object-cover border border-[var(--border)] shadow-xl" />
        </Link>
        
        <nav className="flex flex-col gap-5">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all"
            >
              {getIconForTool(tool.id)}
              <div className="absolute left-14 top-1/2 -translate-y-1/2 rounded-md bg-[var(--bg-elevated)] border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-[100]">
                {tool.name}
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl z-50 flex items-center justify-around px-2">
        {TOOLS.slice(0, 5).map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="flex flex-col items-center gap-1 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors px-2 py-1"
          >
            {getIconForTool(tool.id)}
            <span className="text-[10px] font-medium uppercase tracking-tight">{tool.name.split(' ')[0]}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
