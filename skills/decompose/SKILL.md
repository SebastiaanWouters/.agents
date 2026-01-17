---
name: decompose
description: Break down plans/specs into atomic, self-contained tickets. Triggers on "decompose", "break down", "create tasks from plan". Asks clarifying questions until each ticket has complete implementation details.
---

# Decompose

Transform plans/specs into atomic, self-contained tickets. Each ticket must be implementable without reading others.

> For `tk` CLI usage, see the **ticket** skill.

## Workflow

### 1. Check Existing Work

Run `tk ls` and `tk blocked` to review:
- Duplicates: existing tickets that cover this work?
- Related: tickets to reference as dependencies?

### 2. Parse Plan → Ticket Candidates

Break into atomic tasks. For each, gather:

- Title (concise, imperative)
- Type: `task` | `feature` | `bug` | `epic` | `chore`
- Priority: `0` (critical) → `4` (backlog)
- Description (what, why, constraints)
- **Acceptance criteria** (REQUIRED - testable conditions that define "done")
- Dependencies (internal ticket IDs, external refs)

### 3. Interview User

For each ticket, ask until fully specified:

**What needs doing?**
- Actionable requirements, edge cases

**Files & patterns?**
- Which files to modify/create?
- Which existing patterns to follow?

**Dependencies?**
- External: libraries, APIs, services?
- Internal: other tickets?

**Acceptance? (REQUIRED)**
- Testable success criteria
- Specific test scenarios
- Edge cases to handle

Stop criteria:
- Exact file paths identified
- Patterns/examples named
- Dependencies mapped to ticket IDs
- **Acceptance defines "done"**
- No "figure out later" items

**Never create a ticket without acceptance criteria.** Ask: "What must be true to close this ticket?"

### 4. Create Tickets

Use `tk create` with all gathered attributes (see **ticket** skill for CLI reference).

Track created IDs for dependency wiring with `tk dep` and `tk link`.

### 5. Validate

Run `tk dep tree <id>` and `tk blocked`. Check:
- No circular dependencies
- No orphaned tickets missing deps
- Critical-path tickets prioritized

## Question Templates by Domain

**Backend/APIs**:
- "What endpoints? Methods? Paths? Auth? Request/response schemas? Error codes? Rate limits?"
- "What database tables/collections? Fields? Indexes? Constraints?"

**Frontend/UI**:
- "Which components? States (loading/error/empty)? Layout variants? Responsive breakpoints? A11y requirements?"
- "What interactions? Form validations? Event handlers?"

**Data/Logic**:
- "What calculations? Edge cases? Conflict resolution? Exact formulas?"
- "What caching? TTLs? Cache keys? Invalidation strategy?"

**Integration**:
- "What external services? API versions? Failure modes? Retry/backoff? Timeouts?"
- "What async processing? Queues? Dead-letter handling?"

## Red Flags (Stop & Ask)

- "Standard implementation" → Which file/pattern?
- "Like existing X" → Which one? Reference by path or ticket ID
- "We'll decide later" → What decision is needed? When?
- "Make it fast/secure/good" → What metrics? SLAs? Requirements?
- "Many/some/a few" → Exact count or bounds?

## Common Patterns

**Feature → tickets decomposition**:
1. Data model/migrations (if needed)
2. Backend APIs/business logic
3. Frontend components
4. Integration tests
5. Documentation

**Bug fix → single ticket**:
Type: `bug`, Priority based on severity (0-1 for critical/high)

**Refactor → tickets by layer**:
Each ticket should be one atomic change with its own acceptance criteria.
