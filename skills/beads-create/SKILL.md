---
name: beads-create
description: >
  Create tasks and issues using the Beads tracker (bd create). Use when user says "create a task",
  "add an issue", "track this work", "file a bug", or needs to create new beads. For viewing/planning
  work, use the beads-viewer skill instead.
allowed-tools: "Bash(bd:*)"
version: "0.34.0"
author: "Steve Yegge <https://github.com/steveyegge>"
license: "MIT"
---

# Beads Task Creation

Create tasks and issues with the `bd create` command. This skill focuses exclusively on issue creation.

## Quick Reference

```bash
bd create "Issue title" [flags] --json
```

**Always use `--json` flag** for programmatic output.

## Essential Flags

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--type` | `-t` | `task` | Issue type |
| `--priority` | `-p` | `2` | Priority (0-4) |
| `--description` | `-d` | - | Detailed context |
| `--body-file` | - | - | Read description from file (use `-` for stdin) |
| `--parent` | - | - | Parent issue ID (creates child with dotted ID) |
| `--deps` | - | - | Dependencies: `type:id` or just `id` |
| `--labels` | `-l` | - | Comma-separated labels |
| `--assignee` | `-a` | - | Who is assigned |
| `--estimate` | `-e` | - | Time estimate in minutes |
| `--design` | - | - | Design/architecture notes |
| `--acceptance` | - | - | Acceptance criteria |
| `--external-ref` | - | - | External reference (e.g., `gh-123`) |

## Issue Types

| Type | When to Use |
|------|-------------|
| `bug` | Something broken that needs fixing |
| `feature` | New functionality |
| `task` | Work item (default) - tests, docs, refactoring |
| `epic` | Large feature with subtasks |
| `chore` | Maintenance - dependencies, tooling |
| `message` | Ephemeral communication |
| `gate` | Async coordination point |

## Priorities

| Priority | Name | When to Use |
|----------|------|-------------|
| `0` | Critical | Security, data loss, broken builds |
| `1` | High | Major features, important bugs |
| `2` | Medium | Default - nice-to-have features, minor bugs |
| `3` | Low | Polish, optimization |
| `4` | Backlog | Future ideas |

## Dependency Types

Use `--deps type:id` format to create dependencies:

| Type | Format | Purpose |
|------|--------|---------|
| `blocks` | `--deps blocks:bd-123` | Hard blocker (default if no type specified) |
| `discovered-from` | `--deps discovered-from:bd-123` | Found while working on parent |
| `parent-child` | Use `--parent bd-123` instead | Epic/subtask relationship |
| `related` | `--deps related:bd-123` | Soft connection |

## Examples

### Basic Task

```bash
bd create "Fix authentication bug" -t bug -p 1 --json
```

### With Description

```bash
bd create "Add OAuth support" \
  --description "Implement OAuth2 for Google, GitHub providers. Use passport.js library." \
  -t feature -p 1 --json
```

### Discovered Work (One Command)

When you find new work while implementing something:

```bash
bd create "Found SQL injection in login" \
  --description "Login form doesn't escape special characters in password field" \
  -t bug -p 0 \
  --deps discovered-from:bd-parent-123 \
  --json
```

### Epic with Children

```bash
# Create epic
bd create "User Authentication System" -t epic -p 1 --json
# Returns: bd-a3f8e9

# Create child tasks (auto-numbered: bd-a3f8e9.1, bd-a3f8e9.2, etc.)
bd create "Design login flow" -p 1 --parent bd-a3f8e9 --json
bd create "Implement backend auth" -p 1 --parent bd-a3f8e9 --json
bd create "Add frontend login UI" -p 2 --parent bd-a3f8e9 --json
```

### With Labels and Assignee

```bash
bd create "Refactor database layer" \
  -t task -p 2 \
  --labels backend,tech-debt \
  --assignee alice \
  --json
```

### With Acceptance Criteria

```bash
bd create "Add password reset flow" \
  -t feature -p 2 \
  --description "Users need ability to reset forgotten passwords via email" \
  --acceptance "- Email sent within 30s of request
- Link expires after 1 hour
- Rate limited to 3 requests per hour" \
  --json
```

### From File (Large Description)

```bash
bd create "Implement caching layer" \
  --body-file design-doc.md \
  -t feature -p 1 --json

# Or from stdin
cat requirements.md | bd create "New feature" --body-file=- -t feature --json
```

## Best Practices

### Always Include Descriptions

Issues without descriptions lack context. Include:
- **Why** the issue exists
- **What** needs to be done
- **How** you discovered it (if applicable)

### Use discovered-from for Side Quests

When you find bugs or improvements while working:

```bash
# One command creates issue AND links to parent
bd create "Found edge case in validation" \
  -t bug -p 1 \
  --deps discovered-from:bd-current-work \
  --json
```

### Quote Titles with Special Characters

```bash
bd create "Fix: auth doesn't validate tokens" -t bug -p 1 --json
bd create "Add support for OAuth 2.0" -t feature --json
```

### Hierarchical Children

Epics support up to 3 levels of nesting:
- Parent: `bd-a3f8e9`
- Children: `bd-a3f8e9.1`, `bd-a3f8e9.2`
- Grandchildren: `bd-a3f8e9.1.1`, `bd-a3f8e9.1.2`

## Common Patterns

### Bug During Feature Work

```bash
bd create "Login fails with special chars in password" \
  --description "500 error when password contains quotes. Stack trace shows unescaped SQL in auth/login.go:45" \
  -t bug -p 1 \
  --deps discovered-from:bd-feature-xyz \
  --json
```

### Technical Debt

```bash
bd create "Refactor auth package for testability" \
  --description "Current code has tight DB coupling. Extract interfaces and add DI." \
  -t task -p 3 \
  --labels tech-debt,testing \
  --json
```

### Research Spike

```bash
bd create "Investigate caching options" \
  --description "Compare Redis vs Memcached vs CDN caching for API responses" \
  -t task -p 2 \
  --json
```

## Output

Successful creation returns JSON with the new issue:

```json
{
  "id": "bd-a1b2c3",
  "title": "Fix authentication bug",
  "status": "open",
  "priority": 1,
  "issue_type": "bug",
  "created_at": "2025-12-25T10:00:00Z"
}
```

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| `No .beads database found` | Not initialized | Run `bd init` (humans do this) |
| `Parent not found` | Invalid parent ID | Verify parent exists with `bd show` |
| `Title too long` | >500 characters | Shorten title, move details to description |
