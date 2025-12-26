---
name: commit
description: Create logical git commits with conventional messages. Triggers on "commit", "commit my work", "save changes". Groups related changes, creates multiple commits when appropriate.
---

# Commit

Analyze changes and create well-structured commits.

## Process

1. **Analyze**: `git status`, `git diff`, `git diff --staged`
2. **Group**: Related changes = 1 commit, unrelated = separate commits
3. **Stage**: `git add <files>` or `git add -p` for partial
4. **Commit**: Conventional format
5. **Verify**: `git log --oneline -n 5`

## Conventional Commits

`<type>(<scope>): <description>`

| Type | Use |
|------|-----|
| feat | new feature |
| fix | bug fix |
| refactor | restructure, no behavior change |
| docs | documentation |
| test | tests |
| chore | deps, config, maintenance |

## Grouping

**Same commit**: implementation + tests, multi-file feature, related type defs  
**Separate**: unrelated fixes, independent features, deps (unless required by feature)

## Examples

```bash
# simple
git add src/utils/parser.ts
git commit -m "fix(parser): handle empty input"

# feature + tests
git add src/Button.tsx src/Button.test.tsx
git commit -m "feat(ui): add Button component"

# complex with bullets
git commit -m "refactor(api): restructure client" \
  -m "- extract base class" \
  -m "- add interceptors"
```

## Avoid

- `git add .` without analysis
- Generic: "fix bug", "update code", "wip"
- Committing: .env, secrets, logs, node_modules, .DS_Store
