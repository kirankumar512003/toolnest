import { ReactNode } from 'react';
import Message from './Message';
import type { ToolMessage } from '../../types';

interface ToolbarProps {
  children: ReactNode;
  message?: ToolMessage | null;
  className?: string;
}

export default function Toolbar({ children, message, className = '' }: ToolbarProps) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-3">
        {children}
      </div>
      {message != null && (
        <div className="ml-auto">
          <Message message={message} />
        </div>
      )}
    </div>
  );
}
