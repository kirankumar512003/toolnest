import { ReactNode } from 'react';
import SideNav from './SideNav';
import AtmosBackground from '../AtmosBackground';
import ThemeToggle from '../ThemeToggle';

interface ToolPageLayoutProps {
  /** Page title; when omitted, no h1 is rendered */
  title?: string;
  /** Override the privacy badge label. Defaults to browser-only message. */
  privacyNote?: string;
  children: ReactNode;
}

/**
 * Standard layout for tool pages: side nav + optional title + content.
 */
export default function ToolPageLayout({ title, children, privacyNote }: ToolPageLayoutProps) {
  const badge = privacyNote ?? 'Data stays in your browser';
  const isPdfTool = !!privacyNote;
  return (
    <div className="flex h-screen overflow-hidden text-[var(--text)] bg-[var(--bg)]">
      <AtmosBackground />
      <SideNav />
      <div className="flex-1 md:ml-16 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        <main className="relative z-10 flex flex-col flex-1 min-h-0 mx-auto w-full max-w-7xl px-4 md:px-8 pb-4 md:pb-8 pt-6 md:pt-10 overflow-y-auto">
          {title != null && title !== '' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 shrink-0 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text)]">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide uppercase ${isPdfTool ? 'border-blue-500/20 bg-blue-500/5 text-blue-400' : 'border-green-500/20 bg-green-500/5 text-green-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  {badge}
                </span>
                <ThemeToggle />
              </div>
            </div>
          )}
          <div className="flex-1 flex flex-col min-h-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
