'use client';

import { useRouter } from 'next/navigation';
import { Star, GitFork, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { App } from '@/types/app';
import { getCategoryBadgeClass } from '@/lib/categories';
import { formatDistanceToNow } from 'date-fns';

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(app.cloneCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timeAgo = (() => {
    try {
      return formatDistanceToNow(new Date(app.lastUpdated), { addSuffix: true });
    } catch {
      return app.lastUpdated;
    }
  })();

  return (
    <div
      className="group block cursor-pointer"
      onClick={() => router.push(`/apps/${app.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && router.push(`/apps/${app.id}`)}
    >
      <div className="h-full rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-200 hover:border-blue-500/40 hover:bg-white/8 hover:shadow-lg hover:shadow-blue-500/10">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
            {app.name}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getCategoryBadgeClass(app.category)}`}
          >
            {app.category}
          </span>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {app.description}
        </p>

        {/* Stack tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {app.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              {app.stars.toLocaleString()}
            </span>
            <span>{timeAgo}</span>
          </div>

          <div className="flex items-center gap-2">
            {app.demoUrl && (
              <a
                href={app.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                title="View demo"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-blue-600 hover:text-white border border-white/10 hover:border-transparent"
              title="Copy clone command"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Clone
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
