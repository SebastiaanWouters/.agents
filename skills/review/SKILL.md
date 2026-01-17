---
name: review
description: Code review with QA. Triggers on "review", "check", "verify", "audit", "any issues?", "before I commit/push". Runs project QA tools, analyzes changeset, applies frontend/backend checklists, enforces project's AGENTS.md guidelines.
---

# Code Review

Review code changes for correctness, security, performance, and adherence to project standards.

**Input required:** description, file list, commit, or PR to review.

## Process

### 1. Verify Adherence

- Check changes against AGENTS.md guidelines (if present)
- Analyze codebase patterns in similar/adjacent files
- Flag violations with `file:line` references

### 2. Simplify Code

Run code-simplifier skill on changed files:
- Reduce complexity and nesting
- Eliminate redundancy
- Improve naming and clarity
- Preserve all functionality

### 3. Run QA

Detect project type, run applicable tools:

| Config | Commands |
|--------|----------|
| `package.json` | `lint`, `typecheck`, `test` |
| `Cargo.toml` | `clippy`, `test`, `fmt --check` |
| `go.mod` | `vet`, `golangci-lint`, `test` |
| `pyproject.toml` | `ruff`, `mypy`, `pytest` |

Treat warnings as errors. Collect errors with `file:line`.

### 4. Verify Correctness

- **Functional:** Does code do what it should?
- **Bugs:** Logic errors, edge cases, race conditions, missing await
- **Security:** Injection, path traversal, auth bypass, IDOR, secrets exposure
- **Performance:** N+1 queries, unnecessary re-renders, missing indexes, memory leaks

## Output

```
## Review: [scope]

### QA
- Lint: [pass/N errors]
- Types: [pass/N errors]
- Tests: [pass/N failures]

### Issues
[severity] file:line - description

### Simplified
[files modified by code-simplifier]
```
