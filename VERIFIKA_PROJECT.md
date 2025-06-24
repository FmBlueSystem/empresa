# 🚀 Proyecto Verifika - Sistema de Validación de Actividades Técnicas

**Nombre del proyecto en Dart AI:** Verifika  
**ID del proyecto:** slF0dOywYY8R

## 📋 Descripción General

Verifika es un sistema web completo para la gestión y validación de actividades técnicas diarias. Permite a técnicos registrar sus actividades, a clientes validarlas, y a administradores gestionar todo el proceso con métricas y reportes.

### 👥 Usuarios Objetivo
- **Técnicos**: Registran actividades diarias con detalles y archivos adjuntos
- **Clientes**: Validan o rechazan actividades con comentarios  
- **Administradores**: Gestionan usuarios, asignaciones y métricas

---

## 🔁 FASE 1 – Fundamentos del Proyecto

### 🧱 1.1 Estructura Inicial
- [x] Crear proyecto "Verifika" en Dart AI
- [ ] Definir objetivos funcionales y usuarios clave (admin, técnico, cliente)
- [ ] Configurar documentación técnica base
- [ ] Definir arquitectura (SPA, microfrontend o híbrida)
- [ ] Elegir stack tecnológico (frontend, backend, auth, DB, hosting)

**Stack Tecnológico Propuesto:**
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + JWT
- **Base de Datos**: MySQL 8.0
- **Cache**: Redis 7
- **Autenticación**: JWT + bcrypt
- **Hosting**: Docker + Nginx
- **Archivos**: Multer + almacenamiento local/cloud

---

## 🧑‍💻 FASE 2 – Backend (API RESTful) - FLUJO REORGANIZADO

### ⚙️ 2.1 Estructura Base y Autenticación
- [ ] Crear estructura de servidor (Node.js + Express)
- [ ] Configurar base de datos MySQL con esquemas completos
- [ ] Crear endpoints de autenticación (login, invitación, registro)
- [ ] Crear modelo de usuarios base con roles: técnico, cliente, admin

### 👨‍🔧 2.2 MÓDULO TÉCNICOS (PRIMERA PRIORIDAD)
**⚠️ DEBE IMPLEMENTARSE ANTES QUE CUALQUIER OTRO MÓDULO**
- [ ] `POST /api/tecnicos` → Crear técnico con validaciones completas
- [ ] `GET /api/tecnicos` → Listar técnicos con filtros y paginación
- [ ] `PUT /api/tecnicos/:id` → Actualizar datos y competencias
- [ ] `DELETE /api/tecnicos/:id` → Desactivar técnico (soft delete)
- [ ] `POST /api/tecnicos/invitar` → Sistema de invitaciones por email
- [ ] `GET /api/tecnicos/:id/competencias` → Gestión de competencias técnicas
- [ ] `POST /api/tecnicos/:id/documentos` → Upload de certificaciones
- [ ] `GET /api/tecnicos/:id/perfil` → Perfil completo del técnico
- [ ] `PUT /api/tecnicos/:id/estado` → Activar/desactivar técnico

### 🏢 2.3 MÓDULO CLIENTES (SEGUNDA PRIORIDAD)
- [ ] `POST /api/clientes` → Crear cliente con configuraciones
- [ ] `GET /api/clientes` → Listar clientes activos
- [ ] `PUT /api/clientes/:id` → Actualizar información cliente
- [ ] `POST /api/clientes/:id/validadores` → Gestionar usuarios validadores
- [ ] `GET /api/clientes/:id/configuracion` → Configuración de validación

