#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:3001"

def login(email, password):
    """Login and return token"""
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", 
                               json={"email": email, "password": password})
        data = response.json()
        if data.get("success"):
            return data["data"]["token"]
        else:
            print(f"❌ Login failed: {data.get('message')}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_endpoint(endpoint, token, method="GET", data=None):
    """Test an endpoint with authentication"""
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        if method == "GET":
            response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
        elif method == "POST":
            response = requests.post(f"{BASE_URL}{endpoint}", headers=headers, json=data)
        
        if response.status_code == 200:
            result = response.json()
            status = "✅" if result.get("success") else "⚠️"
            print(f"{status} {method} {endpoint} - {result.get('message', 'OK')}")
            return result
        else:
            print(f"❌ {method} {endpoint} - HTTP {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data.get('message', 'Unknown error')}")
            except:
                print(f"   Raw response: {response.text[:100]}")
            return None
    except Exception as e:
        print(f"❌ {method} {endpoint} - Exception: {e}")
        return None

def main():
    print("🧪 Iniciando validación de API Verifika...")
    print("=" * 50)
    
    # Test health first
    try:
        response = requests.get(f"{BASE_URL}/health")
        health = response.json()
        print(f"✅ Health check: {health.get('message')}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return
    
    print("\n1️⃣ AUTENTICACIÓN")
    print("=" * 20)
    
    # Login con admin
    admin_token = login("admin@bluesystem.io", "admin123")
    tecnico_token = login("tecnico@bluesystem.io", "tecnico123")
    cliente_token = login("cliente@bluesystem.io", "cliente123")
    
    if not admin_token:
        print("❌ No se pudo obtener token de admin, abortando tests")
        return
    
    print(f"\n✅ Admin token obtenido: {admin_token[:30]}...")
    
    print("\n2️⃣ ENDPOINTS PRINCIPALES")
    print("=" * 25)
    
    # Test endpoints with admin token
    endpoints = [
        "/api/tecnicos",
        "/api/tecnicos/stats", 
        "/api/competencias",
        "/api/competencias/stats",
        "/api/clientes",
        "/api/clientes/stats",
        "/api/asignaciones",
        "/api/asignaciones/stats",
        "/api/actividades",
        "/api/actividades/stats",
        "/api/validaciones",
        "/api/validaciones/stats"
    ]
    
    for endpoint in endpoints:
        test_endpoint(endpoint, admin_token)
    
    print("\n3️⃣ PERMISOS POR ROL")
    print("=" * 20)
    
    if tecnico_token:
        print("🔧 Testing Técnico endpoints:")
        test_endpoint("/api/auth/me", tecnico_token)
        test_endpoint("/api/tecnicos", tecnico_token)
    
    if cliente_token:
        print("\n✅ Testing Cliente endpoints:")
        test_endpoint("/api/auth/me", cliente_token)
    
    print("\n🎉 Validación completada!")

if __name__ == "__main__":
    main()