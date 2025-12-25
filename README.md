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
| bv | TBD | [github.com/SebastiaanWouters/bv](https://github.com/SebastiaanWouters/bv) |
| bd | TBD | [github.com/SebastiaanWouters/bd](https://github.com/SebastiaanWouters/bd) |

## Usage

Place `.agents` folder in your project root. AI assistants will read `AGENTS.md` for guidelines and load skills as needed.
