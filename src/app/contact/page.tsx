'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Github, Mail } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', message: '' });

  const mailtoHref = `mailto:anyuanay@gmail.com?subject=${encodeURIComponent('AppToMine message from ' + (form.name || 'a visitor'))}&body=${encodeURIComponent(form.message)}`;

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
            <Link href="/contact" className="text-sm font-medium text-white">Contact</Link>
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

      <main className="mx-auto max-w-xl px-4 py-16">
        <h1 className="mb-2 text-4xl font-extrabold text-white">Contact Us</h1>
        <p className="mb-10 text-slate-400">
          Have a question, suggestion, or just want to say hi? Fill in your message below and
          click Send — it will open your email app with everything pre-filled.
        </p>

        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="name">
              Your name (optional)
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Your message or feedback…"
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <a
            href={mailtoHref}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500"
          >
            <Mail className="h-4 w-4" />
            Send Message
          </a>

          <p className="text-center text-xs text-slate-600">
            Or email us directly at{' '}
            <a href="mailto:anyuanay@gmail.com" className="text-slate-400 hover:text-white">
              anyuanay@gmail.com
            </a>
          </p>
        </div>
      </main>

      <footer className="border-t border-white/5 px-4 py-8 text-center text-sm text-slate-600">
        <p>AppToMine — Open source app discovery and customization by Trueway AI</p>
      </footer>
    </div>
  );
}
