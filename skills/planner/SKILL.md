---
name: generating-implementation-plans
description: Transforms a specification document (SPEC.md) into a comprehensive, implementation-ready plan (PLAN.md). Use when the user has a completed spec and needs a detailed roadmap with architecture, schemas, APIs, configs, and step-by-step build instructions. Interviews user via AskUserQuestion to resolve all implementation decisions before generating the plan.
---

# Generating Implementation Plans

Produce plans complete enough that a developer can build without asking questions.

## Files

- **Source:** `SPEC.md` (or user-specified)
- **Output:** `PLAN.md` (or user-specified)

## Process

### 1. Analyze Specification

Read source file. Extract:
- Features, endpoints, screens, interactions
- Data entities and relationships
- Integration points
- Ambiguities requiring clarification

### 2. Implementation Interview

**Use AskUserQuestion. Mandatory. Continue until all decisions resolved.**

Ask 3-5 questions per round covering gaps in:

| Area | Questions |
|------|-----------|
| Architecture | Monolith/microservices? Cloud? Containers? Caching? |
| Stack | Language/framework versions? ORM? Frontend? CSS? |
| Database | Engine? Schema style? Migrations? Soft delete? Auditing? |
| Auth | Provider? JWT/session? Roles? OAuth? MFA? |
| API | REST/GraphQL? Versioning? Pagination? Rate limits? |
| Security | Validation? CORS? Secrets? Encryption? |
| Testing | Framework? Coverage? E2E approach? |
| DevOps | CI/CD? Environments? Monitoring? Deployment? |
| Timeline | MVP scope? Priorities? Deadlines? |

Skip questions answered in spec. If user says "you decide" → choose and document rationale.

### 3. Generate Plan

Write `PLAN.md`:

```markdown
# Implementation Plan: [Project Name]

## 1. Summary
What we're building. Key decisions table. Success criteria.

## 2. Architecture
System diagram (ASCII). Components (purpose, tech, interfaces). Data flow. Integrations.

## 3. Tech Stack
| Category | Choice | Version |
Complete dependency list with env vars for external services.

## 4. Project Structure
Complete directory tree. File naming conventions.

## 5. Database
ERD. Complete CREATE TABLE + indexes. Migration strategy.

## 6. API Specification
Per endpoint: method, path, auth, request/response formats, errors, curl example.

## 7. Implementation Phases
### Phase N: [Name] — [Duration]
#### Task N.N: [Name] (X hours)
Steps with complete working code. Verification criteria.
Phase deliverables and exit criteria checklists.

## 8. Components
Per component: purpose, dependencies, complete implementation code, complete tests.

## 9. Security
Auth flow. Permission matrix. Security headers config. Validation checklist.

## 10. Testing
Directory structure. Coverage requirements. Key scenarios.

## 11. DevOps
Complete .env template. Complete CI/CD workflow. Complete Dockerfile/compose. Monitoring.

## 12. Launch Checklist
Pre-launch, launch day, post-launch items.

## Appendix
Glossary. External docs. Decision log.
```

## Requirements

- **Complete code only** — no pseudocode, no placeholders
- **Full configs** — entire file contents, pinned versions
- **All edge cases** — error handling for every failure mode
- **Copy-paste ready** — code works when copied directly

## Before Finalizing

- [ ] Every spec feature has implementation steps
- [ ] Every endpoint documented
- [ ] Every table defined
- [ ] Every env var listed
- [ ] No TODOs remain
