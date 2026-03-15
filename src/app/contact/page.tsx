'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Github, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to send message.');
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error.');
      setStatus('error');
    }
  };

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
          Have a question, suggestion, or just want to say hi? Send us a message and we'll get
          back to you.
        </p>

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Message sent!</h2>
            <p className="text-sm text-slate-400">Thanks for reaching out. We'll get back to you soon.</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Your message or feedback…"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </main>

      <footer className="border-t border-white/5 px-4 py-8 text-center text-sm text-slate-600">
        <p>AppToMine — Open source app discovery and customization by Trueway AI</p>
      </footer>
    </div>
  );
}
