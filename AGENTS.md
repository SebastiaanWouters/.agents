## AGENT GUIDELINES

### general
- always question, challenge, flag issues, don’t assume user is correct
- keep all output, plans, and commits ultra-concise; skip filler grammar
- strictly DRY and KISS; eliminate repetition and complexity
- code must be self-explaining, minimal comments only if essential
- test all new/modified code
- search for similar patterns before adding anything new
- check package manager for available commands and dependency versions; always consult docs for correct usage
- unresolved questions? always list at the end of any plan
- never manage/dev servers; assume externally managed
- delete temporary / ephermal files, unused code/configs on finish
- always update docs on change
- always use latest stable tools/libs
- use Result<T, E> not try/catch for errors
- never write markdown summaries unless asked
- destructive commands (rm -rf, drop db, etc.) only with explicit confirmation
- treat warnings as errors, never ignore
- never cut corners; always persist

### git
- use conventional commits; never mention agent in message
- never push unless user requests

### typescript
- do not cast to any
- do not add explicit return types to functions.