### 🔗 2.4 MÓDULO ASIGNACIONES (TERCERA PRIORIDAD)
**⚠️ SOLO DESPUÉS DE TENER TÉCNICOS Y CLIENTES VALIDADOS**
- [ ] `POST /api/asignaciones` → Crear asignación técnico-cliente
- [ ] `GET /api/asignaciones` → Listar asignaciones activas
- [ ] `PUT /api/asignaciones/:id` → Modificar asignación
- [ ] `DELETE /api/asignaciones/:id` → Finalizar asignación
- [ ] `GET /api/asignaciones/tecnico/:id` → Asignaciones de un técnico
- [ ] `GET /api/asignaciones/cliente/:id` → Técnicos asignados a cliente
- [ ] `POST /api/asignaciones/validar` → Validar competencias para asignación

### 📋 2.5 MÓDULO ACTIVIDADES (CUARTA PRIORIDAD)
**⚠️ SOLO DESPUÉS DE TENER ASIGNACIONES ACTIVAS**
- [ ] `POST /api/actividades` → Registrar actividad (solo técnicos asignados)
- [ ] `GET /api/actividades` → Listar actividades con filtros
- [ ] `PUT /api/actividades/:id` → Editar actividad (solo pendientes)
- [ ] `DELETE /api/actividades/:id` → Eliminar actividad (solo pendientes)
- [ ] `GET /api/actividades/tecnico/:id` → Actividades de técnico
- [ ] `GET /api/actividades/cliente/:id` → Actividades para validar

### ✅ 2.6 MÓDULO VALIDACIONES (QUINTA PRIORIDAD)
- [ ] `POST /api/validaciones` → Validar/rechazar actividad
- [ ] `GET /api/validaciones` → Historial de validaciones
- [ ] `PUT /api/validaciones/:id` → Modificar validación
- [ ] `POST /api/validaciones/:id/comentarios` → Agregar comentarios

### 📊 2.7 MÓDULO REPORTES Y EXPORTACIÓN (SEXTA PRIORIDAD)
- [ ] `GET /api/reportes/tecnicos` → Métricas por técnico
- [ ] `GET /api/reportes/clientes` → Métricas por cliente
- [ ] `GET /api/exportar/actividades` → Exportar Excel actividades
- [ ] `GET /api/exportar/tecnicos` → Exportar datos técnicos

