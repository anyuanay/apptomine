'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { Zap, Github, ArrowRight, Download, Terminal, FolderOpen, MessageSquare, Search, Wand2, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import AppCard from '@/components/AppCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import appsData from '@/data/apps.json';
import { filterApps } from '@/lib/categories';
import type { App, Category } from '@/types/app';

const ALL_APPS = appsData as App[];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');

  const [ghQuery, setGhQuery] = useState('');
  const [ghResults, setGhResults] = useState<App[] | null>(null);
  const [ghLoading, setGhLoading] = useState(false);
  const [ghError, setGhError] = useState<string | null>(null);
  const ghInputRef = useRef<HTMLInputElement>(null);

  const searchGitHub = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setGhLoading(true);
    setGhError(null);
    setGhResults(null);
    try {
      const cat = category === 'all' ? 'education' : category;
      const res = await fetch(`/api/crawl?query=${encodeURIComponent(trimmed)}&category=${cat}&perPage=12&minStars=100`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'GitHub search failed');
      setGhResults(data.apps as App[]);
    } catch (err) {
      setGhError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setGhLoading(false);
    }
  }, [category]);

  const clearGitHub = useCallback(() => {
    setGhResults(null);
    setGhError(null);
    setGhQuery('');
  }, []);

  const filtered = useMemo(
    () => filterApps(ALL_APPS, category, search),
    [search, category]
  );

  const counts = useMemo(() => {
    const base = filterApps(ALL_APPS, 'all', search);
    const count = (cat: string) => base.filter((a) => a.category === cat).length;
    return {
      all: base.length,
      education:    count('education'),
      training:     count('training'),
      productivity: count('productivity'),
      cms:          count('cms'),
      ecommerce:    count('ecommerce'),
      community:    count('community'),
    };
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Zap className="h-4 w-4" />
            </div>
            <span>AppToMine</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-slate-400 transition-colors hover:text-white">About</Link>
            <Link href="/contact" className="text-sm text-slate-400 transition-colors hover:text-white">Contact</Link>
            <a
              href="https://github.com/anyuanay/apptomine"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-white/20 hover:text-white"
            >
              <Github className="h-4 w-4" />
              Clone and Customize this App
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-20 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[800px] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Find an open source app.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Customize it to your needs.
            </span>
          </h1>

          <p className="mb-8 text-lg text-slate-400 leading-relaxed">
            Browse curated GitHub Open Source Apps. Clone any app, then use an AI coding agent such as Claude Code to understand and customize
            it — no experience required.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#apps"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500"
            >
              Browse Apps <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#getting-started"
              className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-white/20 hover:text-white"
            >
              Getting Started
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 py-12 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-xl font-bold text-white">
            From zero to customized in 4 steps
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: '1', title: 'Browse', desc: 'Find an app in your category of interest' },
              { n: '2', title: 'Clone', desc: 'Copy the one-line git clone command' },
              { n: '3', title: 'Understand', desc: 'Ask Claude Code to explain the codebase' },
              { n: '4', title: 'Customize', desc: 'Tell Claude Code what changes you want' },
            ].map(({ n, title, desc }) => (
              <div
                key={n}
                className="rounded-xl border border-white/10 bg-white/5 p-5 text-center"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/40 bg-blue-600/20 text-sm font-bold text-blue-400">
                  {n}
                </div>
                <h3 className="mb-1 font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section id="getting-started" className="px-4 py-16 border-b border-white/5">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
              <Zap className="h-3.5 w-3.5" />
              No coding experience needed
            </div>
            <h2 className="text-2xl font-bold text-white">Getting Started</h2>
            <p className="mt-2 text-slate-400">Follow these steps once — then you're ready to customize any app with Claude Code.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                n: '1',
                icon: <Download className="h-5 w-5" />,
                title: 'Install Node.js and Git',
                desc: 'These are free tools your computer needs to run apps. Search "install Node.js" and "install Git" on Google or ask ChatGPT for step-by-step instructions for your operating system.',
                tag: 'One-time setup',
              },
              {
                n: '2',
                icon: <FolderOpen className="h-5 w-5" />,
                title: 'Install Visual Studio Code',
                desc: "Download VS Code from code.visualstudio.com — it's a free, beginner-friendly code editor where you'll view and work on your app.",
                tag: 'One-time setup',
              },
              {
                n: '3',
                icon: <Github className="h-5 w-5" />,
                title: 'Clone the app',
                desc: "Pick an app below and click the Clone button to copy the command. Open any terminal on your computer, paste it, and press Enter. The app's code will download to your computer.",
                tag: 'Per app',
                highlight: true,
              },
              {
                n: '4',
                icon: <FolderOpen className="h-5 w-5" />,
                title: 'Open the folder in VS Code',
                desc: 'In VS Code, go to File → Open Folder and select the folder that was just downloaded.',
                tag: 'Per app',
                highlight: true,
              },
              {
                n: '5',
                icon: <Terminal className="h-5 w-5" />,
                title: 'Open a terminal inside VS Code',
                desc: 'In VS Code, go to Terminal → New Terminal (or press Ctrl+` on Windows / Ctrl+` on Mac). A terminal panel will appear at the bottom of the screen.',
                tag: 'Per app',
                highlight: true,
              },
              {
                n: '6',
                icon: <Terminal className="h-5 w-5" />,
                title: 'Install Claude Code (one-time)',
                desc: (
                  <>
                    In the VS Code terminal, run:{' '}
                    <code className="rounded bg-slate-800 px-2 py-0.5 text-xs text-blue-300 font-mono">
                      npm install -g @anthropic-ai/claude-code
                    </code>
                    . You only need to do this once. Verify it worked by running{' '}
                    <code className="rounded bg-slate-800 px-2 py-0.5 text-xs text-blue-300 font-mono">claude --version</code>.
                  </>
                ),
                tag: 'One-time setup',
              },
              {
                n: '7',
                icon: <MessageSquare className="h-5 w-5" />,
                title: 'Start Claude Code',
                desc: (
                  <>
                    In the VS Code terminal, type{' '}
                    <code className="rounded bg-slate-800 px-2 py-0.5 text-xs text-blue-300 font-mono">claude</code>
                    {' '}and press Enter. Claude Code will start up and wait for your instructions.
                  </>
                ),
                tag: 'Per app',
                highlight: true,
              },
              {
                n: '8',
                icon: <Search className="h-5 w-5" />,
                title: 'Ask Claude Code to understand the codebase',
                desc: (
                  <>
                    Type the following and press Enter:{' '}
                    <span className="italic text-slate-300">"Please read and understand this entire codebase. Summarize the architecture, main components, and how data flows through the app."</span>
                  </>
                ),
                tag: 'Per app',
                highlight: true,
              },
              {
                n: '9',
                icon: <Wand2 className="h-5 w-5" />,
                title: 'Start customizing',
                desc: "Describe what you want to change in plain English. Claude Code will find the right files and make the changes for you. For example: \"I want to change the color scheme to match my brand colors #FF6B35 and #004E89\" or \"I want to add a dark mode toggle.\"",
                tag: 'Ongoing',
                accent: true,
              },
            ].map(({ n, icon, title, desc, tag, highlight, accent }) => (
              <div
                key={n}
                className={`flex gap-4 rounded-xl border p-5 transition-colors ${
                  accent
                    ? 'border-blue-500/30 bg-blue-500/10'
                    : highlight
                    ? 'border-white/10 bg-white/5'
                    : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  accent ? 'bg-blue-600 text-white' : 'border border-slate-700 bg-slate-800 text-slate-400'
                }`}>
                  {n}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className={`font-semibold ${accent ? 'text-blue-300' : 'text-white'}`}>{title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      accent ? 'bg-blue-600/30 text-blue-300' :
                      highlight ? 'bg-slate-700 text-slate-400' :
                      'bg-slate-800 text-slate-500'
                    }`}>{tag}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
                <div className={`hidden sm:flex shrink-0 items-start pt-0.5 ${accent ? 'text-blue-400' : 'text-slate-600'}`}>
                  {icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Browser */}
      <section id="apps" className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {/* GitHub live search */}
          <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
              <Github className="h-3.5 w-3.5" />
              Search GitHub live
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); searchGitHub(ghQuery); }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  ref={ghInputRef}
                  type="text"
                  value={ghQuery}
                  onChange={(e) => setGhQuery(e.target.value)}
                  placeholder="e.g. quiz platform, flashcard, virtual classroom…"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button
                type="submit"
                disabled={!ghQuery.trim() || ghLoading}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ghLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </button>
            </form>
            {ghError && (
              <p className="mt-2 text-xs text-red-400">{ghError}</p>
            )}
          </div>

          <div className="mb-6">
            <h2 className="mb-1 text-xl font-bold text-white">Browse Apps</h2>
            <p className="text-sm text-slate-500">
              {filtered.length} app{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* GitHub results */}
          {ghResults !== null && (
            <div className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  GitHub results
                  <span className="ml-2 rounded-full bg-blue-600/30 px-2 py-0.5 text-xs text-blue-300">{ghResults.length}</span>
                </h3>
                <button
                  onClick={clearGitHub}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" /> Clear results
                </button>
              </div>
              {ghResults.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {ghResults.map((app) => (
                    <AppCard key={app.id} app={app} externalLink />
                  ))}
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-slate-500">No results found on GitHub.</p>
              )}
              <div className="mt-6 border-t border-white/5" />
            </div>
          )}

          {/* Search + Filter */}
          <div className="mb-8 space-y-4">
            <SearchBar value={search} onChange={setSearch} />
            <CategoryFilter active={category} onChange={setCategory} counts={counts} />
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-slate-500">No apps found for your search.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                }}
                className="mt-3 text-sm text-blue-400 hover:text-blue-300"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-8 text-center text-sm text-slate-600">
        <p>AppToMine — Open source app discovery and customization by Trueway AI</p>
      </footer>
    </div>
  );
}
