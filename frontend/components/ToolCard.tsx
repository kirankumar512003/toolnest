import Link from 'next/link';

// Per-tool icon + accent color config
const TOOL_CONFIG: Record<string, { icon: string; color: string; glow: string }> = {
  jsonify: {
    icon: `<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3"/><path d="m9 12 2 2 4-4"/>`,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
    glow: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]',
  },
  diff: {
    icon: `<path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>`,
    color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30',
    glow: 'group-hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]',
  },
  encode: {
    icon: `<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
    color: 'from-violet-500/20 to-purple-500/10 border-violet-500/30',
    glow: 'group-hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]',
  },
  time: {
    icon: `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
    color: 'from-cyan-500/20 to-sky-500/10 border-cyan-500/30',
    glow: 'group-hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]',
  },
  markdown: {
    icon: `<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>`,
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
    glow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]',
  },
  scratchpad: {
    icon: `<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>`,
    color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30',
    glow: 'group-hover:shadow-[0_0_25px_rgba(244,63,94,0.2)]',
  },
  drawboard: {
    icon: `<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>`,
    color: 'from-fuchsia-500/20 to-pink-500/10 border-fuchsia-500/30',
    glow: 'group-hover:shadow-[0_0_25px_rgba(217,70,239,0.2)]',
  },
  'pdf-merge': {
    icon: `<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M12 13h4"/><path d="M12 17h4"/>`,
    color: 'from-red-500/20 to-orange-500/10 border-red-500/30',
    glow: 'group-hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]',
  },
  'pdf-to-doc': {
    icon: `<path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15s.5-1 2-1 2.5 2 4 2 2-1 2-1"/>`,
    color: 'from-lime-500/20 to-green-500/10 border-lime-500/30',
    glow: 'group-hover:shadow-[0_0_25px_rgba(132,204,22,0.2)]',
  },
  'pdf-to-image': {
    icon: `<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>`,
    color: 'from-sky-500/20 to-blue-500/10 border-sky-500/30',
    glow: 'group-hover:shadow-[0_0_25px_rgba(14,165,233,0.2)]',
  },
};

export interface ToolCardProps {
  name: string;
  description: string;
  href: string;
  id?: string;
}

export default function ToolCard({ name, description, href, id = '' }: ToolCardProps) {
  const config = TOOL_CONFIG[id] ?? {
    icon: `<circle cx="12" cy="12" r="10"/>`,
    color: 'from-gray-500/20 to-gray-500/10 border-gray-500/30',
    glow: 'group-hover:shadow-[0_0_25px_rgba(156,163,175,0.2)]',
  };

  return (
    <Link href={href} className="block group h-full">
      <article
        className={`
          h-full rounded-2xl border bg-gradient-to-br p-5
          transition-all duration-300
          ${config.color}
          ${config.glow}
          group-hover:scale-[1.02] group-hover:-translate-y-0.5
        `}
      >
        {/* Icon badge */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-300"
              dangerouslySetInnerHTML={{ __html: config.icon }}
            />
          </div>
          {/* Arrow */}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-elevated)]/60 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </div>

        {/* Text */}
        <h2 className="text-base font-semibold text-[var(--text)] transition-colors duration-200 group-hover:text-[var(--accent)] leading-snug">
          {name}
        </h2>
        <p className="mt-1.5 text-sm text-[var(--text-muted)] leading-relaxed">
          {description}
        </p>
      </article>
    </Link>
  );
}
