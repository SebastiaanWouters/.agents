---
name: decompose
description: Break down plans/specs into atomic, self-contained task beads. Triggers on "decompose", "break down", "create tasks from plan". Asks clarifying questions until each task has complete implementation details.
---

# Decompose

Transform plans/specs into atomic, self-contained task beads using `bd create`. Each bead must be implementable without reading others.

## Workflow

### 1. Pre-Decompose: Check Existing Work

```bash
bv --robot-suggest
```

Review:
- Duplicates: Are there existing beads that cover this work?
- Related: What beads should we reference as parents or dependencies?
- Labels: What labels are in use for this domain?

### 2. Parse Plan → Bead Candidates

Break the plan into atomic tasks. For each candidate, gather:

**Required attributes**:
- Title (concise, imperative)
- Type: `task` | `feature` | `bug` | `chore`
- Priority: `0` (critical) | `1` (high) | `2` (medium) | `3` (low) | `4` (backlog)
- Description (what, why, constraints)
- Acceptance criteria (testable, specific)

**Optional attributes**:
- Labels (domain, component, etc.)
- Dependencies (`--deps blocks:id|related:id|parent:id`)
- Assignee

### 3. Interview User for Each Bead

Until each bead has complete implementation details:

```text
## Bead: [Title]

**What needs doing?**
- [ ] Actionable requirement
- [ ] Edge case handling

**Files & patterns?**
- Which files to modify/create?
- Which existing patterns to follow?

**Dependencies?**
- External: libraries, APIs, services?
- Internal: other beads? (list IDs or describe for lookup)

**Acceptance?**
- Testable success criteria
- Specific test scenarios

**Type/Priority?**
- Type: task/feature/bug/chore?
- Priority: 0(crit)/1(high)/2(med)/3(low)/4(backlog)?

**Labels?** (optional)
```

Ask until:
- Exact file paths identified
- Specific patterns/examples named
- Dependencies mapped to existing bead IDs (or confirmed as new)
- Acceptance criteria are testable and specific
- No "figure out later" items

### 4. Create Beads

For each bead (use `--json` for scriptability):

```bash
bd create "[Title]" \
  --type task \
  --priority 2 \
  --desc "[Description]" \
  --acceptance "[criterion1]; [criterion2]" \
  --deps "blocks:bd-123;related:bd-456" \
  --labels "frontend,api" \
  --json
```

Track created IDs for dependency references in subsequent beads.

### 5. Post-Creation Validation

```bash
bv --robot-insights
```

Check:
- **Cycles**: Any circular dependencies? Fix immediately.
- **Orphaned**: Any beads without dependencies that should have them?
- **Blockers**: Are critical-path beads properly prioritized?

Fix issues using:
```bash
bd dep add <id> <depends-on-id> -t blocks
bd update <id> -p 1
```

## Validation Checklist

For each bead created:
- [ ] Title is imperative and specific
- [ ] Type and priority are appropriate
- [ ] Description explains what + why + constraints
- [ ] Files to touch are named
- [ ] Existing patterns are referenced
- [ ] Dependencies are resolved to actual bead IDs
- [ ] Acceptance criteria are testable
- [ ] Implementable without reading other beads

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
- "Like existing X" → Which one? Reference by path or bead ID
- "We'll decide later" → What decision is needed? When?
- "Make it fast/secure/good" → What metrics? SLAs? Requirements?
- "Many/some/a few" → Exact count or bounds?

## Common Patterns

**Feature → beads decomposition**:
1. Data model/migrations (if needed)
2. Backend APIs/business logic
3. Frontend components
4. Integration tests
5. Documentation

**Bug fix → single bead**:
Type: `bug`, Priority based on severity (0-1 for critical/high)

**Refactor → beads by layer**:
Each bead should be one atomic change with its own acceptance criteria.
