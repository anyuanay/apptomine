import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star, ArrowLeft, ExternalLink, Github, Zap, Copy } from 'lucide-react';
import appsData from '@/data/apps.json';
import { getCategoryBadgeClass } from '@/lib/categories';
import TutorialSteps from '@/components/TutorialSteps';
import type { App, TutorialStep } from '@/types/app';
import { formatDistanceToNow } from 'date-fns';

const ALL_APPS = appsData as App[];

export function generateStaticParams() {
  return ALL_APPS.map((app) => ({ id: app.id }));
}

function getClaudeCodeSteps(app: App): TutorialStep[] {
  const repoName = app.githubUrl.split('/').pop() ?? app.id;
  return [
    {
      step: 1,
      title: 'Clone the repository',
      description: `Clone ${app.name} to your local machine using the command below. Open any terminal on your computer and paste it.`,
      command: `${app.cloneCommand}`,
      note: 'Not sure how to open a terminal? On Mac press Cmd+Space and type "Terminal". On Windows press Win+R and type "cmd".',
    },
    {
      step: 2,
      title: 'Open the folder in VS Code',
      description: `Open Visual Studio Code, go to File → Open Folder, and select the "${repoName}" folder that was just downloaded. VS Code is a free code editor - download it at code.visualstudio.com if you haven't already.`,
    },
    {
      step: 3,
      title: 'Open a terminal inside VS Code',
      description: 'In VS Code, go to Terminal → New Terminal (or press Ctrl+` on Windows / Ctrl+` on Mac). A terminal panel will appear at the bottom of the screen - this is where you will run Claude Code.',
    },
    {
      step: 4,
      title: 'Install Claude Code (one-time)',
      description: 'In the VS Code terminal, install Claude Code globally. You only need to do this once.',
      command: 'npm install -g @anthropic-ai/claude-code',
      note: 'This requires Node.js 18+. Verify the install worked by running: claude --version',
    },
    {
      step: 5,
      title: 'Start Claude Code',
      description: 'In the VS Code terminal, type the command below and press Enter. Claude Code will start up and wait for your instructions.',
      command: 'claude',
    },
    {
      step: 6,
      title: 'Ask Claude Code to understand the codebase',
      description: 'Type the following prompt and press Enter. Claude Code will read and analyze the entire project, then give you a clear overview of how it works.',
      command: `Please read and understand this entire codebase. Summarize the architecture, main components, and how data flows through the app.`,
      note: 'This may take a minute on large repos. Claude will produce a detailed summary you can reference while customizing.',
    },
    {
      step: 7,
      title: 'Start customizing',
      description: 'Now describe what you want to change in plain English. Claude Code will find the right files and make the changes for you.',
      command: `I want to [describe your requirement here]. Please make the necessary changes.`,
      note: 'Be as specific as possible. For example: "I want to change the color scheme to match my brand colors #FF6B35 and #004E89" or "I want to add a dark mode toggle."',
    },
  ];
}

function CloneBox({ command }: { command: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2 rounded-t-xl">
        <span className="text-xs text-slate-500 font-mono">Clone command</span>
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <code className="text-sm text-blue-300 font-mono overflow-x-auto">{command}</code>
        <div className="shrink-0 flex items-center">
          <Copy className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AppDetailPage({ params }: PageProps) {
  const { id } = await params;
  const app = ALL_APPS.find((a) => a.id === id);

  if (!app) {
    notFound();
  }

  const claudeSteps = getClaudeCodeSteps(app);

  const timeAgo = (() => {
    try {
      return formatDistanceToNow(new Date(app.lastUpdated), { addSuffix: true });
    } catch {
      return app.lastUpdated;
    }
  })();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Zap className="h-4 w-4" />
            </div>
            <span>AppToMine</span>
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all example apps
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getCategoryBadgeClass(app.category)}`}
                >
                  {app.category}
                </span>
                <span className="text-sm text-slate-500">Updated {timeAgo}</span>
              </div>
              <h1 className="mb-3 text-3xl font-extrabold text-white">{app.name}</h1>
              <p className="text-base text-slate-400 leading-relaxed">{app.description}</p>
            </div>

            {/* Stack */}
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {app.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            {app.tags.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {app.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-800/80 px-2.5 py-1 text-xs text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Clone command */}
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Clone Command
              </h2>
              <CloneBox command={app.cloneCommand} />
            </div>

            {/* Claude Code Tutorial */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-600/5 p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white">Customize with Claude Code</h2>
                  <p className="text-sm text-slate-400">
                    Follow these steps to understand and modify {app.name}
                  </p>
                </div>
              </div>
              <TutorialSteps steps={claudeSteps} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Stats card */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 text-sm font-semibold text-slate-400">Repository Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Stars</span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-yellow-400">
                    <Star className="h-3.5 w-3.5" />
                    {app.stars.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Category</span>
                  <span className="text-sm font-medium text-white capitalize">{app.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Last updated</span>
                  <span className="text-sm text-slate-300">{timeAgo}</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-400">Links</h3>
              <a
                href={app.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-300 transition-all hover:border-white/20 hover:text-white"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
              {app.demoUrl && (
                <a
                  href={app.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-600/10 px-3 py-2.5 text-sm text-blue-300 transition-all hover:bg-blue-600/20 hover:text-blue-200"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              )}
            </div>

            {/* CTA */}
            <div className="rounded-xl border border-blue-500/20 bg-gradient-to-b from-blue-600/10 to-transparent p-5 text-center">
              <Zap className="mx-auto mb-2 h-6 w-6 text-blue-400" />
              <p className="mb-1 text-sm font-semibold text-white">Ready to customize?</p>
              <p className="mb-4 text-xs text-slate-400">
                Install Claude Code and start building in minutes.
              </p>
              <a
                href="https://claude.ai/code"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-500"
              >
                Get Claude Code
              </a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
