# AppToMine

A free Next.js platform that crawls and indexes GitHub starter templates and open source apps, categorizes them by type and stack, and teaches non-developers a repeatable workflow: clone the repo, run it locally, ask Claude Code to understand the codebase, then type requirements in the CLI to customize it.

## The Workflow (Core Loop)

```
Clone → Run → Understand → Customize with Claude Code
```

1. **Clone** — User finds an app on AppToMine, follows step-by-step clone instructions
2. **Run** — Guide to get the app running locally (or via GitHub Codespaces)
3. **Understand** — Ask Claude Code to deeply read and explain the codebase
4. **Customize** — User types requirements in CLI; Claude Code modifies the app

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

Add a GitHub token to enable the live crawler:

```bash
# .env.local
GITHUB_TOKEN=your_token_here
```

## Target Audience

- Non-developers who want to build or customize apps for their own needs
- People who know what they want but can't code from scratch
- Learners comfortable with CLI basics (or willing to learn)

## App Categories (Initial Focus)

- Education apps
- Training / onboarding tools
- Productivity apps
- SaaS boilerplates
- Starter templates

## Platform Architecture

| Layer | Tech |
|---|---|
| Frontend | Next.js (App Router) |
| Hosting | Vercel (free tier) |
| GitHub Discovery | GitHub API + Octokit (filtered by stars, activity, template tags) |
| Data / Index | Static seed `src/data/apps.json` + ISR crawl via `/api/crawl` |
| Tutorials | Step-by-step written guides + CLI snippets |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage (hero, search, filter, app grid)
│   ├── apps/[id]/page.tsx    # App detail + Claude Code tutorial
│   └── api/crawl/route.ts    # GitHub crawler API (ISR 1hr)
├── components/
│   ├── AppCard.tsx           # Card with stars, stack, clone button
│   ├── SearchBar.tsx         # Debounced search
│   ├── CategoryFilter.tsx    # Filter by category
│   └── TutorialSteps.tsx     # Step-by-step accordion with code blocks
├── data/apps.json            # 18 curated real GitHub apps (seed data)
├── lib/
│   ├── github.ts             # Octokit GitHub crawler
│   └── categories.ts         # Category definitions + filtering
├── types/app.ts              # TypeScript types
└── content/tutorials/        # Generic Claude Code + clone guides
```

## GitHub Crawler Design

- Filter criteria: stars threshold, recently active, quality README, demo URL present
- Focus on repos tagged as templates or boilerplates
- Cache results to stay within GitHub API rate limits
- Auto-update via ISR (1hr) on `/api/crawl`

## Tutorial Format

Two-layer approach:

- **Generic tutorials**: How to use Claude Code, how to read a codebase, how to run a Node/Next.js app locally
- **App-specific recipes**: "Customize this SaaS boilerplate to add your own branding", "Add a new page to this Next.js starter"

## Roadmap

- [x] Scaffold Next.js app on Vercel
- [x] GitHub crawler + indexer (Octokit, ISR caching)
- [x] Initial app category schema
- [x] Generic Claude Code tutorial templates
- [x] 18 curated starter apps across 3 categories
- [x] Search + browse UI
- [ ] Deploy to Vercel
- [ ] App-specific recipe tutorials (3–5 pilot)
- [ ] Community layer — users submit what they built
- [ ] Claude Code Recipe Library — standardized prompts for common customizations

## Open Questions

- How to handle apps with complex setup (required paid APIs, non-trivial env config)?
- Tutorial OS coverage — macOS, Windows, or both?
- Who writes app-specific tutorials — team, community, or AI-generated?

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for details.
