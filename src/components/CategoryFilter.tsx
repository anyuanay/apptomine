'use client';

import { BookOpen, Dumbbell, LayoutDashboard, Grid3X3, FileText, ShoppingCart, Users } from 'lucide-react';
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
  { id: 'all',          label: 'All Apps',     Icon: Grid3X3 },
  { id: 'education',    label: 'Education',    Icon: BookOpen },
  { id: 'training',     label: 'Training',     Icon: Dumbbell },
  { id: 'productivity', label: 'Productivity', Icon: LayoutDashboard },
  { id: 'cms',          label: 'CMS',          Icon: FileText },
  { id: 'ecommerce',    label: 'E-Commerce',   Icon: ShoppingCart },
  { id: 'community',    label: 'Community',    Icon: Users },
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
