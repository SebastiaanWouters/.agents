---
name: decompose
description: Break down plans/specs into atomic, self-contained tickets. Triggers on "decompose", "break down", "create tasks from plan". Asks clarifying questions until each ticket has complete implementation details.
---

# Decompose

Transform plans/specs into atomic, self-contained tickets using `tk create`. Each ticket must be implementable without reading others.

## Workflow

### 1. Check Existing Work

```bash
tk ls
tk blocked
```

Review:
- Duplicates: Are there existing tickets that cover this work?
- Related: What tickets should we reference as dependencies?

### 2. Parse Plan → Ticket Candidates

Break the plan into atomic tasks. For each candidate, gather:

**Required attributes**:
- Title (concise, imperative)
- Type: `task` | `feature` | `bug` | `epic` | `chore`
- Priority: `0` (critical) | `1` (high) | `2` (medium) | `3` (low) | `4` (backlog)
- Description (what, why, constraints)
- Acceptance criteria (testable, specific)

**Optional attributes**:
- Assignee
- External reference (e.g., gh-123, JIRA-456)
- Dependencies

### 3. Interview User for Each Ticket

Until each ticket has complete implementation details:

```text
## Ticket: [Title]

**What needs doing?**
- [ ] Actionable requirement
- [ ] Edge case handling

**Files & patterns?**
- Which files to modify/create?
- Which existing patterns to follow?

**Dependencies?**
- External: libraries, APIs, services?
- Internal: other tickets? (list IDs or describe for lookup)

**Acceptance?**
- Testable success criteria
- Specific test scenarios

**Type/Priority?**
- Type: task/feature/bug/epic/chore?
- Priority: 0(crit)/1(high)/2(med)/3(low)/4(backlog)?
```

Ask until:
- Exact file paths identified
- Specific patterns/examples named
- Dependencies mapped to existing ticket IDs (or confirmed as new)
- Acceptance criteria are testable and specific
- No "figure out later" items

### 4. Create Tickets

For each ticket:

```bash
tk create "[Title]" \
  -t task \
  -p 2 \
  -d "[Description]" \
  --acceptance "[criterion1]; [criterion2]" \
  -a "[assignee]"
```

Then add dependencies:

```bash
tk dep <new-id> <depends-on-id>
```

Track created IDs for dependency references in subsequent tickets.

### 5. Post-Creation Validation

```bash
tk dep tree <id>
tk blocked
```

Check:
- **Cycles**: Any circular dependencies? Fix immediately with `tk undep`.
- **Orphaned**: Any tickets without dependencies that should have them?
- **Blockers**: Are critical-path tickets properly prioritized?

## Validation Checklist

For each ticket created:
- [ ] Title is imperative and specific
- [ ] Type and priority are appropriate
- [ ] Description explains what + why + constraints
- [ ] Files to touch are named
- [ ] Existing patterns are referenced
- [ ] Dependencies are resolved to actual ticket IDs
- [ ] Acceptance criteria are testable
- [ ] Implementable without reading other tickets

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
