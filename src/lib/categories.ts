import type { App, Category, DiscoveryMode } from '@/types/app';

export interface CategoryDefinition {
  id: Category;
  label: string;
  description: string;
  keywords: string[];
  color: string;
}

export interface DiscoveryModeDefinition {
  id: DiscoveryMode;
  label: string;
  description: string;
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
    id: 'creative',
    label: 'Creative',
    description: 'Generative art, music, visual tools, and creative coding',
    keywords: ['creative', 'art', 'music', 'generative', 'visual', 'shader', 'drawing', 'pixel', 'font'],
    color: 'bg-fuchsia-600',
  },
  {
    id: 'tools',
    label: 'Tools',
    description: 'CLI utilities, developer tools, and productivity aids',
    keywords: ['tool', 'cli', 'terminal', 'utility', 'developer', 'git', 'editor', 'wiki'],
    color: 'bg-emerald-600',
  },
  {
    id: 'data',
    label: 'Data',
    description: 'Data viewers, pipelines, visualizations, and analysis tools',
    keywords: ['data', 'csv', 'json', 'sql', 'visualization', 'analytics', 'database', 'maps'],
    color: 'bg-sky-600',
  },
  {
    id: 'games',
    label: 'Games',
    description: 'Game engines, game jam entries, and interactive fiction',
    keywords: ['game', 'engine', 'roguelike', 'jam', 'interactive', 'physics', 'dialogue'],
    color: 'bg-red-600',
  },
  {
    id: 'learning',
    label: 'Learning',
    description: 'Educational tools, flashcards, and learn-by-building projects',
    keywords: ['learning', 'education', 'flashcard', 'tutorial', 'renderer', 'algorithm'],
    color: 'bg-amber-600',
  },
  {
    id: 'automation',
    label: 'Automation',
    description: 'Bots, scrapers, webhooks, and workflow tools',
    keywords: ['automation', 'bot', 'webhook', 'rss', 'proxy', 'scraper', 'workflow'],
    color: 'bg-violet-600',
  },
  {
    id: 'web',
    label: 'Web',
    description: 'Small web apps, PWAs, browser tools, and single-page experiments',
    keywords: ['web', 'pwa', 'browser', 'html', 'css', 'search', 'app'],
    color: 'bg-orange-600',
  },
  {
    id: 'agents',
    label: 'Agents',
    description: 'Agent skills, agentic-coding frameworks, and LLM tooling',
    keywords: ['agent', 'agentic', 'skill', 'claude-skills', 'llm', 'ai', 'subagent', 'context-engineering'],
    color: 'bg-teal-600',
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    description: 'Security tools, pentesting, vulnerability scanners, and CTF projects',
    keywords: ['security', 'cybersecurity', 'pentest', 'vulnerability', 'infosec', 'exploit', 'malware', 'ctf', 'firewall'],
    color: 'bg-cyan-600',
  },
  {
    id: 'privacy',
    label: 'Privacy',
    description: 'Encryption, anonymity, tracker blockers, and self-hosted privacy tools',
    keywords: ['privacy', 'encryption', 'anonymity', 'tor', 'e2ee', 'tracker', 'gdpr', 'self-hosted'],
    color: 'bg-indigo-600',
  },
  {
    id: 'curriculum',
    label: 'Curriculum',
    description: 'Open source course materials, syllabi, learning paths, and self-study guides',
    keywords: ['curriculum', 'course', 'syllabus', 'learning-path', 'self-study', 'course-materials', 'lecture-notes', 'mooc'],
    color: 'bg-rose-600',
  },
  {
    id: 'papers',
    label: 'Research Papers',
    description: 'Curated research-paper collections, reading lists, and paper implementations',
    keywords: ['papers', 'research-paper', 'awesome-papers', 'paper-list', 'reading-list', 'paper-implementation', 'arxiv', 'survey'],
    color: 'bg-lime-600',
  },
  {
    id: 'degree',
    label: 'Degree Programs',
    description: 'Open source degree programs and full self-taught CS/AI curricula (OSSU-style)',
    keywords: ['degree', 'open-source-degree', 'cs-curriculum', 'self-taught', 'computer-science', 'ossu', 'roadmap', 'study-plan'],
    color: 'bg-purple-600',
  },
];

export const DISCOVERY_MODES: DiscoveryModeDefinition[] = [
  { id: 'all', label: 'All Apps', description: 'All apps, sorted by seed score' },
  { id: 'dormant-gems', label: 'Dormant Gems', description: 'Abandoned but cool — free real estate' },
  { id: 'single-file', label: 'Single-File Wonders', description: 'Entire project in one file, under 500 LOC' },
  { id: 'jam-survivors', label: 'Jam Survivors', description: 'Game jam and hackathon entries with extension potential' },
  { id: 'tiny-and-complete', label: 'Tiny & Complete', description: 'Under 1,000 LOC but fully functional' },
];

export function getCategoryDefinition(id: Category): CategoryDefinition {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export function filterByDiscoveryMode(apps: App[], mode: DiscoveryMode): App[] {
  switch (mode) {
    case 'dormant-gems':
      return apps.filter((a) => a.dormant);
    case 'single-file':
      return apps.filter((a) => a.singleFile);
    case 'jam-survivors':
      return apps.filter((a) =>
        a.tags.some((t) => ['game-jam', 'js13k', 'jam', 'hackathon', 'ludum-dare', 'game-jam'].includes(t)) ||
        a.tags.some((t) => t.includes('jam')) ||
        a.category === 'games'
      );
    case 'tiny-and-complete':
      return apps.filter((a) => a.loc <= 1000);
    default:
      return apps;
  }
}

export function filterApps(apps: App[], category: Category, query: string, discoveryMode: DiscoveryMode = 'all'): App[] {
  let filtered = filterByDiscoveryMode(apps, discoveryMode);

  if (category !== 'all') {
    filtered = filtered.filter((app) => app.category === category);
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.spark.toLowerCase().includes(q) ||
        app.tags.some((t) => t.toLowerCase().includes(q)) ||
        app.stack.some((s) => s.toLowerCase().includes(q)) ||
        app.category.toLowerCase().includes(q)
    );
  }

  filtered.sort((a, b) => b.seedScore.total - a.seedScore.total);

  return filtered;
}

export function getCategoryBadgeClass(category: Exclude<Category, 'all'>): string {
  const map: Record<Exclude<Category, 'all'>, string> = {
    creative:   'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30',
    tools:      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    data:       'bg-sky-500/20 text-sky-400 border border-sky-500/30',
    games:      'bg-red-500/20 text-red-400 border border-red-500/30',
    learning:   'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    automation: 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
    web:        'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    agents:     'bg-teal-500/20 text-teal-400 border border-teal-500/30',
    cybersecurity: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    privacy:    'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    curriculum: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    papers:     'bg-lime-500/20 text-lime-400 border border-lime-500/30',
    degree:     'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  };
  return map[category] ?? 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
}
