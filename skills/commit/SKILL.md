---
name: commit
description: Create logical git commits with conventional messages. Triggers on "commit", "commit my work", "save changes". Groups related changes, creates multiple commits when appropriate.
---

# Commit

**NEVER push. Commit only. NEVER mention AI/agent/LLM in message or author.**

## Flow

```
git log --oneline -n 10   # inspect existing style
git status && git diff    # analyze changes
git add <files>           # stage (use -p for partial)
git commit -m "msg"       # match existing style
git log --oneline -n 3    # verify
```

## Style

1. Match existing repo pattern (format, casing, scope, length)
2. No pattern? Use conventional: `<type>(<scope>): <desc>`

**Types**: feat | fix | refactor | docs | test | chore

## Grouping

- **1 commit**: impl+tests, multi-file feature, related types
- **N commits**: unrelated fixes, independent features

## Never

- `git add .` blindly
- generic msgs: "fix bug", "update", "wip"
- commit secrets, .env, logs, node_modules
- push
- mention AI/agent/assistant
