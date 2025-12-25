---
name: plan
description: Create comprehensive technical plans for complex projects through iterative Q&A. Use when starting a new project, feature, or initiative that needs detailed specs before implementation. Keeps asking clarifying questions until all details are clear, then outputs a plan.md ready for decomposition.
---

# Plan Skill

Create exhaustive, implementation-ready technical plans for complex projects through iterative questioning. The goal: produce a plan.md so detailed that any AI agent can implement the project autonomously without additional context.

## When to Use

- Starting a new project/product from scratch
- Major features requiring architectural decisions
- Complex initiatives spanning multiple domains
- Projects with unclear or evolving requirements
- When "just start coding" would lead to rework

## Core Philosophy

**Plans fail because of missing details, not missing vision.**

A plan is only as good as its specificity. Vague plans → vague implementations → rework. This skill forces clarity through relentless questioning until every implementation detail is explicit.

## Process Overview

```
[User describes project idea]
        ↓
[Agent asks clarifying questions - Round 1]
        ↓
[User answers]
        ↓
[Agent asks deeper questions - Round 2...N]
        ↓
[Repeat until NO ambiguity remains]
        ↓
[Agent writes plan.md]
        ↓
[Ready for decompose skill]
```

## Phase 1: Initial Understanding

### Capture the Vision

Ask the user to describe:
- What are you building? (one sentence)
- Who is it for? (target users/audience)
- What problem does it solve?
- What does success look like?
- Any hard constraints? (timeline, budget, tech stack, team size)

### Identify Scope Boundaries

Critical first questions:
- What is explicitly IN scope?
- What is explicitly OUT of scope?
- What are the must-haves vs nice-to-haves?
- Is this greenfield or integrating with existing systems?

## Phase 2: Iterative Questioning

### Question Categories

For each category, drill down until answers are specific and actionable.

#### 1. Functional Requirements

```markdown
## Questions: Functionality

### Core Features
1. List every feature the system must have
2. For [feature X]:
   - What triggers this feature?
   - What is the expected output/result?
   - What inputs does it require?
   - What happens on success/failure?
   - Any edge cases to handle?

### User Journeys
1. Walk me through the primary user flow step-by-step
2. What are the alternative paths?
3. What are the error/exception paths?
4. What does the user see at each step?

### Business Rules
1. What business logic governs [domain concept]?
2. Are there any calculations? Specify formulas exactly.
3. What validations are required? Be specific about rules.
4. What are the states [entity] can be in?
5. What triggers state transitions?
```

#### 2. Data & Domain Model

```markdown
## Questions: Data Model

### Entities
1. What are the core domain entities?
2. For [entity]:
   - What fields/properties does it have?
   - What are the types of each field?
   - Which fields are required vs optional?
   - What are the validation rules for each field?
   - What is the uniqueness constraint?

### Relationships
1. How does [entity A] relate to [entity B]?
2. Is it one-to-one, one-to-many, many-to-many?
3. Is the relationship required or optional?
4. What happens when a related entity is deleted?

### Data Sources
1. Where does initial data come from?
2. How is data imported/migrated?
3. What external data sources are integrated?
4. What is the data volume? (records, growth rate)

### Data Lifecycle
1. How long is data retained?
2. Is there archival/soft-delete?
3. GDPR/privacy considerations?
4. Audit trail requirements?
```

#### 3. Technical Architecture

