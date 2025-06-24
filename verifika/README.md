# 🚀 Verifika - Sistema de Validación de Actividades Técnicas

Sistema web completo para la gestión y validación de actividades técnicas diarias.

## 📋 Descripción

Verifika permite a técnicos registrar sus actividades diarias, a clientes validarlas, y a administradores gestionar todo el proceso con métricas y reportes.

## 🏗️ Estructura del Proyecto

```
verifika/
├── backend/           # API Node.js + Express
│   ├── routes/       # Endpoints de la API
│   ├── models/       # Modelos de datos
│   ├── middleware/   # Middleware personalizado
│   ├── config/       # Configuraciones
│   └── tests/        # Pruebas unitarias
├── frontend/         # Frontend React + Vite
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/      # Páginas principales
│   │   ├── utils/      # Utilidades
│   │   └── hooks/      # Custom hooks
│   └── public/        # Archivos estáticos
└── docs/             # Documentación adicional
```

## 🔧 Comandos de Desarrollo

```bash
# Desarrollo
cd verifika/frontend && npm run dev  # Frontend en localhost:5174
cd verifika/backend && npm run dev   # Backend en localhost:3001

# Testing
cd verifika && npm test              # Pruebas unitarias
cd verifika && npm run test:e2e      # Pruebas end-to-end

# Despliegue
docker-compose -f docker-compose.yml -f docker-compose.verifika.yml up -d
```

## 🌐 URLs

- **Desarrollo Frontend**: http://localhost:5174
- **API Backend**: http://localhost:3001/api
- **Producción**: http://localhost/verifika

## 👥 Usuarios

- **Técnicos**: Registran actividades con horarios y archivos
- **Clientes**: Validan o rechazan actividades con comentarios  
- **Administradores**: Gestionan usuarios, asignaciones y métricas

## 📊 Funcionalidades Principales

- Registro de actividades técnicas diarias
- Auto-cálculo de horas trabajadas
- Upload de archivos (fotos, PDFs)
- Sistema de validación cliente
- Panel administrativo con métricas
- Exportación a Excel
- Notificaciones por email

## 🔗 Integración

Verifika se integra como módulo híbrido en la infraestructura BlueSystem:
- Comparte MySQL, Redis y Nginx
- Sistema de autenticación unificado
- Logging centralizado con Winston

---

*Proyecto Dart AI ID: slF0dOywYY8R*