---
name: review
description: Code review with QA. Triggers on "review", "check", "verify", "audit", "any issues?", "before I commit/push". Runs project QA tools, analyzes changeset, applies frontend/backend checklists, enforces project's AGENTS.md guidelines.
---

# Code Review

Analyzes changeset, runs QA, applies review checklists based on file types. Enforces project's AGENTS.md guidelines if present.

## Process

### 0. Check for AGENTS.md

**CRITICAL:** All projects with AGENTS.md must have changes reviewed against those guidelines.

```bash
# Check if AGENTS.md exists
if [ -f "AGENTS.md" ]; then
  echo "Project has AGENTS.md - will enforce these guidelines"
  cat AGENTS.md
else
  echo "No AGENTS.md found - skipping guideline enforcement"
fi
```

**If AGENTS.md exists:**
- Read and parse all guideline sections
- Check changes for violations against each section
- Flag violations in review output under "AGENTS.md Violations"

**Common AGENTS.md sections to enforce:**
- General guidelines (DRY, KISS, testing, etc.)
- Git conventions (commit format, push behavior)
- Language-specific rules (TypeScript, Python, etc.)
- Project-specific tooling (tk, btca, etc.)
- Code style preferences (formatting, naming, etc.)

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

### 5. AGENTS.md Enforcement (if present)

For each guideline in the project's AGENTS.md:
- Check if changes violate the guideline
- Document violations with file:line references
- Explain why it violates the specific guideline

**Example violations to flag:**
- Conventional commits not followed
- Agent mentioned in commit message
- Code not tested (if AGENTS.md requires tests)
- Unnecessary comments added (if AGENTS.md prefers self-explaining code)
- Incorrect imports/dependencies (if AGENTS.md specifies tooling)
- Language-specific violations (e.g., `any` casts in TypeScript)
- Git violations (push without permission, destructive commands)
- Missing docs updates (if AGENTS.md requires doc updates on change)

## Output Format

```
## Review: [scope]

### AGENTS.md
[Present / Not Found]

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

### AGENTS.md Violations
[violations of project's AGENTS.md guidelines - only present if file exists]
1. [severity] file:line - description
   - [guideline section violated]
   - [how to fix]

### Recommendations
1. [severity] file:line - description
   - [principle violated or best practice]
   - [suggested refactor/fix]
```