```markdown
## Questions: Architecture

### System Components
1. What are the major system components/services?
2. How do they communicate? (sync/async, protocols)
3. What are the deployment units?
4. Any microservices vs monolith preference?

### Tech Stack
1. What languages/frameworks are required or preferred?
2. What database(s)? Relational, document, graph?
3. What infrastructure? Cloud provider, on-prem, hybrid?
4. Any existing systems to integrate with?

### APIs
1. What API style? REST, GraphQL, gRPC, WebSocket?
2. What endpoints are needed?
3. What is the auth mechanism?
4. What is the rate limiting strategy?
5. Versioning approach?

### Performance
1. What are the latency requirements? (p50, p99)
2. Expected concurrent users/requests?
3. Any throughput requirements? (requests/sec, data volume)
4. What should be cached? TTL?

### Reliability
1. What is the uptime target? (99%, 99.9%, 99.99%)
2. What happens if [component] fails?
3. Disaster recovery requirements?
4. Backup strategy?

### Security
1. Authentication method? (OAuth, SAML, custom)
2. Authorization model? (RBAC, ABAC, custom)
3. What data needs encryption? At rest? In transit?
4. Compliance requirements? (SOC2, HIPAA, PCI)
5. Audit logging requirements?
```

#### 4. User Interface

```markdown
## Questions: UI/UX

### Interface Type
1. Web, mobile, desktop, CLI, API-only?
2. Responsive requirements?
3. Accessibility requirements? (WCAG level)

### Pages/Screens
1. List all pages/screens
2. For [page]:
   - What components are on it?
   - What data does it display?
   - What actions can user take?
   - What states does it have? (loading, empty, error, populated)

### Design
1. Existing design system/component library?
2. Brand guidelines to follow?
3. Reference designs or inspirations?
4. Dark mode requirement?

### Interactions
1. What forms exist? What fields?
2. Real-time features? (live updates, collaboration)
3. Notification/alert patterns?
4. Offline support needed?
```

#### 5. Integrations

```markdown
## Questions: Integrations

### External Services
1. What third-party services are needed?
2. For [service]:
   - What is the purpose?
   - What data is exchanged?
   - What is the auth method?
   - What is the failure mode?
   - Rate limits or quotas?

### Existing Systems
1. What internal systems does this integrate with?
2. API documentation available?
3. Who owns those systems?

### Webhooks/Events
1. What events should trigger external calls?
2. What external events should we consume?
3. Retry/idempotency strategy?
```

#### 6. Operations & DevOps

```markdown
## Questions: Operations

### Deployment
1. Deployment strategy? (blue/green, canary, rolling)
2. CI/CD requirements?
3. Environment strategy? (dev, staging, prod)
4. Infrastructure as code preference?

### Monitoring
1. What metrics are critical?
2. Alerting thresholds?
3. Logging requirements?
4. Tracing requirements?

### Maintenance
1. Update/migration strategy?
2. Feature flag system?
3. A/B testing needs?
```

#### 7. Testing Strategy

```markdown
## Questions: Testing

1. What is the test coverage expectation?
2. Unit test requirements?
3. Integration test requirements?
4. E2E test requirements?
5. Performance/load testing needs?
6. Security testing needs?
7. Manual QA process?
```

#### 8. Project Constraints

```markdown
## Questions: Constraints

### Timeline
1. What is the deadline?
2. Are there interim milestones?
3. MVP vs full release timing?

### Team
1. Who will implement this?
2. What skills are available?
3. Any training needed?

### Budget
1. Infrastructure budget?
2. Third-party service budget?
3. Any cost optimization requirements?
```

### Questioning Technique

**Go deep, not wide first**

For each topic:
1. Ask open-ended question
2. Listen to answer
3. Identify ambiguities in the answer
4. Ask specific follow-ups
5. Repeat until answer is implementation-ready

**Red flags that need more questions**:
- "It should just work like..."
- "Standard implementation"
- "We'll figure that out later"
- "Something like..."
- "Users can..."
- "The usual way"
- Vague quantities ("a lot", "many", "some")
- Undefined terms used casually

**Push back on vagueness**:
```
User: "Users can manage their settings"

Agent: "Let me understand 'settings' specifically:
1. What settings exist? List each one.
2. For each setting, what are the valid values?
3. Are there defaults?
4. Are any settings admin-only?
5. Do settings sync across devices?
6. Is there settings history/audit?
7. Can settings be imported/exported?"
```

