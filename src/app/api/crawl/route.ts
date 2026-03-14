import { NextRequest, NextResponse } from 'next/server';
import { crawlCategory, repoToApp, searchGithubRepos } from '@/lib/github';
import type { Category } from '@/types/app';

export const runtime = 'nodejs';
export const revalidate = 3600; // ISR: re-crawl at most once per hour

/**
 * GET /api/crawl?category=education&perPage=10&minStars=100&query=...
 *
 * Uses Octokit to search GitHub for repos matching the given category or query.
 * Returns structured App data ready for the frontend.
 *
 * Requires GITHUB_TOKEN env var for authenticated requests (higher rate limit).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const category = (searchParams.get('category') ?? 'education') as Exclude<Category, 'all'>;
  const perPage = Math.min(parseInt(searchParams.get('perPage') ?? '10', 10), 30);
  const minStars = parseInt(searchParams.get('minStars') ?? '100', 10);
  const query = searchParams.get('query') ?? '';

  const validCategories: Array<Exclude<Category, 'all'>> = ['education', 'training', 'productivity', 'cms', 'ecommerce', 'community'];
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
      const repos = await searchGithubRepos({ category, query, perPage, minStars });
      apps = repos.map((repo) => repoToApp(repo, category));
    } else {
      apps = await crawlCategory(category, perPage);
    }

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
        error: 'Failed to crawl GitHub.',
        detail: message,
      },
      { status: 500 }
    );
  }
}
