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
| btca | Query library/framework source code for context | [github.com/SebastiaanWouters/btca](https://github.com/SebastiaanWouters/btca) |
| bv | Beads viewer - view/manage bead task files | [github.com/Dicklesworthstone/beads_viewer](https://github.com/Dicklesworthstone/beads_viewer) |
| bd | Beads - atomic task format for AI agents | [github.com/steveyegge/beads](https://github.com/steveyegge/beads) |

## Usage

Place `.agents` folder in your project root. AI assistants will read `AGENTS.md` for guidelines and load skills as needed.
