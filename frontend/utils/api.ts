/**
 * Client for ToolNest backend API.
 * Base URL is proxied via Next.js rewrites to /api -> localhost:8080/api
 */

const API_BASE = '/api';

export async function getToolsList(): Promise<{ tools: string[]; version: string }> {
  const res = await fetch(`${API_BASE}/tools/list`);
  if (!res.ok) throw new Error('Failed to fetch tools list');
  return res.json();
}

export async function getHealth(): Promise<{ status: string; service: string }> {
  const res = await fetch(`${API_BASE}/tools/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}
