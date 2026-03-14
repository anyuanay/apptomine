import { Octokit } from '@octokit/rest';
import type { App, GithubRepo } from '@/types/app';
import type { Category } from '@/types/app';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface CrawlOptions {
  category: Exclude<Category, 'all'>;
  query: string;
  perPage?: number;
  minStars?: number;
}

const CATEGORY_QUERIES: Record<Exclude<Category, 'all'>, string> = {
  education: 'lms OR "learning management" OR "quiz app" OR "flashcard" OR "e-learning" OR "virtual classroom" OR "course platform" in:description,topics',
  training: 'onboarding OR "employee training" OR "skill tracker" OR "corporate training" OR "assessment platform" OR "badge" OR "credential" in:description,topics',
  productivity: 'kanban OR "task manager" OR "note taking" OR "project management" OR "scheduling" OR "wiki" OR "knowledge base" in:description,topics',
  cms: '"content management" OR "headless cms" OR "headless CMS" OR "cms" OR "blog platform" OR "publishing platform" in:description,topics',
  ecommerce: '"e-commerce" OR ecommerce OR "online store" OR "shopping cart" OR "commerce platform" OR storefront in:description,topics',
  community: 'forum OR "community platform" OR "discussion board" OR "social network" OR "team chat" OR "live chat" OR "q&a platform" in:description,topics',
};

export async function searchGithubRepos(options: CrawlOptions): Promise<GithubRepo[]> {
  const { category, query, perPage = 10, minStars = 100 } = options;

  const baseQuery = query || CATEGORY_QUERIES[category];
  const fullQuery = `${baseQuery} stars:>=${minStars} is:public`;

  const response = await octokit.search.repos({
    q: fullQuery,
    sort: 'stars',
    order: 'desc',
    per_page: perPage,
  });

  return response.data.items.map((item) => ({
    id: item.id,
    name: item.name,
    full_name: item.full_name,
    description: item.description,
    html_url: item.html_url,
    stargazers_count: item.stargazers_count,
    topics: item.topics ?? [],
    language: item.language,
    pushed_at: item.pushed_at ?? new Date().toISOString(),
    homepage: item.homepage,
  }));
}

export function repoToApp(repo: GithubRepo, category: Exclude<Category, 'all'>): App {
  return {
    id: repo.full_name.replace('/', '-').toLowerCase(),
    name: repo.name
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    description: repo.description ?? 'No description available.',
    githubUrl: repo.html_url,
    stars: repo.stargazers_count,
    category,
    tags: [
      ...(repo.topics ?? []).slice(0, 5),
      ...(repo.language ? [repo.language.toLowerCase()] : []),
    ],
    stack: [
      ...(repo.language ? [repo.language] : []),
      ...(repo.topics ?? [])
        .filter((t) =>
          ['react', 'nextjs', 'vue', 'angular', 'typescript', 'python', 'go', 'rust'].includes(t)
        )
        .slice(0, 3),
    ],
    demoUrl: repo.homepage ?? undefined,
    cloneCommand: `git clone ${repo.html_url}`,
    lastUpdated: repo.pushed_at.split('T')[0],
  };
}

export async function crawlCategory(
  category: Exclude<Category, 'all'>,
  perPage = 10
): Promise<App[]> {
  const repos = await searchGithubRepos({ category, query: '', perPage });
  return repos.map((repo) => repoToApp(repo, category));
}
