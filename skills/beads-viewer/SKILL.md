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

## Core Commands

| Command | Purpose |
|---------|---------|
| `--robot-triage` | Comprehensive triage (start here) |
| `--robot-next` | Single top pick recommendation |
| `--robot-plan` | Dependency-respecting execution plan |
| `--robot-insights` | Full graph metrics (PageRank, cycles, critical path) |
| `--robot-alerts` | Stale issues, blocking cascades |
| `--robot-priority` | Priority misalignment detection |
| `--robot-suggest` | Duplicates, deps, labels, cycles |
| `--robot-capacity` | Capacity simulation & completion projection |
| `--robot-forecast` | ETA prediction for bead(s) |
| `--robot-graph` | Dependency graph (JSON/DOT/Mermaid) |

## File Analysis

```bash
bv --robot-file-hotspots                    # files touched by most beads
bv --robot-file-beads <file-path>           # beads that touched file
bv --robot-file-relations <file-path>       # files that co-change with file
bv --robot-impact <comma-sep-paths>         # impact of modifying files
bv --robot-blocker-chain <bead-id>          # full blocker chain
bv --robot-causality <bead-id>              # causal chain analysis
```

## Filtering & Scoping

```bash
bv --robot-plan --label backend             # scope to label
bv --recipe actionable --robot-triage       # only ready items
bv --robot-triage --robot-triage-by-track   # group by work stream
bv --robot-triage --robot-triage-by-label   # group by label
bv --robot-by-assignee "name"               # filter by assignee
bv --robot-by-label "urgent"                # filter by label
```

## jq Patterns

```bash
bv --robot-triage | jq '.quick_ref'           # summary
bv --robot-triage | jq '.recommendations[0]'  # top pick
bv --robot-insights | jq '.Cycles'            # circular deps (MUST FIX!)
bv --robot-forecast all | jq '.forecasts'     # all ETAs
bv --robot-suggest | jq '.duplicates'         # duplicate issues
```

## Metrics

| Metric | Use |
|--------|-----|
| PageRank | Find foundational blockers |
| Betweenness | Find bottlenecks |
| Critical Path | Zero-slack keystones |
| Cycles | **Bugs - fix immediately!** |

## Recipes

```bash
bv --recipe actionable --robot-triage      # ready-to-work items
bv --recipe triage --robot-triage          # standard workflow
bv --recipe high-impact --robot-triage     # high-value work
bv --robot-recipes                         # list all recipes
```

## Standard Workflow

1. `bv --robot-triage | jq '.quick_ref'` - overview
2. `bv --robot-triage | jq '.recommendations[0]'` - top pick
3. `bd update <id> -s in_progress --json` - claim work
4. `bv --robot-insights | jq '.Cycles'` - fix cycles if found
