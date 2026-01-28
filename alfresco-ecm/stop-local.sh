#!/bin/bash

# Stop all locally running services

echo "🛑 Stopping Alfresco ECM Platform (Local Services)..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Stop Node.js services using PID files
stop_services() {
    echo "Stopping local services..."
    
    if [ -d "logs" ]; then
        for pidfile in logs/*.pid; do
            if [ -f "$pidfile" ]; then
                service_name=$(basename "$pidfile" .pid)
                pid=$(cat "$pidfile")
                
                if kill -0 "$pid" 2>/dev/null; then
                    echo "Stopping $service_name (PID: $pid)..."
                    kill "$pid"
                    rm "$pidfile"
                    echo -e "${GREEN}✅ Stopped $service_name${NC}"
                else
                    echo -e "${YELLOW}⚠️  $service_name was not running${NC}"
                    rm "$pidfile"
                fi
            fi
        done
    fi
    
    # Also kill any remaining node processes on our service ports
    ports=(3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012 3013 3014 3015 3000)
    for port in "${ports[@]}"; do
        pid=$(lsof -ti:$port)
        if [ ! -z "$pid" ]; then
            echo "Killing process on port $port (PID: $pid)..."
            kill -9 "$pid" 2>/dev/null || true
        fi
    done
}

# Stop Docker infrastructure
stop_infrastructure() {
    read -p "Do you want to stop Docker infrastructure services? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Stopping Docker services..."
        docker-compose down
        echo -e "${GREEN}✅ Docker services stopped${NC}"
    else
        echo "Docker services kept running"
    fi
}

# Clean up
cleanup() {
    read -p "Do you want to clean up logs? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Cleaning up logs..."
        rm -f logs/*.log
        rm -f logs/*.pid
        echo -e "${GREEN}✅ Logs cleaned${NC}"
    fi
}

# Main
stop_services
stop_infrastructure
cleanup

echo -e "${GREEN}✅ All services stopped${NC}"