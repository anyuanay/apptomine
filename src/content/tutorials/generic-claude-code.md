# Using Claude Code to Understand and Customize Any Codebase

Claude Code is an AI-powered CLI that lets you interact with an entire codebase through natural language. This guide shows you how to use it effectively — even if you have never written code before.

---

## Prerequisites

- Node.js 18 or higher installed ([nodejs.org](https://nodejs.org))
- An Anthropic API key ([console.anthropic.com](https://console.anthropic.com))
- The app cloned to your local machine

---

## Step 1: Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Verify the installation:

```bash
claude --version
```

Set your API key (first-time only):

```bash
export ANTHROPIC_API_KEY="your-key-here"
```

Or add it to your shell profile (`~/.zshrc` or `~/.bashrc`) to persist it.

---

## Step 2: Navigate to the cloned repo

```bash
cd <your-cloned-repo-name>
```

---

## Step 3: Ask Claude to understand the codebase

Start with a high-level summary prompt. This gets Claude oriented before you ask it to make changes.

```bash
claude "Please read and understand this entire codebase. Summarize:
1. What this app does
2. The overall architecture
3. The main components or modules
4. How data flows through the app
5. The key files I should know about"
```

Claude will read all the files and give you a detailed map of the codebase. Save or screenshot this — it is your reference guide.

---

## Step 4: Ask clarifying questions

Before making changes, ask questions to understand how things work:

```bash
claude "How does authentication work in this app?"
claude "Where is the database schema defined?"
claude "Which file controls the homepage layout?"
claude "What API calls does this app make?"
```

---

## Step 5: Type your customization requirement

Once you understand the codebase, describe what you want:

```bash
claude "I want to [your requirement]. Please make the necessary changes and explain what you changed."
```

### Good requirement examples

- `"I want to change the primary color from blue to purple throughout the entire app."`
- `"I want to add a 'dark mode' toggle in the navigation bar."`
- `"I want to rename the 'Projects' section to 'My Work' everywhere it appears."`
- `"I want to add a footer with my company name and a link to my website."`
- `"I want the app to show a welcome message with the user's name after they log in."`

---

## Tips for effective prompts

| Do | Don't |
|---|---|
| Be specific about what you want | Say "make it better" |
| Mention where you want the change | Leave location ambiguous |
| Describe the end result | Describe implementation details |
| Ask one change at a time | Request many changes at once |

---

## What Claude Code can help with

- Understanding unfamiliar code
- Renaming and rebranding
- Adding new pages or sections
- Changing colors, fonts, and layout
- Adding or removing features
- Fixing bugs and error messages
- Writing tests
- Adding new API integrations
