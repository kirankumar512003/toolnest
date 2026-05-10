import type { ToolMessage } from '@/types';

interface MessageProps {
  message: ToolMessage | null;
}

export default function Message({ message }: MessageProps) {
  if (message == null) return null;
  return (
    <span
      className={`text-sm ${
        message.type === 'success' ? 'text-green-500' : 'text-red-400'
      }`}
    >
      {message.text}
    </span>
  );
}
