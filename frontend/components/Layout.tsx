import { ReactNode } from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  privacyNote?: string;
}

/**
 * Default layout for tool pages. Wraps ToolPageLayout for backward compatibility.
 */
export default function Layout({ title, children, privacyNote }: LayoutProps) {
  return (
    <ToolPageLayout title={title} privacyNote={privacyNote}>
      {children}
    </ToolPageLayout>
  );
}
