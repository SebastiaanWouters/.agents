---
name: setup
description: Initialize new projects by gathering requirements through interactive Q&A. Guides tech stack selection, architecture decisions, package choices, and project structure. Creates a clean, well-configured starting point ready for development.
---

# Setup Skill

Initialize new projects through interactive questioning to create a clean, well-configured starting point. Covers purpose, tech stack, dependencies, architecture, and initial structure.

## When to Use

- User wants to start a new project from scratch
- Need guidance on tech stack selection
- Want a consistent, well-structured project setup
- Initializing a project with best practices
- Setting up development environment and tooling

## Core Philosophy

**Good foundations prevent rework.**

A well-initialized project with clear conventions, proper tooling, and sensible structure accelerates development and reduces friction. This skill ensures nothing is forgotten during setup.

## Process Overview

```
[User describes project idea]
        ↓
[Agent asks clarifying questions - iterative]
        ↓
[Gather: purpose, tech, packages, structure]
        ↓
[Agent proposes setup plan]
        ↓
[User confirms/adjusts]
        ↓
[Agent initializes project]
        ↓
[Clean, ready-to-develop project]
```

## Phase 1: Gather Project Context

### Essential Questions

Ask these in a conversational, iterative manner. Don't dump all questions at once.

#### 1. Project Purpose

```markdown
## Purpose Questions

1. What will this project do? (one sentence)
2. Who is the target user/audience?
3. Is this a personal project, work project, or open source?
4. What problem does it solve?
5. Any reference projects or inspirations?
```

#### 2. Technology Selection

```markdown
## Tech Stack Questions

### Runtime/Language
1. What language? (TypeScript, Python, Go, Rust, etc.)
2. If JS/TS: Node.js, Bun, Deno?
3. Language version preferences?

### Project Type
1. What type of project?
   - Web app (frontend only)
   - API/backend service
   - Full-stack application
   - CLI tool
   - Library/package
   - Desktop app
   - Mobile app
   - Monorepo with multiple packages

### Framework (if applicable)
1. Frontend: React, Vue, Svelte, SolidJS, Vanilla, etc.?
2. Backend: Express, Fastify, Hono, tRPC, etc.?
3. Full-stack: Next.js, Nuxt, SvelteKit, Remix, Astro?
4. Metaframework preferences?

### Database (if applicable)
1. Need a database?
2. Type: SQL (PostgreSQL, MySQL, SQLite) or NoSQL (MongoDB, Redis)?
3. ORM preference? (Prisma, Drizzle, TypeORM, Kysely, raw)
4. Hosted or local development?
```

#### 3. Package/Dependency Selection

```markdown
## Dependencies Questions

### Core Dependencies
1. What essential libraries do you need?
   - API clients (axios, ky, ofetch)
   - State management (zustand, jotai, redux)
   - Forms (react-hook-form, formik)
   - Validation (zod, yup, valibot)
   - Date handling (date-fns, dayjs, luxon)
   - UI components (shadcn, radix, headless-ui)

### Dev Dependencies
1. Testing: Vitest, Jest, Playwright, Cypress?
2. Linting: ESLint, Biome?
3. Formatting: Prettier, Biome?
4. Type checking: TypeScript strict mode?
5. Pre-commit hooks: Husky, lefthook?
6. Any other dev tools?

### Styling (if frontend)
1. CSS approach: Tailwind, CSS Modules, Styled Components, vanilla CSS?
2. Component library or custom?
```

#### 4. Project Structure & Architecture

```markdown
## Structure Questions

### Code Organization
1. Preferred project structure?
   - Feature-based (co-located by feature)
   - Layer-based (separate controllers, services, etc.)
   - Domain-driven
   - Default framework convention
   
2. Any specific folder conventions?
   - src/ vs root
   - Naming conventions (camelCase, kebab-case, PascalCase)

### Architecture Patterns
1. Backend patterns?
   - MVC
   - Clean architecture / hexagonal
   - Service-oriented
   - Functional handlers
   
2. Frontend patterns?
   - Component-based
   - Atomic design
   - Feature modules
   
3. Error handling approach?
   - Result<T, E> pattern (recommended)
   - try/catch with custom errors
   - Framework default
   
4. API design (if applicable)?
   - REST
   - GraphQL
   - tRPC
   - gRPC
```

#### 5. Development Environment

```markdown
## Dev Environment Questions

### Version Control
1. Initialize git repository? (recommended: yes)
2. Initial branch name? (main/master)
3. .gitignore template?
4. Add conventional commits tooling?

### Configuration
1. Environment variables approach? (.env, config files)
2. Multiple environments? (dev, staging, prod)
3. Docker/containerization?
4. CI/CD setup? (GitHub Actions, GitLab CI)

### Documentation
1. README with project overview?
2. Contributing guidelines?
3. API documentation approach?
4. Changelog management?
```

## Phase 2: Propose Setup Plan

After gathering requirements, present a clear setup plan:

```markdown
# Project Setup Plan: [Project Name]

## Overview
- **Purpose**: [one sentence]
- **Type**: [web app / api / cli / etc.]
- **Runtime**: [Node.js 20 / Bun / Deno]
- **Language**: [TypeScript 5.x]

## Tech Stack
- **Framework**: [e.g., Next.js 14]
- **Database**: [e.g., PostgreSQL with Drizzle]
- **Styling**: [e.g., Tailwind CSS]

## Dependencies

### Production
- [package]: [purpose]
- [package]: [purpose]

### Development
- [package]: [purpose]
- [package]: [purpose]

## Project Structure
```
project-name/
├── src/
│   ├── app/           # Next.js app router
│   ├── components/    # Shared components
│   ├── lib/           # Utilities and helpers
│   ├── server/        # Server-side code
│   │   ├── db/        # Database schema and queries
│   │   └── api/       # API handlers
│   └── types/         # Type definitions
├── tests/             # Test files
├── public/            # Static assets
├── .env.example       # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Configuration
- TypeScript: strict mode
- ESLint: [config approach]
- Prettier: [settings]
- Git hooks: [if any]

