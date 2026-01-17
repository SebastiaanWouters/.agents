---
name: knowledge
description: Capture and retrieve project knowledge. Read knowledge.md at session start. Write discoveries proactively after fixing bugs, finding patterns, or learning commands.
triggers:
  - session start
  - after troubleshooting
  - after discovering patterns
  - after finding useful commands
---

# Knowledge Management

Maintain a living `knowledge.md` at project root to capture learnings during execution.

## On Session Start

1. Check if `knowledge.md` exists in project root
2. If exists, read it to inform your work
3. If not, create it with the section template below

## When to Write

Use judgment. Write after:
- Fixing a non-obvious bug
- Discovering a useful command
- Finding a code pattern or convention
- Encountering unexpected behavior
- Learning a dependency quirk
- Resolving any error that took multiple attempts

## How to Write

1. Read current `knowledge.md`
2. Identify the appropriate section
3. Check if similar knowledge already exists
4. If exists: update/merge if new info adds value
5. If new: append concisely

## Section Template

```markdown
# Project Knowledge

## Commands
<!-- build, test, lint, run, deploy commands -->

## Troubleshooting
<!-- problem → solution pairs -->

## Patterns
<!-- code conventions, architectural decisions -->

## Gotchas
<!-- surprises, edge cases, workarounds -->

## Dependencies
<!-- library quirks, version-specific notes -->
```

## Writing Style

- Terse, scannable entries
- Problem → solution format for troubleshooting
- Include context (why it matters)
- No fluff, no timestamps
- Deduplicate aggressively

## Examples

**Commands:**
```markdown
- `pnpm test:unit` — fast unit tests, no DB
- `pnpm db:reset` — wipes and reseeds local DB
```

**Troubleshooting:**
```markdown
- **Prisma "prepared statement already exists"** → Run `pnpm db:reset` or restart DB container
```

**Gotchas:**
```markdown
- Auth middleware skips `/api/health` — don't add sensitive routes under health path
```
