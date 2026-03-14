'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import type { TutorialStep } from '@/types/app';

interface TutorialStepsProps {
  steps: TutorialStep[];
  title?: string;
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative mt-3 overflow-hidden rounded-lg border border-white/10 bg-slate-900">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
        <span className="flex items-center gap-2 text-xs text-slate-500">
          <Terminal className="h-3 w-3" />
          Terminal
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-sm text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function StepItem({ step, isLast }: { step: TutorialStep; isLast: boolean }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="relative flex gap-4">
      {/* Step connector line */}
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-px bg-gradient-to-b from-blue-500/40 to-transparent" />
      )}

      {/* Step number */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-500/40 bg-blue-600/20 text-sm font-bold text-blue-400">
        {step.step}
      </div>

      {/* Step content */}
      <div className="flex-1 pb-8">
        <button
          onClick={() => setExpanded((p) => !p)}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <h3 className="text-sm font-semibold text-white">{step.title}</h3>
          {expanded ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
          )}
        </button>

        {expanded && (
          <div className="mt-2">
            <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
            {step.command && <CodeBlock code={step.command} />}
            {step.note && (
              <div className="mt-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2">
                <p className="text-xs text-yellow-400">
                  <span className="font-semibold">Note: </span>
                  {step.note}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TutorialSteps({ steps, title }: TutorialStepsProps) {
  return (
    <div>
      {title && (
        <h2 className="mb-6 text-lg font-bold text-white">{title}</h2>
      )}
      <div>
        {steps.map((step, i) => (
          <StepItem key={step.step} step={step} isLast={i === steps.length - 1} />
        ))}
      </div>
    </div>
  );
}
