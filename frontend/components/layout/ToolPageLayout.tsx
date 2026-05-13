import { ReactNode } from 'react';
import SideNav from './SideNav';
import AtmosBackground from '../AtmosBackground';

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
    <div className="flex h-screen overflow-hidden text-[var(--text)]">
      <AtmosBackground />
      <SideNav />
      <div className="flex-1 ml-16 flex flex-col min-w-0 overflow-hidden">
        <main className="relative z-10 flex flex-col flex-1 min-h-0 mx-auto w-full max-w-6xl px-6 pb-6 pt-10 overflow-y-auto">
          {title != null && title !== '' && (
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h1 className="text-xl font-semibold text-[var(--text)]">
                {title}
              </h1>
              <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${isPdfTool ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-green-500/30 bg-green-500/10 text-green-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                {badge}
              </span>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
