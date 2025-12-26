# .agents

Agent guidelines and skills for AI coding assistants.

## Structure

```
.agents/
├── AGENTS.md          # core guidelines
├── commands/          # custom slash commands
│   ├── qa.md             # run project QA tools
│   └── review.md         # trigger code review manually
└── skills/            # specialized skills
    ├── beads-create/     # create bead task files
    ├── beads-viewer/     # view/manage bead files
    ├── btca/             # query library/framework docs
    ├── commit/           # intelligent git commits
    ├── decompose/        # break specs into task beads
    ├── dev-browser/      # browser automation
    ├── frontend-design/  # build distinctive UIs
    ├── plan/             # create detailed technical plans
    ├── review/           # intelligent code review (auto-triggers)
    └── setup/            # initialize new projects
```

## Skills

| Skill | Trigger | Description |
|-------|---------|-------------|
| review | auto | Intelligent code review - runs QA tools, applies frontend/backend checklists based on changeset |
| plan | manual | Create detailed technical plans for features/changes |
| commit | manual | Generate conventional commit messages |
| frontend-design | manual | Build distinctive, production-grade UIs |
| setup | manual | Initialize new projects with proper structure |
| decompose | manual | Break specs into atomic task beads |
| btca | manual | Query library/framework source for context |
| dev-browser | manual | Browser automation via Playwright |

## Commands

| Command | Description |
|---------|-------------|
| /qa | Run project QA tools (lint, typecheck, test) |
| /review | Trigger intelligent code review manually |

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

- Copy skills to your agent's skills directory (e.g. `.opencode/skills/`, `.claude/skills/`)
- Copy commands to your agent's commands directory (e.g. `.opencode/commands/`, `.claude/commands/`)
- Copy `AGENTS.md` to project root or merge with existing instructions
