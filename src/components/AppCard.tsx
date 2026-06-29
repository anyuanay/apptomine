'use client';

import { useRouter } from 'next/navigation';
import { Star, ExternalLink, Copy, Check, Flame, Moon, FileCode } from 'lucide-react';
import { useState } from 'react';
import type { App } from '@/types/app';
import { getCategoryBadgeClass } from '@/lib/categories';
import { getLicenseInfo } from '@/lib/licenses';

interface AppCardProps {
  app: App;
  externalLink?: boolean;
}

export default function AppCard({ app, externalLink = false }: AppCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const license = getLicenseInfo(app.license);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(app.cloneCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group block cursor-pointer"
      onClick={() => externalLink ? window.open(app.githubUrl, '_blank', 'noopener,noreferrer') : router.push(`/apps/${app.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && (externalLink ? window.open(app.githubUrl, '_blank', 'noopener,noreferrer') : router.push(`/apps/${app.id}`))}
    >
      <div className="h-full rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-200 hover:border-blue-500/40 hover:bg-white/8 hover:shadow-lg hover:shadow-blue-500/10">
        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
            {app.name}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getCategoryBadgeClass(app.category)}`}
          >
            {app.category}
          </span>
        </div>

        {/* Spark */}
        <p className="mb-3 text-xs text-blue-400/80 italic line-clamp-2 leading-relaxed">
          {app.spark}
        </p>

        {/* Description */}
        <p className="mb-4 text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {app.description}
        </p>

        {/* Badges row */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {app.dormant && (
            <span className="flex items-center gap-1 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-xs text-amber-400">
              <Moon className="h-3 w-3" /> Dormant
            </span>
          )}
          {app.singleFile && (
            <span className="flex items-center gap-1 rounded-md bg-cyan-500/15 px-1.5 py-0.5 text-xs text-cyan-400">
              <FileCode className="h-3 w-3" /> Single file
            </span>
          )}
          <span className="rounded-md bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400">
            {app.loc.toLocaleString()} LOC
          </span>
          <span
            className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs ${license.badgeClass}`}
            title={license.tooltip}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${license.dotClass}`} />
            {license.label}
          </span>
        </div>

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
            <span className="flex items-center gap-1" title="Seed score">
              <Flame className="h-3.5 w-3.5 text-orange-400" />
              {app.seedScore.total}
            </span>
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
