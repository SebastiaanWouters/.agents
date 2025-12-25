# .agents

Agent guidelines and skills for AI coding assistants.

## Structure

```
.agents/
├── AGENTS.md          # core guidelines
└── skills/            # specialized skills
    ├── backend-review/   # review backend changes
    ├── btca/             # query library/framework docs
    ├── commit/           # intelligent git commits
    ├── decompose/        # break specs into task beads
    ├── dev-browser/      # browser automation
    ├── frontend-design/  # build distinctive UIs
    └── ui-review/        # review frontend changes
```

## Dependencies

| Tool | Description | Repository |
|------|-------------|------------|
| bun | JavaScript runtime and package manager | [bun.sh](https://bun.sh) |
| chromium | Browser for dev-browser automation | `apt install chromium-browser` |
| btca | Query library/framework source code for context | [github.com/davis7dotsh/better-context](https://github.com/davis7dotsh/better-context) |
| bv | Beads viewer - view/manage bead task files | [github.com/Dicklesworthstone/beads_viewer](https://github.com/Dicklesworthstone/beads_viewer) |
| bd | Beads - atomic task format for AI agents | [github.com/steveyegge/beads](https://github.com/steveyegge/beads) |
| tmux | Terminal multiplexer for background tasks | [github.com/tmux/tmux](https://github.com/tmux/tmux) |

## Usage

Copy skills to your agent's skills directory (e.g. `.opencode/skills/`, `.claude/skills/`). Copy `AGENTS.md` to project root or merge with existing instructions.
