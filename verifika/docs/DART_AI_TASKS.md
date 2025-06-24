# 🎯 Tareas Específicas para Dart AI - Proyecto Verifika

**Proyecto Dart AI ID:** slF0dOywYY8R  
**Token:** dsa_df88b54b32408afbe42489b08d25bfbf91759ab7d2d1cdac26f4d72b51c71583

---

## 📋 RESUMEN PARA DART AI

**Total de tareas:** 168 tareas específicas  
**Estado actual:** 15% completado (documentación)  
**Próxima fase crítica:** FASE 2.1 - Autenticación  
**Duración estimada:** 16 semanas

---

## 🚨 TAREAS CRÍTICAS INMEDIATAS (Semana 1)

### 🔐 FASE 2.1: AUTENTICACIÓN - 11 Tareas

#### Tarea 1: Setup Servidor Express
- **ID:** VRF-001
- **Prioridad:** CRÍTICA
- **Estimación:** 4 horas
- **Dependencias:** Ninguna
- **Descripción:** Configurar estructura inicial del servidor Node.js + Express
- **Criterios de aceptación:**
  - Servidor responde en puerto 3001
  - Estructura de carpetas MVC creada
  - Middleware básico configurado
  - Health check endpoint funcionando

#### Tarea 2: Configuración Base de Datos
- **ID:** VRF-002
- **Prioridad:** CRÍTICA
- **Estimación:** 6 horas
- **Dependencias:** VRF-001
- **Descripción:** Configurar MySQL con 12 esquemas de tablas
- **Criterios de aceptación:**
  - Conexión a MySQL establecida
  - 12 tablas creadas con relaciones
  - Triggers de validación implementados
  - Índices de performance configurados

#### Tarea 3: Sistema JWT + Usuarios
- **ID:** VRF-003
- **Prioridad:** CRÍTICA
- **Estimación:** 8 horas
- **Dependencias:** VRF-002
- **Descripción:** Implementar autenticación JWT con roles
- **Criterios de aceptación:**
  - Modelo Usuario funcional
  - Login/logout operativo
  - JWT tokens generados correctamente
  - Middleware de autenticación

#### Tarea 4: Middleware Roles
- **ID:** VRF-004
- **Prioridad:** CRÍTICA
- **Estimación:** 6 horas
- **Dependencias:** VRF-003
- **Descripción:** Sistema de autorización por roles
- **Criterios de aceptación:**
  - Roles admin/técnico/cliente implementados
  - Rutas protegidas por rol
  - Verificación de permisos en endpoints

#### Tarea 5: Sistema Invitaciones
- **ID:** VRF-005
- **Prioridad:** CRÍTICA
- **Estimación:** 8 horas
- **Dependencias:** VRF-004
- **Descripción:** Envío automático de invitaciones por email
- **Criterios de aceptación:**
  - Servicio de email configurado
  - Templates de invitación
  - Tokens de invitación únicos
  - Proceso de aceptación completo

#### Tarea 6: Recuperación Contraseñas
- **ID:** VRF-006
- **Prioridad:** ALTA
- **Estimación:** 6 horas
- **Dependencias:** VRF-005
- **Descripción:** Sistema completo de reset de contraseñas
- **Criterios de aceptación:**
  - Endpoint de solicitud reset
  - Tokens temporales seguros
  - Página de cambio de contraseña
  - Notificación por email

#### Tarea 7: Validación Inputs
- **ID:** VRF-007
- **Prioridad:** ALTA
- **Estimación:** 4 horas
- **Dependencias:** VRF-003
- **Descripción:** Validación robusta con Joi
- **Criterios de aceptación:**
  - Esquemas Joi para todos los endpoints
  - Mensajes de error detallados
  - Sanitización de inputs
  - Prevención de inyecciones

#### Tarea 8: Variables Entorno
- **ID:** VRF-008
- **Prioridad:** MEDIA
- **Estimación:** 2 horas
- **Dependencias:** VRF-001
- **Descripción:** Configuración completa de .env
- **Criterios de aceptación:**
  - Archivo .env.example actualizado
  - Variables documentadas
  - Configuración por ambientes
  - Validación de variables requeridas

#### Tarea 9: Redis Setup
- **ID:** VRF-009
- **Prioridad:** MEDIA
- **Estimación:** 4 horas
- **Dependencias:** VRF-001
- **Descripción:** Configurar Redis para sesiones y caché
- **Criterios de aceptación:**
  - Conexión Redis establecida
  - Sesiones almacenadas en Redis
  - Sistema de caché básico
  - TTL configurado correctamente

#### Tarea 10: Logging Winston
- **ID:** VRF-010
- **Prioridad:** MEDIA
- **Estimación:** 3 horas
- **Dependencias:** VRF-001
- **Descripción:** Sistema de logs estructurados
- **Criterios de aceptación:**
  - Winston configurado
  - Logs por niveles (error, warn, info)
  - Rotación de archivos
  - Logs estructurados JSON

#### Tarea 11: Health Checks
- **ID:** VRF-011
- **Prioridad:** BAJA
- **Estimación:** 2 horas
- **Dependencias:** VRF-001
- **Descripción:** Endpoints de monitoreo
- **Criterios de aceptación:**
  - /health endpoint básico
  - /health/detailed con dependencias
  - Verificación DB y Redis
  - Métricas de sistema

---

## 👨‍🔧 FASE 2.2: MÓDULO TÉCNICOS (Semanas 2-3)

### Backend Técnicos - 16 Tareas

