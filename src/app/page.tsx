'use client';

import { useState, useMemo } from 'react';
import { Zap, Github, ArrowRight } from 'lucide-react';
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

  const filtered = useMemo(
    () => filterApps(ALL_APPS, category, search),
    [search, category]
  );

  const counts = useMemo(() => {
    const base = filterApps(ALL_APPS, 'all', search);
    return {
      all: base.length,
      education: base.filter((a) => a.category === 'education').length,
      training: base.filter((a) => a.category === 'training').length,
      productivity: base.filter((a) => a.category === 'productivity').length,
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
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-white/20 hover:text-white"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-20 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[800px] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
            <Zap className="h-3.5 w-3.5" />
            Powered by Claude Code
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Find an open source app.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Make it yours.
            </span>
          </h1>

          <p className="mb-8 text-lg text-slate-400 leading-relaxed">
            Browse curated GitHub starter templates across education, training, and
            productivity. Clone any app, then use Claude Code to understand and customize
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
              href="#how-it-works"
              className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-white/20 hover:text-white"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 py-12 border-y border-white/5">
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

      {/* App Browser */}
      <section id="apps" className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h2 className="mb-1 text-xl font-bold text-white">Browse Apps</h2>
            <p className="text-sm text-slate-500">
              {filtered.length} app{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>

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
        <p>
          AppToMine — Open source app discovery, powered by{' '}
          <a
            href="https://claude.ai/code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400"
          >
            Claude Code
          </a>
        </p>
      </footer>
    </div>
  );
}
