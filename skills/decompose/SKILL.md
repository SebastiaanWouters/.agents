---
name: decompose
description: Break down plan/spec markdown files into self-contained task beads with full implementation details. Use when you have a plan or spec and need to decompose it into atomic, fully-specified tasks. Asks clarifying questions until each task has complete requirements.
---

# Decompose Skill

Transform high-level plans or specifications into atomic, self-contained task "beads" - each with complete implementation details so any developer can execute without additional context.

## When to Use

- User provides a plan/spec markdown file to break down
- Large feature needs decomposition into implementable units
- Sprint planning / task creation from PRD
- Converting vague requirements into actionable tasks
- Ensuring no implementation detail is left ambiguous

## Core Principles

### Self-Contained Beads
Each task bead must:
- Be executable independently (no hidden dependencies on other beads)
- Contain ALL information needed to implement
- Have clear acceptance criteria
- Include technical approach
- Specify files/locations to modify
- Note any external dependencies

### Full Requirements
Never leave ambiguity. For each bead, ensure:
- **What**: Exact functionality/change
- **Where**: Specific files, functions, components
- **How**: Technical approach, patterns to follow
- **Why**: Context for decision-making
- **Done when**: Measurable acceptance criteria

## Process

### 1. Read & Understand the Spec

```bash
# read the plan/spec file
cat path/to/spec.md
```

Identify:
- High-level goals
- Implicit requirements
- Technical constraints
- Dependencies between features
- Ambiguous areas needing clarification

### 2. Ask Clarifying Questions

**CRITICAL**: Do not proceed with decomposition until all ambiguity is resolved.

Ask user about:
- Unclear requirements
- Missing technical details
- Edge cases not covered
- Integration points
- Error handling expectations
- Performance requirements
- UI/UX specifics (if applicable)
- Data models/schemas
- API contracts
- Auth/permissions
- Testing expectations

**Question Format**:
```
## Questions Before Decomposition

### [Feature/Section Name]
1. [Specific question about ambiguity]
2. [Edge case question]
3. [Technical approach question]

### [Another Section]
1. ...
```

Keep asking rounds of questions until:
- Every requirement is specific and measurable
- Technical approach is clear
- Edge cases are defined
- Integration points are understood

### 3. Decompose into Beads

Once requirements are clear, create beads:

```markdown
## Bead 1: [Descriptive Title]

### Context
Brief background - why this bead exists, what problem it solves.

### Requirements
- [ ] Specific requirement 1
- [ ] Specific requirement 2
- [ ] Edge case handling: [describe]

### Technical Approach
- Files to modify: `path/to/file.ts`
- Pattern to follow: [reference existing code or describe]
- Data structures: [if applicable]
- API changes: [if applicable]

### Dependencies
- External: [libraries, services]
- Internal: [other beads that must complete first, if any]

### Acceptance Criteria
- [ ] [Measurable criterion 1]
- [ ] [Measurable criterion 2]
- [ ] Tests pass: [specific test scenarios]

### Estimated Complexity
[small/medium/large] - [brief justification]
```

### 4. Validate Decomposition

For each bead, verify:
- [ ] Can be implemented without reading other beads
- [ ] Has no implicit assumptions
- [ ] Acceptance criteria are testable
- [ ] Technical approach is clear
- [ ] Files/locations are specified

### 5. Output Complete Bead List

Structure final output:

```markdown
# [Project/Feature Name] - Task Beads

## Overview
- Total beads: N
- Suggested order: [if dependencies exist]
- Estimated total effort: [sum of complexities]

## Dependency Graph
[If beads have dependencies, show them]

---

## Bead 1: [Title]
[Full bead content]

---

## Bead 2: [Title]
[Full bead content]

---
[Continue for all beads]
```

## Question Templates

### For Data/Models
- What fields does [entity] have?
- What are the validation rules for [field]?
- Is [field] required or optional?
- What's the relationship between [A] and [B]?
- How is [entity] persisted? (DB schema, storage)

### For APIs
- What's the request/response format for [endpoint]?
- What auth is required?
- What errors can occur?
- Rate limiting?
- Pagination strategy?

### For UI
- What's the layout/wireframe?
- Loading/empty/error states?
- Responsive behavior?
- Animations/transitions?
- Accessibility requirements?

### For Business Logic
- What happens when [edge case]?
- What's the priority order when [conflict]?
- How is [calculation] performed exactly?
- What triggers [action]?
- What are the permission rules?

### For Integration
- What external services are involved?
- What's the failure mode if [service] is down?
- Retry/timeout strategy?
- Data sync approach?

### For Performance
- Expected data volume?
- Latency requirements?
- Caching strategy?
- Batch vs real-time?

## Example Decomposition

### Input Spec
```markdown
# User Settings Feature
Users should be able to update their profile settings including name, email, and notification preferences.
```

