#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

SERVER_PID=""
CHROME_PID=""

cleanup() {
    echo ""
    echo "Shutting down..."
    
    if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
        echo "Stopping server (PID: $SERVER_PID)..."
        kill -TERM "$SERVER_PID" 2>/dev/null || true
        wait "$SERVER_PID" 2>/dev/null || true
    fi
    
    # cleanup stale chrome on CDP port
    CHROME_PID=$(lsof -ti:9223 2>/dev/null || true)
    if [[ -n "$CHROME_PID" ]]; then
        echo "Cleaning up Chrome (PID: $CHROME_PID)..."
        kill -TERM "$CHROME_PID" 2>/dev/null || true
        sleep 1
        kill -9 "$CHROME_PID" 2>/dev/null || true
    fi
    
    echo "Cleanup complete."
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# parse args
HEADLESS=false
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --headless) HEADLESS=true ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

if ! command -v bun &>/dev/null; then
    echo "Error: bun is required but not installed."
    exit 1
fi

echo "Installing dependencies..."
bun install

echo "Starting dev-browser server..."
export HEADLESS=$HEADLESS
bun scripts/start-server.ts &
SERVER_PID=$!

wait "$SERVER_PID"
