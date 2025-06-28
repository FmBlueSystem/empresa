#!/bin/bash

BASE_URL="http://localhost:3001"

echo "🧪 Iniciando validación completa de endpoints Verifika..."
echo "=================================================="

# Función para login y obtener token
login() {
    local email=$1
    local password=$2
    local role=$3
    
    echo "📝 Probando login $role ($email)..."
    response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}")
    
    success=$(echo $response | jq -r '.success')
    if [ "$success" = "true" ]; then
        token=$(echo $response | jq -r '.data.token')
        name=$(echo $response | jq -r '.data.user.nombre')
        echo "✅ Login exitoso para $role: $name"
        echo $token
    else
        echo "❌ Error login $role: $(echo $response | jq -r '.message')"
        echo ""
    fi
}

# Función para probar endpoint
test_endpoint() {
    local endpoint=$1
    local method=${2:-GET}
    local token=$3
    local data=${4:-""}
    
    if [ -z "$token" ] || [ "$token" = "" ]; then
        echo "❌ $method $endpoint - No token disponible"
        return
    fi
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json")
    else
        response=$(curl -s -X "$method" "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    success=$(echo $response | jq -r '.success // empty')
    message=$(echo $response | jq -r '.message // empty')
    
    if [ "$success" = "true" ]; then
        echo "✅ $method $endpoint - OK: $message"
    elif [ "$success" = "false" ]; then
        echo "⚠️  $method $endpoint - WARN: $message"
    else
        echo "❌ $method $endpoint - ERROR: $response"
    fi
}

echo ""
echo "1️⃣ AUTENTICACIÓN"
echo "=================="

# Login con todos los roles
ADMIN_TOKEN=$(login "admin@bluesystem.io" "admin123" "Admin")
TECNICO_TOKEN=$(login "tecnico@bluesystem.io" "tecnico123" "Técnico")
CLIENTE_TOKEN=$(login "cliente@bluesystem.io" "cliente123" "Cliente")

echo ""
echo "2️⃣ HEALTH CHECKS"
echo "================="

test_endpoint "/health" "GET" "$ADMIN_TOKEN"
test_endpoint "/health/detailed" "GET" "$ADMIN_TOKEN"

echo ""
echo "3️⃣ ENDPOINTS DE TÉCNICOS"
echo "========================="

test_endpoint "/api/tecnicos" "GET" "$ADMIN_TOKEN"
test_endpoint "/api/tecnicos/stats" "GET" "$ADMIN_TOKEN"
test_endpoint "/api/tecnicos/available" "GET" "$ADMIN_TOKEN"

echo ""
echo "4️⃣ ENDPOINTS DE COMPETENCIAS"
echo "=============================="

test_endpoint "/api/competencias" "GET" "$ADMIN_TOKEN"
test_endpoint "/api/competencias/categories" "GET" "$ADMIN_TOKEN"
test_endpoint "/api/competencias/stats" "GET" "$ADMIN_TOKEN"

echo ""
echo "5️⃣ ENDPOINTS DE CLIENTES"
echo "========================="

test_endpoint "/api/clientes" "GET" "$ADMIN_TOKEN"
test_endpoint "/api/clientes/stats" "GET" "$ADMIN_TOKEN"

echo ""
echo "6️⃣ ENDPOINTS DE ASIGNACIONES"
echo "============================="

test_endpoint "/api/asignaciones" "GET" "$ADMIN_TOKEN"
test_endpoint "/api/asignaciones/active" "GET" "$ADMIN_TOKEN"
test_endpoint "/api/asignaciones/stats" "GET" "$ADMIN_TOKEN"

echo ""
echo "7️⃣ ENDPOINTS DE ACTIVIDADES"
echo "============================"

test_endpoint "/api/actividades" "GET" "$ADMIN_TOKEN"
test_endpoint "/api/actividades/stats" "GET" "$ADMIN_TOKEN"

echo ""
echo "8️⃣ ENDPOINTS DE VALIDACIONES"
echo "============================="

test_endpoint "/api/validaciones" "GET" "$ADMIN_TOKEN"
test_endpoint "/api/validaciones/stats" "GET" "$ADMIN_TOKEN"

echo ""
echo "9️⃣ TESTS DE PERMISOS POR ROL"
echo "=============================="

echo "🔧 Técnico accediendo a sus endpoints:"
test_endpoint "/api/tecnicos" "GET" "$TECNICO_TOKEN"
test_endpoint "/api/auth/me" "GET" "$TECNICO_TOKEN"

echo ""
echo "✅ Cliente accediendo a sus endpoints:"
test_endpoint "/api/auth/me" "GET" "$CLIENTE_TOKEN"

echo ""
echo "🎉 VALIDACIÓN DE ENDPOINTS COMPLETADA"
echo "======================================"