---
name: review
description: Code review with QA. Triggers on "review", "check", "verify", "audit", "any issues?", "before I commit/push". Runs project QA tools, analyzes changeset, applies frontend/backend checklists.
---

# Code Review

Analyzes changeset, runs QA, applies review checklists based on file types.

## Process

### 1. Run QA Tools

Detect project type and run available tools:

| Config | Commands |
|--------|----------|
| `package.json` | `npm run lint`, `npm run typecheck`, `npm run test` |
| `Cargo.toml` | `cargo clippy`, `cargo test`, `cargo fmt --check` |
| `go.mod` | `go vet ./...`, `golangci-lint run`, `go test ./...` |
| `composer.json` | `composer run phpstan`, `composer run test` |
| `pyproject.toml` | `ruff check .`, `mypy .`, `pytest --tb=short` |

Collect errors with `file:line`. Treat warnings as errors.

### 2. Get Changeset

```bash
git diff --name-only HEAD              # staged + unstaged
git diff --name-only origin/main..HEAD # committed, not pushed
```

### 3. Classify Files

**Frontend**: `*.tsx`, `*.jsx`, `*.vue`, `*.svelte`, `*.css`, `*.scss`  
Paths: `components/`, `pages/`, `views/`, `hooks/`, `styles/`

**Backend**: `*.ts`, `*.js` (non-JSX), `*.go`, `*.rs`, `*.py`, `*.rb`, `*.php`  
Paths: `api/`, `server/`, `services/`, `controllers/`, `routes/`, `db/`

### 4. Apply Checklists

#### Frontend
- Missing loading/empty/error states
- No feedback on user actions
- Missing alt text, ARIA labels
- Hardcoded colors (use tokens)
- Unnecessary re-renders

#### Backend
- Logic errors, edge cases not handled
- Race conditions, missing await
- SQL/command injection, path traversal
- Missing auth checks, IDOR
- Multi-step DB ops without transactions
- Swallowed errors, generic error messages
- DRY violations, deep nesting
- Circular deps, layer violations

## Output Format

```
## Review: [scope]

### QA
- Lint: [pass/N errors]
- Types: [pass/N errors]
- Tests: [pass/N failures]

[errors with file:line]

### Files
Frontend: N | Backend: M

### Critical
[bugs, security, data corruption]

### High
[logic errors, missing validation]

### Medium
[code quality, DRY]

### Recommendations
1. [severity] file:line - description
```
