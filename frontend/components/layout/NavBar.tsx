import Link from 'next/link';

interface NavBarProps {
  /** Optional title suffix after "ToolNest" (e.g. "· Drawboard") */
  suffix?: string;
  /** Optional custom link content; defaults to "ToolNest" + suffix */
  brandLabel?: string;
}

export default function NavBar({ suffix, brandLabel }: NavBarProps) {
  const label = brandLabel ?? (suffix ? `ToolNest ${suffix}` : 'ToolNest');
  return (
    <nav className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg)]/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="font-semibold text-[var(--text)] no-underline hover:text-[var(--accent)]"
        >
          {label}
        </Link>
        <Link
          href="/"
          className="text-sm text-[var(--text-muted)] no-underline hover:text-[var(--text)]"
        >
          All tools
        </Link>
      </div>
    </nav>
  );
}
