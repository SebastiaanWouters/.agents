---
name: beads-viewer
description: >
  Understand and plan beads work using the bv graph-aware triage engine. Use when user asks
  "what should I work on?", "what's blocking progress?", "show me dependencies", "what's the plan?",
  "what are the blockers?", or needs to understand project status. CRITICAL: Always use --robot-*
  flags, never bare bv!
allowed-tools: "Bash(bv:*)"
version: "1.0.0"
author: "Steve Yegge <https://github.com/steveyegge>"
license: "MIT"
---

# Beads Viewer - Graph-Aware Triage Engine

`bv` is a graph-aware triage engine for Beads projects. It provides deterministic, dependency-aware analysis with precomputed metrics (PageRank, betweenness, critical path, cycles).

## CRITICAL WARNING

**NEVER run bare `bv`!** It launches an interactive TUI that blocks your session.

**ALWAYS use `--robot-*` flags** for JSON output that can be parsed programmatically.

```bash
# WRONG - blocks session!
bv

# CORRECT - returns JSON
bv --robot-triage
```

## Quick Start

**Start every session with `--robot-triage`** - it's the mega-command that returns everything:

```bash
bv --robot-triage
```

Returns:
- `quick_ref`: at-a-glance counts + top 3 picks
- `recommendations`: ranked actionable items with scores, reasons, unblock info
- `quick_wins`: low-effort high-impact items
- `blockers_to_clear`: items that unblock the most downstream work
- `project_health`: status/type/priority distributions, graph metrics
- `commands`: copy-paste shell commands for next steps

## Command Reference

### Triage & Work Selection

| Command | Purpose | Returns |
|---------|---------|---------|
| `bv --robot-triage` | **THE MEGA-COMMAND** - comprehensive triage | Everything you need to start |
| `bv --robot-next` | Single top pick only | Minimal: just one recommendation + claim command |

### Planning

| Command | Purpose | Returns |
|---------|---------|---------|
| `bv --robot-plan` | Dependency-respecting execution plan | Parallel tracks with `unblocks` lists |
| `bv --robot-priority` | Priority recommendations | Misalignment detection with confidence scores |

### Graph Analysis

| Command | Purpose | Returns |
|---------|---------|---------|
| `bv --robot-insights` | Full graph metrics | PageRank, betweenness, HITS, eigenvector, critical path, cycles, k-core |
| `bv --robot-label-health` | Per-label health | `health_level` (healthy/warning/critical), velocity, staleness |
| `bv --robot-label-flow` | Cross-label dependencies | Flow matrix, bottleneck labels |
| `bv --robot-label-attention` | Attention-ranked labels | Combines pagerank, staleness, block impact |

### Hygiene & Alerts

| Command | Purpose | Returns |
|---------|---------|---------|
| `bv --robot-alerts` | Issues needing attention | Stale issues, blocking cascades, priority mismatches |
| `bv --robot-suggest` | Hygiene suggestions | Duplicates, missing deps, cycle breaks, label suggestions |

### History & Changes

| Command | Purpose | Returns |
|---------|---------|---------|
| `bv --robot-history` | Bead-to-commit correlations | Stats, per-bead events/commits/milestones |
| `bv --robot-diff --diff-since <ref>` | Changes since git ref | New/closed/modified issues, cycles introduced/resolved |

### Other Commands

| Command | Purpose |
|---------|---------|
| `bv --robot-burndown <sprint>` | Sprint burndown, scope changes, at-risk items |
| `bv --robot-forecast <id\|all>` | ETA predictions with dependency-aware scheduling |
| `bv --robot-graph` | Dependency graph export (JSON, DOT, or Mermaid) |

## Understanding Output

All robot JSON includes:
- `data_hash`: Fingerprint of source beads.jsonl (verify consistency)
- `status`: Per-metric state with timing

### Two-Phase Analysis

- **Phase 1 (instant)**: degree, topo sort, density - always available immediately
- **Phase 2 (async, 500ms timeout)**: PageRank, betweenness, HITS, eigenvector, cycles

Check `status` field for metric state: `computed|approx|timeout|skipped`

### Large Graphs (>500 nodes)