**Esquema de Base de Datos Completo con Dependencias:**
```sql
-- ========================================
-- TABLA BASE: USUARIOS 
-- ========================================
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol ENUM('admin', 'tecnico', 'cliente') NOT NULL,
    estado ENUM('activo', 'inactivo', 'pendiente_validacion') DEFAULT 'pendiente_validacion',
    fecha_invitacion TIMESTAMP NULL,
    fecha_ultimo_acceso TIMESTAMP NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_estado (estado)
);

-- ========================================
-- MÓDULO TÉCNICOS - TABLAS DEPENDIENTES
-- ========================================

-- Perfiles extendidos de técnicos
CREATE TABLE tecnicos_perfiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    numero_empleado VARCHAR(50) UNIQUE,
    especialidad VARCHAR(100),
    nivel_experiencia ENUM('junior', 'semi_senior', 'senior', 'lead') DEFAULT 'junior',
    fecha_contratacion DATE,
    salario_base DECIMAL(10,2),
    certificaciones_principales TEXT,
    habilidades_tecnicas TEXT,
    idiomas JSON,
    ubicacion VARCHAR(255),
    disponibilidad ENUM('tiempo_completo', 'medio_tiempo', 'freelance') DEFAULT 'tiempo_completo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_numero_empleado (numero_empleado),
    INDEX idx_especialidad (especialidad)
);

-- Competencias técnicas (catálogo)
CREATE TABLE competencias_catalogo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50) NOT NULL,
    nivel_requerido ENUM('basico', 'intermedio', 'avanzado', 'experto') DEFAULT 'basico',
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_categoria (categoria),
    INDEX idx_activa (activa)
);

-- Competencias de técnicos (relación muchos a muchos)
CREATE TABLE tecnicos_competencias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tecnico_id INT NOT NULL,
    competencia_id INT NOT NULL,
    nivel_actual ENUM('basico', 'intermedio', 'avanzado', 'experto') DEFAULT 'basico',
    certificado BOOLEAN DEFAULT FALSE,
    fecha_adquirida DATE,
    fecha_vencimiento DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (competencia_id) REFERENCES competencias_catalogo(id),
    UNIQUE KEY unique_tecnico_competencia (tecnico_id, competencia_id),
    INDEX idx_tecnico_id (tecnico_id),
    INDEX idx_competencia_id (competencia_id)
);

-- Documentos y certificaciones de técnicos
CREATE TABLE tecnicos_documentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tecnico_id INT NOT NULL,
    tipo_documento ENUM('certificacion', 'titulo', 'curso', 'cv', 'identificacion', 'otro') NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamaño_archivo INT,
    tipo_mime VARCHAR(100),
    fecha_vencimiento DATE,
    validado BOOLEAN DEFAULT FALSE,
    validado_por INT,
    fecha_validacion TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (validado_por) REFERENCES usuarios(id),
    INDEX idx_tecnico_id (tecnico_id),
    INDEX idx_tipo_documento (tipo_documento),
    INDEX idx_validado (validado)
);

-- ========================================
-- MÓDULO CLIENTES - TABLAS DEPENDIENTES
-- ========================================

-- Perfiles extendidos de clientes
CREATE TABLE clientes_perfiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    razon_social VARCHAR(255),
    rfc VARCHAR(20),
    giro_empresarial VARCHAR(100),
    sector VARCHAR(100),
    tamaño_empresa ENUM('startup', 'pequeña', 'mediana', 'grande', 'corporativo') DEFAULT 'pequeña',
    direccion_fiscal TEXT,
    codigo_postal VARCHAR(10),
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'México',
    sitio_web VARCHAR(255),
    facturacion_anual DECIMAL(15,2),
    numero_empleados INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_rfc (rfc),
    INDEX idx_sector (sector)
);

-- Usuarios validadores por cliente (un cliente puede tener múltiples validadores)
CREATE TABLE clientes_validadores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    validador_email VARCHAR(255) NOT NULL,
    validador_nombre VARCHAR(255) NOT NULL,
    validador_puesto VARCHAR(100),
    puede_validar BOOLEAN DEFAULT TRUE,
    puede_rechazar BOOLEAN DEFAULT TRUE,
    notificar_por_email BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cliente_validador (cliente_id, validador_email),
    INDEX idx_cliente_id (cliente_id),
    INDEX idx_validador_email (validador_email)
);

-- Configuración de validación por cliente
CREATE TABLE clientes_configuracion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    validacion_automatica BOOLEAN DEFAULT FALSE,
    tiempo_limite_validacion INT DEFAULT 48, -- horas
    requiere_archivos_adjuntos BOOLEAN DEFAULT FALSE,
    validacion_multiple BOOLEAN DEFAULT FALSE, -- requiere múltiples validadores
    comentarios_obligatorios BOOLEAN DEFAULT FALSE,
    notificar_actividades_nuevas BOOLEAN DEFAULT TRUE,
    notificar_rechazos BOOLEAN DEFAULT TRUE,
    horario_trabajo_inicio TIME DEFAULT '08:00:00',
    horario_trabajo_fin TIME DEFAULT '18:00:00',
    dias_laborales JSON DEFAULT '["1","2","3","4","5"]', -- Lunes a Viernes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cliente_config (cliente_id)
);

-- ========================================
-- MÓDULO ASIGNACIONES
-- ========================================
CREATE TABLE asignaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tecnico_id INT NOT NULL,
    cliente_id INT NOT NULL,
    proyecto VARCHAR(255),
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin_estimada DATE,
    fecha_fin_real DATE,
    horas_estimadas DECIMAL(6,2),
    horas_reales DECIMAL(6,2) DEFAULT 0,
    tarifa_por_hora DECIMAL(8,2),
    estado ENUM('activa', 'pausada', 'finalizada', 'cancelada') DEFAULT 'activa',
    prioridad ENUM('baja', 'media', 'alta', 'urgente') DEFAULT 'media',
    competencias_requeridas JSON,
    notas TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    INDEX idx_tecnico_id (tecnico_id),
    INDEX idx_cliente_id (cliente_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_inicio (fecha_inicio)
);

-- ========================================
-- MÓDULO ACTIVIDADES
-- ========================================
CREATE TABLE actividades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asignacion_id INT NOT NULL,
    tecnico_id INT NOT NULL,
    cliente_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    horas_trabajadas DECIMAL(4,2) GENERATED ALWAYS AS (
        TIME_TO_SEC(TIMEDIFF(hora_fin, hora_inicio)) / 3600
    ) STORED,
    descripcion TEXT NOT NULL,
    tipo_actividad ENUM('desarrollo', 'reunion', 'testing', 'deployment', 'soporte', 'capacitacion', 'otro') NOT NULL,
    ubicacion ENUM('remoto', 'oficina_cliente', 'oficina_propia', 'otro') DEFAULT 'remoto',
    estado ENUM('pendiente', 'validada', 'rechazada', 'en_revision') DEFAULT 'pendiente',
    comentarios_tecnico TEXT,
    comentarios_cliente TEXT,
    motivo_rechazo TEXT,
    archivos_adjuntos JSON,
    validada_por INT,
    fecha_validacion TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (asignacion_id) REFERENCES asignaciones(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (validada_por) REFERENCES usuarios(id),
    INDEX idx_asignacion_id (asignacion_id),
    INDEX idx_tecnico_id (tecnico_id),
    INDEX idx_cliente_id (cliente_id),
    INDEX idx_fecha (fecha),
    INDEX idx_estado (estado)
);

-- ========================================
-- MÓDULO VALIDACIONES - HISTORIAL
-- ========================================
CREATE TABLE validaciones_historial (
    id INT PRIMARY KEY AUTO_INCREMENT,
    actividad_id INT NOT NULL,
    estado_anterior ENUM('pendiente', 'validada', 'rechazada', 'en_revision'),
    estado_nuevo ENUM('pendiente', 'validada', 'rechazada', 'en_revision'),
    validador_id INT NOT NULL,
    comentarios TEXT,
    fecha_validacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE,
    FOREIGN KEY (validador_id) REFERENCES usuarios(id),
    INDEX idx_actividad_id (actividad_id),
    INDEX idx_validador_id (validador_id),
    INDEX idx_fecha_validacion (fecha_validacion)
);

-- ========================================
-- MÓDULO ARCHIVOS Y DOCUMENTOS
-- ========================================
CREATE TABLE archivos_actividades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    actividad_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamaño_archivo INT,
    tipo_mime VARCHAR(100),
    descripcion TEXT,
    uploaded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES usuarios(id),
    INDEX idx_actividad_id (actividad_id),
    INDEX idx_uploaded_by (uploaded_by)
);

-- ========================================
-- SISTEMA DE NOTIFICACIONES
-- ========================================
CREATE TABLE notificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo ENUM('actividad_nueva', 'actividad_validada', 'actividad_rechazada', 'asignacion_nueva', 'recordatorio', 'sistema') NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    url_accion VARCHAR(500),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_tipo (tipo),
    INDEX idx_leida (leida),
    INDEX idx_created_at (created_at)
);

-- ========================================
-- ÍNDICES DE RENDIMIENTO ADICIONALES
-- ========================================
CREATE INDEX idx_actividades_fecha_estado ON actividades(fecha, estado);
CREATE INDEX idx_asignaciones_activas ON asignaciones(estado, fecha_inicio);
CREATE INDEX idx_tecnicos_competencias_nivel ON tecnicos_competencias(nivel_actual, certificado);
```