## Confirm?
Ready to initialize with this setup? Any adjustments needed?
```

## Phase 3: Initialize Project

Once confirmed, execute the setup:

### 1. Create Project Directory

```bash
mkdir project-name && cd project-name
```

### 2. Initialize Package Manager

```bash
# npm
npm init -y

# pnpm
pnpm init

# bun
bun init

# or use framework CLI
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
```

### 3. Install Dependencies

```bash
# production deps
npm install [packages]

# dev deps
npm install -D [packages]
```

### 4. Create Project Structure

Create all necessary directories and placeholder files:

```bash
# create directories
mkdir -p src/{components,lib,server/{db,api},types}
mkdir -p tests
```

### 5. Configure Tooling

Create configuration files:

- `tsconfig.json` - TypeScript config
- `eslint.config.js` - Linting rules
- `.prettierrc` - Formatting rules
- `tailwind.config.ts` - Tailwind config (if applicable)
- `vitest.config.ts` - Testing config (if applicable)
- `drizzle.config.ts` - Database config (if applicable)

### 6. Setup Environment

```bash
# create .env.example with template variables
# add .env to .gitignore
```

### 7. Initialize Git

```bash
git init
# create appropriate .gitignore
git add .
git commit -m "chore: initial project setup"
```

### 8. Create README

Generate a README with:
- Project name and description
- Tech stack overview
- Getting started instructions
- Available scripts
- Project structure explanation
- Contributing guidelines (if open source)

## Setup Templates

### TypeScript Node.js API

```bash
# init
npm init -y

# deps
npm install hono zod drizzle-orm postgres dotenv
npm install -D typescript @types/node vitest drizzle-kit tsx

# structure
mkdir -p src/{routes,services,db,middleware,types}
mkdir -p tests

# configs
# tsconfig.json, drizzle.config.ts, vitest.config.ts
```

### Next.js Full-Stack

```bash
# create with CLI
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# additional deps
npm install zod drizzle-orm postgres server-only
npm install -D drizzle-kit

# extend structure
mkdir -p src/{components/{ui,forms},lib/{utils,validators},server/{db,actions}}
```

### CLI Tool

```bash
# init
npm init -y

# deps
npm install commander chalk ora zod
npm install -D typescript @types/node tsup vitest

# structure
mkdir -p src/{commands,utils}
mkdir -p tests

# configs
# tsconfig.json, tsup.config.ts
```

### Library/Package

```bash
# init
npm init -y

# deps
npm install -D typescript tsup vitest @types/node

# structure
mkdir -p src tests

# configs
# tsconfig.json, tsup.config.ts for building
# package.json with exports, main, types
```

## Configuration Templates

### tsconfig.json (Strict)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### .gitignore (Node.js)

```gitignore
# dependencies
node_modules/

# build output
dist/
build/
.next/
out/

# environment
.env
.env.local
.env.*.local

# logs
logs/
*.log
npm-debug.log*

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# testing
coverage/

# misc
*.tgz
.turbo/
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Output Checklist

Before completion, verify:

### Files Created
- [ ] Package manager initialized (package.json)
- [ ] Dependencies installed
- [ ] TypeScript configured (tsconfig.json)
- [ ] Linting configured
- [ ] Formatting configured
- [ ] Git initialized with .gitignore
- [ ] README.md with getting started
- [ ] .env.example (if applicable)
- [ ] Test configuration (if applicable)
- [ ] Database configuration (if applicable)

### Structure Verified
- [ ] Source directory exists
- [ ] Test directory exists
- [ ] All planned folders created
- [ ] Initial placeholder files in place

### Scripts Working
- [ ] `dev` script runs
- [ ] `build` script succeeds
- [ ] `test` script runs (can be empty)
- [ ] `lint` script runs

### Git Status
- [ ] Clean working directory
- [ ] Initial commit made
- [ ] No sensitive files committed

## Final Message

After setup, provide:

```markdown
# Setup Complete!

## Project: [name]
Location: [path]

## Quick Start
```bash
cd [project-name]
npm install    # if not already done
npm run dev    # start development
```

## Available Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Lint code

## Next Steps
1. Review the generated README.md
2. Configure environment variables in .env
3. [Project-specific next step]
4. Start building!

## Structure
[Brief structure overview]
```

## Anti-Patterns

### Avoid
- Installing packages without confirming with user
- Using outdated package versions
- Skipping essential configs (tsconfig, linting)
- Forgetting .gitignore
- Generic README without project-specific info
- Installing unnecessary dependencies
- Complex setup for simple projects
- Ignoring user's stated preferences

### Prefer
- Latest stable versions
- Minimal viable dependencies (add as needed)
- Clear, documented configuration
- Working scripts out of the box
- Clean git history from start
- Structure that matches project complexity

## Integration with Other Skills

- **plan**: For complex projects, use plan skill first, then setup
- **decompose**: After setup, decompose initial features into tasks
- **btca**: Query for library-specific setup guidance
- **commit**: Use for initial commit and subsequent changes
