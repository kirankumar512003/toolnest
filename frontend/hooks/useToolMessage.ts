import { useState, useCallback } from 'react';
import type { ToolMessage } from '../types';

export function useToolMessage(): [
  ToolMessage | null,
  (message: ToolMessage | null) => void,
  () => void,
] {
  const [message, setMessage] = useState<ToolMessage | null>(null);
  const clearMessage = useCallback(() => setMessage(null), []);
  return [message, setMessage, clearMessage];
}
