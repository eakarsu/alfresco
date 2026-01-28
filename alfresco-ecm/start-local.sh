#!/bin/bash

# Alfresco ECM Platform - Local Development Startup Script
# Runs services locally while using Docker for infrastructure

set -e

echo "🚀 Starting Alfresco ECM Platform (Local Development)..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}Killing process on port $port (PID: $pid)${NC}"
        kill -9 $pid 2>/dev/null || true
        sleep 1
    fi
}

# Clean all ports
clean_ports() {
    echo -e "${BLUE}🧹 Cleaning up ports...${NC}"
    
    # Infrastructure ports
    kill_port 5432  # PostgreSQL
    kill_port 27017 # MongoDB
    kill_port 9200  # Elasticsearch
    kill_port 9300  # Elasticsearch transport
    kill_port 6379  # Redis
    kill_port 9000  # MinIO
    kill_port 9001  # MinIO Console
    kill_port 8080  # Keycloak
    kill_port 5672  # RabbitMQ
    kill_port 15672 # RabbitMQ Management
    kill_port 8090  # Camunda
    kill_port 9998  # Tika
    kill_port 3050  # LibreOffice/Gotenberg
    kill_port 9090  # Prometheus
    
    # Application service ports
    kill_port 3000  # Web application
    kill_port 3001  # Auth service
    kill_port 3002  # Document service
    kill_port 3003  # Workflow service
    kill_port 3004  # Search service
    kill_port 3005  # Transformation service
    kill_port 3006  # CMIS service
    kill_port 3007  # Protocols service
    kill_port 3008  # Office service
    kill_port 3009  # Email service
    kill_port 3010  # Smart folders service
    kill_port 3011  # Replication service
    kill_port 3012  # Forms service
    kill_port 3013  # Analytics service
    kill_port 3014  # AI service
    kill_port 3015  # DAM service
    kill_port 3016  # Mobile service
    kill_port 3017  # Calendar service
    kill_port 3018  # OCR service
    kill_port 3019  # Share service
    kill_port 3020  # Gateway service
    
    echo -e "${GREEN}✅ Ports cleaned${NC}"
}

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Node.js $(node -v)${NC}"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ npm $(npm -v)${NC}"
    
    # Check Docker (for infrastructure only)
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed (needed for databases)${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1)${NC}"
}

# Start Docker infrastructure only
start_infrastructure() {
    echo -e "${BLUE}🐳 Starting infrastructure services in Docker...${NC}"
    
    # Start only infrastructure services
    docker-compose up -d \
        postgres \
        mongodb \
        elasticsearch \
        redis \
        minio \
        rabbitmq \
        keycloak \
        camunda \
        tika \
        libreoffice
    
    echo "⏳ Waiting for infrastructure services to be ready..."
    
    # Wait for PostgreSQL
    until docker-compose exec -T postgres pg_isready -U alfresco > /dev/null 2>&1; do
        echo -n "."
        sleep 2
    done
    echo -e "\n${GREEN}✅ PostgreSQL ready${NC}"
    
    # Wait for MongoDB
    until docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
        echo -n "."
        sleep 2
    done
    echo -e "${GREEN}✅ MongoDB ready${NC}"
    
    # Wait for Elasticsearch
    until curl -s http://localhost:9200/_cluster/health > /dev/null 2>&1; do
        echo -n "."
        sleep 2
    done
    echo -e "${GREEN}✅ Elasticsearch ready${NC}"
    
    # Wait for Redis
    until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
        echo -n "."
        sleep 2
    done
    echo -e "${GREEN}✅ Redis ready${NC}"
    
    echo -e "${GREEN}✅ All infrastructure services are ready${NC}"
}

