#!/bin/bash

# Alfresco ECM Platform - Complete Shutdown Script

set -e

echo "🛑 Stopping Alfresco ECM Platform..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse command line arguments
FORCE_STOP=false
STOP_DOCKER=false
CLEAN_DATA=false
CLEAN_LOGS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --force|-f)
            FORCE_STOP=true
            shift
            ;;
        --docker|-d)
            STOP_DOCKER=true
            shift
            ;;
        --clean-data)
            CLEAN_DATA=true
            shift
            ;;
        --clean-logs)
            CLEAN_LOGS=true
            shift
            ;;
        --all|-a)
            STOP_DOCKER=true
            shift
            ;;
        --help|-h)
            echo "Usage: ./stop.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -f, --force       Force stop all services (kill -9)"
            echo "  -d, --docker      Stop Docker infrastructure services"
            echo "  -a, --all         Stop all services including Docker"
            echo "  --clean-data      Clean data directories (requires confirmation)"
            echo "  --clean-logs      Clean log files"
            echo "  -h, --help        Show this help message"
            echo ""
            echo "Examples:"
            echo "  ./stop.sh                    # Stop only Node.js services"
            echo "  ./stop.sh --all              # Stop all services including Docker"
            echo "  ./stop.sh --force --all      # Force stop everything"
            echo "  ./stop.sh --all --clean-logs # Stop all and clean logs"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Function to check if a process is running
is_process_running() {
    local pid=$1
    if [ -z "$pid" ]; then
        return 1
    fi
    kill -0 "$pid" 2>/dev/null
}

# Function to stop a service gracefully
stop_service_gracefully() {
    local pid=$1
    local service_name=$2
    local timeout=30
    
    echo -n "  Stopping $service_name (PID: $pid)"
    
    # Send SIGTERM for graceful shutdown
    kill -TERM "$pid" 2>/dev/null || return 1
    
    # Wait for process to terminate
    local count=0
    while [ $count -lt $timeout ]; do
        if ! is_process_running "$pid"; then
            echo -e " ${GREEN}✓${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
        count=$((count + 1))
    done
    
    # If still running, force kill
    echo -e " ${YELLOW}(forcing)${NC}"
    kill -9 "$pid" 2>/dev/null || true
    sleep 1
    
    if ! is_process_running "$pid"; then
        echo -e "  ${GREEN}✅ $service_name stopped (forced)${NC}"
    else
        echo -e "  ${RED}❌ Failed to stop $service_name${NC}"
        return 1
    fi
}