### Questions Asked
```
## Questions Before Decomposition

### Profile Updates
1. Can users change their email? If so, is verification required?
2. What validation rules for name (min/max length, allowed chars)?
3. Is there an avatar/profile picture? If so, what formats/sizes?

### Notification Preferences
1. What notification channels exist (email, push, SMS)?
2. What events can be subscribed to?
3. Are there notification frequency options (instant, daily digest)?

### Technical
1. Existing user model location?
2. Current API patterns in the codebase?
3. How is validation handled elsewhere?
```

### After Clarification - Beads
```markdown
# User Settings - Task Beads

## Overview
- Total beads: 4
- Suggested order: 1 → 2 → 3 → 4 (3 & 4 can parallel after 2)
- Estimated total effort: Medium

---

## Bead 1: Add Settings API Endpoint Structure

### Context
Create the API scaffolding for user settings endpoints.

### Requirements
- [ ] GET /api/users/:id/settings - fetch current settings
- [ ] PATCH /api/users/:id/settings - update settings
- [ ] Validate :id matches authenticated user
- [ ] Return 403 if user tries to access other's settings

### Technical Approach
- Files to modify: `src/routes/users.ts`, `src/controllers/userSettings.ts` (new)
- Pattern: Follow existing `src/controllers/userProfile.ts`
- Use zod schema for request validation

### Dependencies
- External: zod (already installed)
- Internal: None

### Acceptance Criteria
- [ ] Endpoints return 200 with empty response
- [ ] Auth check returns 403 for wrong user
- [ ] Route tests pass

### Estimated Complexity
small - scaffolding only

---

## Bead 2: Profile Name Update

### Context
Allow users to update their display name.

### Requirements
- [ ] Name field: 2-50 chars, alphanumeric + spaces
- [ ] Trim whitespace
- [ ] Return validation error with specific message if invalid

### Technical Approach
- Files: `src/controllers/userSettings.ts`, `src/models/user.ts`
- Add `displayName` to User model if not exists
- Validation in controller using zod

### Dependencies
- Internal: Bead 1 (endpoint structure)

### Acceptance Criteria
- [ ] Valid name updates successfully
- [ ] <2 chars returns "Name must be at least 2 characters"
- [ ] >50 chars returns "Name cannot exceed 50 characters"
- [ ] Invalid chars returns "Name can only contain letters, numbers, and spaces"

### Estimated Complexity
small

---

## Bead 3: Email Change with Verification

### Context
Allow email changes with re-verification requirement.

### Requirements
- [ ] New email must be valid format
- [ ] New email must not be in use by another account
- [ ] Send verification email to NEW address
- [ ] Email not changed until verified (store as pendingEmail)
- [ ] Verification link expires in 24h

### Technical Approach
- Files: `src/controllers/userSettings.ts`, `src/models/user.ts`, `src/services/email.ts`
- Add `pendingEmail`, `emailVerificationToken`, `emailVerificationExpires` to User
- Use existing email service pattern from registration flow
- New endpoint: POST /api/users/:id/verify-email?token=xxx

### Dependencies
- External: Email service (SendGrid - already configured)
- Internal: Bead 1

### Acceptance Criteria
- [ ] Invalid email format returns 400
- [ ] Email in use returns "Email already registered"
- [ ] Verification email sent to new address
- [ ] Clicking valid token updates email
- [ ] Expired token returns "Verification link expired"

### Estimated Complexity
medium - multiple states, email integration

---

## Bead 4: Notification Preferences

### Context
Let users control email notifications for key events.

### Requirements
- [ ] Notification types: marketing, product_updates, security_alerts
- [ ] Security alerts cannot be disabled (always on)
- [ ] Default all to true for new users
- [ ] Store as JSON in user record

### Technical Approach
- Files: `src/controllers/userSettings.ts`, `src/models/user.ts`
- Add `notificationPreferences` JSON field to User
- Validate against allowed notification types

### Dependencies
- Internal: Bead 1

### Acceptance Criteria
- [ ] Can toggle marketing on/off
- [ ] Can toggle product_updates on/off
- [ ] Attempting to disable security_alerts returns error
- [ ] Unknown notification type returns 400

### Estimated Complexity
small
```

## Anti-Patterns to Avoid

### Vague Beads
❌ "Implement user settings"
✅ "Add PATCH endpoint for profile name with 2-50 char validation"

### Hidden Dependencies
❌ "Update the component" (which component? what update?)
✅ "Modify `src/components/Settings.tsx` to add name field using existing `TextInput` pattern"

### Untestable Criteria
❌ "Should work well"
✅ "Returns 200 with updated user object within 100ms"

### Missing Edge Cases
❌ "Handle errors"
✅ "Return 409 if email already registered, 400 if invalid format, 500 if email service fails with retry message"

## Integration with Other Skills

- **btca**: Query library/framework specifics for technical approach
- **backend-review**: Review completed beads for issues
- **ui-review**: Review UI beads for frontend quality