---

## 🎨 FASE 3 – Frontend (React + Vite) - FLUJO REORGANIZADO

### 🔐 3.1 Autenticación y Onboarding
- [ ] **LoginPage** → Autenticación JWT con roles
- [ ] **InvitationPage** → Aceptar invitaciones de técnicos/clientes
- [ ] **ResetPasswordPage** → Recuperación de contraseña

### 👨‍🔧 3.2 MÓDULO GESTIÓN DE TÉCNICOS (PRIMERA PRIORIDAD)
**⚠️ DEBE IMPLEMENTARSE ANTES QUE DASHBOARDS**

#### Componentes Administrativos:
- [ ] **TecnicosListPage** → Lista completa de técnicos con filtros
- [ ] **TecnicoCreateForm** → Formulario de alta de técnico completo
- [ ] **TecnicoEditForm** → Edición de datos y competencias
- [ ] **TecnicoInviteModal** → Sistema de invitaciones por email
- [ ] **TecnicoCompetenciasManager** → Gestión de competencias técnicas
- [ ] **TecnicoDocumentosUpload** → Upload de certificaciones
- [ ] **TecnicoPerfilCard** → Vista de perfil completo

#### Componentes de Técnico:
- [ ] **TecnicoOnboardingWizard** → Proceso de alta paso a paso
- [ ] **TecnicoPerfilPage** → Perfil personal editable
- [ ] **TecnicoCompetenciasPage** → Gestión de competencias propias
- [ ] **TecnicoDocumentosPage** → Subir certificaciones

