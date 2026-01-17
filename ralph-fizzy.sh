#!/bin/bash
set -e

# Ralph-Fizzy: Autonomous Fizzy card worker
# Processes cards until all work is complete
# Usage: ./ralph-fizzy.sh [--claude] [max_iterations]
#
# Board is read from:
#   1. .fizzy.yaml in current directory (board: <id>)
#   2. ~/.config/fizzy/config.yaml (board: <id>)

USE_CLAUDE=false
MAX_ITERATIONS=10

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --claude)
      USE_CLAUDE=true
      shift
      ;;
    *)
      MAX_ITERATIONS=$1
      shift
      ;;
  esac
done

# Get board ID from config
get_board_id() {
  local board_id=""
  
  # 1. Check local .fizzy.yaml
  if [ -f ".fizzy.yaml" ]; then
    board_id=$(grep -E "^board:" .fizzy.yaml 2>/dev/null | sed 's/board:[[:space:]]*//' | tr -d '"' | tr -d "'" || true)
  fi
  
  # 2. Fall back to global config
  if [ -z "$board_id" ] && [ -f "$HOME/.config/fizzy/config.yaml" ]; then
    board_id=$(grep -E "^board:" "$HOME/.config/fizzy/config.yaml" 2>/dev/null | sed 's/board:[[:space:]]*//' | tr -d '"' | tr -d "'" || true)
  fi
  
  echo "$board_id"
}

BOARD_ID=$(get_board_id)

if [ -z "$BOARD_ID" ]; then
  echo "Error: No board configured"
  echo "Set board in .fizzy.yaml or ~/.config/fizzy/config.yaml:"
  echo "  board: your-board-id"
  echo ""
  echo "Find your board ID with: fizzy board list | jq '.data[] | {id, name}'"
  exit 1
fi

echo "Using board: $BOARD_ID"

get_ready_count() {
  # Cards in 'maybe' column are ready to work (not blocked)
  local count
  count=$(fizzy card list --board "$BOARD_ID" --all --column maybe 2>/dev/null | jq '.data | length' || echo "0")
  echo "${count:-0}"
}

get_blocked_count() {
  # Cards in 'not-now' column are blocked
  local count
  count=$(fizzy card list --board "$BOARD_ID" --all --column not-now 2>/dev/null | jq '.data | length' || echo "0")
  echo "${count:-0}"
}

run_agent() {
  local prompt="$1"
  if [ "$USE_CLAUDE" = true ]; then
    claude --dangerously-skip-permissions -p "$prompt"
  else
    echo "$prompt" | amp --dangerously-allow-all
  fi
}

iteration=0
while [ "$iteration" -lt "$MAX_ITERATIONS" ]; do
  ready_count=$(get_ready_count)
  blocked_count=$(get_blocked_count)
  
  if [ "$ready_count" -eq 0 ]; then
    if [ "$blocked_count" -gt 0 ]; then
      echo "No ready cards, but $blocked_count blocked. Check dependencies."
    fi
    echo "No cards ready to work. Exiting."
    exit 0
  fi

  iteration=$((iteration + 1))
  echo "=========================================="
  echo "Iteration $iteration of $MAX_ITERATIONS"
  echo "Ready: $ready_count | Blocked: $blocked_count"
  echo "=========================================="
  
  prompt="@AGENTS.md @knowledge.md

## Your Task: Work on ONE Fizzy card

