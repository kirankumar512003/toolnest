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
  return (
    <div className="flex h-screen overflow-hidden text-[var(--text)] bg-[var(--bg)]">
      <AtmosBackground />
      <SideNav />
      <div className="flex-1 md:ml-16 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        <main className="relative z-10 flex flex-col flex-1 min-h-0 w-full overflow-hidden p-4 md:p-6 bg-[var(--bg)]/50">
          {children}
        </main>
      </div>
    </div>
  );
}
