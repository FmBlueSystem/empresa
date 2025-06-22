#!/bin/bash

# Script para iniciar el entorno de desarrollo de BlueSystem.io
# Requiere Docker Desktop instalado y funcionando

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Verificar que Docker esté corriendo
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        error "Docker no está corriendo. Por favor:"
        echo "1. Abre Docker Desktop"
        echo "2. Espera a que se inicie completamente"
        echo "3. Ejecuta este script nuevamente"
        exit 1
    fi
    log "✅ Docker está corriendo"
}

# Verificar archivos necesarios
check_files() {
    if [ ! -f "docker-compose.yml" ]; then
        error "docker-compose.yml no encontrado"
        exit 1
    fi
    
    if [ ! -f "docker-compose.dev.yml" ]; then
        error "docker-compose.dev.yml no encontrado"
        exit 1
    fi
    
    log "✅ Archivos de configuración encontrados"
}

# Crear archivo .env si no existe
create_env() {
    if [ ! -f ".env" ]; then
        warning "Archivo .env no encontrado. Creando uno por defecto..."
        
        cat > .env << 'EOF'
# Configuración de base de datos
DB_HOST=db
DB_PORT=3306
DB_USER=bluesystem_user
DB_PASSWORD=secure_password_123
DB_ROOT_PASSWORD=root_password_123
DB_NAME=bluesystem

# Configuración de Redis
REDIS_HOST=cache
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_123

# Configuración JWT
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-for-development
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-different-from-jwt-dev

# Configuración de API
API_KEY=dev-api-key-for-external-integrations
SESSION_SECRET=dev-session-secret-here-for-express-sessions

# Configuración del dominio
DOMAIN=localhost
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000

# Configuración de logs
LOG_LEVEL=debug
LOG_MAX_SIZE=10m
LOG_MAX_FILES=5

# Configuración del entorno
NODE_ENV=development
PORT=3000
EOF
        
        log "✅ Archivo .env creado con configuración de desarrollo"
    else
        log "✅ Archivo .env ya existe"
    fi
}

# Iniciar servicios
start_services() {
    log "🚀 Iniciando entorno de desarrollo BlueSystem.io..."
    
    info "📦 Construyendo e iniciando contenedores..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
    
    info "⏳ Esperando a que los servicios estén listos..."
    sleep 10
    
    log "✅ Servicios iniciados exitosamente"
}

# Mostrar URLs de acceso
show_urls() {
    echo ""
    log "🌐 URLs de acceso disponibles:"
    echo ""
    echo -e "${BLUE}📱 Aplicación:${NC}"
    echo -e "   • Frontend (React): ${GREEN}http://localhost:5173${NC}"
    echo -e "   • Backend API: ${GREEN}http://localhost:3000${NC}"
    echo -e "   • Nginx Proxy: ${GREEN}http://localhost:8080${NC}"
    echo ""
    echo -e "${BLUE}🛠️  Herramientas de desarrollo:${NC}"
    echo -e "   • Adminer (Base de datos): ${GREEN}http://localhost:8081${NC}"
    echo -e "   • Redis Commander: ${GREEN}http://localhost:8082${NC}"
    echo ""
    echo -e "${BLUE}📊 Monitoreo:${NC}"
    echo -e "   • cAdvisor (Contenedores): ${GREEN}http://localhost:8083${NC}"
    echo -e "   • Uptime Kuma (Servicios): ${GREEN}http://localhost:8084${NC}"
    echo ""
    echo -e "${YELLOW}💡 Tip: Los cambios en el código se recargan automáticamente${NC}"
}

# Mostrar comandos útiles
show_commands() {
    echo ""
    info "📋 Comandos útiles:"
    echo ""
    echo "Ver logs en tiempo real:"
    echo "  docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f"
    echo ""
    echo "Parar servicios:"
    echo "  docker-compose -f docker-compose.yml -f docker-compose.dev.yml down"
    echo ""
    echo "Reiniciar un servicio específico:"
    echo "  docker-compose -f docker-compose.yml -f docker-compose.dev.yml restart [servicio]"
    echo ""
    echo "Ver estado de servicios:"
    echo "  ./scripts/setup-monitoring.sh status"
    echo ""
}

# Función principal
main() {
    log "🔧 Iniciando configuración del entorno de desarrollo..."
    
    check_docker
    check_files
    create_env
    start_services
    show_urls
    show_commands
    
    log "🎉 ¡Entorno de desarrollo listo!"
    echo ""
    warning "Presiona Ctrl+C para ver los logs en tiempo real:"
    echo "docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f"
}

# Ejecutar función principal
main 