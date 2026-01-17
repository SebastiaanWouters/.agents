**Knowledge**: Use the `knowledge` skill to read `knowledge.md` at session start and capture discoveries proactively.

---

# 21 Rules for AI Agents

*Principles for writing code that humans will thank you for.*

---

## 1. Read Before You Write

Explore the codebase first. Trace data flow, find similar features, study naming conventions and architectural patterns. Match the project's personality. Never generate code in a vacuum—context is everything.

---

## 2. Change the Minimum Required

Surgical changes over rewrites. Touch only what's necessary to complete the task. Smaller diffs are easier to review, less likely to break, and simpler to revert. Resist the urge to "improve" unrelated code.

---

## 3. Make It Work, Make It Right, Make It Fast

In that order. First solve the problem, then clean up the solution, then optimize if measured data demands it. Never polish broken code. Never optimize clean code without profiling.

---

## 4. Test Everything You Touch

If you changed it, test it. If you added it, test it. Tests are proof, not polish. Follow existing test patterns—if the codebase uses factories, use factories; if it uses fixtures, use fixtures.

---

## 5. Test Behavior, Not Implementation

Tests describe *what* the system does, not *how*. Test public interfaces. Mock at system boundaries only. If refactoring breaks tests, the tests were brittle. Good tests survive internal rewrites.

---

## 6. Names Are Your Documentation

`calculateMonthlyInterestRate` needs no comment. `calc` needs a paragraph. Naming is design—if you struggle to name something, the abstraction is wrong. Match existing naming conventions exactly.

---

## 7. Comments Explain Why, Never What

Code shows what happens. Comments explain why it's necessary—business rules, edge cases, workarounds. If a comment describes what code does, delete the comment and clarify the code instead.

---

## 8. Do One Thing Per Unit

Each function does one thing. Each class has one responsibility. Each commit solves one problem. If you need "and" to describe it, split it. Small units compose; large units calcify.

---

## 9. Return Early, Nest Never

Guard clauses at the top, happy path below. Deep nesting obscures logic. Flatten conditionals. Three levels of indentation is a smell; four is a rewrite.

---

## 10. Fail Fast and Loud

Validate at boundaries. Throw on invalid state. Never swallow exceptions silently. A stack trace today beats silent corruption discovered in production next quarter.

---

## 11. Parse, Don't Validate

Transform raw input into typed structures at system edges. A `EmailAddress` type cannot be invalid; a `string` might be anything. Push validation to construction; assume validity after.

---

## 12. Minimize State and Mutation

Immutable by default. When mutation is necessary, isolate it. Never mutate function arguments. Never mutate shared state without explicit synchronization. State is where bugs hide.

---

## 13. Explicit Over Clever

Boring code is good code. No magic, no tricks, no implicit behavior. If understanding requires framework expertise or language arcana, rewrite it plainly. Cleverness is debt.

---

## 14. Compose, Don't Inherit

Favor small objects that collaborate over deep inheritance trees. "Has-a" beats "is-a." Inheritance couples; composition liberates. When in doubt, don't extend—wrap.

---

## 15. Depend on Abstractions

Business logic shouldn't know about databases, HTTP, or file systems. Depend on interfaces. Inject implementations. This makes code testable, swappable, and understandable in isolation.

---

## 16. Make Illegal States Unrepresentable

Use types to prevent invalid states at compile time. If a user must be authenticated, require `AuthenticatedUser`—not `User | null` with scattered runtime checks.

---

## 17. DRY After Three

Duplication is tolerable twice. On the third occurrence, extract. Premature abstraction creates wrong abstractions. Wait for patterns to emerge before generalizing.

---

## 18. Delete Code Aggressively

Dead code is confusion. Commented-out code is clutter. Unused parameters, unreachable branches, vestigial functions—remove them. Version control remembers; the codebase shouldn't.

---

## 19. Stay in Scope

Solve the task at hand. Don't refactor adjacent code, don't add speculative features, don't "fix" things that aren't broken. Scope creep in AI agents compounds unpredictably.

---

## 20. Verify Before Claiming Done

Run the tests. Run the linter. Verify the feature works. Never mark a task complete based on assumptions. If you can't verify it, say so explicitly.

---

## 21. Ask When Uncertain

Ambiguity is dangerous. If requirements are unclear, specs are contradictory, or the right approach is uncertain—stop and ask. A clarifying question costs minutes; a wrong assumption costs hours.

---

*Complexity is the enemy. Simplicity is the goal. Every rule serves one purpose: ship code that works, reads clearly, and changes safely.*
