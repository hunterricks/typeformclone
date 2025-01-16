#!/bin/bash

# Kill process on port 3000
kill_port() {
    local port=$1
    local pid=$(lsof -t -i:$port)
    if [ ! -z "$pid" ]; then
        echo "Killing process on port $port (PID: $pid)"
        kill -9 $pid
    else
        echo "No process found on port $port"
    fi
}

# Kill common development ports
kill_port 3000  # Next.js
kill_port 3001  # Alternative port
kill_port 5432  # PostgreSQL (if running locally)
