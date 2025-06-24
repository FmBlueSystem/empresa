#!/bin/bash

# Script de desarrollo para Verifika
# Automatiza el setup y comandos comunes del proyecto

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de utilidad
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

# Función para mostrar ayuda
show_help() {
    echo "🚀 Verifika Development Script"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  setup       - Configuración inicial del proyecto"
    echo "  dev         - Iniciar entorno de desarrollo"
    echo "  build       - Construir proyecto para producción"
    echo "  test        - Ejecutar pruebas"
    echo "  deploy      - Desplegar proyecto"
    echo "  clean       - Limpiar archivos temporales"
    echo "  logs        - Ver logs del proyecto"
    echo "  status      - Estado del proyecto"
    echo "  help        - Mostrar esta ayuda"
}

# Función para configuración inicial
setup_project() {
    log_info "Configurando proyecto Verifika..."
    
    # Verificar que estemos en el directorio correcto
    if [ ! -f "CLAUDE.md" ]; then
        log_error "Debe ejecutar este script desde el directorio raíz del proyecto BlueSystem"
        exit 1
    fi
    
    # Crear estructura de directorios si no existe
    mkdir -p verifika/{backend,frontend,docs}
    mkdir -p verifika/backend/{routes,models,middleware,config,tests,uploads}
    mkdir -p verifika/frontend/{src/{components,pages,utils,hooks},public,dist}
    
    log_success "Estructura de directorios creada"
    
    # Verificar instalación de dart-mcp-server
    if ! command -v dart-mcp-server &> /dev/null; then
        log_info "Instalando dart-mcp-server..."
        npm install -g dart-mcp-server
        log_success "dart-mcp-server instalado"
    else
        log_success "dart-mcp-server ya está instalado"
    fi
    
    # Verificar configuración MCP
    if [ ! -f ".claude_code_config.json" ]; then
        log_error "Archivo .claude_code_config.json no encontrado"
        log_info "Ejecute el comando de configuración MCP primero"
        exit 1
    fi
    
    log_success "Configuración inicial completada"
}

# Función para iniciar desarrollo
start_dev() {
    log_info "Iniciando entorno de desarrollo Verifika..."
    
    # Verificar que Docker esté ejecutándose
    if ! docker info &> /dev/null; then
        log_error "Docker no está ejecutándose"
        exit 1
    fi
    
    # Iniciar servicios de desarrollo
    log_info "Iniciando servicios de desarrollo..."
    docker-compose -f docker-compose.yml -f docker-compose.verifika.yml --profile development up -d
    
    # Esperar a que los servicios estén listos
    log_info "Esperando a que los servicios estén listos..."
    sleep 10
    
    # Verificar estado de servicios
    if docker-compose -f docker-compose.yml -f docker-compose.verifika.yml ps | grep -q "Up"; then
        log_success "Servicios de desarrollo iniciados"
        log_info "Frontend: http://localhost:5174"
        log_info "Backend API: http://localhost:3001/api"
        log_info "Logs: $0 logs"
    else
        log_error "Error al iniciar servicios"
        exit 1
    fi
}

# Función para build de producción
build_project() {
    log_info "Construyendo proyecto para producción..."
    
    docker-compose -f docker-compose.yml -f docker-compose.verifika.yml --profile production build
    
    log_success "Build completado"
}

# Función para ejecutar pruebas
run_tests() {
    log_info "Ejecutando pruebas..."
    
    # Pruebas backend
    if [ -d "verifika/backend" ]; then
        log_info "Ejecutando pruebas backend..."
        cd verifika/backend && npm test && cd ../..
    fi
    
    # Pruebas frontend
    if [ -d "verifika/frontend" ]; then
        log_info "Ejecutando pruebas frontend..."
        cd verifika/frontend && npm test && cd ../..
    fi
    
    log_success "Pruebas completadas"
}

# Función para despliegue
deploy_project() {
    log_info "Desplegando proyecto Verifika..."
    
    # Build de producción
    build_project
    
    # Iniciar servicios de producción
    docker-compose -f docker-compose.yml -f docker-compose.verifika.yml --profile production up -d
    
    log_success "Despliegue completado"
    log_info "Aplicación disponible en: http://localhost/verifika"
}

# Función para limpiar archivos temporales
clean_project() {
    log_info "Limpiando archivos temporales..."
    
    # Detener contenedores
    docker-compose -f docker-compose.yml -f docker-compose.verifika.yml down
    
    # Limpiar imágenes no utilizadas
    docker image prune -f
    
    # Limpiar node_modules si existe
    if [ -d "verifika/backend/node_modules" ]; then
        rm -rf verifika/backend/node_modules
    fi
    
    if [ -d "verifika/frontend/node_modules" ]; then
        rm -rf verifika/frontend/node_modules
    fi
    
    log_success "Limpieza completada"
}

# Función para ver logs
view_logs() {
    log_info "Mostrando logs de Verifika..."
    
    docker-compose -f docker-compose.yml -f docker-compose.verifika.yml logs -f --tail=100
}

# Función para estado del proyecto
project_status() {
    log_info "Estado del proyecto Verifika:"
    echo ""
    
    # Estado de contenedores
    echo "📦 Contenedores:"
    docker-compose -f docker-compose.yml -f docker-compose.verifika.yml ps
    echo ""
    
    # Estado de servicios
    echo "🌐 Servicios:"
    echo "  Frontend: http://localhost:5174 (dev) / http://localhost/verifika (prod)"
    echo "  Backend:  http://localhost:3001/api"
    echo "  Health:   http://localhost:3001/health"
    echo ""
    
    # Verificar MCP
    echo "🔗 MCP Integration:"
    if [ -f ".claude_code_config.json" ]; then
        echo "  ✅ Configuración MCP encontrada"
    else
        echo "  ❌ Configuración MCP no encontrada"
    fi
    
    if command -v dart-mcp-server &> /dev/null; then
        echo "  ✅ dart-mcp-server instalado"
    else
        echo "  ❌ dart-mcp-server no instalado"
    fi
}

# Procesamiento de argumentos
case "$1" in
    setup)
        setup_project
        ;;
    dev)
        start_dev
        ;;
    build)
        build_project
        ;;
    test)
        run_tests
        ;;
    deploy)
        deploy_project
        ;;
    clean)
        clean_project
        ;;
    logs)
        view_logs
        ;;
    status)
        project_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Comando no reconocido: $1"
        echo ""
        show_help
        exit 1
        ;;
esac