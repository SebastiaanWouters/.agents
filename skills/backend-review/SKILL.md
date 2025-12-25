---
name: backend-review
description: Review local code changes for backend bugs, incorrect behavior, and quality issues. Use when reviewing recent changes, hunting bugs, or ensuring correctness. Surfaces logic errors, edge cases, race conditions, DRY violations, dead code, and architectural drift.
---

# Backend Review Skill

Review recent local changes for backend issues: bugs, incorrect functionality, logic errors, edge cases, race conditions, DRY violations, dead code, and architectural problems. Primary goal is correctness; secondary is maintainability.

## When to Use

- Before committing backend changes
- After implementing new features/refactors
- When codebase feels "off" or hard to navigate
- Periodic quality audits
- Before major releases

## Review Process

### 1. Gather Changed Files

```bash
# staged + unstaged changes
git diff --name-only HEAD

# specific commit range
git diff --name-only main..HEAD

# backend files only (adjust extensions)
git diff --name-only HEAD | grep -E '\.(ts|js|go|rs|py|java|rb|php)$' | grep -v '\.test\.|\.spec\.|__test__'
```

### 2. Analyze Full Diff

```bash
# see actual changes with context
git diff HEAD -- path/to/file.ts

# for larger reviews
git diff main..HEAD --stat
git diff main..HEAD -- src/
```

### 3. Review Checklist

For each changed file, evaluate against:

#### Correctness & Bugs (PRIORITY 1)
- [ ] Logic errors (wrong conditions, off-by-one, inverted logic)
- [ ] Edge cases not handled (null, empty, zero, negative, max values)
- [ ] Race conditions (async operations, shared state)
- [ ] State corruption (partial updates, inconsistent state)
- [ ] Boundary conditions (array bounds, string length, numeric overflow)
- [ ] Incorrect comparisons (== vs ===, floating point)
- [ ] Wrong operator precedence
- [ ] Missing await on async calls
- [ ] Incorrect loop termination
- [ ] Variable shadowing causing bugs
- [ ] Closure capturing wrong value
- [ ] Mutation of shared/passed objects

**Trace execution paths**:
```bash
# understand the flow
rg "functionName" --type ts -A 5 -B 2

# find all callers
rg "functionName\(" --type ts
```

#### Data Integrity Issues
- [ ] Missing transactions (multi-step DB operations)
- [ ] Partial failures leave bad state
- [ ] No idempotency on retryable operations
- [ ] Stale data (cache invalidation, read-after-write)
- [ ] Data validation gaps at boundaries
- [ ] Type coercion losing data
- [ ] Timezone/locale issues
- [ ] Encoding problems (UTF-8, special chars)

#### Security Issues
- [ ] SQL/NoSQL injection
- [ ] Command injection
- [ ] Path traversal
- [ ] Missing auth checks
- [ ] Sensitive data in logs
- [ ] Insecure defaults
- [ ] Missing rate limiting
- [ ] IDOR (insecure direct object reference)

#### DRY Violations
- [ ] Duplicated logic (copy-pasted code blocks)
- [ ] Similar functions that could be unified
- [ ] Repeated validation/transformation logic
- [ ] Config values hardcoded in multiple places
- [ ] Same error handling pattern repeated

**Detection**: Search for similar patterns
```bash
# find potential duplicates
rg -l "pattern from changed code" --type ts
```

#### Dead Code & Slop
- [ ] Unused imports
- [ ] Unreachable code paths
- [ ] Commented-out code (remove or restore)
- [ ] Unused function parameters
- [ ] Empty catch blocks
- [ ] TODO/FIXME without tracking
- [ ] Console.log/print debugging left in
- [ ] Unused variables/constants
- [ ] Orphaned files (not imported anywhere)

**Detection**: Use tooling
```bash
# typescript unused exports
npx ts-prune

# find orphan files
npx unimported

# dead code in specific file
npx ts-unused-exports tsconfig.json path/to/file.ts
```

#### Architectural Issues
- [ ] Circular dependencies
- [ ] Layer violations (UI importing DB directly)
- [ ] God objects/functions (>200 lines)
- [ ] Missing abstractions (raw SQL everywhere)
- [ ] Wrong abstraction level (over-engineering)
- [ ] Inconsistent patterns (some repos use ORM, some raw)
- [ ] Business logic in wrong layer
- [ ] Tight coupling between modules

**Layer boundaries** (typical):
```
routes/controllers → services → repositories → database
                  → external APIs
                  → queues/events
```

#### Error Handling
- [ ] Swallowed errors (empty catch)
- [ ] Generic error messages (no context)
- [ ] Missing error types/codes
- [ ] No error boundaries/recovery
- [ ] Exceptions for control flow
- [ ] Inconsistent error patterns (throw vs Result)
- [ ] Missing validation at boundaries
- [ ] Unhandled promise rejections

**Preferred pattern**: Result<T, E> over try/catch
```typescript
// prefer
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }

// avoid
try { ... } catch (e) { ... }
```

#### Naming & Clarity
- [ ] Unclear variable/function names
- [ ] Misleading names (does more than name suggests)
- [ ] Inconsistent naming conventions
- [ ] Magic numbers/strings
- [ ] Abbreviations that aren't obvious
- [ ] Names that don't match domain language

#### Function/Module Quality
- [ ] Functions doing multiple things
- [ ] Too many parameters (>4)
- [ ] Deep nesting (>3 levels)
- [ ] Long functions (>50 lines usually suspicious)
- [ ] Missing input validation
- [ ] Side effects in pure-looking functions
- [ ] Implicit dependencies (globals, singletons)

