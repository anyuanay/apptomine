export type Category = 'creative' | 'tools' | 'data' | 'games' | 'learning' | 'automation' | 'web' | 'agents' | 'cybersecurity' | 'privacy' | 'curriculum' | 'papers' | 'degree' | 'vision' | 'ontology' | 'knowledgegraphs' | 'all';

export type DiscoveryMode = 'all' | 'dormant-gems' | 'single-file' | 'jam-survivors' | 'tiny-and-complete';

// Any SPDX license id (or 'Unknown' for repos with no detected license).
// The crawler no longer filters by license, so this is an open string.
export type License = string;

export interface SeedScore {
  ideaNovelty: number;
  sizeFit: number;
  scopeClarity: number;
  readmeClarity: number;
  singleAuthorBonus: number;
  dormancyBonus: number;
  singleFileBonus: number;
  genericClonePenalty: number;
  popularityRamp: number;
  total: number;
}

export interface App {
  id: string;
  name: string;
  description: string;
  spark: string;
  githubUrl: string;
  stars: number;
  license: License;
  category: Exclude<Category, 'all'>;
  tags: string[];
  stack: string[];
  demoUrl?: string;
  cloneCommand: string;
  lastUpdated: string;
  loc: number;
  authorCount: number;
  dormant: boolean;
  singleFile: boolean;
  seedScore: SeedScore;
}

export interface Tutorial {
  id: string;
  title: string;
  steps: TutorialStep[];
}

export interface TutorialStep {
  step: number;
  title: string;
  description: string;
  command?: string;
  note?: string;
}

export interface SearchResult {
  apps: App[];
  total: number;
  query: string;
  category: Category;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  topics: string[];
  language: string | null;
  pushed_at: string;
  homepage: string | null;
  license: { spdx_id: string } | null;
  size: number;
}
