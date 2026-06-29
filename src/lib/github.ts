import { Octokit } from '@octokit/rest';
import type { App, GithubRepo, SeedScore } from '@/types/app';
import type { Category } from '@/types/app';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface CrawlOptions {
  category: Exclude<Category, 'all'>;
  query: string;
  perPage?: number;
  maxStars?: number;
}

const CATEGORY_QUERIES: Record<Exclude<Category, 'all'>, string> = {
  creative: 'generative OR "creative coding" OR "pixel art" OR "shader" OR "music" OR "audio visualization" OR "procedural" in:description,topics',
  tools: 'cli OR "command line" OR "terminal tool" OR "developer tool" OR "git extension" OR "tui" in:description,topics',
  data: 'csv OR "data visualization" OR "sqlite extension" OR "json viewer" OR "data pipeline" OR "analytics" in:description,topics',
  games: '"game engine" OR "game jam" OR "roguelike" OR "interactive fiction" OR "js13k" OR "ludum dare" in:description,topics',
  learning: 'flashcard OR "spaced repetition" OR "educational" OR "learn by building" OR "from scratch" in:description,topics',
  automation: 'webhook OR "rss" OR "bot" OR "scraper" OR "automation" OR "proxy" OR "cron" in:description,topics',
  web: 'pwa OR "single page" OR "static site" OR "browser extension" OR "bookmarklet" OR "minimal web app" in:description,topics',
  agents: '"agent skill" OR "claude skill" OR "agentic" OR "ai agent" OR "subagent" OR "context engineering" OR "llm agent" in:description,topics',
  cybersecurity: 'cybersecurity OR "security tool" OR "penetration testing" OR "vulnerability scanner" OR "infosec" OR "ctf" in:description,topics',
  privacy: 'privacy OR "end-to-end encryption" OR "anonymity" OR "tracker blocker" OR "self-hosted" OR "gdpr" in:description,topics',
  curriculum: 'curriculum OR "course materials" OR "syllabus" OR "learning path" OR "self-study" OR "lecture notes" in:description,topics',
  papers: '"awesome papers" OR "paper list" OR "research papers" OR "paper implementations" OR "reading list" OR "paper collection" in:description,topics',
  degree: '"open source degree" OR "cs curriculum" OR "self-taught" OR "computer science curriculum" OR "ossu" OR "degree program" in:description,topics',
  vision: '"computer vision" OR "object detection" OR "image segmentation" OR "opencv" OR "image processing" OR "yolo" in:description,topics',
};

export async function searchGithubRepos(options: CrawlOptions): Promise<GithubRepo[]> {
  const { category, query, perPage = 10, maxStars = 500 } = options;

  const baseQuery = query || CATEGORY_QUERIES[category];
  const fullQuery = `${baseQuery} stars:1..${maxStars} is:public`;

  const response = await octokit.search.repos({
    q: fullQuery,
    sort: 'updated',
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
    license: item.license ? { spdx_id: item.license.spdx_id ?? 'Unknown' } : null,
    size: item.size ?? 0,
  }));
}

function estimateLoc(sizeKb: number): number {
  return Math.max(100, Math.round(sizeKb * 0.8));
}

function computeSeedScore(repo: GithubRepo): SeedScore {
  const loc = estimateLoc(repo.size);

  const sizeFit = loc >= 200 && loc <= 5000 ? 9 : loc < 200 ? 6 : Math.max(3, 9 - Math.floor((loc - 5000) / 2000));
  const scopeClarity = repo.topics.length <= 5 ? 8 : 5;
  const readmeClarity = repo.description && repo.description.length > 30 ? 8 : 4;
  const singleAuthorBonus = 3;
  const lastPush = new Date(repo.pushed_at);
  const monthsAgo = (Date.now() - lastPush.getTime()) / (1000 * 60 * 60 * 24 * 30);
  const dormancyBonus = monthsAgo > 12 ? 3 : 0;
  const singleFileBonus = loc < 500 ? 3 : 0;
  const genericClonePenalty = 0;
  const popularityRamp = repo.stargazers_count > 400 ? -1 : repo.stargazers_count > 300 ? -0.5 : 0;
  const ideaNovelty = 6;

  const total = ideaNovelty + sizeFit + scopeClarity + readmeClarity +
    singleAuthorBonus + dormancyBonus + singleFileBonus + genericClonePenalty + popularityRamp;

  return {
    ideaNovelty,
    sizeFit,
    scopeClarity,
    readmeClarity,
    singleAuthorBonus,
    dormancyBonus,
    singleFileBonus,
    genericClonePenalty,
    popularityRamp,
    total: Math.round(total),
  };
}

export function repoToApp(repo: GithubRepo, category: Exclude<Category, 'all'>): App {
  const loc = estimateLoc(repo.size);
  const lastPush = new Date(repo.pushed_at);
  const monthsAgo = (Date.now() - lastPush.getTime()) / (1000 * 60 * 60 * 24 * 30);
  const licenseSpdx = repo.license?.spdx_id ?? 'Unknown';

  return {
    id: repo.full_name.replace('/', '-').toLowerCase(),
    name: repo.name
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    description: repo.description ?? 'No description available.',
    spark: repo.description ?? 'Interesting project worth exploring.',
    githubUrl: repo.html_url,
    stars: repo.stargazers_count,
    license: licenseSpdx,
    category,
    tags: [
      ...(repo.topics ?? []).slice(0, 5),
      ...(repo.language ? [repo.language.toLowerCase()] : []),
    ],
    stack: [
      ...(repo.language ? [repo.language] : []),
      ...(repo.topics ?? [])
        .filter((t) =>
          ['react', 'nextjs', 'vue', 'angular', 'svelte', 'typescript', 'python', 'go', 'rust', 'c', 'cpp'].includes(t)
        )
        .slice(0, 3),
    ],
    demoUrl: repo.homepage ?? undefined,
    cloneCommand: `git clone ${repo.html_url}`,
    lastUpdated: repo.pushed_at.split('T')[0],
    loc,
    authorCount: 1,
    dormant: monthsAgo > 12,
    singleFile: loc < 500,
    seedScore: computeSeedScore(repo),
  };
}

export async function crawlCategory(
  category: Exclude<Category, 'all'>,
  perPage = 10
): Promise<App[]> {
  const repos = await searchGithubRepos({ category, query: '', perPage });
  return repos.map((repo) => repoToApp(repo, category));
}
