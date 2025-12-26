---
name: plan
description: Create comprehensive technical plans through iterative Q&A. Triggers on "plan", "spec", "design", starting new project/feature. Keeps asking until all details clear, outputs plan.md ready for decomposition.
---

# Plan

Create exhaustive, implementation-ready technical plans through iterative questioning.

## Process

```
[User describes project] → [Ask questions] → [Repeat until NO ambiguity] → [Write plan.md]
```

## Question Categories

### Functional
- Features list, user flows, business rules
- Triggers, inputs, outputs, success/failure paths
- Edge cases, state transitions

### Data Model
- Entities, fields, types, validation rules
- Relationships (1:1, 1:N, N:M), cascades
- Data sources, volume, retention, GDPR

### Architecture
- Components, communication (sync/async)
- Tech stack, databases, APIs (REST/GraphQL/tRPC)
- Performance (latency, throughput), reliability (uptime, DR)
- Security (auth, authz, encryption, compliance)

### UI/UX
- Interface type, pages/screens
- States (loading, empty, error, populated)
- Forms, real-time features, offline support

### Integrations
- External services, auth methods, failure modes
- Webhooks, retry/idempotency

### Operations
- Deployment strategy, CI/CD, environments
- Monitoring, alerting, logging

### Testing
- Coverage targets, unit/integration/E2E/perf tests

## Red Flags (Keep Asking)

- "Should just work like...", "Standard implementation"
- "We'll figure that out later"
- Vague quantities, undefined terms

## Plan.md Template

```markdown
# [Project] - Technical Plan

## Overview
Purpose, users, success criteria, timeline

## Scope
In/out of scope, assumptions, risks

## Functional Spec
Features with acceptance criteria, business rules, edge cases

## Data Model
Entities with fields, types, validation, relationships

## API Spec
Endpoints with request/response, auth, errors

## Architecture
System diagram, components, responsibilities

## UI/UX
Screens with layout, states, interactions

## Security
Auth method, authorization model, encryption

## Performance
Targets, caching strategy

## Testing Strategy
Coverage, test types, critical paths

## Deployment
Environments, CI/CD, monitoring
```

## Validation

Before finalizing:
- Every feature has acceptance criteria
- Every entity has all fields defined
- Every API has schemas
- No "TBD" items remain
- Agent can implement without questions
