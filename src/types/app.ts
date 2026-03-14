export type Category = 'education' | 'training' | 'productivity' | 'cms' | 'ecommerce' | 'community' | 'all';

export interface App {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  stars: number;
  category: Exclude<Category, 'all'>;
  tags: string[];
  stack: string[];
  demoUrl?: string;
  cloneCommand: string;
  lastUpdated: string;
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
}
