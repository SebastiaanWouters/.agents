# .agents

Agent guidelines and skills for AI coding assistants.

## Structure

```
.agents/
├── AGENTS.md          # core guidelines
└── skills/            # specialized skills
    ├── beads-create/     # create bead task files
    ├── beads-viewer/     # view/manage bead files
    ├── btca/             # query library/framework docs
    ├── commit/           # intelligent git commits
    ├── decompose/        # break specs into task beads
    ├── dev-browser/      # browser automation
    ├── frontend-design/  # build distinctive UIs
    ├── plan/             # create detailed technical plans
    ├── review/           # code review with QA (auto-triggers)
    └── setup/            # initialize projects (language-agnostic)
```

## Skills

| Skill | Trigger | Description |
|-------|---------|-------------|
| review | auto | Code review with QA - runs project tools, applies frontend/backend checklists |
| plan | manual | Create detailed technical plans for features/changes |
| commit | manual | Generate conventional commit messages |
| frontend-design | manual | Build distinctive, production-grade UIs |
| setup | manual | Initialize projects (language-agnostic) |
| decompose | manual | Break specs into atomic task beads |
| btca | manual | Query library/framework source for context |
| dev-browser | manual | Browser automation via Playwright |

## Dependencies

| Tool | Description | Repository |
|------|-------------|------------|
| bun | JavaScript runtime and package manager | [bun.sh](https://bun.sh) |
| chromium | Browser for dev-browser automation | `apt install chromium-browser` |
| btca | Query library/framework source code for context | [github.com/davis7dotsh/better-context](https://github.com/davis7dotsh/better-context) |
| bv | Beads viewer - view/manage bead task files | [github.com/Dicklesworthstone/beads_viewer](https://github.com/Dicklesworthstone/beads_viewer) |
| bd | Beads - atomic task format for AI agents | [github.com/steveyegge/beads](https://github.com/steveyegge/beads) |
| am | Amicii - agent coordination server & CLI | [github.com/SebastiaanWouters/amicii](https://github.com/SebastiaanWouters/amicii) |
| tmux | Terminal multiplexer for background tasks | [github.com/tmux/tmux](https://github.com/tmux/tmux) |

## Usage

- Copy skills to your agent's skills directory (e.g. `.opencode/skills/`, `.claude/skills/`)
- Copy `AGENTS.md` to project root or merge with existing instructions
