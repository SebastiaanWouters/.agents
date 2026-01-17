---
name: decompose
description: Break down plans/specs into atomic, self-contained tickets. Triggers on "decompose", "break down", "create tasks from plan". Asks clarifying questions until each ticket has complete implementation details.
---

# Decompose

Transform SPEC.md into atomic, self-contained tickets.

## Flow

1. Read SPEC.md
2. Load **ticket** skill — check existing work (`tk ls`, `tk blocked`)
3. Identify ticket candidates from spec
4. For each ticket:
   - Load **interviewer** skill
   - Gather: scope, files, patterns, dependencies, acceptance criteria
   - Stop when fully specified (no gaps, no "later" items)
5. Create tickets via **ticket** skill
6. Wire dependencies and validate

## Ticket Completeness

Each ticket must be implementable without reading others. Requires:
- Clear scope and constraints
- Exact file paths
- Referenced patterns/examples
- Testable acceptance criteria
- Mapped dependencies

## Red Flags → Interview More

- "Standard implementation" → which pattern?
- "Like existing X" → which path?
- "Decide later" → what? when?
- "Fast/secure/good" → what metrics?
- Vague quantities → exact bounds?
