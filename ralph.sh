#!/bin/bash
set -e

# Ralph: Autonomous ticket worker
# Processes tickets until all work is complete
# Usage: ./ralph.sh [--claude] [max_iterations]

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

get_ready_count() {
  local count
  count=$(tk ready 2>/dev/null | grep -c "^[a-z]" || true)
  echo "${count:-0}"
}

run_agent() {
  local prompt="$1"
  if [ "$USE_CLAUDE" = true ]; then
    claude --dangerously-skip-permissions -p "$prompt"
  else
    amp --full-auto "$prompt"
  fi
}

iteration=0
while [ "$iteration" -lt "$MAX_ITERATIONS" ]; do
  ready_count=$(get_ready_count)
  
  if [ "$ready_count" -eq 0 ]; then
    echo "All tickets complete, exiting."
    exit 0
  fi

  iteration=$((iteration + 1))
  echo "Iteration $iteration ($ready_count tickets ready)"
  echo "--------------------------------"
  
  prompt="@AGENTS.md @knowledge.md
1. Run 'tk ready' to find available tickets. Pick the highest-priority one (lowest number = highest priority).
2. Run 'tk start <id>' to claim the ticket.
3. Implement the feature/fix described in the ticket.
4. review the code and make changes/improvements where needed
5. Run the project's build/typecheck/lint commands (check AGENTS.md or package.json/Makefile/etc).
6. Run the project's test suite to verify your changes.
7. Update knowledge.md with any discoveries or notes for future work.
8. Make a git commit with a descriptive message referencing the ticket.
9. Run 'tk close <id>' to mark the ticket done.
ONLY WORK ON A SINGLE TICKET.
If after closing, 'tk ready' shows no more tickets, output <promise>COMPLETE</promise>."

  result=$(run_agent "$prompt")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "All tickets complete after $iteration iterations."
    exit 0
  fi
done

echo "Reached max iterations ($MAX_ITERATIONS). Exiting."
