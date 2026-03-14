# Clone and Run Any Node.js / Next.js App

This guide walks you through getting any Node.js or Next.js app running on your local machine from scratch.

---

## Prerequisites

Install these tools if you haven't already:

1. **Git** — [git-scm.com](https://git-scm.com)
2. **Node.js 18+** — [nodejs.org](https://nodejs.org) (includes npm)
3. A terminal / command prompt

Verify your setup:

```bash
git --version
node --version
npm --version
```

---

## Step 1: Clone the repository

Find the GitHub URL for the app (on the AppToMine app detail page, or on GitHub). Then run:

```bash
git clone https://github.com/<owner>/<repo-name>
```

This downloads all the code to a new folder named `<repo-name>` in your current directory.

---

## Step 2: Navigate into the project

```bash
cd <repo-name>
```

---

## Step 3: Install dependencies

Most Node.js apps list their dependencies in `package.json`. Install them with:

```bash
npm install
```

Some projects use `yarn` or `pnpm` instead:

```bash
# If the repo has a yarn.lock file:
yarn install

# If the repo has a pnpm-lock.yaml file:
pnpm install
```

---

## Step 4: Set up environment variables

Many apps need secrets (API keys, database URLs) that are not stored in the repo. Look for a `.env.example` or `.env.sample` file:

```bash
cp .env.example .env.local
```

Open `.env.local` in any text editor and fill in the required values. Check the project's `README.md` for instructions on what each variable means.

---

## Step 5: Run the development server

For **Next.js** apps:

```bash
npm run dev
```

For other Node.js apps, check `package.json` for the `scripts` section. Common commands:

```bash
npm start
npm run start
npm run serve
```

---

## Step 6: Open in your browser

Once the server starts, open [http://localhost:3000](http://localhost:3000) in your browser (the port may differ — check the terminal output).

---

## Common issues and fixes

### Port already in use

Another app is running on the same port. Either stop the other app, or specify a different port:

```bash
PORT=3001 npm run dev
```

### Missing environment variable errors

Check the error message for the variable name, then add it to your `.env.local` file.

### Module not found errors

Re-run `npm install`. If errors persist, try deleting `node_modules` and reinstalling:

```bash
rm -rf node_modules
npm install
```

### Database connection errors

Some apps require a local database (PostgreSQL, MySQL, etc.). Check the `README.md` for setup instructions, or use a hosted database service like [Supabase](https://supabase.com) (free tier available).

---

## Next steps

Once the app is running locally, use Claude Code to understand and customize it:

```bash
npm install -g @anthropic-ai/claude-code
claude "Please read and understand this entire codebase and summarize the architecture."
```

See the [Claude Code customization guide](./generic-claude-code.md) for more.
