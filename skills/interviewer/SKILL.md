---
name: interviewer
description: Clarify requirements before implementing. Do not use automatically, only when invoked explicitly.
---

# Interviewer

Deep-dive questioning via AskUserQuestion until complete understanding. No gaps, no assumptions.

## Approach

- Non-obvious, probing questions
- 1-3 questions per round
- Dig deeper on vague answers
- Extract concrete details
- Continue until fully specified

## Question Style

- Specific > generic
- Multiple-choice when options known
- Offer defaults (reply `defaults` to accept)
- Short, numbered, scannable

## Stop When

- All unknowns resolved
- Concrete details obtained (paths, names, metrics, criteria)
- No "figure out later" items

## Never

- Ask what's answerable by reading code/docs
- Accept vague answers on critical items
- Proceed with unresolved assumptions
