---
name: beads-create
description: Create beads issues with `bd create`. Triggers on "create task", "add issue", "track work", "file bug". For viewing/planning, use beads-viewer.
allowed-tools: "Bash(bd:*)"
---

# Beads Create

Create issues with `bd create "title" [flags] --json`. **Always use `--json`.**

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--type` | `-t` | bug, feature, task (default), epic, chore |
| `--priority` | `-p` | 0=critical, 1=high, 2=medium (default), 3=low, 4=backlog |
| `--description` | `-d` | Detailed context (why, what, how) |
| `--parent` | | Parent ID (creates child: bd-xxx.1, bd-xxx.1.1) |
| `--deps` | | `blocks:id`, `blocked-by:id`, `discovered-from:id`, `related:id` |
| `--labels` | `-l` | Comma-separated (e.g., "backend,auth") |
| `--assignee` | `-a` | Assign to user |
| `--acceptance` | | Acceptance criteria |

## Examples

```bash
# simple bug
bd create "Fix auth bug" -t bug -p 1 --json

# with description
bd create "Add OAuth" -d "Implement OAuth2 for Google, GitHub" -t feature -p 1 --json

# with labels & acceptance
bd create "Login flow" -t task -l "auth,frontend" \
  --acceptance "Users can login with email/password, 2FA works" --json

# discovered during work
bd create "Found SQL injection" -t bug -p 0 --deps discovered-from:bd-123 --json

# epic hierarchy
bd create "Auth System" -t epic -p 1 --json  # returns bd-abc
bd create "Design login flow" --parent bd-abc --json
bd create "Implement backend" --parent bd-abc --json
bd create "Add 2FA" --parent bd-abc --json

# with blockers
bd create "Deploy auth" -t task --deps blocks:bd-234 --json
```

## Dependencies

### At creation time (via --deps flag)
```bash
--deps blocks:bd-xyz            # This blocks another issue
--deps blocked-by:bd-xyz        # Blocked by another issue
--deps discovered-from:bd-xyz   # Found while working on this
--deps related:bd-xyz           # Related work
```

### After creation (via bd dep commands)
```bash
bd dep add <id> <depends-on-id> [-t type]  # add dependency
bd dep remove <id> <depends-on-id>         # remove dependency
bd dep tree <id>                           # show dependency tree
bd dep cycles                              # detect cycles (BUGS - fix immediately!)
bd duplicate <id> --of <canonical>         # mark as duplicate
bd relate <id1> <id2>                      # create bidirectional "see also"
bd unrelate <id1> <id2>                    # remove "see also"
```

**Dependency types**: `blocks`, `related`, `parent-child`, `discovered-from`

## Best Practices

- Always include descriptions (context, why it matters)
- Use `discovered-from` for side quests found during work
- Use labels to group related work (`backend`, `frontend`, `auth`, etc.)
- Quote titles with special characters
- Set correct priority (0=critical, 1=high, etc.)
- Use `--acceptance` for tasks with clear completion criteria
- Epics support 3-level hierarchy: `bd-xxx` → `bd-xxx.1` → `bd-xxx.1.1`

## Status Updates

```bash
bd update <id> -s in_progress --json        # claim work
bd update <id> -s open --json               # revert to open
bd close <id> -r "completed" --json         # close issue
bd close <id> --suggest-next --json         # close + show unblocked work
```
