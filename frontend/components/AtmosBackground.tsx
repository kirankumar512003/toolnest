import { useEffect, useMemo, useRef, useState } from 'react';

type Point = { x: number; y: number };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Full-screen animated background.
 * - Drag to move: hold Shift + click/drag anywhere
 * - Never blocks clicks unless Shift is held
 */
export default function AtmosBackground() {
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const offsetRef = useRef(offset);
  const dragStartRef = useRef<Point | null>(null);
  const dragOriginRef = useRef<Point>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  offsetRef.current = offset;

  const transform = useMemo(() => {
    // Keep it bounded so it never disappears completely
    const x = clamp(offset.x, -260, 260);
    const y = clamp(offset.y, -180, 180);
    return `translate3d(${x}px, ${y}px, 0)`;
  }, [offset.x, offset.y]);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!e.shiftKey) return;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      dragOriginRef.current = offsetRef.current;
      // capture so dragging continues even if pointer leaves the window
      (e.target as Element | null)?.setPointerCapture?.(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragStartRef.current) return;
      const start = dragStartRef.current;
      const origin = dragOriginRef.current;
      const next = { x: origin.x + (e.clientX - start.x), y: origin.y + (e.clientY - start.y) };

      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setOffset(next));
    }

    function stopDrag() {
      dragStartRef.current = null;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', stopDrag, { passive: true });
    window.addEventListener('pointercancel', stopDrag, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopDrag);
      window.removeEventListener('pointercancel', stopDrag);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base gradient — uses CSS vars so it works in both dark and light mode */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, var(--bg), var(--bg-2))'
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(1200px circle at 20% 10%, rgba(245,158,11,0.10), transparent 55%), radial-gradient(900px circle at 85% 20%, rgba(59,130,246,0.10), transparent 60%), radial-gradient(900px circle at 40% 90%, rgba(236,72,153,0.08), transparent 55%)'
      }} />

      {/* Draggable animated blobs */}
      <div className="absolute inset-[-20%] will-change-transform" style={{ transform }}>
        <div className="atmos-blob atmos-blob-a" />
        <div className="atmos-blob atmos-blob-b" />
        <div className="atmos-blob atmos-blob-c" />
      </div>

      {/* Subtle noise overlay */}
      <div className="atmos-noise absolute inset-0 opacity-[0.04] mix-blend-overlay" />
    </div>
  );
}

