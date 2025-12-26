---
name: beads-create
description: Create beads issues with `bd create`. Triggers on "create task", "add issue", "track work", "file bug". For viewing/planning, use beads-viewer.
allowed-tools: "Bash(bd:*)"
---

# Beads Create

Create issues with `bd create "title" [flags] --json`. Always use `--json`.

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--type` | `-t` | bug, feature, task (default), epic, chore |
| `--priority` | `-p` | 0=critical, 1=high, 2=medium (default), 3=low, 4=backlog |
| `--description` | `-d` | Detailed context |
| `--parent` | | Parent ID (creates child: bd-xxx.1) |
| `--deps` | | `blocks:id`, `discovered-from:id`, `related:id` |
| `--labels` | `-l` | Comma-separated |
| `--assignee` | `-a` | Who's assigned |
| `--acceptance` | | Acceptance criteria |

## Examples

```bash
# basic bug
bd create "Fix auth bug" -t bug -p 1 --json

# with description
bd create "Add OAuth" -d "Implement OAuth2 for Google, GitHub" -t feature -p 1 --json

# discovered while working
bd create "Found SQL injection" -t bug -p 0 --deps discovered-from:bd-123 --json

# epic with children
bd create "Auth System" -t epic -p 1 --json  # returns bd-abc
bd create "Design login flow" --parent bd-abc --json
bd create "Implement backend" --parent bd-abc --json
```

## Best Practices

- Always include descriptions (why, what, how)
- Use `discovered-from` for side quests found during work
- Quote titles with special chars
- Epics support 3 levels: `bd-xxx.1.1`