Some metrics may be approximated or skipped. Always check `status` before using metrics.

## Scoping & Filtering

```bash
# Scope to a label's subgraph
bv --robot-plan --label backend

# Historical point-in-time analysis
bv --robot-insights --as-of HEAD~30

# Pre-filter with recipes
bv --recipe actionable --robot-plan        # Only ready (no blockers)
bv --recipe high-impact --robot-triage     # Top PageRank scores

# Group recommendations by work stream
bv --robot-triage --robot-triage-by-track

# Group by domain
bv --robot-triage --robot-triage-by-label

# Filter by confidence/results
bv --robot-plan --robot-min-confidence 0.6
bv --robot-plan --robot-max-results 5
bv --robot-plan --robot-by-assignee alice
```

## jq Quick Reference

```bash
# At-a-glance summary
bv --robot-triage | jq '.quick_ref'

# Top recommendation
bv --robot-triage | jq '.recommendations[0]'

# Check metric readiness
bv --robot-insights | jq '.status'

# Find circular dependencies (MUST FIX!)
bv --robot-insights | jq '.Cycles'

# Best unblock target
bv --robot-plan | jq '.plan.summary.highest_impact'

# Critical labels needing attention
bv --robot-label-health | jq '.results.labels[] | select(.health_level == "critical")'
```

## Common Workflows

### Starting a Session

```bash
# 1. Get comprehensive triage
bv --robot-triage | jq '.quick_ref'

# 2. See top recommendation
bv --robot-triage | jq '.recommendations[0]'

# 3. Claim the work (command provided in output)
bd update <id> --status in_progress --json
```

### Understanding What's Blocked

```bash
# Get blockers to clear (unblocks most downstream work)
bv --robot-triage | jq '.blockers_to_clear'

# Or use the full plan
bv --robot-plan | jq '.plan.recommendations'
```

### Detecting Cycles

Circular dependencies are bugs that must be fixed:

```bash
bv --robot-insights | jq '.Cycles'
```

If cycles exist, use `bd dep remove` to break them.

### Finding Quick Wins

Low-effort, high-impact items:

```bash
bv --robot-triage | jq '.quick_wins'
```

### Sprint Planning

```bash
# Get dependency-respecting plan
bv --robot-plan

# Check for priority misalignments
bv --robot-priority

# Sprint burndown (if using sprints)
bv --robot-burndown sprint-42
```

### Health Check

```bash
# Overall project health
bv --robot-triage | jq '.project_health'

# Per-label health
bv --robot-label-health

# Alerts for attention
bv --robot-alerts
```

## Graph Metrics Explained

| Metric | What It Measures | Use For |
|--------|-----------------|---------|
| **PageRank** | Recursive importance via dependencies | Finding foundational blockers |
| **Betweenness** | Bottleneck detection | Finding bridges between clusters |
| **HITS** | Hub/Authority scores | Distinguishing epics from utilities |
| **Critical Path** | Longest dependency chain | Finding keystones with zero slack |
| **Eigenvector** | Influence via neighbors | Strategic dependencies |
| **Cycles** | Circular dependencies | **Bugs that must be fixed!** |
| **K-Core** | Densely connected subgraphs | Finding tightly coupled work |

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| No `.beads/` found | Not in a beads project | Navigate to beads project directory |
| Empty recommendations | All work blocked or closed | Check `bv --robot-insights` for cycles |
| Metrics timeout | Large graph (>500 nodes) | Use scoping flags to filter |

## Best Practices

1. **Start with `--robot-triage`** - it's the entry point for understanding any project
2. **Check `status` for metrics** - ensure they computed before relying on them
3. **Fix cycles immediately** - circular dependencies break the entire system
4. **Use `--label` scoping** - focus analysis on relevant subgraphs
5. **Prefer `--robot-plan` for speed** - faster than full `--robot-insights`

## Performance Notes

- Phase 1 metrics: <10ms
- Phase 2 metrics: <100ms for typical projects
- Betweenness: O(V*E) - can be slow for large graphs (~10ms to 4.6s)
- Results cached by data hash

For diagnostics: `bv --profile-startup`
