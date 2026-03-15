import Link from 'next/link';
import { Zap, Github, Search, Code2, Users } from 'lucide-react';

export const metadata = {
  title: 'About - AppToMine',
  description: 'Learn about AppToMine - open source app discovery and customization by Trueway AI.',
};

export default function AboutPage() {
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
            <Link href="/" className="text-sm text-slate-400 transition-colors hover:text-white">Home</Link>
            <Link href="/about" className="text-sm font-medium text-white">About</Link>
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

      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-4 text-4xl font-extrabold text-white">About AppToMine</h1>
        <p className="mb-10 text-lg text-slate-400 leading-relaxed">
          AppToMine is an open source app discovery and customization platform built by{' '}
          <span className="font-semibold text-white">Trueway AI</span>. Our mission is to make
          the world's open source software accessible to everyone - not just developers.
        </p>

        <div className="space-y-8">
          {/* What */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20">
                <Search className="h-4 w-4 text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-white">What is AppToMine?</h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              AppToMine curates high-quality open source apps from GitHub across categories like
              education, training, productivity, e-commerce, and community platforms. Each app
              comes with a one-click clone command and a step-by-step guide for customizing it
              with AI - no coding experience required.
            </p>
          </div>

          {/* Why */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/20">
                <Users className="h-4 w-4 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Who is it for?</h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              AppToMine is built for non-developers, educators, entrepreneurs, and anyone who
              wants a working app without building from scratch. If you can describe what you
              want in plain English, you can customize any app on this platform using an AI
              coding agent like Claude Code - and ship something real.
            </p>
          </div>

          {/* How */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600/20">
                <Code2 className="h-4 w-4 text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-white">How does it work?</h2>
            </div>
            <ol className="mt-1 space-y-2 text-sm text-slate-400">
              {[
                'Browse or search for an app that fits your use case.',
                'Clone it to your computer with a single command.',
                'Open the folder in VS Code and launch Claude Code.',
                'Ask Claude Code to explain the codebase, then describe the changes you want.',
                'Claude Code modifies the code for you - you review, run, and ship.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 font-bold text-slate-600">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Open source */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-600/5 p-6">
            <h2 className="mb-2 font-bold text-white">AppToMine is open source</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              The platform itself is open source. You can clone it, customize it, and run your
              own version - using the exact same workflow we teach. It's built with Next.js and
              deployed on Vercel.
            </p>
            <a
              href="https://github.com/anyuanay/apptomine"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-500"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 px-4 py-8 text-center text-sm text-slate-600">
        <p>AppToMine - Open source app discovery and customization by Trueway AI</p>
      </footer>
    </div>
  );
}
