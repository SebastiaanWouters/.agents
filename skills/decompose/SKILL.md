---
name: decompose
description: Break down plans/specs into atomic, self-contained task beads. Triggers on "decompose", "break down", "create tasks from plan". Asks clarifying questions until each task has complete implementation details.
---

# Decompose

Transform plans/specs into atomic, self-contained task beads with full implementation details.

## Process

1. **Read spec**: Identify goals, requirements, constraints, ambiguities
2. **Ask questions**: Until ALL ambiguity is resolved
3. **Create beads**: Each fully self-contained
4. **Validate**: Can each bead be implemented without reading others?

## Bead Template

```markdown
## Bead N: [Title]

### Context
Why this exists, what problem it solves.

### Requirements
- [ ] Specific requirement
- [ ] Edge case: [describe]

### Technical Approach
- Files: `path/to/file.ts`
- Pattern: [reference or describe]

### Dependencies
- External: [libraries]
- Internal: [other beads, if any]

### Acceptance Criteria
- [ ] Testable criterion
- [ ] Tests: [specific scenarios]

### Complexity
[small/medium/large]
```

## Question Templates

**Data**: Fields? Types? Validation? Relationships? Persistence?  
**APIs**: Format? Auth? Errors? Rate limits?  
**UI**: Layout? States (loading/empty/error)? Responsive? A11y?  
**Logic**: Edge cases? Priority on conflict? Exact calculations?  
**Integration**: External services? Failure modes? Retry strategy?

## Red Flags (Need More Questions)

- "It should just work like..."
- "Standard implementation"
- "We'll figure that out later"
- Vague quantities ("many", "some")

## Avoid

- Vague beads: "Implement settings" → "Add PATCH /settings with 2-50 char name validation"
- Hidden deps: "Update component" → "Modify `src/Settings.tsx` using `TextInput` pattern"
- Untestable: "Should work well" → "Returns 200 within 100ms"
