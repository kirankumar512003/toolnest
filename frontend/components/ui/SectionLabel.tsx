import { ReactNode } from 'react';

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <span
      className={`mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] ${className}`}
    >
      {children}
    </span>
  );
}