#### Tarea 12: Modelo TecnicoPerfiles
- **ID:** VRF-012
- **Prioridad:** CRÍTICA
- **Estimación:** 6 horas
- **Dependencias:** VRF-002
- **Descripción:** Modelo completo de perfiles técnicos

#### Tarea 13-27: [Continúa con las 16 tareas backend]

### Frontend Técnicos - 7 Tareas

#### Tarea 28: TecnicosListPage
- **ID:** VRF-028
- **Prioridad:** ALTA
- **Estimación:** 12 horas
- **Dependencias:** Backend técnicos completado
- **Descripción:** Lista administrativa con filtros

#### Tarea 29-34: [Continúa con las 7 tareas frontend]

---

## 🏢 MÓDULOS SIGUIENTES

### FASE 2.3: Clientes (18 tareas)
- **IDs:** VRF-035 a VRF-052
- **Dependencias:** FASE 2.1 completada
- **Duración:** 2 semanas

### FASE 2.4: Asignaciones (22 tareas)
- **IDs:** VRF-053 a VRF-074
- **Dependencias:** Técnicos + Clientes completados
- **Duración:** 2.5 semanas

### FASE 3: Dashboards (15 tareas)
- **IDs:** VRF-075 a VRF-089
- **Dependencias:** Asignaciones completadas
- **Duración:** 1.5 semanas

### FASE 4: Actividades (26 tareas)
- **IDs:** VRF-090 a VRF-115
- **Dependencias:** Dashboards completados
- **Duración:** 3 semanas

### FASE 5: Validaciones (18 tareas)
- **IDs:** VRF-116 a VRF-133
- **Dependencias:** Actividades completadas
- **Duración:** 2 semanas

### FASE 6: Infraestructura (23 tareas)
- **IDs:** VRF-134 a VRF-156
- **Dependencias:** Core completado
- **Duración:** 1.5 semanas

### FASE 7: Testing (12 tareas)
- **IDs:** VRF-157 a VRF-168
- **Dependencias:** Todo completado
- **Duración:** 1.5 semanas

---

## 📊 MÉTRICAS PARA DART AI

### KPIs de Seguimiento
- **Velocity:** Tareas completadas por día
- **Quality:** % tests passing
- **Blockers:** Tareas bloqueadas por dependencias
- **Risk:** Tareas críticas en riesgo

### Alertas Automáticas
- Tarea crítica lleva >1 día sin progreso
- Dependencia no completada cerca de deadline
- Tests failing en tarea marcada como completada
- Performance degradation detectada

### Reportes Automáticos
- **Daily:** Estado de tareas críticas
- **Weekly:** Resumen de progreso y proyecciones
- **Biweekly:** Análisis de riesgos y recomendaciones

---

## 🔄 INTEGRACIÓN DART AI

### Comandos MCP Disponibles
```bash
# Actualizar progreso de tarea
dart-task-update --id VRF-001 --status completed --notes "Servidor funcionando"

# Reportar blocker
dart-task-block --id VRF-003 --reason "Esperando configuración DB"

# Solicitar review
dart-task-review --id VRF-005 --reviewer "lead-dev"

# Generar reporte
dart-progress-report --type weekly --format json
```

### Webhooks Configurados
- **Task Completion:** Notificar cuando se completa tarea crítica
- **Dependency Block:** Alertar cuando una dependencia bloquea progreso
- **Timeline Risk:** Avisar si el proyecto se está retrasando

### API Endpoints para Dart AI
```bash
# Estado del proyecto
GET /api/dart/project-status

# Actualizar tarea
POST /api/dart/tasks/{id}/update
{
  "status": "in_progress",
  "progress": 75,
  "notes": "Implementación casi completa",
  "estimated_completion": "2025-06-25"
}

# Reportar métricas
POST /api/dart/metrics
{
  "tasks_completed": 5,
  "tasks_blocked": 1,
  "code_coverage": 85,
  "performance_score": 92
}
```

---

## 📋 CHECKLIST DART AI

### Setup Inicial ✅
- [x] Proyecto creado en Dart AI
- [x] Token MCP configurado
- [x] Tareas iniciales cargadas
- [x] Webhooks configurados

### Próximos Pasos ⏳
- [ ] Sync de 168 tareas específicas
- [ ] Configurar alertas automáticas
- [ ] Establecer métricas de quality gates
- [ ] Configurar reportes automatizados

### Validaciones Requeridas 🔍
- [ ] Verificar que todas las dependencias están mapeadas
- [ ] Confirmar estimaciones realistas
- [ ] Validar criterios de aceptación
- [ ] Establecer process de review

---

## 🎯 OBJETIVOS POR SPRINT

### Sprint 1 (Semana 1): Autenticación
- **Goal:** Sistema de login funcional
- **Tasks:** VRF-001 a VRF-011
- **Success Criteria:** Usuario admin puede autenticarse

### Sprint 2 (Semana 2): Backend Técnicos
- **Goal:** API completa de gestión técnicos
- **Tasks:** VRF-012 a VRF-027
- **Success Criteria:** CRUD técnicos + competencias operativo

### Sprint 3 (Semana 3): Frontend Técnicos
- **Goal:** Interfaz completa gestión técnicos
- **Tasks:** VRF-028 a VRF-034
- **Success Criteria:** Admin puede gestionar técnicos end-to-end

---

*Última sincronización: 2025-06-24*  
*Próxima sync: Automática daily*  
*Estado MCP: ✅ Conectado y operativo*