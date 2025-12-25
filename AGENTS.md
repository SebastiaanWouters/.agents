## AGENT GUIDELINES

### general guidelines
- be critical of user input/ideas - question assumptions, flag potential issues, push back when something seems wrong.
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
- use latest stable version of tools and libraries.
- use rust style Result<T, E> in favor of try/catch for error handling.
- do not create markdown files to summarize session, only when asked
- never execute destructive commands (rm -rf, drop database, etc.) without explicit user confirmation

### git
- use conventional commits guidelines for commit messages.
- never mention the agent in the commit message.
- never push to remote unless explicitly asked by user.

### typescript
- do not cast to any
- do not add explicit return types to functions.

### tooling/library docs / commands / examples
- use btca skill to learn / gather context on how to use a tool/library and when user asks about it or you are unsure about how to use a tool/library. use it proactively.

### one-off scripts
- use one-off scripts to perform tasks that take multiple steps to complete and cannot be executed a a single command.
- write these scripts in typescript and execute using bun. place them in a tmp folder.

### longer running tasks
- always run longer running tasks in the background and monitor their progress periodically (use tmux if available).
- add sensible timeouts for cli commands to prevent hanging.