### 🏢 3.3 MÓDULO GESTIÓN DE CLIENTES (SEGUNDA PRIORIDAD)
- [ ] **ClientesListPage** → Lista de clientes con configuraciones
- [ ] **ClienteCreateForm** → Alta de cliente con validadores
- [ ] **ClienteEditForm** → Edición y configuración
- [ ] **ClienteValidadoresManager** → Gestión de usuarios validadores
- [ ] **ClienteConfiguracionPage** → Configuración de validación

### 🔗 3.4 MÓDULO ASIGNACIONES (TERCERA PRIORIDAD)
**⚠️ SOLO DESPUÉS DE TENER TÉCNICOS Y CLIENTES**
- [ ] **AsignacionesListPage** → Vista de todas las asignaciones
- [ ] **AsignacionCreateModal** → Crear asignación técnico-cliente
- [ ] **AsignacionEditModal** → Modificar asignaciones existentes
- [ ] **AsignacionValidationComponent** → Validar competencias
- [ ] **AsignacionesCalendarView** → Vista calendario de asignaciones

### 📋 3.5 DASHBOARDS (CUARTA PRIORIDAD)
**⚠️ SOLO DESPUÉS DE COMPLETAR GESTIÓN DE USUARIOS**

#### Dashboard Técnico:
- [ ] **TecnicoDashboard** → Vista principal con resumen
- [ ] **TecnicoMisAsignaciones** → Clientes asignados
- [ ] **TecnicoEstadisticas** → Métricas personales

#### Dashboard Cliente:
- [ ] **ClienteDashboard** → Vista de validación con filtros
- [ ] **ClienteTecnicosAsignados** → Técnicos bajo supervisión

#### Dashboard Admin:
- [ ] **AdminDashboard** → Vista ejecutiva completa
- [ ] **AdminEstadisticas** → KPIs generales del sistema

### 📝 3.6 MÓDULO ACTIVIDADES (QUINTA PRIORIDAD)
**⚠️ SOLO DESPUÉS DE DASHBOARDS Y ASIGNACIONES**
- [ ] **ActividadCreateForm** → Registro de actividad diaria
- [ ] **ActividadEditForm** → Edición de actividades pendientes
- [ ] **ActividadListPage** → Lista de actividades con filtros
- [ ] **ActividadDetailModal** → Vista detallada con archivos
- [ ] **ActividadTimeCalculator** → Auto-cálculo de horas
- [ ] **ActividadFileUpload** → Upload de fotos/PDFs

