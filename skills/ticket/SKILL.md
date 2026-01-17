---
name: ticket
description: Manage tickets with tk CLI. Triggers on "create ticket", "list tickets", "what's next", "blocked", "close ticket", "ticket status", "work on next ticket/issue".
---

# Ticket Management

Minimal ticket system with dependency tracking. Tickets stored as markdown in `.tickets/`.

## CLI Reference

```
tk - minimal ticket system with dependency tracking

Usage: tk <command> [args]

Commands:
  create [title] [options] Create ticket, prints ID
    -d, --description      Description text
    --design               Design notes
    --acceptance           Acceptance criteria
    -t, --type             Type (bug|feature|task|epic|chore) [default: task]
    -p, --priority         Priority 0-4, 0=highest [default: 2]
    -a, --assignee         Assignee
    --external-ref         External reference (e.g., gh-123, JIRA-456)
    --parent               Parent ticket ID
  start <id>               Set status to in_progress
  close <id>               Set status to closed
  reopen <id>              Set status to open
  status <id> <status>     Update status (open|in_progress|closed)
  dep <id> <dep-id>        Add dependency (id depends on dep-id)
  dep tree [--full] <id>   Show dependency tree (--full disables dedup)
  undep <id> <dep-id>      Remove dependency
  link <id> <id> [id...]   Link tickets together (symmetric)
  unlink <id> <target-id>  Remove link between tickets
  ls [--status=X]          List tickets
  ready                    List open/in-progress tickets with deps resolved
  blocked                  List open/in-progress tickets with unresolved deps
  closed [--limit=N]       List recently closed tickets (default 20, by mtime)
  show <id>                Display ticket
  edit <id>                Open ticket in $EDITOR
  query [jq-filter]        Output tickets as JSON, optionally filtered
  migrate-beads            Import tickets from .beads/issues.jsonl

Supports partial ID matching (e.g., 'tk show 5c4' matches 'nw-5c46')
```

## Workflow

### Find work
```bash
tk ready      # unblocked tickets
tk blocked    # blocked tickets with unresolved deps
tk ls         # all tickets
```

### Create ticket
Always include `--acceptance` to define completion criteria:
```bash
tk create "Fix auth timeout" -t bug -p 1 \
  -d "Users get logged out after 5 min" \
  --acceptance "Session lasts 24h; refresh token extends session; test covers timeout logic"
tk create "Add dark mode" -t feature \
  --acceptance "Toggle in settings; persists across sessions; respects system preference"
```

### Track progress
```bash
tk start <id>   # mark in_progress
tk close <id>   # mark closed
tk dep <id> <dep-id>  # add dependency
tk link <id> <id>     # link related tickets (symmetric)
```

### Query/export
```bash
tk query                          # all tickets as JSON
tk query '.[] | select(.status == "open")'  # filter with jq
```