# Install dependencies for all services
install_dependencies() {
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    
    # Install root dependencies with legacy peer deps flag
    npm install --legacy-peer-deps
    
    # Install service dependencies
    services=(
        "services/auth"
        "services/document"
        "services/workflow"
        "services/search"
        "services/collaboration"
        "services/records"
        "services/transformation"
        "services/cmis"
        "services/protocols"
        "services/office"
        "services/email"
        "services/smart-folders"
        "services/replication"
        "services/forms"
        "services/analytics"
        "services/ai"
        "services/dam"
        "services/integration"
        "services/notification"
        "services/audit"
        "services/admin"
    )
    
    for service in "${services[@]}"; do
        if [ -d "$service" ]; then
            echo "Installing dependencies for $service..."
            (cd "$service" && npm install --legacy-peer-deps) || echo -e "${YELLOW}⚠️  Skipping $service${NC}"
        fi
    done
    
    # Install web app dependencies
    if [ -d "apps/web" ]; then
        echo "Installing web app dependencies..."
        (cd apps/web && npm install --legacy-peer-deps)
    fi
    
    # Install shared packages
    if [ -d "packages/shared" ]; then
        echo "Installing shared package dependencies..."
        (cd packages/shared && npm install --legacy-peer-deps)
    fi
    
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Build TypeScript services
build_services() {
    echo -e "${BLUE}🔨 Building TypeScript services...${NC}"
    
    # Build shared packages first
    if [ -d "packages/shared" ]; then
        echo "Building shared packages..."
        (cd packages/shared && npm run build) || true
    fi
    
    # Build each service
    services=(
        "services/auth"
        "services/document"
        "services/workflow"
        "services/search"
        "services/collaboration"
        "services/records"
    )
    
    for service in "${services[@]}"; do
        if [ -d "$service" ] && [ -f "$service/tsconfig.json" ]; then
            echo "Building $service..."
            (cd "$service" && npm run build) || true
        fi
    done
    
    echo -e "${GREEN}✅ Services built${NC}"
}

# Create .env files for local development
setup_environment() {
    echo -e "${BLUE}🔧 Setting up environment files...${NC}"
    
    # Create root .env if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.example .env
        echo -e "${YELLOW}Created .env from .env.example - please update with your settings${NC}"
    fi
    
    # Create .env.local for local development overrides
    cat > .env.local << EOF
# Local Development Environment
NODE_ENV=development
LOG_LEVEL=debug

# Local service ports
AUTH_SERVICE_PORT=3001
DOCUMENT_SERVICE_PORT=3002
WORKFLOW_SERVICE_PORT=3003
SEARCH_SERVICE_PORT=3004
TRANSFORMATION_SERVICE_PORT=3005
CMIS_SERVICE_PORT=3006
PROTOCOLS_SERVICE_PORT=3007
OFFICE_SERVICE_PORT=3008
EMAIL_SERVICE_PORT=3009
SMART_FOLDERS_SERVICE_PORT=3010
REPLICATION_SERVICE_PORT=3011
FORMS_SERVICE_PORT=3012
ANALYTICS_SERVICE_PORT=3013
AI_SERVICE_PORT=3014
DAM_SERVICE_PORT=3015

# Infrastructure URLs (Docker)
DATABASE_URL=postgresql://alfresco:alfresco_secure_pass@localhost:5432/alfresco_ecm
MONGODB_URI=mongodb://alfresco:alfresco_secure_pass@localhost:27017/alfresco_content
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_URL=http://localhost:9200
RABBITMQ_URL=amqp://alfresco:alfresco_secure_pass@localhost:5672
MINIO_ENDPOINT=localhost:9000
KEYCLOAK_URL=http://localhost:8080
CAMUNDA_URL=http://localhost:8090
EOF
    
    echo -e "${GREEN}✅ Environment files ready${NC}"
}

# Initialize databases
initialize_databases() {
    echo -e "${BLUE}🗄️  Initializing databases...${NC}"
    
    # Run PostgreSQL initialization
    if [ -f "init-scripts/postgres/01-init-database.sql" ]; then
        echo "Running PostgreSQL initialization..."
        docker-compose exec -T postgres psql -U alfresco -d alfresco_ecm < init-scripts/postgres/01-init-database.sql || true
    fi
    
    echo -e "${GREEN}✅ Databases initialized${NC}"
}

# Start services locally
start_services() {
    echo -e "${BLUE}🚀 Starting services locally...${NC}"
    
    # Create logs directory
    mkdir -p logs
    
    # Start services in background with logging
    services=(
        "auth:3001"
        "document:3002"
        "workflow:3003"
        "search:3004"
        "transformation:3005"
        "cmis:3006"
        "protocols:3007"
        "office:3008"
        "email:3009"
        "smart-folders:3010"
        "replication:3011"
        "forms:3012"
        "analytics:3013"
        "ai:3014"
        "dam:3015"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service port <<< "$service_info"
        service_dir="services/$service"
        
        if [ -d "$service_dir" ]; then
            echo "Starting $service service on port $port..."
            
            # Start service in background
            (
                cd "$service_dir"
                PORT=$port npm run dev > ../../logs/${service}.log 2>&1
            ) &
            
            # Save PID
            echo $! > "logs/${service}.pid"
            echo -e "${GREEN}✅ Started $service service (PID: $!)${NC}"
        else
            echo -e "${YELLOW}⚠️  Service directory $service_dir not found${NC}"
        fi
    done
    
    # Start web application
    echo "Starting web application..."
    (
        cd apps/web
        npm run dev > ../../logs/web.log 2>&1
    ) &
    echo $! > logs/web.pid
    echo -e "${GREEN}✅ Started web application (PID: $!)${NC}"
}

# Health check for local services
health_check() {
    echo -e "${BLUE}🏥 Running health checks...${NC}"
    
    # Wait for services to start
    sleep 10
    
    # Check each service
    services=(
        "http://localhost:3001/health:Auth Service"
        "http://localhost:3002/health:Document Service"
        "http://localhost:3003/health:Workflow Service"
        "http://localhost:3004/health:Search Service"
        "http://localhost:3005/health:Transformation Service"
        "http://localhost:3006/health:CMIS Service"
        "http://localhost:3007/health:Protocols Service"
        "http://localhost:3008/health:Office Service"
        "http://localhost:3009/health:Email Service"
        "http://localhost:3010/health:Smart Folders Service"
        "http://localhost:3011/health:Replication Service"
        "http://localhost:3012/health:Forms Service"
        "http://localhost:3013/health:Analytics Service"
        "http://localhost:3014/health:AI Service"
        "http://localhost:3015/health:DAM Service"
        "http://localhost:3000:Web Application"
    )
    
    all_healthy=true
    for service in "${services[@]}"; do
        IFS=':' read -r url port name <<< "$service"
        full_url="${url}:${port}"
        
        if curl -s "$full_url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is healthy${NC}"
        else
            echo -e "${YELLOW}⚠️  $name is not responding yet${NC}"
            all_healthy=false
        fi
    done
    
    if [ "$all_healthy" = false ]; then
        echo -e "${YELLOW}Some services are still starting. Check logs in ./logs/ directory${NC}"
    fi
}

# Display information
display_info() {
    echo ""
    echo "=================================================="
    echo -e "${GREEN}🎉 Alfresco ECM Platform is running locally!${NC}"
    echo "=================================================="
    echo ""
    echo "📌 Main Access Points:"
    echo "  • Web Application:    http://localhost:3000"
    echo "  • API Gateway:        http://localhost:3001"
    echo ""
    echo "📌 Service Endpoints:"
    echo "  • Auth Service:       http://localhost:3001"
    echo "  • Document Service:   http://localhost:3002"
    echo "  • Workflow Service:   http://localhost:3003"
    echo "  • Search Service:     http://localhost:3004"
    echo "  • Transform Service:  http://localhost:3005"
    echo "  • CMIS Service:       http://localhost:3006"
    echo "  • Protocols Service:  http://localhost:3007"
    echo "  • Office Service:     http://localhost:3008"
    echo "  • Email Service:      http://localhost:3009"
    echo "  • Smart Folders:      http://localhost:3010"
    echo "  • Replication:        http://localhost:3011"
    echo "  • Forms Service:      http://localhost:3012"
    echo "  • Analytics Service:  http://localhost:3013"
    echo "  • AI Service:         http://localhost:3014"
    echo "  • DAM Service:        http://localhost:3015"
    echo ""
    echo "📌 Infrastructure (Docker):"
    echo "  • PostgreSQL:         localhost:5432"
    echo "  • MongoDB:            localhost:27017"
    echo "  • Elasticsearch:      localhost:9200"
    echo "  • Redis:              localhost:6379"
    echo "  • MinIO Console:      localhost:9001"
    echo "  • RabbitMQ Console:   localhost:15672"
    echo "  • Keycloak:           localhost:8080"
    echo ""
    echo "📌 Logs:"
    echo "  • Service logs:       ./logs/[service-name].log"
    echo "  • View logs:          tail -f logs/[service-name].log"
    echo ""
    echo "📌 Commands:"
    echo "  • Stop all:           ./stop-local.sh"
    echo "  • Restart service:    npm run dev (in service directory)"
    echo "  • View Docker logs:   docker-compose logs -f [service]"
    echo ""
    echo -e "${YELLOW}⚠️  Services are starting in background. Check logs if any service fails.${NC}"
}

# Main execution
main() {
    clean_ports  # Clean all ports first
    check_prerequisites
    setup_environment
    start_infrastructure
    install_dependencies
    # build_services  # Optional: uncomment if you want to build TypeScript
    initialize_databases
    start_services
    health_check
    display_info
}

# Run main function
main