### ✅ 3.7 MÓDULO VALIDACIONES (SEXTA PRIORIDAD)
- [ ] **ValidacionModal** → Aprobar/rechazar actividades
- [ ] **ValidacionHistorialPage** → Historial de validaciones
- [ ] **ValidacionComentariosComponent** → Sistema de comentarios
- [ ] **ValidacionBulkActions** → Validaciones masivas

### 📊 3.8 FUNCIONALIDADES TRANSVERSALES (ÚLTIMA PRIORIDAD)
- [ ] **ExportButton** → Exportación a Excel
- [ ] **FilterComponent** → Filtros avanzados reutilizables  
- [ ] **SearchComponent** → Búsqueda global
- [ ] **NotificationSystem** → Notificaciones en tiempo real
- [ ] **FilePreviewModal** → Vista previa de archivos

**Componentes React Principales:**
```
src/
├── components/
│   ├── Auth/
│   │   ├── LoginForm.jsx
│   │   └── InvitationForm.jsx
│   ├── Dashboard/
│   │   ├── TecnicoDashboard.jsx
│   │   ├── ClienteDashboard.jsx
│   │   └── AdminDashboard.jsx
│   ├── Actividades/
│   │   ├── ActividadForm.jsx
│   │   ├── ActividadCard.jsx
│   │   └── ActividadList.jsx
│   └── Common/
│       ├── FileUpload.jsx
│       ├── TimeCalculator.jsx
│       └── ExportButton.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── TecnicoPage.jsx
│   ├── ClientePage.jsx
│   └── AdminPage.jsx
└── utils/
    ├── api.js
    ├── auth.js
    └── timeUtils.js
```

---

## 🧪 FASE 4 – QA y Validaciones

### 🔍 4.1 Pruebas Unitarias y Funcionales
- [ ] **Pruebas backend** → Jest + Supertest para rutas API
- [ ] **Validación de formularios** → Errores de validación y UX
- [ ] **Flujo de validación cliente** → Proceso completo de aprobación/rechazo
- [ ] **Prueba de exportación** → Generación correcta de archivos Excel
- [ ] **Pruebas de autenticación** → JWT, roles y permisos
- [ ] **Pruebas de archivos** → Upload, almacenamiento y descarga

**Scripts de Testing:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run"
  }
}
```

---

## 📦 FASE 5 – Despliegue y Entrega

### 🌐 5.1 Preparar Entorno Productivo
- [ ] **Hosting frontend** → Integración con Nginx existente
- [ ] **Hosting backend** → Contenedor Docker en stack actual
- [ ] **Base de datos** → Extensión de MySQL existente
- [ ] **Configurar correo** → Notificaciones automáticas
- [ ] **SSL y seguridad** → Certificados y headers de seguridad

**Configuración Docker:**
```yaml
# Extensión del docker-compose.yml existente
services:
  verifika-api:
    build: ./verifika/backend
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis
    networks:
      - bluesystem_network

  verifika-frontend:
    build: ./verifika/frontend
    volumes:
      - ./nginx/verifika.conf:/etc/nginx/conf.d/verifika.conf
    depends_on:
      - verifika-api
    networks:
      - bluesystem_network
