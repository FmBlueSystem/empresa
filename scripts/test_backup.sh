#!/bin/bash

# Script de prueba para backup (sin Docker)
# Para testing local sin base de datos real

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

# Configuración
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Crear directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

# Función principal de backup simulado
simulate_backup() {
    local backup_name="${1:-full_backup_$TIMESTAMP}"
    local backup_file="$BACKUP_DIR/${backup_name}.sql"
    
    log "🚀 Iniciando backup simulado..."
    info "📁 Directorio de backup: $BACKUP_DIR"
    info "📄 Archivo de backup: $backup_file"
    
    # Simular backup creando un archivo de prueba
    cat > "$backup_file" << EOF
-- BlueSystem.io Database Backup Simulation
-- Generated on: $(date)
-- This is a test backup file

CREATE DATABASE IF NOT EXISTS bluesystem_test;
USE bluesystem_test;

CREATE TABLE test_backup (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO test_backup (name) VALUES 
('Test Backup Entry 1'),
('Test Backup Entry 2'),
('Backup completed successfully');

-- End of backup
EOF
    
    log "✅ Backup simulado completado exitosamente"
    info "📊 Tamaño del archivo: $(du -h "$backup_file" | cut -f1)"
    
    return 0
}

# Función para listar backups
list_backups() {
    log "📋 Listando backups disponibles..."
    
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
        warning "No hay backups disponibles en $BACKUP_DIR"
        return 0
    fi
    
    echo ""
    echo -e "${BLUE}Backups disponibles:${NC}"
    echo "===================="
    
    for file in "$BACKUP_DIR"/*.sql; do
        if [ -f "$file" ]; then
            local filename=$(basename "$file")
            local size=$(du -h "$file" | cut -f1)
            local date=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$file" 2>/dev/null || stat -c "%y" "$file" 2>/dev/null | cut -d' ' -f1,2)
            
            echo -e "${GREEN}📄 $filename${NC}"
            echo -e "   📊 Tamaño: $size"
            echo -e "   📅 Fecha: $date"
            echo ""
        fi
    done
}

# Función para limpiar backups antiguos
cleanup_backups() {
    local days=${1:-7}
    
    log "🧹 Limpiando backups antiguos (más de $days días)..."
    
    if [ ! -d "$BACKUP_DIR" ]; then
        warning "Directorio de backups no existe: $BACKUP_DIR"
        return 0
    fi
    
    local deleted=0
    
    # Buscar archivos más antiguos que X días
    find "$BACKUP_DIR" -name "*.sql" -type f -mtime +$days -print0 | while IFS= read -r -d '' file; do
        echo -e "${YELLOW}🗑️  Eliminando: $(basename "$file")${NC}"
        rm "$file"
        ((deleted++))
    done
    
    if [ $deleted -eq 0 ]; then
        info "No hay backups antiguos para eliminar"
    else
        log "✅ Se eliminaron $deleted backups antiguos"
    fi
}

# Función de ayuda
show_help() {
    echo -e "${BLUE}BlueSystem.io - Script de Backup de Prueba${NC}"
    echo ""
    echo "Uso: $0 [COMANDO] [OPCIONES]"
    echo ""
    echo "Comandos disponibles:"
    echo "  backup [nombre]     - Crear backup simulado (nombre opcional)"
    echo "  list               - Listar backups disponibles" 
    echo "  cleanup [días]     - Limpiar backups antiguos (default: 7 días)"
    echo "  help               - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 backup                    # Backup completo con timestamp"
    echo "  $0 backup mi_backup          # Backup con nombre específico"
    echo "  $0 list                      # Listar todos los backups"
    echo "  $0 cleanup 14                # Limpiar backups de más de 14 días"
    echo ""
}

# Procesamiento de argumentos
case "${1:-help}" in
    "backup")
        simulate_backup "$2"
        ;;
    "list")
        list_backups
        ;;
    "cleanup")
        cleanup_backups "$2"
        ;;
    "help"|*)
        show_help
        ;;
esac 