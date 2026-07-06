'use client';

import { Palette, Wrench, Database, Gamepad2, GraduationCap, Bot, Globe, Grid3X3, Brain, Shield, EyeOff, BookOpen, FileText, Award, Eye, ListTree, Network } from 'lucide-react';
import type { Category } from '@/types/app';

interface CategoryFilterProps {
  active: Category;
  onChange: (category: Category) => void;
  counts?: Record<Category, number>;
}

const CATEGORY_CONFIG: Array<{
  id: Category;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'all',        label: 'Example Apps', Icon: Grid3X3 },
  { id: 'creative',   label: 'Creative',    Icon: Palette },
  { id: 'tools',      label: 'Tools',       Icon: Wrench },
  { id: 'data',       label: 'Data',        Icon: Database },
  { id: 'games',      label: 'Games',       Icon: Gamepad2 },
  { id: 'learning',   label: 'Learning',    Icon: GraduationCap },
  { id: 'automation', label: 'Automation',  Icon: Bot },
  { id: 'web',        label: 'Web',         Icon: Globe },
  { id: 'agents',     label: 'Agents',      Icon: Brain },
  { id: 'cybersecurity', label: 'Cybersecurity', Icon: Shield },
  { id: 'privacy',    label: 'Privacy',     Icon: EyeOff },
  { id: 'curriculum', label: 'Curriculum',  Icon: BookOpen },
  { id: 'papers',     label: 'Research Papers', Icon: FileText },
  { id: 'degree',     label: 'Degree Programs', Icon: Award },
  { id: 'vision',     label: 'Computer Vision', Icon: Eye },
  { id: 'ontology',   label: 'Ontology',    Icon: ListTree },
  { id: 'knowledgegraphs', label: 'Knowledge Graphs', Icon: Network },
];

export default function CategoryFilter({ active, onChange, counts }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_CONFIG.map(({ id, label, Icon }) => {
        const isActive = active === id;
        const count = counts?.[id];

        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {count !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  isActive ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-400'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