### 1. Find Ready Cards
\`\`\`bash
fizzy card list --board $BOARD_ID --column maybe | jq '.data[] | {number, title}'
\`\`\`
Pick the first card (lowest number = highest priority).

### 2. Claim the Card
\`\`\`bash
fizzy card column CARD_NUMBER --column 'working on'
\`\`\`

### 3. Read Card Details
\`\`\`bash
fizzy card show CARD_NUMBER | jq '{title: .data.title, description: .data.description, steps: .data.steps}'
\`\`\`
The description contains: Scope, Files, Patterns, Dependencies.
Steps are acceptance criteria—all must pass.

### 4. Check Dependencies
Look for \`blocked-by:N\` tags. If any blocking card is not done:
\`\`\`bash
fizzy card column CARD_NUMBER --column not-now
\`\`\`
Then pick another card.

### 5. Implement
Follow the description. Check each acceptance criterion (step).

### 6. Verify - MANDATORY
**You MUST run ALL verification commands before proceeding. Do not skip any.**

a) **Find verification commands** - Check these sources in order:
   - AGENTS.md (look for Commands section)
   - package.json scripts (test, lint, typecheck, build)
   - Makefile targets (test, lint, check)
   - pyproject.toml / setup.py (for Python)
   - Cargo.toml (for Rust)

b) **Run ALL of these that exist:**
   \`\`\`bash
   # TypeScript/JavaScript
   pnpm run typecheck || npm run typecheck || yarn typecheck
   pnpm run lint || npm run lint || yarn lint
   pnpm run test || npm run test || yarn test
   pnpm run build || npm run build || yarn build
   
   # Or for other languages, equivalent commands from AGENTS.md
   \`\`\`

c) **Fix any failures** before proceeding. Do not continue if:
   - Type errors exist
   - Lint errors exist
   - Tests fail
   - Build fails

d) **Run format check if available:**
   \`\`\`bash
   pnpm run format:check || npm run format:check || true
   \`\`\`

### 7. Update Knowledge
Load the **knowledge** skill. Update knowledge.md with any discoveries:
- Commands you found useful
- Gotchas or edge cases
- Patterns you followed
- Troubleshooting steps that worked

### 8. Commit
Only after ALL verifications pass:
\`\`\`bash
git add -A && git commit -m \"feat: <description> (fizzy #CARD_NUMBER)\"
\`\`\`

### 9. Complete Steps
Mark each step as completed:
\`\`\`bash
fizzy step update STEP_ID --card CARD_NUMBER --completed
\`\`\`

### 10. Close Card
\`\`\`bash
fizzy card close CARD_NUMBER
\`\`\`

### 11. Unblock Dependents
Find cards with \`blocked-by:CARD_NUMBER\` tag (replace CARD_NUMBER with actual number):
\`\`\`bash
fizzy card list --board $BOARD_ID --column not-now --all | jq '.data[] | select(.tags[]?.title == \"blocked-by:CARD_NUMBER\") | .number'
\`\`\`
For each dependent:
1. Remove the blocker tag (toggle off)
2. Check if all blockers are removed
3. If no more blockers, move to maybe:
\`\`\`bash
fizzy card tag DEPENDENT_NUMBER --tag \"blocked-by:CARD_NUMBER\"  # toggles off
# Check remaining blockers
BLOCKERS=\$(fizzy card show DEPENDENT_NUMBER | jq '[.data.tags[]?.title | select(startswith(\"blocked-by:\"))] | length')
if [ \"\$BLOCKERS\" -eq 0 ]; then
  fizzy card column DEPENDENT_NUMBER --column maybe
fi
\`\`\`

### 12. Check Completion
\`\`\`bash
fizzy card list --board $BOARD_ID --column maybe | jq '.data | length'
\`\`\`
If 0 cards remain, output: <promise>COMPLETE</promise>

## Rules
- ONLY work on ONE card per iteration
- ALWAYS run typecheck, lint, test, build before committing
- NEVER commit if any verification fails
- ALWAYS commit after completing a card
- ALWAYS update knowledge.md with discoveries
- ALWAYS check and unblock dependent cards"

  result=$(run_agent "$prompt")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "=========================================="
    echo "All cards complete after $iteration iterations."
    echo "=========================================="
    exit 0
  fi
done

echo "=========================================="
echo "Reached max iterations ($MAX_ITERATIONS)."
echo "Remaining ready: $(get_ready_count)"
echo "Remaining blocked: $(get_blocked_count)"
echo "=========================================="