# Stop Node.js microservices
stop_microservices() {
    echo "📦 Stopping microservices..."
    
    # First, try to stop using npm (if running)
    if pgrep -f "npm run dev" > /dev/null; then
        echo "  Stopping npm dev process..."
        if [ "$FORCE_STOP" = true ]; then
            pkill -9 -f "npm run dev" 2>/dev/null || true
        else
            pkill -TERM -f "npm run dev" 2>/dev/null || true
            sleep 2
        fi
        echo -e "  ${GREEN}✅ npm dev process stopped${NC}"
    fi
    
    # Stop services using PID files if they exist
    if [ -d "logs" ]; then
        local found_pidfiles=false
        for pidfile in logs/*.pid; do
            if [ -f "$pidfile" ]; then
                found_pidfiles=true
                local service_name=$(basename "$pidfile" .pid)
                local pid=$(cat "$pidfile")
                
                if is_process_running "$pid"; then
                    if [ "$FORCE_STOP" = true ]; then
                        echo "  Force stopping $service_name (PID: $pid)..."
                        kill -9 "$pid" 2>/dev/null || true
                        echo -e "  ${GREEN}✅ $service_name stopped (forced)${NC}"
                    else
                        stop_service_gracefully "$pid" "$service_name"
                    fi
                    rm -f "$pidfile"
                else
                    echo -e "  ${YELLOW}⚠️  $service_name was not running${NC}"
                    rm -f "$pidfile"
                fi
            fi
        done
        
        if [ "$found_pidfiles" = false ]; then
            echo -e "  ${YELLOW}No PID files found${NC}"
        fi
    fi
    
    # Kill any remaining processes on service ports
    echo "  Checking for processes on service ports..."
    local ports=(3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012 3013 3014 3015 8080 8090)
    local killed_any=false
    
    for port in "${ports[@]}"; do
        local pid=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pid" ]; then
            echo -n "  Stopping process on port $port (PID: $pid)"
            if [ "$FORCE_STOP" = true ]; then
                kill -9 $pid 2>/dev/null || true
                echo -e " ${GREEN}✓${NC}"
            else
                kill -TERM $pid 2>/dev/null || true
                sleep 1
                if is_process_running "$pid"; then
                    kill -9 $pid 2>/dev/null || true
                    echo -e " ${GREEN}✓ (forced)${NC}"
                else
                    echo -e " ${GREEN}✓${NC}"
                fi
            fi
            killed_any=true
        fi
    done
    
    if [ "$killed_any" = false ]; then
        echo -e "  ${GREEN}No processes found on service ports${NC}"
    fi
    
    echo -e "${GREEN}✅ Microservices stopped${NC}"
}

# Stop Docker infrastructure services
stop_docker_services() {
    if [ "$STOP_DOCKER" = true ]; then
        echo "🐳 Stopping Docker services..."
        
        # Check if docker-compose.yml exists
        if [ ! -f "docker-compose.yml" ] && [ ! -f "docker-compose.yaml" ]; then
            echo -e "  ${YELLOW}⚠️  docker-compose.yml not found${NC}"
            return
        fi
        
        # Check if Docker is running
        if ! docker info > /dev/null 2>&1; then
            echo -e "  ${YELLOW}⚠️  Docker is not running${NC}"
            return
        fi
        
        # Stop containers
        if [ "$FORCE_STOP" = true ]; then
            echo "  Force stopping Docker containers..."
            docker-compose kill 2>/dev/null || true
            docker-compose down -v 2>/dev/null || true
        else
            echo "  Gracefully stopping Docker containers..."
            docker-compose stop 2>/dev/null || true
            docker-compose down 2>/dev/null || true
        fi
        
        echo -e "${GREEN}✅ Docker services stopped${NC}"
    else
        echo -e "${BLUE}ℹ️  Docker services not stopped (use --docker or --all to stop)${NC}"
    fi
}

# Clean up logs
cleanup_logs() {
    if [ "$CLEAN_LOGS" = true ]; then
        echo "🧹 Cleaning up logs..."
        
        if [ -d "logs" ]; then
            rm -f logs/*.log 2>/dev/null || true
            rm -f logs/*.pid 2>/dev/null || true
            echo -e "  ${GREEN}✅ Log files cleaned${NC}"
        else
            echo -e "  ${YELLOW}No logs directory found${NC}"
        fi
    fi
}

# Clean up data (with confirmation)
cleanup_data() {
    if [ "$CLEAN_DATA" = true ]; then
        echo "🗑️  Data cleanup requested..."
        echo -e "${YELLOW}⚠️  WARNING: This will delete all data including databases!${NC}"
        
        read -p "Are you sure you want to delete all data? Type 'yes' to confirm: " confirmation
        
        if [ "$confirmation" = "yes" ]; then
            echo "  Removing data directories..."
            rm -rf data/postgres/* 2>/dev/null || true
            rm -rf data/mongodb/* 2>/dev/null || true
            rm -rf data/elasticsearch/* 2>/dev/null || true
            rm -rf data/redis/* 2>/dev/null || true
            rm -rf data/minio/* 2>/dev/null || true
            rm -rf uploads/* 2>/dev/null || true
            rm -rf temp/* 2>/dev/null || true
            echo -e "  ${GREEN}✅ Data directories cleaned${NC}"
        else
            echo -e "  ${BLUE}Data cleanup cancelled${NC}"
        fi
    fi
}

# Display status
display_status() {
    echo ""
    echo "=================================="
    echo -e "${GREEN}🏁 Shutdown Complete${NC}"
    echo "=================================="
    
    # Check what's still running
    local services_running=false
    
    echo ""
    echo "📊 Status Check:"
    
    # Check Node.js services
    local node_ports=(3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012 3013 3014 3015)
    local node_running=false
    for port in "${node_ports[@]}"; do
        if lsof -ti:$port > /dev/null 2>&1; then
            node_running=true
            break
        fi
    done
    
    if [ "$node_running" = true ]; then
        echo -e "  ${YELLOW}⚠️  Some Node.js services are still running${NC}"
        services_running=true
    else
        echo -e "  ${GREEN}✅ All Node.js services stopped${NC}"
    fi
    
    # Check Docker services
    if docker info > /dev/null 2>&1; then
        local containers=$(docker-compose ps -q 2>/dev/null | wc -l | tr -d ' ')
        if [ "$containers" -gt "0" ]; then
            echo -e "  ${BLUE}ℹ️  Docker services are still running ($containers containers)${NC}"
            services_running=true
        else
            echo -e "  ${GREEN}✅ No Docker containers running${NC}"
        fi
    fi
    
    echo ""
    echo "💡 Restart Options:"
    echo "  • Quick start:          ./start-local.sh"
    echo "  • Full start:           ./start.sh"
    echo "  • Docker only:          docker-compose up -d"
    echo "  • Check logs:           tail -f logs/*.log"
    
    if [ "$services_running" = true ]; then
        echo ""
        echo -e "${YELLOW}Note: Some services are still running.${NC}"
        echo "To stop everything, run: ./stop.sh --force --all"
    fi
}

# Main execution
main() {
    # Display what will be stopped
    echo "🔍 Shutdown configuration:"
    echo -e "  • Microservices: ${GREEN}Yes${NC}"
    [ "$STOP_DOCKER" = true ] && echo -e "  • Docker: ${GREEN}Yes${NC}" || echo -e "  • Docker: ${YELLOW}No${NC}"
    [ "$FORCE_STOP" = true ] && echo -e "  • Force mode: ${YELLOW}Yes${NC}" || echo -e "  • Force mode: ${GREEN}No (graceful)${NC}"
    [ "$CLEAN_LOGS" = true ] && echo -e "  • Clean logs: ${GREEN}Yes${NC}"
    [ "$CLEAN_DATA" = true ] && echo -e "  • Clean data: ${YELLOW}Yes (requires confirmation)${NC}"
    echo ""
    
    # Execute shutdown sequence
    stop_microservices
    stop_docker_services
    cleanup_logs
    cleanup_data
    display_status
}

# Trap to handle script interruption
trap 'echo -e "\n${RED}❌ Shutdown script interrupted${NC}"; exit 1' INT

# Run main function
main