## Phase 3: Write the Plan

Once all questions are answered, synthesize into plan.md:

```markdown
# [Project Name] - Technical Plan

## Overview
- **Purpose**: [one sentence]
- **Target Users**: [who]
- **Success Criteria**: [measurable outcomes]
- **Timeline**: [dates/milestones]

## Scope
### In Scope
- [explicit list]

### Out of Scope
- [explicit list]

### Assumptions
- [things assumed to be true]

### Risks
- [identified risks and mitigations]

---

## Functional Specification

### Feature: [Feature Name]

#### Description
[What it does, why it exists]

#### User Story
As a [user type], I want [capability] so that [benefit].

#### Acceptance Criteria
- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]

#### Business Rules
1. [Rule with exact logic]
2. [Validation with exact constraints]

#### Edge Cases
- When [condition], then [behavior]
- When [edge case], then [behavior]

#### Error Handling
- [Error scenario] → [response/behavior]

---

## Data Model

### Entity: [Entity Name]

```
[EntityName]
├── id: UUID (PK)
├── field1: String (required, max 100 chars)
├── field2: Integer (optional, default 0, min 0)
├── status: Enum [active, inactive, pending]
├── createdAt: Timestamp
├── updatedAt: Timestamp
└── [relationship]: -> [OtherEntity] (many-to-one)
```

#### Validation Rules
- field1: required, alphanumeric + spaces, 1-100 chars
- field2: >= 0

#### State Machine (if applicable)
```
[draft] --submit--> [pending] --approve--> [active]
                             --reject---> [draft]
[active] --archive--> [inactive]
```

---

## API Specification

### Endpoint: [METHOD] [path]

**Purpose**: [what it does]

**Auth**: [required role/permission]

**Request**:
```json
{
  "field1": "string (required)",
  "field2": 123
}
```

**Response (200)**:
```json
{
  "id": "uuid",
  "field1": "value"
}
```

**Errors**:
- 400: Invalid input - `{"error": "field1 required"}`
- 401: Unauthorized
- 403: Forbidden - user lacks permission
- 404: Resource not found
- 409: Conflict - duplicate entry

---

## Architecture

### System Diagram
```
[Client] <--HTTPS--> [API Gateway]
                          |
                    [Auth Service]
                          |
         +----------------+----------------+
         |                |                |
   [Service A]      [Service B]      [Service C]
         |                |                |
   [Database A]    [Database B]     [Queue]
                                         |
                                   [Worker]
