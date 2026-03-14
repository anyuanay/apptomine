import type { App, Category } from '@/types/app';

export interface CategoryDefinition {
  id: Category;
  label: string;
  description: string;
  keywords: string[];
  color: string;
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'all',
    label: 'All Apps',
    description: 'Browse all curated open source apps',
    keywords: [],
    color: 'bg-blue-600',
  },
  {
    id: 'education',
    label: 'Education',
    description: 'Learning platforms, course builders, and quiz apps',
    keywords: ['education', 'learning', 'lms', 'course', 'quiz', 'flashcard', 'mooc', 'school', 'student', 'teacher'],
    color: 'bg-emerald-600',
  },
  {
    id: 'training',
    label: 'Training',
    description: 'Onboarding tools, skill trackers, and corporate learning',
    keywords: ['training', 'onboarding', 'skill', 'corporate', 'employee', 'feedback', 'assessment', 'badge', 'credential'],
    color: 'bg-violet-600',
  },
  {
    id: 'productivity',
    label: 'Productivity',
    description: 'Task managers, note apps, kanban boards, and calendars',
    keywords: ['productivity', 'task', 'todo', 'kanban', 'project', 'notes', 'calendar', 'scheduling', 'board'],
    color: 'bg-orange-600',
  },
  {
    id: 'cms',
    label: 'CMS',
    description: 'Content management systems and headless backends',
    keywords: ['cms', 'content', 'blog', 'headless', 'api', 'publishing', 'media', 'admin'],
    color: 'bg-sky-600',
  },
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    description: 'Online stores, storefronts, and commerce platforms',
    keywords: ['ecommerce', 'shop', 'store', 'cart', 'checkout', 'payment', 'products', 'orders'],
    color: 'bg-rose-600',
  },
  {
    id: 'community',
    label: 'Community',
    description: 'Forums, social networks, and messaging platforms',
    keywords: ['community', 'forum', 'social', 'chat', 'messaging', 'discussion', 'network', 'feed'],
    color: 'bg-amber-600',
  },
];

export function getCategoryDefinition(id: Category): CategoryDefinition {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export function filterApps(apps: App[], category: Category, query: string): App[] {
  let filtered = apps;

  if (category !== 'all') {
    filtered = filtered.filter((app) => app.category === category);
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.tags.some((t) => t.toLowerCase().includes(q)) ||
        app.stack.some((s) => s.toLowerCase().includes(q)) ||
        app.category.toLowerCase().includes(q)
    );
  }

  return filtered;
}

export function getCategoryBadgeClass(category: Exclude<Category, 'all'>): string {
  const map: Record<Exclude<Category, 'all'>, string> = {
    education:   'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    training:    'bg-violet-500/20 text-violet-400 border border-violet-500/30',
    productivity:'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    cms:         'bg-sky-500/20 text-sky-400 border border-sky-500/30',
    ecommerce:   'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    community:   'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  };
  return map[category] ?? 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
}
