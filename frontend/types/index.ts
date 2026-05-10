/**
 * Shared types for ToolNest tools and UI.
 */

export type ToolMessageType = 'success' | 'error';

export interface ToolMessage {
  type: ToolMessageType;
  text: string;
}

export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };
