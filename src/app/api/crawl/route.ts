import { NextRequest, NextResponse } from 'next/server';
import { crawlCategory, repoToApp, searchGithubRepos } from '@/lib/github';
import type { Category } from '@/types/app';

export const runtime = 'nodejs';
export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const category = (searchParams.get('category') ?? 'creative') as Exclude<Category, 'all'>;
  const perPage = Math.min(parseInt(searchParams.get('perPage') ?? '10', 10), 30);
  const maxStars = Math.min(parseInt(searchParams.get('maxStars') ?? '500', 10), 500);
  const query = searchParams.get('query') ?? '';

  const validCategories: Array<Exclude<Category, 'all'>> = ['creative', 'tools', 'data', 'games', 'learning', 'automation', 'web', 'agents', 'cybersecurity', 'privacy', 'curriculum', 'papers', 'degree', 'vision', 'ontology', 'knowledgegraphs'];
  if (!validCategories.includes(category)) {
    return NextResponse.json(
      { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
      { status: 400 }
    );
  }

  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json(
      {
        error: 'GITHUB_TOKEN is not configured. Add it to .env.local to enable crawling.',
        hint: 'Create a GitHub personal access token at https://github.com/settings/tokens',
      },
      { status: 503 }
    );
  }

  try {
    let apps;

    if (query) {
      const repos = await searchGithubRepos({ category, query, perPage, maxStars });
      apps = repos.map((repo) => repoToApp(repo, category));
    } else {
      apps = await crawlCategory(category, perPage);
    }

    apps.sort((a, b) => b.seedScore.total - a.seedScore.total);

    return NextResponse.json({
      success: true,
      category,
      count: apps.length,
      apps,
      crawledAt: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/crawl] Error:', message);

    return NextResponse.json(
      {
        error: 'Failed to search GitHub for seed projects.',
        detail: message,
      },
      { status: 500 }
    );
  }
}
