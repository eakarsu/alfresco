#!/bin/bash

# Alfresco ECM Platform - Complete Startup Script

set -e

echo "🚀 Starting Alfresco ECM Platform..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Node.js $(node -v)${NC}"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker $(docker -v)${NC}"
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker Compose $(docker-compose -v)${NC}"
}

# Create necessary directories
create_directories() {
    echo "📁 Creating directories..."
    mkdir -p logs
    mkdir -p data/{postgres,mongodb,elasticsearch,redis,minio}
    mkdir -p uploads
    mkdir -p temp
    mkdir -p backups
    echo -e "${GREEN}✅ Directories created${NC}"
}

# Copy environment file
setup_environment() {
    echo "🔧 Setting up environment..."
    if [ ! -f .env ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Created .env file from .env.example${NC}"
        echo -e "${YELLOW}⚠️  Please update .env with your configuration${NC}"
    else
        echo -e "${GREEN}✅ Environment file exists${NC}"
    fi
}

# Start Docker services
start_docker_services() {
    echo "🐳 Starting Docker services..."
    docker-compose up -d
    
    # Wait for services to be healthy
    echo "⏳ Waiting for services to be healthy..."
    
    # Wait for PostgreSQL
    until docker-compose exec -T postgres pg_isready -U alfresco > /dev/null 2>&1; do
        echo -n "."
        sleep 2
    done
    echo -e "\n${GREEN}✅ PostgreSQL is ready${NC}"
    
    # Wait for MongoDB
    until docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
        echo -n "."
        sleep 2
    done
    echo -e "\n${GREEN}✅ MongoDB is ready${NC}"
    
    # Wait for Elasticsearch
    until curl -s http://localhost:9200/_cluster/health > /dev/null 2>&1; do
        echo -n "."
        sleep 2
    done
    echo -e "\n${GREEN}✅ Elasticsearch is ready${NC}"
    
    # Wait for Redis
    until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
        echo -n "."
        sleep 2
    done
    echo -e "\n${GREEN}✅ Redis is ready${NC}"
}

# Initialize databases
initialize_databases() {
    echo "🗄️  Initializing databases..."
    
    # Run PostgreSQL migrations
    docker-compose exec -T postgres psql -U alfresco -d alfresco_ecm -f /docker-entrypoint-initdb.d/01-init-database.sql || true
    
    echo -e "${GREEN}✅ Databases initialized${NC}"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Build services
build_services() {
    echo "🔨 Building services..."
    npm run build
    echo -e "${GREEN}✅ Services built${NC}"
}

# Start microservices
start_microservices() {
    echo "🚀 Starting microservices..."
    
    # Start services in background
    npm run dev &
    
    echo -e "${GREEN}✅ Microservices started${NC}"
}

# Health check
health_check() {
    echo "🏥 Running health checks..."
    
    sleep 10
    
    # Check each service
    services=(
        "http://localhost:3001/health:Auth Service"
        "http://localhost:3002/health:Document Service"
        "http://localhost:3003/health:Workflow Service"
        "http://localhost:3004/health:Transformation Service"
        "http://localhost:3005/health:CMIS Service"
        "http://localhost:3006/health:Protocols Service"
        "http://localhost:3007/health:Office Service"
        "http://localhost:3008/health:Email Service"
        "http://localhost:3009/health:Smart Folders Service"
        "http://localhost:3010/health:Replication Service"
        "http://localhost:3011/health:Forms Service"
        "http://localhost:3012/health:Analytics Service"
        "http://localhost:3013/health:AI Service"
        "http://localhost:3014/health:DAM Service"
    )
    
    for service in "${services[@]}"; do
        IFS=':' read -r url name <<< "$service"
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is healthy${NC}"
        else
            echo -e "${YELLOW}⚠️  $name is not responding${NC}"
        fi
    done
}

# Display access information
display_info() {
    echo ""
    echo "=================================="
    echo -e "${GREEN}🎉 Alfresco ECM Platform is running!${NC}"
    echo "=================================="
    echo ""
    echo "📌 Access Points:"
    echo "  • Web Application:    http://localhost:3000"
    echo "  • Alfresco Share:     http://localhost:3000/share"
    echo "  • Admin Console:      http://localhost:3000/admin"
    echo "  • API Documentation:  http://localhost:3000/api-docs"
    echo ""
    echo "📌 Protocol Access:"
    echo "  • WebDAV:            http://localhost:8080"
    echo "  • FTP:               ftp://localhost:21"
    echo "  • SFTP:              sftp://localhost:22"
    echo "  • SMB/CIFS:          smb://localhost:445"
    echo "  • CMIS:              http://localhost:3005/cmis"
    echo "  • IMAP:              imap://localhost:143"
    echo ""
    echo "📌 Default Credentials:"
    echo "  • Admin:             admin@alfresco.com / admin"
    echo "  • Demo User:         demo@alfresco.com / demo"
    echo ""
    echo "📌 Infrastructure:"
    echo "  • PostgreSQL:        localhost:5432"
    echo "  • MongoDB:           localhost:27017"
    echo "  • Elasticsearch:     localhost:9200"
    echo "  • Redis:             localhost:6379"
    echo "  • MinIO:             localhost:9001"
    echo "  • RabbitMQ:          localhost:15672"
    echo "  • Keycloak:          localhost:8080"
    echo "  • Camunda:           localhost:8090"
    echo "  • Prometheus:        localhost:9090"
    echo "  • Grafana:           localhost:3001"
    echo ""
    echo "📌 Commands:"
    echo "  • Stop services:     docker-compose down"
    echo "  • View logs:         docker-compose logs -f [service]"
    echo "  • Restart service:   docker-compose restart [service]"
    echo "  • Run tests:         npm test"
    echo ""
    echo -e "${YELLOW}⚠️  Remember to update .env file with your configuration${NC}"
}

# Main execution
main() {
    check_prerequisites
    create_directories
    setup_environment
    start_docker_services
    initialize_databases
    install_dependencies
    build_services
    start_microservices
    health_check
    display_info
}

# Trap to handle script interruption
trap 'echo -e "\n${RED}❌ Script interrupted${NC}"; exit 1' INT

# Run main function
main