```

---

## 📊 FASE 6 – Métricas y Optimización

### 📈 6.1 Panel Administrativo
- [ ] **Visualizar métricas** → Horas trabajadas, % validaciones, productividad
- [ ] **Historial de actividades** → Filtros por técnico, cliente y fecha
- [ ] **Logs y auditoría** → Registro de cambios y acciones
- [ ] **Reportes automáticos** → Generación programada de informes
- [ ] **Dashboard ejecutivo** → KPIs y gráficos interactivos

**Métricas a Implementar:**
- Horas totales por técnico/mes
- Porcentaje de actividades validadas vs rechazadas
- Tiempo promedio de validación por cliente
- Productividad por técnico (actividades/día)
- Satisfacción del cliente (basado en validaciones)

---

## 🧩 FASE 7 – Futuras Funciones (Opcional)

### 🧠 Inteligencia y Expansión
- [ ] **Agendar tareas programadas** → Pre-registro de actividades recurrentes
- [ ] **Firma digital del cliente** → Validación con firma electrónica
- [ ] **Notificaciones push** → Alertas en tiempo real
- [ ] **Subusuarios por cliente** → Múltiples validadores por cliente
- [ ] **API externa** → Integración con sistemas ERP/CRM existentes
- [ ] **App móvil** → React Native para técnicos en campo
- [ ] **IA para categorización** → Clasificación automática de actividades

---

## 🔧 Integración con BlueSystem

### Arquitectura Híbrida
- **Frontend**: Módulo independiente integrado en Nginx existente
- **Backend**: Microservicio conectado a infraestructura actual
- **Base de Datos**: Esquemas adicionales en MySQL existente
- **Autenticación**: Sistema unificado con JWT compartido
- **Monitoring**: Integración con logs y métricas de Winston

### URLs de Desarrollo
- **Frontend Verifika**: http://localhost:5174
- **API Verifika**: http://localhost:3001
- **Integración**: http://localhost/verifika

---

## 📅 Timeline Reorganizado con Dependencias

| Fase | Duración | Entregables | Dependencias | Estado |
|------|----------|-------------|--------------|---------|
| **Fase 1** | 1 semana | Documentación y arquitectura | - | ✅ **Completado** |
| **Fase 2.1** | 3 días | Autenticación y usuarios base | Fase 1 | ⏳ **Pendiente** |
| **Fase 2.2** | 4 días | **MÓDULO TÉCNICOS COMPLETO** | Fase 2.1 | ⏳ **Bloqueado** |
| **Fase 2.3** | 3 días | Módulo clientes | Fase 2.1 | ⏳ **Bloqueado** |
| **Fase 2.4** | 4 días | Módulo asignaciones | Fases 2.2 + 2.3 | ⏳ **Bloqueado** |
| **Fase 3.1** | 3 días | Dashboards básicos | Fase 2.4 | ⏳ **Bloqueado** |
| **Fase 3.2** | 5 días | **MÓDULO ACTIVIDADES** | Fase 3.1 | ⏳ **Bloqueado** |
| **Fase 3.3** | 3 días | Sistema de validaciones | Fase 3.2 | ⏳ **Bloqueado** |
| **Fase 4** | 1 semana | Testing y QA | Fase 3.3 | ⏳ **Bloqueado** |
| **Fase 5** | 1 semana | Despliegue y configuración | Fase 4 | ⏳ **Bloqueado** |
| **Fase 6** | 1 semana | Métricas y reportes | Fase 5 | ⏳ **Bloqueado** |
| **Total** | **8 semanas** | **Sistema completo** | - | **15% Completado** |

### 🚨 DEPENDENCIAS CRÍTICAS:
- **SIN TÉCNICOS = SIN ACTIVIDADES** ⚠️
- **SIN ASIGNACIONES = SIN DASHBOARDS FUNCIONALES** ⚠️  
- **SIN VALIDADORES = SIN SISTEMA DE VALIDACIÓN** ⚠️

### 📋 PRÓXIMO HITO CRÍTICO:
**Fase 2.2 - Módulo Técnicos** debe completarse antes de continuar con cualquier otra funcionalidad.

---

## 🎯 Objetivos de Calidad

- **Performance**: Carga < 2s, respuesta API < 500ms
- **Seguridad**: Autenticación robusta, validación de inputs
- **Usabilidad**: Interfaz intuitiva, accesibilidad WCAG 2.1
- **Escalabilidad**: Soporte para 100+ usuarios concurrentes
- **Mantenibilidad**: Código documentado, testing >80%

---

*Documentación actualizada: 2025-06-24*  
*Proyecto Dart AI ID: slF0dOywYY8R*