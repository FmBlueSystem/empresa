#!/bin/bash

# BlueSystem.io Deployment Script
# Automated deployment script for Docker environment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="bluesystem"
DOCKER_COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"
BACKUP_DIR="./backups"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f "$ENV_FILE" ]; then
        log_warning ".env file not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_warning "Please edit .env file with your configuration before proceeding."
            read -p "Press enter to continue after editing .env file..."
        else
            log_error ".env.example file not found. Cannot create .env file."
            exit 1
        fi
    fi
    
    log_success "Requirements check passed"
}

create_backup() {
    if [ "$1" = "true" ]; then
        log_info "Creating backup..."
        
        # Create backup directory if it doesn't exist
        mkdir -p "$BACKUP_DIR"
        
        # Generate backup filename with timestamp
        BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).tar.gz"
        
        # Create backup of important files
        tar -czf "$BACKUP_FILE" \
            --exclude=node_modules \
            --exclude=.git \
            --exclude=logs \
            --exclude=backups \
            ./ 2>/dev/null || true
        
        log_success "Backup created: $BACKUP_FILE"
    fi
}

pull_latest_images() {
    log_info "Pulling latest Docker images..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
    log_success "Images pulled successfully"
}

build_images() {
    log_info "Building Docker images..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache
    log_success "Images built successfully"
}

start_services() {
    log_info "Starting services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    log_success "Services started successfully"
}

stop_services() {
    log_info "Stopping services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    log_success "Services stopped successfully"
}

restart_services() {
    log_info "Restarting services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
    log_success "Services restarted successfully"
}

check_health() {
    log_info "Checking service health..."
    
    # Wait for services to be ready
    sleep 10
    
    # Check if containers are running
    if docker-compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q "Up"; then
        log_success "Containers are running"
    else
        log_error "Some containers are not running"
        docker-compose -f "$DOCKER_COMPOSE_FILE" ps
        return 1
    fi
    
    # Check health endpoints
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log_info "Health check attempt $attempt/$max_attempts..."
        
        # Check backend health
        if curl -f -s http://localhost/health >/dev/null 2>&1; then
            log_success "Backend health check passed"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            log_error "Health check failed after $max_attempts attempts"
            return 1
        fi
        
        sleep 5
        ((attempt++))
    done
    
    # Check frontend
    if curl -f -s http://localhost/ >/dev/null 2>&1; then
        log_success "Frontend health check passed"
    else
        log_warning "Frontend health check failed, but continuing..."
    fi
    
    log_success "Health checks completed"
}

show_status() {
    log_info "Service status:"
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
    
    echo ""
    log_info "Service logs (last 20 lines):"
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=20
}

cleanup() {
    log_info "Cleaning up unused Docker resources..."
    docker system prune -f
    docker volume prune -f
    log_success "Cleanup completed"
}

show_help() {
    echo "BlueSystem.io Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  deploy          Full deployment (stop, build, start, health check)"
    echo "  quick-deploy    Quick deployment (pull, restart, health check)"
    echo "  start           Start all services"
    echo "  stop            Stop all services"
    echo "  restart         Restart all services"
    echo "  build           Build Docker images"
    echo "  pull            Pull latest Docker images"
    echo "  health          Check service health"
    echo "  status          Show service status and logs"
    echo "  backup          Create backup"
    echo "  cleanup         Clean up unused Docker resources"
    echo "  help            Show this help message"
    echo ""
    echo "Options:"
    echo "  --no-backup     Skip backup creation"
    echo "  --no-build      Skip image building"
    echo "  --no-health     Skip health checks"
    echo ""
    echo "Examples:"
    echo "  $0 deploy                    # Full deployment with backup"
    echo "  $0 deploy --no-backup        # Full deployment without backup"
    echo "  $0 quick-deploy              # Quick deployment"
    echo "  $0 restart                   # Restart services"
}

# Parse command line arguments
COMMAND=${1:-help}
CREATE_BACKUP=true
BUILD_IMAGES=true
CHECK_HEALTH=true

shift || true
while [[ $# -gt 0 ]]; do
    case $1 in
        --no-backup)
            CREATE_BACKUP=false
            shift
            ;;
        --no-build)
            BUILD_IMAGES=false
            shift
            ;;
        --no-health)
            CHECK_HEALTH=false
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
case $COMMAND in
    deploy)
        log_info "Starting full deployment..."
        check_requirements
        create_backup $CREATE_BACKUP
        stop_services
        if [ "$BUILD_IMAGES" = "true" ]; then
            build_images
        else
            pull_latest_images
        fi
        start_services
        if [ "$CHECK_HEALTH" = "true" ]; then
            check_health
        fi
        log_success "Full deployment completed successfully!"
        log_info "Application is available at: http://localhost"
        ;;
    
    quick-deploy)
        log_info "Starting quick deployment..."
        check_requirements
        pull_latest_images
        restart_services
        if [ "$CHECK_HEALTH" = "true" ]; then
            check_health
        fi
        log_success "Quick deployment completed successfully!"
        ;;
    
    start)
        check_requirements
        start_services
        ;;
    
    stop)
        stop_services
        ;;
    
    restart)
        check_requirements
        restart_services
        ;;
    
    build)
        check_requirements
        build_images
        ;;
    
    pull)
        check_requirements
        pull_latest_images
        ;;
    
    health)
        check_health
        ;;
    
    status)
        show_status
        ;;
    
    backup)
        create_backup true
        ;;
    
    cleanup)
        cleanup
        ;;
    
    help|--help|-h)
        show_help
        ;;
    
    *)
        log_error "Unknown command: $COMMAND"
        show_help
        exit 1
        ;;
esac 