```

### Components

#### [Component Name]
- **Purpose**: [why it exists]
- **Technology**: [stack]
- **Responsibilities**: [what it does]
- **Dependencies**: [what it needs]
- **Interfaces**: [how others interact with it]

---

## UI/UX Specification

### Screen: [Screen Name]

**Purpose**: [what user accomplishes here]

**Layout**:
```
+----------------------------------+
|  Header: Logo | Nav | User Menu  |
+----------------------------------+
|  Sidebar  |   Main Content       |
|           |   - Component A      |
|           |   - Component B      |
|           |   - Action Buttons   |
+----------------------------------+
|  Footer                          |
+----------------------------------+
```

**States**:
- Loading: [skeleton/spinner description]
- Empty: [message and CTA]
- Error: [error message pattern]
- Populated: [normal view]

**Interactions**:
- Click [element] → [action/navigation]
- Submit form → [behavior]

---

## Integrations

### [Service Name]

**Purpose**: [why needed]

**Integration Type**: REST API / SDK / Webhook

**Data Flow**:
- Send: [what data goes out]
- Receive: [what data comes back]

**Auth**: [API key, OAuth, etc.]

**Error Handling**:
- Timeout: [behavior]
- Rate limit: [behavior]
- Service down: [behavior]

---

## Security Requirements

### Authentication
- Method: [OAuth 2.0 / JWT / Session]
- Token lifetime: [duration]
- Refresh strategy: [how]

### Authorization
- Model: [RBAC / ABAC]
- Roles: [list with permissions]

### Data Protection
- Encryption at rest: [what data, how]
- Encryption in transit: [TLS version]
- PII handling: [specific fields, treatment]

---

## Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page load | < 2s | p95 |
| API response | < 200ms | p99 |
| Concurrent users | 1000 | sustained |
| Data volume | 1M records | year 1 |

### Caching Strategy
- [What to cache] → [TTL] → [Invalidation trigger]

---

## Testing Strategy

### Unit Tests
- Coverage target: [X%]
- Focus areas: [business logic, utilities]

### Integration Tests
- API endpoints: [all CRUD operations]
- Database: [migrations, queries]

### E2E Tests
- Critical paths: [list user journeys]
- Tool: [Playwright / Cypress]

### Performance Tests
- Load test: [X users, Y duration]
- Stress test: [breaking point]

---

## Deployment & Operations

### Environments
| Env | Purpose | URL | Data |
|-----|---------|-----|------|
| dev | development | dev.example.com | synthetic |
| staging | pre-prod | staging.example.com | anonymized prod |
| prod | production | example.com | real |

### CI/CD Pipeline
1. Push → Run tests
2. Tests pass → Build container
3. Build success → Deploy to staging
4. Manual approval → Deploy to prod

### Monitoring
- Metrics: [list key metrics]
- Alerts: [conditions and thresholds]
- Dashboards: [what to visualize]

### Logging
- Format: [structured JSON]
- Retention: [X days]
- Sensitive data: [excluded fields]

---

## Appendix

### Glossary
- **Term**: Definition

### References
- [Design doc link]
- [API docs link]
- [Related systems]

### Open Questions
- [Any remaining questions for future resolution]

### Decision Log
| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| Database | PostgreSQL, MongoDB | PostgreSQL | Need ACID, complex queries |
```

## Phase 4: Validation

Before finalizing, verify the plan:

### Completeness Check
- [ ] Every feature has acceptance criteria
- [ ] Every entity has all fields defined
- [ ] Every API has request/response schemas
- [ ] Every integration has error handling
- [ ] Every UI has all states defined
- [ ] Security model is complete
- [ ] Performance targets are specified
- [ ] Testing strategy covers critical paths

### Implementation Readiness
- [ ] An agent could implement each section without asking questions
- [ ] No "TBD" or "to be determined" items
- [ ] No vague requirements ("appropriate", "reasonable", "standard")
- [ ] All edge cases addressed
- [ ] All error scenarios defined

### Cross-Reference Check
- [ ] Data model supports all features
- [ ] APIs cover all UI needs
- [ ] Security model covers all endpoints
- [ ] Testing covers all requirements

## Output

Write the completed plan to `plan.md` in the current directory (or user-specified location).

```bash
# write to plan.md
# then confirm with user
```

The plan is now ready for the `decompose` skill to break into implementable beads.

## Anti-Patterns

### Stopping Too Early
- Accepting vague answers
- Not drilling into edge cases
- Assuming "standard" means the same thing to everyone
- Leaving TBD items

### Wrong Level of Detail
- Too abstract: "handle authentication" (how exactly?)
- Too detailed: specifying variable names (premature)
- Right level: "OAuth 2.0 with Google, store refresh tokens in DB, 1hr access token TTL"

### Missing Categories
- Forgetting operations/monitoring
- Ignoring security until later
- No error handling specs
- No testing strategy

### Bias Toward Technology
- Jumping to solutions before understanding requirements
- Letting tech stack drive architecture
- Assuming patterns without validation

## Integration with Other Skills

- **decompose**: Takes plan.md and creates implementable beads
- **btca**: Query tech specifics during planning
- **backend-review**: Reference for backend quality expectations
- **frontend-design**: Reference for UI/UX standards