#### Type Safety (if applicable)
- [ ] `any` type usage
- [ ] Type assertions without validation
- [ ] Missing null checks
- [ ] Implicit type coercion
- [ ] Overly broad types
- [ ] Missing discriminated unions for states

#### Testing Gaps
- [ ] New code paths without tests
- [ ] Changed behavior without test updates
- [ ] Missing edge case coverage
- [ ] Tests that don't assert anything meaningful
- [ ] Flaky test patterns

### 4. Cross-File Analysis

Look beyond individual files:

```bash
# check for similar code across codebase
rg "function_name|pattern" --type ts -C 2

# find all usages of changed function
rg "changedFunction" --type ts

# check import graph
npx madge --circular src/

# find files importing changed module
rg "from ['\"].*changed-module" --type ts
```

### 5. Verify Behavior

Before concluding, verify changed code works correctly:

```bash
# run tests for changed files
npm test -- --findRelatedTests path/to/changed.ts

# run specific test file
npm test -- path/to/changed.test.ts

# check types
npx tsc --noEmit

# lint
npm run lint -- path/to/changed.ts
```

**Manual verification**:
- Trace logic mentally with concrete inputs
- Check edge cases: null, empty, zero, negative, huge values
- Consider concurrent execution scenarios
- Verify error paths actually work

### 6. Output Format

```
## Backend Review: [scope]

### Bugs & Incorrect Behavior
Logic errors, edge cases, race conditions - things that are WRONG.

### Security Issues
Injection, auth gaps, data exposure.

### Data Integrity Risks
Transaction gaps, partial failures, stale data.

### Architectural Concerns
Structural problems, layer violations, coupling.

### Code Quality
DRY violations, naming, complexity.

### Dead Code & Cleanup
Unused code, leftover debugging, TODOs.

### Testing Gaps
Missing or inadequate test coverage.

### Recommendations
Prioritized action items with severity.
```

## Quality Standards

### Code Organization
- Single responsibility at all levels
- Clear module boundaries
- Consistent file/folder structure
- Colocation of related code

### Dependencies
- Explicit over implicit
- Inject dependencies, don't import globals
- Minimal coupling between modules
- No circular dependencies

### Error Handling
- Fail fast, fail loud
- Errors carry context
- Recoverable vs fatal distinction
- Consistent patterns throughout

### Data Flow
- Validate at boundaries
- Transform early, use clean types internally
- Immutable where practical
- Clear ownership of state

### Naming
- Domain language in code
- Verb+noun for functions
- Noun for data
- Boolean: is/has/should prefix

## Example Review

```
## Backend Review: OrderService refactor

### Bugs & Incorrect Behavior
- `order.service.ts:89` - off-by-one: `i <= items.length` should be `i < items.length`
- `order.service.ts:134` - missing await: `updateInventory()` runs detached
- `applyDiscount` returns NaN when quantity is 0 (divide by zero)
- `processOrder` catches all errors but only logs - orders silently fail
- Race condition: inventory check and decrement not atomic - overselling possible

### Security Issues
- SQL injection via string interpolation in `findByName` (line 45)
- User ID from request body not validated against session - IDOR possible
- Stack traces leaked in error responses

### Data Integrity Risks
- Order and inventory updates not in transaction - partial failures possible
- No idempotency key - retry causes duplicate orders
- Cache not invalidated after order - stale inventory shown

### Architectural Concerns
- OrderService directly queries UserRepository - should go through UserService
- Business logic (discount calc) in OrderController - move to service
- `utils/helpers.ts` becoming a dumping ground (47 exports)

### Code Quality
- `calculateTotal` duplicated in OrderService and CartService
- `processPayment` is 180 lines - extract PaymentProcessor
- Magic number `0.15` in discount logic - extract to config

### Dead Code & Cleanup
- `legacyOrderFormat()` - no callers found
- `order.service.ts:45` - commented out code block
- `DEBUG_MODE` constant never used

### Testing Gaps
- No tests for `applyDiscount` edge cases (negative, zero, NaN)
- `processOrder` happy path only - no failure scenarios
- Missing integration test for order→inventory→payment flow
- Race condition not tested

### Recommendations
1. [Critical] Fix off-by-one and missing await - causes data corruption
2. [Critical] Parameterize SQL queries - injection risk
3. [Critical] Add transaction around order+inventory
4. [High] Add idempotency key to prevent duplicates
5. [High] Validate user ID ownership
6. [Medium] Extract payment processing to dedicated service
7. [Low] Clean up dead code before next release
```

## Bug Hunting Techniques

### Trace Concrete Values
Walk through code with real inputs:
```
Input: { items: [], userId: null, discount: -5 }
Line 10: items.length = 0 → loop skipped
Line 15: userId.toString() → CRASH: null
Line 20: discount * -1 = 5 → wrong sign
```

### Check State Transitions
- What states can this object be in?
- Are all transitions valid?
- Can we get stuck in invalid state?
- What happens on partial failure?

### Async Reasoning
- What if this runs twice simultaneously?
- What if upstream service is slow/down?
- Are operations atomic?
- Is ordering guaranteed?

### Boundary Analysis
Test each input at:
- Zero/empty
- One
- Max value
- Just over max
- Negative
- null/undefined
- Special characters
- Unicode edge cases

## Automation Hooks

Add to CI/PR workflow:

```yaml
# .github/workflows/backend-review.yml
- name: Check circular deps
  run: npx madge --circular src/
  
- name: Check unused exports
  run: npx ts-prune | grep -v "used in module"
  
- name: Check complexity
  run: npx complexity-report src/ --max-complexity 10
```

## Integration with Other Skills

- **btca**: Query framework/library best practices
- **dev-browser**: Test API responses via UI if needed
