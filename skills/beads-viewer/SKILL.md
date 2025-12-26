---
name: beads-viewer
description: Graph-aware beads triage with `bv`. Triggers on "what to work on?", "blockers?", "dependencies?", "project status?". CRITICAL - always use --robot-* flags, never bare bv!
allowed-tools: "Bash(bv:*)"
---

# Beads Viewer

Graph-aware triage engine. **NEVER run bare `bv`** (blocks session). Always use `--robot-*` flags.

## Quick Start

```bash
bv --robot-triage  # THE MEGA-COMMAND - returns everything
```

Returns: `quick_ref`, `recommendations`, `quick_wins`, `blockers_to_clear`, `project_health`, `commands`

## Commands

| Command | Purpose |
|---------|---------|
| `--robot-triage` | Comprehensive triage (start here) |
| `--robot-next` | Single top pick only |
| `--robot-plan` | Dependency-respecting execution plan |
| `--robot-insights` | Full graph metrics (PageRank, cycles, critical path) |
| `--robot-alerts` | Stale issues, blocking cascades |
| `--robot-priority` | Priority misalignment detection |

## Filtering

```bash
bv --robot-plan --label backend           # scope to label
bv --recipe actionable --robot-triage     # only ready items
bv --robot-triage --robot-triage-by-track # group by work stream
```

## jq Patterns

```bash
bv --robot-triage | jq '.quick_ref'           # summary
bv --robot-triage | jq '.recommendations[0]'  # top pick
bv --robot-insights | jq '.Cycles'            # circular deps (MUST FIX!)
```

## Metrics

| Metric | Use |
|--------|-----|
| PageRank | Find foundational blockers |
| Betweenness | Find bottlenecks |
| Critical Path | Zero-slack keystones |
| Cycles | **Bugs - fix immediately!** |

## Workflow

1. `bv --robot-triage | jq '.quick_ref'` - overview
2. `bv --robot-triage | jq '.recommendations[0]'` - top pick
3. `bd update <id> --status in_progress --json` - claim work
