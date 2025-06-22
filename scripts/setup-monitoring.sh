#!/bin/bash

# Script para configurar monitoreo con Uptime Kuma
# BlueSystem.io - Setup Monitoring

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

# Función principal
setup_monitoring() {
    log "🚀 Configurando monitoreo para BlueSystem.io..."
    
    # Verificar que Docker esté corriendo
    if ! docker info >/dev/null 2>&1; then
        error "Docker no está corriendo. Inicia Docker Desktop primero."
        exit 1
    fi
    
    # Verificar que los servicios estén corriendo
    info "📊 Verificando servicios..."
    
    # Verificar servicios principales
    check_url "Frontend" "http://localhost:5173"
    check_url "Backend API" "http://localhost:3000/health"
    check_url "Nginx Proxy" "http://localhost:8080"
    check_url "Adminer" "http://localhost:8081"
    check_url "Redis Commander" "http://localhost:8082"
    check_url "cAdvisor" "http://localhost:8083"
    
    echo ""
    log "📋 Configuración de monitoreo completada"
    echo ""
    
    # Mostrar URLs de acceso
    info "🌐 URLs de monitoreo disponibles:"
    echo -e "${BLUE}  • cAdvisor (Contenedores): ${NC}http://localhost:8083"
    echo -e "${BLUE}  • Uptime Kuma (Servicios): ${NC}http://localhost:8084"
    echo ""
    
    # Instrucciones para Uptime Kuma
    info "⚙️  Configuración de Uptime Kuma:"
    echo "1. Accede a http://localhost:8084"
    echo "2. Crea tu cuenta de administrador"
    echo "3. Agrega los siguientes monitores:"
    echo ""
    
    echo -e "   📊 ${YELLOW}Frontend${NC}: http://localhost:5173"
    echo -e "   📊 ${YELLOW}Backend API${NC}: http://localhost:3000/health"
    echo -e "   📊 ${YELLOW}Nginx Proxy${NC}: http://localhost:8080"
    echo -e "   📊 ${YELLOW}Adminer${NC}: http://localhost:8081"
    echo -e "   📊 ${YELLOW}Redis Commander${NC}: http://localhost:8082"
    echo -e "   📊 ${YELLOW}cAdvisor${NC}: http://localhost:8083"
    
    echo ""
    info "📈 Configuración recomendada:"
    echo "   • Intervalo de monitoreo: 60 segundos"
    echo "   • Timeout: 10 segundos"
    echo "   • Reintentos: 3"
    echo "   • Notificaciones: Email/Discord/Slack"
    
    echo ""
    log "✅ Setup de monitoreo completado exitosamente"
}

# Función para mostrar estado de servicios
show_status() {
    log "📊 Estado actual de servicios BlueSystem.io"
    echo ""
    
    # Lista de servicios y puertos
    check_service "Frontend (Vite)" 5173
    check_service "Backend API" 3000
    check_service "Nginx Proxy" 8080
    check_service "MySQL" 3306
    check_service "Redis" 6379
    check_service "Adminer" 8081
    check_service "Redis Commander" 8082
    check_service "cAdvisor" 8083
    check_service "Uptime Kuma" 8084
}

# Función auxiliar para verificar un servicio por puerto
check_service() {
    local service_name="$1"
    local port="$2"
    
    if lsof -i :$port >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $service_name${NC} - Puerto $port activo"
    else
        echo -e "${RED}❌ $service_name${NC} - Puerto $port inactivo"
    fi
}

# Función auxiliar para verificar un servicio por URL
check_url() {
    local service_name="$1"
    local url="$2"
    
    info "🔍 Verificando $service_name en $url..."
    
    if curl -s --max-time 5 "$url" >/dev/null 2>&1; then
        log "✅ $service_name está funcionando"
    else
        warning "⚠️  $service_name no responde en $url"
    fi
}

# Función de ayuda
show_help() {
    echo -e "${BLUE}BlueSystem.io - Setup de Monitoreo${NC}"
    echo ""
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponibles:"
    echo "  setup      - Configurar monitoreo y verificar servicios"
    echo "  status     - Mostrar estado de servicios"
    echo "  help       - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 setup    # Configurar monitoreo completo"
    echo "  $0 status   # Ver estado de servicios"
    echo ""
}

# Procesamiento de argumentos
case "${1:-setup}" in
    "setup")
        setup_monitoring
        ;;
    "status")
        show_status
        ;;
    "help"|*)
        show_help
        ;;
esac 