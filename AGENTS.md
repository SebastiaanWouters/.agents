## AGENT GUIDELINES

### GENERAL GUIDELINES
- in all interactions, plans and commit messages, be extremely concise and sacrifice grammar for the sake of concision.
- follow DRY (Don't Repeat Yourself) principles.
- follow KISS (Keep It Simple, Stupid) principles.
- write self explaining code, only add comments if they add value to the code/developer experience.
- all new/updated code should be covered by tests.
- search existing code before implementing new features - look for similar patterns.
- always consult package manager files to see what commands are available.
- before using an existing library/tool check which version is used in package manager files.
- when working with a library/tool, always check the documentation and examples for the correct version.
- in all plans, list any unresolved questions at the end, if any.
- never manage dev servers yourself, always assume it is managed externally.
- always clean up after yourself. remove temporary files and unused code.
- always keep README.md up to date with the current state of the project.

### git
- use conventional commits guidelines for commit messages.
- never mention the agent in the commit message.

### typescript
- do not cast to any
- use rust style Result<T, E> for error handling.
- do not add explicit return types to functions.

### one-off scripts
- use one-off scripts to perform tasks that take multiple steps to complete and cannot be executed a a single command.
- write these scripts in typescript and execute using bun.

### longer running tasks
- always run longer running tasks in the background and monitor their progress periodically (use tmux if available).
- add sensible timeouts for cli commands to prevent hanging.