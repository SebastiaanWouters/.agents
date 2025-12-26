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
- Language (TypeScript, Python, Go, Rust, Java, C#, etc.)
- Runtime (Node, Bun, Deno, CPython, etc.)
- Project type (web, API, CLI, library, full-stack, monorepo)
- Framework (varies by language/type)
- Database + ORM/driver (if applicable)

### Dependencies
- Core libs needed
- Testing framework
- Linting/formatting tools

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
- Language: [e.g., Python 3.12]
- Framework: [e.g., FastAPI]
- Database: [e.g., PostgreSQL + SQLAlchemy]

## Dependencies
Production: [list]
Dev: [list]

## Structure
[tree view]

## Config
[language-specific config files]
```

## Execution

1. Create directory
2. Init package manager / project
3. Install deps
4. Create structure
5. Configure tooling (linter, formatter, etc.)
6. Setup env vars template
7. Git init + .gitignore
8. Create README

## Checklist

- [ ] Project initialized with package manager
- [ ] Dependencies installed
- [ ] Linting/formatting configured
- [ ] Git with appropriate .gitignore
- [ ] README with getting started
- [ ] Dev/build/test scripts working
