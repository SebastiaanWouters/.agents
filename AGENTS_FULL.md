## AGENT GUIDELINES

### general
- be critical, question assumptions, push back when wrong
- prefer being concise over excessive grammar for interactions / plans; follow DRY and KISS principles; write self-explaining code
- tests required; search existing patterns first
- check pkg manager for commands/versions; consult docs for correct version
- list unresolved questions; never manage dev servers
- clean up temp files/unused code; keep docs updated
- Result<T,E> over try/catch; treat warnings as errors
- no markdown summaries unless asked; confirm before destructive cmds

### git
- conventional commits; no agent mentions; no push unless asked

### typescript
- no `any` casts; no explicit return types

### scripts/tasks
- multi-step tasks: ts scripts via bun in tmp/
- long tasks: background + tmux; add timeouts

### processes
- use killport to kill running processes on a port.

---

## BEADS

### bd create
```bash
bd create "title" [flags] --json  # always --json
```
Flags: `-t` type (bug/feature/task/epic/chore), `-p` priority (0-4: critical/high/medium/low/backlog), `-d` desc, `--parent id`, `--deps blocks:id|discovered-from:id|related:id`, `-l` labels, `-a` assignee, `--acceptance` criteria

```bash
bd create "Fix auth bug" -t bug -p 1 --json
bd create "Add OAuth" -d "Implement OAuth2" -t feature -p 1 --json
bd create "Found SQL injection" -t bug -p 0 --deps discovered-from:bd-123 --json
```

### bd manage
```bash
bd close <id> [-r "reason"]           # close issue
bd close <id> --suggest-next          # close + show unblocked issues
bd reopen <id> [-r "reason"]          # reopen closed issue
bd update <id> -s in_progress         # set status (open/in_progress/closed)
bd delete <id>                        # delete issue and clean refs
bd show <id>                          # view issue details
bd list [--label] [--assignee] [-s status]  # list issues
bd search <query>                     # text search
bd graph                              # show dependency graph
```

### bd dependencies
```bash
bd dep add <id> <depends-on-id> [-t type]  # add dependency (type: blocks/related/parent-child/discovered-from)
bd dep remove <id> <depends-on-id>         # remove dependency
bd dep tree <id>                           # show dependency tree
bd dep cycles                              # detect cycles in graph
bd duplicate <id> --of <canonical>         # mark as duplicate of another issue
bd relate <id1> <id2>                      # create bidirectional "see also" link
bd unrelate <id1> <id2>                    # remove "see also" link
```

### bv (viewer) - CRITICAL: NEVER bare bv (blocks session)!
Always use `--robot-*` flags:

**Core triage**:
```bash
bv --robot-triage              # comprehensive triage (start here)
bv --robot-next                # single top recommendation
bv --robot-plan                # dependency-respecting exec plan
bv --robot-insights            # full graph metrics & cycles
bv --robot-alerts              # stale issues & blocking cascades
bv --robot-priority            # priority misalignment
bv --robot-suggest             # duplicates, deps, labels, cycles
bv --robot-capacity            # capacity simulation & projection
bv --robot-forecast <id|all>   # ETA prediction
bv --robot-graph               # dependency graph (JSON/DOT/Mermaid)
bv --robot-file-hotspots       # files touched by most beads
bv --robot-file-beads <path>   # beads that touched file
bv --robot-blocker-chain <id>  # full blocker chain
```

Cycles in `--robot-insights` = bugs, fix immediately!

---

## BTCA
```bash
btca ask -t <tech> -q "question"      # query library source
btca ask -t <tech> -q "q" --no-sync   # skip update (faster)
btca config repos list                 # available repos
btca config repos add -n name -u url   # add repo
```
Use proactively for unfamiliar libs, version-specific details, verifying 3rd party library/tooling usage.

---

## AMICII (am)

Multi-agent coordination via messaging and file reservations. **Check server first**:
```bash
am status --json  # if running: false, skip all am commands
```

### When to use
- Starting/updating/closing beads - announce to other agents & check availability/status
- Before editing files - reserve to signal intent
- Periodically check inbox for messages from other agents

### Setup (once per project)
```bash
am agent register --program <editor> --model <model>  # e.g. --program opencode --model claude
```

### Bead workflow
```bash
# Starting a bead
am reserve "src/**" --reason <bead-id>
am send --to all --subject "[<bead-id>] Starting" --body "<desc>" --thread <bead-id>

# During work
am inbox --unread --json          # check for messages
am ack <id>                       # acknowledge if requested

# Completing a bead
am release --all
am send --to all --subject "[<bead-id>] Done" --thread <bead-id>
```

### Quick reference
```bash
am send --to <agent|all> --subject <text> [--body <text>] [--thread <id>] [--urgent]
am inbox [--unread] [--json]
am read <id> --json
am ack <id>
am reserve <pattern> --reason <id> [--ttl <sec>]
am release [--all]
am reservations [--active] [--json]
am search <query> --json
```

Notes:
- File reservations are advisory (signal intent, not enforced)
- Use bead ID as `--reason` and `--thread` for traceability
- Default reservation TTL: 1 hour
