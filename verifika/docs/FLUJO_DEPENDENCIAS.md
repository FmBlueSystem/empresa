# 🔄 Matriz de Dependencias - Proyecto Verifika

**Proyecto Dart AI ID:** slF0dOywYY8R

## 🚨 FLUJO CORREGIDO - Orden de Implementación Obligatorio

### ❌ Problema Identificado Original:
El flujo inicial permitía crear actividades sin tener técnicos validados, lo que generaría errores y inconsistencias en el sistema.

### ✅ Solución Implementada:
Reorganización completa con dependencias explícitas y validaciones en cada nivel.

---

## 📋 MATRIZ DE DEPENDENCIAS

| Módulo | Depende de | Bloquea a | Prioridad | Orden |
|--------|------------|-----------|-----------|-------|
| **Autenticación** | - | Todos los demás | CRÍTICA | 1 |
| **Gestión Técnicos** | Autenticación | Asignaciones, Actividades | ALTA | 2 |
| **Gestión Clientes** | Autenticación | Asignaciones, Validaciones | ALTA | 3 |
| **Asignaciones** | Técnicos + Clientes | Actividades | MEDIA | 4 |
| **Dashboards** | Usuarios + Asignaciones | Actividades | MEDIA | 5 |
| **Actividades** | Asignaciones activas | Validaciones | MEDIA | 6 |
| **Validaciones** | Actividades | Reportes | BAJA | 7 |
| **Reportes** | Todos los anteriores | - | BAJA | 8 |

---

## 🔗 DEPENDENCIAS DETALLADAS

### 🏗️ FASE 1: FUNDAMENTOS (Semana 1)
**Estado:** ✅ Completado
- [x] Documentación y arquitectura
- [x] Configuración de stack tecnológico
- [x] Configuración MCP con Dart AI

### 🔐 FASE 2.1: AUTENTICACIÓN (Semana 2)
**Dependencias:** Ninguna  
**Bloquea:** Todos los módulos

**Tareas Críticas:**
- [ ] Sistema de usuarios base con roles
- [ ] JWT y middleware de autenticación
- [ ] Sistema de invitaciones por email
- [ ] Recuperación de contraseñas

**Criterios de Finalización:**
- ✅ Usuario admin puede crear cuentas
- ✅ Sistema de roles funcional
- ✅ Login/logout operativo
- ✅ Invitaciones por email funcionando

---

### 👨‍🔧 FASE 2.2: MÓDULO TÉCNICOS (Semana 2-3)
**Dependencias:** FASE 2.1 completada  
**Bloquea:** Asignaciones, Actividades, Dashboards

**⚠️ ORDEN OBLIGATORIO DE IMPLEMENTACIÓN:**

#### 2.2.1 Backend Técnicos (PRIMERA PRIORIDAD)
- [ ] `POST /api/tecnicos` - Crear técnico con validaciones
- [ ] `GET /api/tecnicos` - Listar con filtros
- [ ] `PUT /api/tecnicos/:id` - Actualizar perfil
- [ ] `POST /api/tecnicos/invitar` - Sistema de invitaciones
- [ ] `GET /api/tecnicos/:id/competencias` - Gestión competencias
- [ ] `POST /api/tecnicos/:id/documentos` - Upload certificaciones

#### 2.2.2 Frontend Técnicos (SEGUNDA PRIORIDAD)
- [ ] **TecnicosListPage** - Lista administrativa
- [ ] **TecnicoCreateForm** - Formulario de alta
- [ ] **TecnicoInviteModal** - Invitaciones
- [ ] **TecnicoOnboardingWizard** - Proceso de alta
- [ ] **TecnicoPerfilPage** - Perfil personal

**Criterios de Finalización:**
- ✅ Admin puede crear y gestionar técnicos
- ✅ Técnicos pueden completar su perfil
- ✅ Sistema de competencias operativo
- ✅ Upload de documentos funcional
- ✅ Validación de perfiles completa

---

### 🏢 FASE 2.3: MÓDULO CLIENTES (Semana 3)
**Dependencias:** FASE 2.1 completada  
**Ejecutar en paralelo con:** FASE 2.2

#### 2.3.1 Backend Clientes
- [ ] `POST /api/clientes` - Crear cliente
- [ ] `POST /api/clientes/:id/validadores` - Gestión validadores
- [ ] `GET /api/clientes/:id/configuracion` - Configuración

#### 2.3.2 Frontend Clientes
- [ ] **ClientesListPage** - Gestión administrativa
- [ ] **ClienteCreateForm** - Alta de cliente
- [ ] **ClienteValidadoresManager** - Gestión validadores

**Criterios de Finalización:**
- ✅ Admin puede gestionar clientes
- ✅ Configuración de validadores operativa
- ✅ Configuración de validación personalizada

---

### 🔗 FASE 2.4: MÓDULO ASIGNACIONES (Semana 4)
**Dependencias:** FASE 2.2 Y 2.3 completadas  
**Bloquea:** Actividades, Dashboards funcionales

**⚠️ VALIDACIONES CRÍTICAS:**
- Solo técnicos con estado "activo"
- Solo clientes con configuración completa
- Verificación de competencias requeridas

#### 2.4.1 Backend Asignaciones
- [ ] `POST /api/asignaciones` - Crear con validaciones
- [ ] `POST /api/asignaciones/validar` - Validar competencias
- [ ] `GET /api/asignaciones/tecnico/:id` - Por técnico
- [ ] `GET /api/asignaciones/cliente/:id` - Por cliente

