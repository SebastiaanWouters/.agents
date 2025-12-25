---
name: commit
description: Analyze local git changes and create logical commits with conventional commit messages. Automatically groups related changes and creates multiple commits when appropriate. Use when committing work.
---

# Commit Skill

Intelligently analyze local changes and create well-structured commits following conventional commit guidelines.

## When to Use

- User wants to commit their work
- Multiple unrelated changes need separate commits
- Need help writing good commit messages
- Want to ensure commits are logically grouped

## Core Principles

### Logical Grouping
- Group related changes into single commits
- Separate unrelated changes into multiple commits
- Keep commits atomic and focused

### Conventional Commits
Format: `<type>[optional scope]: <description>`

Types:
- `feat`: new feature
- `fix`: bug fix
- `refactor`: code restructuring without behavior change
- `docs`: documentation only
- `test`: adding/updating tests
- `chore`: maintenance, deps, config
- `style`: formatting, whitespace
- `perf`: performance improvement
- `ci`: CI/CD changes

### Commit Message Guidelines
- Short message (50 chars) for simple changes
- Add bullet-point description only for complex changesets
- Focus on "why" not "what" (code shows what)
- Use imperative mood ("add" not "added")

## Process

### 1. Analyze Changes

```bash
# view all changes
git status
git diff
git diff --staged

# understand scope of changes
git diff --stat
```

### 2. Group Changes Logically

Analyze changes and identify logical groups:
- Same feature/fix across multiple files = 1 commit
- Unrelated changes = separate commits
- Test files with implementation = same commit
- Config/deps changes = usually separate commit

### 3. Stage and Commit Groups

For each logical group:

```bash
# stage specific files
git add <files>

# or stage hunks for partial file commits
git add -p <file>

# commit with appropriate message
git commit -m "<type>(<scope>): <short description>"

# for complex changes, use multiline
git commit -m "<type>(<scope>): <short description>" -m "- detail 1" -m "- detail 2"
```

### 4. Verify

```bash
git log --oneline -n 5
```

## Examples

### Simple Single Commit
```bash
# single file fix
git add src/utils/parser.ts
git commit -m "fix(parser): handle empty input"
```

### Feature with Tests
```bash
# feature + its tests = 1 commit
git add src/components/Button.tsx src/components/Button.test.tsx
git commit -m "feat(ui): add Button component"
```

### Multiple Logical Commits
```bash
# scenario: user changed auth logic, added a util, and updated deps

# commit 1: deps
git add package.json package-lock.json
git commit -m "chore(deps): update axios to 1.6.0"

# commit 2: util (independent)
git add src/utils/format.ts src/utils/format.test.ts
git commit -m "feat(utils): add date formatting helper"

# commit 3: auth changes
git add src/auth/*.ts
git commit -m "fix(auth): refresh token before expiry" -m "- check token exp 5min before" -m "- add retry on 401"
```

### Complex Changeset with Description
```bash
git add src/api/*.ts src/types/api.ts
git commit -m "refactor(api): restructure client architecture" \
  -m "- extract base client class" \
  -m "- add request interceptors" \
  -m "- unify error handling"
```

## Grouping Heuristics

### Same Commit
- Implementation + tests for same feature
- Multiple files modified for single feature/fix
- Closely related type definitions + usage
- Migration + model changes for same entity

### Separate Commits
- Unrelated bug fixes
- Independent features
- Dependency updates (unless required by feature)
- Formatting/lint fixes (unless part of touched code)
- Documentation updates (unless for new feature)

## User Instructions Priority

If user provides specific instructions:
- Custom commit message → use it
- Specific grouping → follow it
- Single commit requested → combine all changes
- Exclude files → respect exclusions

User instructions override default behavior.

## Anti-Patterns

### Avoid
- `git add .` without analysis
- Generic messages: "fix bug", "update code", "wip"
- Mixing unrelated changes
- Huge commits with many unrelated changes
- Empty or unclear descriptions

### Prefer
- Targeted `git add <files>`
- Specific messages: "fix(auth): handle expired refresh token"
- Atomic, focused commits
- Logical grouping by feature/fix
- Concise but informative messages
