---
name: decompose-fizzy
description: Break down plans/specs into atomic, self-contained Fizzy cards. Triggers on "decompose to fizzy", "break down to cards", "create cards from plan". Asks clarifying questions until each card has complete implementation details.
---

# Decompose to Fizzy

Transform SPEC.md into atomic, self-contained Fizzy cards.

## Flow

1. Read SPEC.md
2. Load **fizzy** skill — identify target board (`fizzy board list`)
3. Check existing work: `fizzy card list --board ID`
4. Identify card candidates from spec
5. For each card:
   - Load **interviewer** skill
   - Gather: scope, files, patterns, dependencies, acceptance criteria
   - Stop when fully specified (no gaps, no "later" items)
6. Create cards via `fizzy card create`
7. Add acceptance criteria as steps
8. Wire dependencies using tags and column placement
9. Validate all cards are actionable

## Card Structure

Each card description follows this template:

```html
<h2>Scope</h2>
<p>[What this card accomplishes, boundaries, constraints]</p>

<h2>Files</h2>
<ul>
  <li><code>path/to/file.ts</code> — [what to do]</li>
</ul>

<h2>Patterns</h2>
<p>Follow pattern in <code>path/to/example.ts</code></p>

<h2>Dependencies</h2>
<p>Blocked by: #123, #124</p>
<p>Or: None</p>
```

Acceptance criteria go as **steps** (checkable items), not in description.

## Creating Cards

```bash
# Create card
CARD=$(fizzy card create --board BOARD_ID \
  --title "Implement user authentication" \
  --description_file card.html | jq -r '.data.number')

# Add acceptance criteria as steps
fizzy step create --card $CARD --content "JWT tokens issued on login"
fizzy step create --card $CARD --content "Tokens expire after 24h"
fizzy step create --card $CARD --content "Invalid tokens return 401"

# Tag dependencies
fizzy card tag $CARD --tag "blocked-by:122"

# Place in correct column
fizzy card column $CARD --column not-now  # if blocked
fizzy card column $CARD --column maybe    # if ready
```

## Columns

| Column | When to Use |
|--------|-------------|
| **not now** | Card has unmet dependencies |
| **maybe** | Ready to work, in backlog |
| **working on** | Currently active |
| **done** | Completed |

## Dependency Handling

Fizzy has no native dependencies. Use this pattern:

1. **Tag**: Add `blocked-by:N` tag referencing blocking card number
2. **Column**: Place blocked cards in **not now**
3. **Description**: List dependencies in Dependencies section
4. **Unblock**: When dependency closes, remove tag and move to **maybe**

## Card Completeness

Each card must be implementable without reading others. Requires:

- Clear scope and constraints
- Exact file paths
- Referenced patterns/examples
- Testable acceptance criteria (as steps)
- Mapped dependencies (as tags + description)

## Red Flags → Interview More

- "Standard implementation" → which pattern?
- "Like existing X" → which path?
- "Decide later" → what? when?
- "Fast/secure/good" → what metrics?
- Vague quantities → exact bounds?

## Validation Checklist

Before finishing, verify:

- [ ] All cards have description with Scope, Files, Patterns, Dependencies
- [ ] All cards have steps for acceptance criteria
- [ ] Blocked cards are in **not now** with `blocked-by:N` tags
- [ ] Unblocked cards are in **maybe**
- [ ] No circular dependencies
- [ ] Each card is standalone (implementable without reading others)
