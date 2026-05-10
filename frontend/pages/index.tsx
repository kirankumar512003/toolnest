import Head from 'next/head';
import SideNav from '@/components/layout/SideNav';
import AtmosBackground from '@/components/AtmosBackground';
import ToolCard from '@/components/ToolCard';
import { TOOLS } from '@/utils/tools';

export default function Home() {
  return (
    <>
      <Head>
        <title>ToolNest – A cozy nest of developer tools</title>
        <meta name="description" content="A cozy nest of essential developer tools. JSON, diff, encoding, markdown, timestamps, scratchpad, drawboard." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Scrollable home layout — does NOT use h-screen so page can grow */}
      <div className="flex min-h-screen text-[var(--text)]">
        <AtmosBackground />
        <SideNav />
        <div className="flex-1 ml-16 overflow-y-auto">
          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16">

            <header className="mb-24 mt-16 flex flex-col items-center text-center">
              <div className="mb-8 inline-flex items-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent)] shadow-sm">
                Developer Toolkit
              </div>

              <h1 className="mb-6 max-w-4xl text-5xl font-extrabold tracking-tight text-[var(--text)] sm:text-6xl md:text-7xl">
                You searched. You bookmarked.{' '}
                <br className="hidden sm:block" />
                You forgot.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-yellow-400">
                  We keep it for you.
                </span>
              </h1>

              <p className="mb-10 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)] sm:text-xl">
                ToolNest is your permanent developer nest — every tool you reach for, always here, no sign-up needed.
              </p>

              <a
                href="#tools"
                className="mb-16 inline-flex items-center rounded-lg bg-[var(--text)] px-8 py-3.5 text-sm font-semibold text-[var(--bg)] transition-transform hover:scale-105 hover:bg-white"
              >
                Browse Tools ↓
              </a>

              <div className="flex w-full max-w-3xl items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-8 py-8 shadow-2xl backdrop-blur-md sm:px-16">
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-black text-[var(--text)]">10</span>
                  <span className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Tools</span>
                </div>
                <div className="h-16 w-px bg-[var(--border)]/80"></div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-black text-[var(--text)]">100%</span>
                  <span className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Offline</span>
                </div>
                <div className="h-16 w-px bg-[var(--border)]/80"></div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-black text-[var(--text)]">0</span>
                  <span className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Sign-Ups Needed</span>
                </div>
              </div>
            </header>

            <section id="tools" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TOOLS.map((tool) => (
                <ToolCard
                  key={tool.id}
                  id={tool.id}
                  name={tool.name}
                  description={tool.description}
                  href={tool.href}
                />
              ))}
            </section>

            <footer className="mt-16 text-center text-xs text-[var(--text-muted)]">
              Your everyday developer utilities. All tools run in your browser.
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
