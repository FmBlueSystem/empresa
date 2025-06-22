#!/bin/bash

# BlueSystem.io VPS Setup Script
# Automated setup script for Ubuntu 24.04 VPS with Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_NAME="bluesystem"
PROJECT_DIR="/root/bluesystem"
REPO_URL="https://github.com/FmBlueSystem/empresa.git"

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

check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root"
        exit 1
    fi
}

update_system() {
    log_info "Updating system packages..."
    apt update && apt upgrade -y
    log_success "System updated successfully"
}

install_docker() {
    if command -v docker &> /dev/null; then
        log_info "Docker already installed"
        return
    fi

    log_info "Installing Docker..."
    
    # Install prerequisites
    apt install -y ca-certificates curl gnupg lsb-release
    
    # Add Docker GPG key
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    log_success "Docker installed successfully"
}

install_docker_compose() {
    if command -v docker-compose &> /dev/null; then
        log_info "Docker Compose already installed"
        return
    fi

    log_info "Installing Docker Compose..."
    
    # Download and install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Create symlink
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    log_success "Docker Compose installed successfully"
}

setup_firewall() {
    log_info "Setting up UFW firewall..."
    
    # Install ufw if not present
    apt install -y ufw
    
    # Reset UFW to defaults
    ufw --force reset
    
    # Set default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH
    ufw allow 22/tcp comment 'SSH'
    
    # Allow HTTP and HTTPS
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    
    # Allow Portainer
    ufw allow 9000/tcp comment 'Portainer'
    
    # Enable UFW
    ufw --force enable
    
    log_success "Firewall configured successfully"
}

clone_repository() {
    log_info "Cloning repository..."
    
    # Remove existing directory if it exists
    if [ -d "$PROJECT_DIR" ]; then
        log_warning "Directory $PROJECT_DIR already exists. Removing..."
        rm -rf "$PROJECT_DIR"
    fi
    
    # Clone repository
    git clone "$REPO_URL" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    
    log_success "Repository cloned successfully"
}

setup_environment() {
    log_info "Setting up environment..."
    
    cd "$PROJECT_DIR"
    
    # Copy .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_info "Created .env file from .env.example"
        else
            log_error ".env.example file not found"
            exit 1
        fi
    fi
    
    # Generate secure passwords
    DB_PASSWORD=$(openssl rand -base64 32)
    DB_ROOT_PASSWORD=$(openssl rand -base64 32)
    REDIS_PASSWORD=$(openssl rand -base64 32)
    JWT_SECRET=$(openssl rand -base64 64)
    API_KEY=$(openssl rand -base64 32)
    SESSION_SECRET=$(openssl rand -base64 64)
    
    # Update .env file with secure passwords
    sed -i "s/change_this_secure_password_123/$DB_PASSWORD/g" .env
    sed -i "s/change_this_root_password_456/$DB_ROOT_PASSWORD/g" .env
    sed -i "s/change_this_redis_password_789/$REDIS_PASSWORD/g" .env
    sed -i "s/change_this_to_a_very_long_random_string_for_jwt_tokens_security/$JWT_SECRET/g" .env
    sed -i "s/change_this_api_key_for_external_services/$API_KEY/g" .env
    sed -i "s/change_this_session_secret_very_long_string/$SESSION_SECRET/g" .env
    
    # Make scripts executable
    chmod +x scripts/*.sh
    
    log_success "Environment configured with secure passwords"
}

enable_auto_start() {
    log_info "Setting up auto-start on boot..."
    
    # Create systemd service file
    cat > /etc/systemd/system/bluesystem.service << EOF
[Unit]
Description=BlueSystem.io Docker Compose Service
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    # Enable and start service
    systemctl daemon-reload
    systemctl enable bluesystem.service
    
    log_success "Auto-start configured successfully"
}

setup_backup() {
    log_info "Setting up automatic backups..."
    
    # Create backup script
    cat > /root/backup-bluesystem.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
PROJECT_DIR="/root/bluesystem"

mkdir -p "$BACKUP_DIR"

# Backup database
cd "$PROJECT_DIR"
docker-compose exec -T db mysqldump -u root -p$DB_ROOT_PASSWORD --all-databases > "$BACKUP_DIR/db_backup_$DATE.sql"

# Backup volumes
docker run --rm -v bluesystem_db_data:/data -v "$BACKUP_DIR":/backup ubuntu tar czf "/backup/volumes_backup_$DATE.tar.gz" /data

# Keep only last 7 backups
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

    chmod +x /root/backup-bluesystem.sh
    
    # Add to crontab (daily at 2 AM)
    (crontab -l 2>/dev/null; echo "0 2 * * * /root/backup-bluesystem.sh >> /var/log/bluesystem-backup.log 2>&1") | crontab -
    
    log_success "Automatic backups configured"
}

install_monitoring() {
    log_info "Installing monitoring tools..."
    
    # Install htop, iotop, netstat
    apt install -y htop iotop net-tools
    
    # Install Docker stats script
    cat > /root/docker-stats.sh << 'EOF'
#!/bin/bash
echo "=== Docker Container Status ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "=== Resource Usage ==="
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
echo ""
echo "=== Disk Usage ==="
df -h
echo ""
echo "=== Memory Usage ==="
free -h
EOF

    chmod +x /root/docker-stats.sh
    
    log_success "Monitoring tools installed"
}

deploy_application() {
    log_info "Deploying BlueSystem.io application..."
    
    cd "$PROJECT_DIR"
    
    # Start the application
    ./scripts/deploy.sh deploy --no-backup
    
    log_success "Application deployed successfully"
}

show_completion_info() {
    log_success "VPS setup completed successfully!"
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}    BlueSystem.io VPS Setup Complete!    ${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    echo -e "${BLUE}Application URLs:${NC}"
    echo -e "  Web App: http://$(curl -s ifconfig.me)"
    echo -e "  Portainer: http://$(curl -s ifconfig.me):9000"
    echo ""
    echo -e "${BLUE}Default Credentials:${NC}"
    echo -e "  Email: admin@bluesystem.io"
    echo -e "  Password: admin123"
    echo ""
    echo -e "${BLUE}Useful Commands:${NC}"
    echo -e "  Check status: cd $PROJECT_DIR && ./scripts/deploy.sh status"
    echo -e "  View logs: cd $PROJECT_DIR && docker-compose logs -f"
    echo -e "  Backup: /root/backup-bluesystem.sh"
    echo -e "  Monitor: /root/docker-stats.sh"
    echo ""
    echo -e "${BLUE}Important Files:${NC}"
    echo -e "  Project: $PROJECT_DIR"
    echo -e "  Environment: $PROJECT_DIR/.env"
    echo -e "  Backups: /root/backups"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo -e "1. Update DNS records to point to this server IP"
    echo -e "2. Configure SSL certificates for HTTPS"
    echo -e "3. Review and update environment variables"
    echo -e "4. Set up additional monitoring if needed"
    echo ""
}

# Main execution
main() {
    log_info "Starting BlueSystem.io VPS setup..."
    
    check_root
    update_system
    install_docker
    install_docker_compose
    setup_firewall
    clone_repository
    setup_environment
    enable_auto_start
    setup_backup
    install_monitoring
    deploy_application
    show_completion_info
}

# Run main function
main "$@" 