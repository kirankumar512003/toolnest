import { ReactNode } from 'react';

interface SplitPanelProps {
  children: ReactNode;
  className?: string;
}

export default function SplitPanel({ children, className = '' }: SplitPanelProps) {
  return (
    <div className={`grid gap-4 lg:grid-cols-2 flex-1 min-h-0 ${className}`}>
      {children}
    </div>
  );
}
