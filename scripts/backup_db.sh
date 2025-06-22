#!/bin/bash

# BlueSystem.io Database Backup Script
# Creates a local backup of the MySQL database from Docker container

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups"
CONTAINER_NAME="bluesystem_mysql"
DATE=$(date +%Y%m%d_%H%M)

# Load environment variables
if [ -f "$PROJECT_DIR/.env" ]; then
    source "$PROJECT_DIR/.env"
else
    echo -e "${RED}Error: .env file not found in $PROJECT_DIR${NC}"
    exit 1
fi

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

check_container() {
    if ! docker ps | grep -q "$CONTAINER_NAME"; then
        log_error "MySQL container '$CONTAINER_NAME' is not running"
        log_info "Start the database with: docker-compose up db -d"
        exit 1
    fi
}

create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        log_info "Created backup directory: $BACKUP_DIR"
    fi
}

backup_database() {
    local backup_file="$BACKUP_DIR/db_backup_${DATE}.sql"
    
    log_info "Starting database backup..."
    log_info "Container: $CONTAINER_NAME"
    log_info "Database: $DB_NAME"
    log_info "Output file: $backup_file"
    
    # Create database dump
    if docker exec "$CONTAINER_NAME" mysqldump \
        -u root \
        -p"$DB_ROOT_PASSWORD" \
        --single-transaction \
        --routines \
        --triggers \
        --all-databases > "$backup_file" 2>/dev/null; then
        
        log_success "Database backup completed successfully"
        log_info "Backup saved to: $backup_file"
        
        # Show file size
        local file_size=$(du -h "$backup_file" | cut -f1)
        log_info "Backup size: $file_size"
        
    else
        log_error "Database backup failed"
        # Remove incomplete backup file
        [ -f "$backup_file" ] && rm "$backup_file"
        exit 1
    fi
}

backup_specific_database() {
    local backup_file="$BACKUP_DIR/db_${DB_NAME}_${DATE}.sql"
    
    log_info "Starting specific database backup..."
    log_info "Database: $DB_NAME"
    log_info "Output file: $backup_file"
    
    # Create specific database dump
    if docker exec "$CONTAINER_NAME" mysqldump \
        -u root \
        -p"$DB_ROOT_PASSWORD" \
        --single-transaction \
        --routines \
        --triggers \
        "$DB_NAME" > "$backup_file" 2>/dev/null; then
        
        log_success "Specific database backup completed successfully"
        log_info "Backup saved to: $backup_file"
        
        # Show file size
        local file_size=$(du -h "$backup_file" | cut -f1)
        log_info "Backup size: $file_size"
        
    else
        log_error "Specific database backup failed"
        # Remove incomplete backup file
        [ -f "$backup_file" ] && rm "$backup_file"
        exit 1
    fi
}

cleanup_old_backups() {
    local days_to_keep=${1:-7}
    
    log_info "Cleaning up backups older than $days_to_keep days..."
    
    find "$BACKUP_DIR" -name "db_*.sql" -type f -mtime +$days_to_keep -delete 2>/dev/null || true
    
    local remaining_backups=$(find "$BACKUP_DIR" -name "db_*.sql" -type f | wc -l)
    log_info "Remaining backups: $remaining_backups"
}

list_backups() {
    log_info "Available backups in $BACKUP_DIR:"
    echo ""
    
    if [ -d "$BACKUP_DIR" ] && [ "$(ls -A $BACKUP_DIR/db_*.sql 2>/dev/null)" ]; then
        ls -la "$BACKUP_DIR"/db_*.sql | while read -r line; do
            echo "  $line"
        done
    else
        log_warning "No backups found"
    fi
    echo ""
}

restore_backup() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        log_error "Please specify a backup file to restore"
        log_info "Usage: $0 restore /path/to/backup.sql"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        log_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log_warning "This will restore the database from: $backup_file"
    log_warning "Current data will be overwritten!"
    
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Restoring database from backup..."
        
        if docker exec -i "$CONTAINER_NAME" mysql \
            -u root \
            -p"$DB_ROOT_PASSWORD" < "$backup_file"; then
            
            log_success "Database restored successfully"
        else
            log_error "Database restore failed"
            exit 1
        fi
    else
        log_info "Restore cancelled"
    fi
}

show_help() {
    echo "BlueSystem.io Database Backup Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  backup, b          Create a full database backup (default)"
    echo "  backup-db, bd      Create backup of specific database only"
    echo "  list, l            List available backups"
    echo "  restore, r FILE    Restore database from backup file"
    echo "  cleanup, c [DAYS]  Remove backups older than DAYS (default: 7)"
    echo "  help, h            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                           # Create full backup"
    echo "  $0 backup                    # Create full backup"
    echo "  $0 backup-db                 # Backup specific database only"
    echo "  $0 list                      # List available backups"
    echo "  $0 restore backup.sql        # Restore from backup"
    echo "  $0 cleanup 14                # Remove backups older than 14 days"
    echo ""
}

# Main execution
main() {
    local command=${1:-backup}
    
    case $command in
        backup|b)
            check_container
            create_backup_dir
            backup_database
            cleanup_old_backups
            ;;
        backup-db|bd)
            check_container
            create_backup_dir
            backup_specific_database
            cleanup_old_backups
            ;;
        list|l)
            list_backups
            ;;
        restore|r)
            check_container
            restore_backup "$2"
            ;;
        cleanup|c)
            cleanup_old_backups "${2:-7}"
            ;;
        help|h|--help|-h)
            show_help
            ;;
        *)
            log_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 