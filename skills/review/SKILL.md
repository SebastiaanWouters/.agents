---
name: review
description: Code review with QA. Triggers on "review", "check", "verify", "audit", "any issues?", "before I commit/push". Runs project QA tools, analyzes changeset, applies frontend/backend checklists.
---

# Code Review

Analyzes changeset, runs QA, applies review checklists based on file types. Enforces clean code, pragmatic engineering, and "Slow is Fast" principles for senior backend/database engineers.

## Review Principles

**User Profile:** Senior backend/database engineer (Rust/Go/Python)  
**Values:** "Slow is Fast" - reasoning quality, architecture, maintainability over speed

**Quality Priority:**
1. Readability & maintainability
2. Correctness (edge cases, error handling)
3. Performance
4. Code length

**Bad Smells (Flag & Fix):**
- Repeated/copied logic
- Tight coupling, circular dependencies
- Fragile design (cascading changes)
- Unclear intent, vague naming, confused abstractions
- Over-design without benefits

**Language Standards:**
- Rust: snake_case, community conventions, prefer ~/.cargo/registry for deps
- Go: uppercase exports, use gh CLI
- Python: PEP 8
- TypeScript: no any casts, no explicit return types
- All: English code/comments/identifiers, auto-formatted, minimal comments (explain "why", not "what")

## AGENTS.md Adherence

**CRITICAL:** All changes must enforce project's AGENTS.md guidelines. Check:

### General Guidelines
- Challenged assumptions, questioned user input (not blindly following)
- Output/plans/commits ultra-concise, no filler grammar
- DRY and KISS principles strictly followed
- Code self-explaining, minimal comments only if essential
- All new/modified code tested
- Searched existing code for similar patterns before adding new
- Checked package manager for available commands/dependency versions
- Docs consulted for correct version usage
- Unresolved questions listed at end of plans
- No dev server management logic (assumed externally managed)
- Temporary/ephemeral files deleted after use
- Unused code/configs removed
- Docs updated on changes
- Latest stable tools/libs used
- Result<T, E> used instead of try/catch for errors
- No markdown summaries written unless asked
- Destructive commands (rm -rf, drop db, etc.) only with explicit confirmation
- Warnings treated as errors, never ignored
- Never cut corners; always persist

### Git Guidelines
- Conventional commits used
- Agent never mentioned in commit message
- No push to remote unless explicitly requested

### TypeScript Guidelines
- No `any` casts
- No explicit return types on functions

### Library/Tool Research
- Used btca for unfamiliar tech, API usage, version-specific docs
- Verified solutions against actual source code (not assumptions/outdated docs)

### Issue Tracking
- Used bd/bv for issue tracking when applicable
- Followed workflow: bd prime, bd ready, bd create, bd close, bd sync
- Used bv with --robot-* flags (never bare bv)

### One-Off Scripts
- Multi-step tasks use TypeScript scripts in tmp folder
- Executed via bun

### Longer Running Tasks
- Run in background with tmux
- Monitored progress periodically
- Sensible timeouts added for CLI commands

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

**Clean Code:**
- Component has single responsibility
- Meaningful names (variables, functions, components)
- Props properly typed with interfaces
- Extract repeated logic to hooks/utilities
- Avoid deep nesting with early returns
- Constants for magic values
- Error boundaries where needed

**Pragmatic:**
- Over-engineering (abstractions without clear need)
- Unnecessary complexity
- Unclear intent or vague naming
- Tight coupling between components
- Fragile design (cascading changes)

#### Backend
- Logic errors, edge cases not handled
- Race conditions, missing await
- SQL/command injection, path traversal
- Missing auth checks, IDOR
- Multi-step DB ops without transactions
- Swallowed errors, generic error messages
- DRY violations, deep nesting
- Circular deps, layer violations

**Clean Code:**
- Single responsibility per function/module
- Meaningful names (clear intent, no abbreviations)
- Functions do one thing well
- Extract constants for magic numbers/strings
- Proper error handling (Result<T,E> types, not try/catch)
- Small functions (<50 lines preferred)
- Early returns to avoid nesting
- Clear separation of concerns (data/logic/presentation)
- Dependency injection where appropriate
- Testable code (mockable dependencies)

**Pragmatic:**
- Over-design (premature abstraction, patterns without need)
- YAGNI violations (features "might need")
- Unclear abstractions or leaky boundaries
- Repeated/copied logic
- Tight coupling, circular dependencies
- Fragile design (changes cascade)
- Vague naming, unclear intentions
- Unnecessary complexity without benefits

**Architecture & Maintainability:**
- Priority: Readability/maintainability > correctness > performance > brevity
- Clear abstraction boundaries
- SOLID principles respected
- Data consistency and type safety
- Concurrency safety considered
- Business requirements and boundaries clear
- Long-term evolution considered

### 5. Test Coverage (Non-Trivial Logic)

For complex conditions, state machines, concurrency, error recovery:
- Test cases added/updated?
- Coverage points identified?
- How to run tests documented?

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
[bugs, security, data corruption, correctness issues]

### High
[logic errors, missing validation, error handling, DRY violations]

### Medium
[code quality, unclear intent, naming, abstraction issues]

### AGENTS.md Violations
[violations of project guidelines from AGENTS.md]
- No challenges/assumptions questioned
- Verbose output/plans/commits
- DRY/KISS violations
- Unnecessary comments
- Missing tests for new/modified code
- Didn't search existing code for patterns
- Didn't check package manager for commands/versions
- Unresolved questions not listed
- Dev server management logic
- Temporary/ephemeral files not deleted
- Unused code/configs not removed
- Docs not updated
- Outdated tools/libs
- try/catch instead of Result<T, E>
- Unnecessary markdown summaries
- Destructive commands without confirmation
- Warnings ignored
- Cut corners, not persistent
- Non-conventional commits
- Agent mentioned in commit
- Unexpected push to remote
- TypeScript any casts
- Explicit return types
- Didn't use btca for unfamiliar tech
- Didn't verify against source code
- Didn't use bd/bv for issue tracking
- Used bare bv instead of --robot-* flags
- One-off scripts not in tmp folder
- Long tasks not in background

### Clean Code Issues
[violations of SRP, meaningful names, single function, testability]

### Pragmatic Concerns
[over-design, unnecessary complexity, fragile design, tight coupling]

### Recommendations
1. [severity] file:line - description
   - [principle violated or best practice]
   - [suggested refactor/fix]
```