#### 2.4.2 Frontend Asignaciones
- [ ] **AsignacionesListPage** - Vista completa
- [ ] **AsignacionCreateModal** - Crear con validaciones
- [ ] **AsignacionValidationComponent** - Verificar competencias

**Criterios de Finalización:**
- ✅ Asignaciones solo con usuarios validados
- ✅ Verificación de competencias automática
- ✅ Vista calendario de asignaciones
- ✅ Gestión de estados (activa/pausada/finalizada)

---

### 📋 FASE 2.5: DASHBOARDS (Semana 4-5)
**Dependencias:** FASE 2.4 completada  
**Prerrequisito:** Datos de usuarios y asignaciones

#### 2.5.1 Dashboards por Rol
- [ ] **TecnicoDashboard** - Vista con asignaciones activas
- [ ] **ClienteDashboard** - Técnicos asignados
- [ ] **AdminDashboard** - Vista ejecutiva

**Criterios de Finalización:**
- ✅ Dashboards muestran datos reales
- ✅ Navegación entre módulos operativa
- ✅ Métricas básicas funcionales

---

### 📝 FASE 2.6: MÓDULO ACTIVIDADES (Semana 5-6)
**Dependencias:** FASE 2.5 completada  
**Validación crítica:** Solo técnicos con asignaciones activas

#### 2.6.1 Backend Actividades
- [ ] `POST /api/actividades` - Solo técnicos asignados
- [ ] Validación de asignación activa
- [ ] Auto-cálculo de horas trabajadas
- [ ] Upload de archivos con validaciones

#### 2.6.2 Frontend Actividades
- [ ] **ActividadCreateForm** - Con validaciones
- [ ] **ActividadTimeCalculator** - Cálculo automático
- [ ] **ActividadFileUpload** - Upload seguro

**Criterios de Finalización:**
- ✅ Solo técnicos asignados pueden crear actividades
- ✅ Validación de horarios y fechas
- ✅ Upload de archivos operativo
- ✅ Auto-cálculo de horas funcional

---

### ✅ FASE 2.7: MÓDULO VALIDACIONES (Semana 6-7)
**Dependencias:** FASE 2.6 completada  
**Usuarios:** Solo validadores autorizados

#### 2.7.1 Sistema de Validaciones
- [ ] Solo validadores pueden aprobar/rechazar
- [ ] Historial completo de cambios
- [ ] Notificaciones automáticas
- [ ] Comentarios obligatorios en rechazos

**Criterios de Finalización:**
- ✅ Sistema de permisos operativo
- ✅ Workflow de validación completo
- ✅ Notificaciones funcionando
- ✅ Auditoría de cambios

---

### 📊 FASE 2.8: REPORTES Y MÉTRICAS (Semana 7-8)
**Dependencias:** Todos los módulos anteriores  
**Función:** Consolidación de datos

#### 2.8.1 Sistema de Reportes
- [ ] Métricas por técnico
- [ ] Reportes por cliente
- [ ] Exportación a Excel
- [ ] Dashboard ejecutivo

---

## 🔒 VALIDACIONES DE INTEGRIDAD

### Reglas de Negocio Implementadas:

1. **No actividades sin asignaciones**
   ```sql
   -- Trigger que valida asignación activa
   CREATE TRIGGER validate_actividad_asignacion 
   BEFORE INSERT ON actividades
   FOR EACH ROW 
   BEGIN
       IF NOT EXISTS (
           SELECT 1 FROM asignaciones 
           WHERE id = NEW.asignacion_id 
           AND estado = 'activa'
       ) THEN
           SIGNAL SQLSTATE '45000' 
           SET MESSAGE_TEXT = 'No se puede crear actividad sin asignación activa';
       END IF;
   END;
   ```

2. **No asignaciones sin técnicos validados**
   ```sql
   -- Trigger que valida técnico activo
   CREATE TRIGGER validate_asignacion_tecnico
   BEFORE INSERT ON asignaciones
   FOR EACH ROW 
   BEGIN
       IF NOT EXISTS (
           SELECT 1 FROM usuarios 
           WHERE id = NEW.tecnico_id 
           AND rol = 'tecnico' 
           AND estado = 'activo'
       ) THEN
           SIGNAL SQLSTATE '45000' 
           SET MESSAGE_TEXT = 'No se puede asignar técnico inactivo';
       END IF;
   END;
   ```

3. **Validaciones solo por usuarios autorizados**
   - Frontend: Verificación de permisos en cada componente
   - Backend: Middleware de autorización en endpoints
   - Base de datos: Foreign keys y constraints

---

## 📈 MÉTRICAS DE PROGRESO

### Estado Actual (2025-06-24):
- ✅ **Documentación**: 100%
- ✅ **Arquitectura**: 100%
- ✅ **Base de Datos**: 100%
- ⏳ **Backend**: 0% (Listo para iniciar)
- ⏳ **Frontend**: 0% (Listo para iniciar)

### Próximos Hitos:
1. **Semana 2**: Autenticación + Gestión Técnicos
2. **Semana 3**: Gestión Clientes + Inicio Asignaciones
3. **Semana 4**: Completar Asignaciones + Dashboards
4. **Semana 5**: Módulo Actividades
5. **Semana 6**: Sistema Validaciones
6. **Semana 7**: Reportes y Optimización
7. **Semana 8**: Testing y Deployment

---

*Última actualización: 2025-06-24*  
*Estado: Flujo reorganizado y validado*  
*Proyecto Dart AI ID: slF0dOywYY8R*