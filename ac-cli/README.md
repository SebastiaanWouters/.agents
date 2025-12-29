# ac - Agent Copy CLI

Copy AGENTS.md and skills to Claude, Codex, Amp, and OpenCode projects with ease.

## Features

- **Multi-platform support**: Copy to Claude, Codex, Amp, and OpenCode
- **Interactive mode**: Easy selection of platforms, skills, and merge strategies
- **Smart merging**: Intelligently handle existing files with merge/overwrite/skip options
- **Dry run mode**: Preview changes before executing
- **User and project-level**: Copy to both user-level (`~/.claude/skills/`) and project-level directories

## Installation

### One-liner (recommended)

```bash
curl -fsSL https://github.com/sebastiaanwouters/.agents/releases/latest/download/install.sh | bun run
```

### From cloned repository

```bash
git clone https://github.com/sebastiaanwouters/.agents.git
cd .agents/ac-cli
chmod +x install.sh
./install.sh
```

### Requirements

- bun (install with `curl -fsSL https://bun.sh/install | bash`)
- bash
- curl or wget
- Linux or macOS (no Windows support yet)

### Updating

To update to the latest version, simply rerun the installation script:

```bash
curl -fsSL https://github.com/sebastiaanwouters/.agents/releases/latest/download/install.sh | bun run
```

**Note**: Your custom skills in `~/.ac` will be preserved during updates. Rerun `ac init` if you want to reset to default skills.

## Usage

### Initialize Default Skills

```bash
ac init
```

This copies default skills and AGENTS.md to `~/.ac`, which is used as the default source for copy operations.

Run this after installation to set up your default agent configuration.

### Interactive Mode (Default)

```bash
ac
```

This will guide you through:
1. Detecting your `.agents/` directory
2. Selecting platforms to copy to
3. Choosing which components to copy (AGENTS.md, skills, subagents)
4. Selecting specific skills
5. Choosing merge strategy for existing files
6. Preview and confirm

### Direct Copy to Specific Platform

```bash
# Copy to Claude
ac copy claude

# Copy to multiple platforms
ac copy claude opencode amp

# Copy to custom target directory
ac copy claude --target /path/to/project
```

### Copy Specific Components

```bash
# Copy only AGENTS.md
ac copy claude --agents-only

# Copy only skills
ac copy claude --skills-only

# Copy specific skill(s)
ac copy claude --skill plan --skill review

# Copy only subagents
ac copy claude --subagents-only
```

### Source and Target Directories

```bash
# Specify source directory
ac copy claude --source /path/to/.agents

# Specify target directory
ac copy claude --target /path/to/project
```

### Merge Strategies

```bash
# Ask for each file (default)
ac copy claude --merge ask

# Merge content
ac copy claude --merge merge

# Overwrite existing files
ac copy claude --merge overwrite

# Skip existing files
ac copy claude --merge skip
```

### User-Level Installation

```bash
# Copy to user-level directory (e.g., ~/.claude/skills/)
ac copy claude --user-level
```

### Dry Run

```bash
# Preview changes without executing
ac copy claude --dry-run
```

### Skip Confirmation

```bash
# Copy without confirmation prompts
ac copy claude -y
```

## Other Commands

### List Available Platforms

```bash
ac list
```

Shows:
- Available platforms and their capabilities
- Detected `.agents/` directory
- Available components (AGENTS.md, skills, subagents)

### Validate Platform Setup

```bash
ac validate claude
```

Checks:
- Platform configuration files exist
- Skills have proper YAML frontmatter
- Missing or invalid files

## Platform Conventions

| Platform | Config File | Skills Directory | Subagents |
|----------|-------------|-----------------|------------|
| **Claude** | `CLAUDE.md` | `.claude/skills/<name>/SKILL.md` | `.claude/agents/<name>.md` |
| **Codex** | `AGENTS.md` | `~/.codex/skills/` | N/A |
| **Amp** | `AGENTS.md` | `.agents/skills/<name>/SKILL.md` | N/A |
| **OpenCode** | `AGENTS.md` | `.opencode/skill/<name>/` | N/A |

## Project Structure

Your `.agents/` directory should follow this structure:

```
.agents/
├── AGENTS.md              # Main agents file (copied as AGENTS.md or CLAUDE.md)
├── AGENTS-FULL.md         # Optional full agents file
├── skills/                 # Skills directory
│   ├── plan/
│   │   └── SKILL.md
│   ├── review/
│   │   └── SKILL.md
│   └── ...
└── subagents/              # Subagents (Claude only)
    ├── code-reviewer.md
    └── ...
```

## Skill Format

Skills should include YAML frontmatter with `name` and `description`:

```markdown
---
name: my-skill
description: A description of what this skill does and when to use it
---

# My Skill

Instructions for the agent...
```

## Examples

```bash
# Copy all skills to Claude with interactive prompts
ac copy claude

# Copy AGENTS.md and specific skills to multiple platforms
ac copy claude opencode amp --skill plan --skill review

# Copy to user-level Claude directory, merging existing skills
ac copy claude --user-level --merge merge -y

# Preview what would be copied to Amp
ac copy amp --dry-run

# Copy only subagents to Claude project
ac copy claude --subagents-only --target ./my-project

# Validate Claude setup in current directory
ac validate claude
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT
