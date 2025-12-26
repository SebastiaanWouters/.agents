---
name: setup
description: Initialize new projects through interactive Q&A. Triggers on "new project", "start project", "init", "setup". Covers tech stack, architecture, structure, tooling.
---

# Setup

Initialize projects through iterative questioning to create well-configured starting points.

## Process

```
[User describes idea] → [Ask questions] → [Propose plan] → [User confirms] → [Initialize]
```

## Questions

### Purpose
- What does it do? Who's it for?
- Personal/work/open source?

### Tech Stack
- Language/runtime (TS, Python, Go, Rust, Bun, Deno)
- Project type (web, API, CLI, library, full-stack, monorepo)
- Framework (React, Vue, Next.js, Hono, etc.)
- Database (PostgreSQL, SQLite, MongoDB) + ORM (Drizzle, Prisma)

### Dependencies
- Core libs needed
- Testing (Vitest, Jest, Playwright)
- Linting/formatting (ESLint, Biome, Prettier)

### Structure
- Organization (feature-based, layer-based, domain-driven)
- Conventions (src/, naming)

### Dev Environment
- Git, .gitignore
- Env vars approach
- Docker, CI/CD

## Setup Plan Template

```markdown
# Setup: [Name]

## Stack
- Runtime: [Node 20 / Bun]
- Framework: [Next.js 14]
- Database: [PostgreSQL + Drizzle]
- Styling: [Tailwind]

## Dependencies
Production: [list]
Dev: [list]

## Structure
[tree view]

## Config
- TypeScript: strict
- ESLint: [config]
- Prettier: [settings]
```

## Execution

1. Create directory
2. Init package manager
3. Install deps
4. Create structure
5. Configure tooling (tsconfig, eslint, etc.)
6. Setup env (.env.example)
7. Git init + .gitignore
8. Create README

## Scripts Template

```json
{
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "test": "vitest",
  "lint": "eslint src/",
  "typecheck": "tsc --noEmit"
}
```

## Checklist

- [ ] Package manager initialized
- [ ] Dependencies installed
- [ ] TypeScript configured (strict)
- [ ] Linting/formatting configured
- [ ] Git with .gitignore
- [ ] README with getting started
- [ ] Scripts working (dev, build, test, lint)
