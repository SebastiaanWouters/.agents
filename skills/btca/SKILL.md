---
name: btca
description: Learn about, gather context on, and ask questions about libraries, frameworks, or codebases using the btca CLI. Use this proactively to understand unfamiliar technologies, verify documentation, or add new repositories for deeper context.
---

# btca (Better Context App) Skill

The `btca` CLI is a powerful tool for gathering high-quality technical information by analyzing the actual source code or documentation repositories of libraries and frameworks. It clones repositories locally and uses AI to answer questions based on the real code.

## Trigger Scenarios
- **Unfamiliar Tech**: You encounter a library, framework, or API you aren't familiar with.
- **Deep Implementation Details**: You need to know *how* something is implemented or used in a specific version (e.g., "How do I use the new snippets in Svelte 5?").
- **Verification**: You want to verify if a suggested solution aligns with the actual library implementation.
- **Context Expansion**: You realize a repository is missing from your local context and want to add it to improve your knowledge base.

## Usage Guidelines

### 1. Asking Questions (`btca ask`)
Use this to get immediate answers about a technology.
- **Command**: `btca ask -t <tech> -q "<your question>"`
- **Tip**: Use `-t` (tech name) exactly as it appears in `btca config repos list`.
- **Syncing**: By default, it might try to sync/clone. Use `--no-sync` if you know the repo is already up to date and you want a faster response.

### 2. Managing Repositories
If a technology is missing, you MUST add it.
- **List existing**: `btca config repos list`
- **Add new repo**: `btca config repos add -n <name> -u <url> [-b <branch>] [--notes <notes>]`
- **Example**: `btca config repos add -n react -u https://github.com/facebook/react`

### 3. Interactive Chat & Server Mode
- **Interactive TUI**: `btca chat -t <tech>` allows for exploratory chat.
- **Server Mode**: `btca serve -p 8080` runs a server that accepts POST requests at `/question`.
- **OpenCode Instance**: `btca open` keeps an instance running.

### 4. Configuration
`btca` stores its configuration at `~/.config/btca/btca.json`. 
- **Repos**: Managed via `btca config repos`.
- **Model/Provider**: Managed via `btca config model --provider <provider> --model <model>`.

## Best Practices
- **Be Proactive**: If you find yourself guessing about a library's behavior, use `btca ask` immediately.
- **Specific Questions**: Instead of "How does X work?", ask "What is the internal implementation of Y in X?".
- **Maintain Context**: If the project uses a niche library, add its repository to `btca` using `btca config repos add` so you can reference it throughout the session.
- **No-Sync for Speed**: For quick follow-up questions, use `--no-sync` to avoid the overhead of checking for repository updates.

## Reference Commands
- `btca ask -t <tech> -q "<question>"`: Get an answer based on the repo.
- `btca config repos add -n <name> -u <url> [-b <branch>] [--notes <notes>]`: Add a repository.
- `btca config repos list`: See what's available.
- `btca chat -t <tech>`: Start an interactive chat session.
- `btca --help`: Explore more advanced options.
