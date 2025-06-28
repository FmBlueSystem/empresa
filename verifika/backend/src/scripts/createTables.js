// createTables.js - Script simplificado para crear solo las tablas de Verifika
const database = require('../config/database');
const logger = require('../config/logger');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const tableStatements = [
// 1. TABLA DE USUARIOS
`CREATE TABLE IF NOT EXISTS vf_usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    rol ENUM('admin', 'tecnico', 'cliente', 'validador') NOT NULL,
    estado ENUM('activo', 'inactivo', 'pendiente', 'suspendido') DEFAULT 'pendiente',
    email_verificado BOOLEAN DEFAULT FALSE,
    fecha_ultimo_login TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creado_por INT,
    metadatos JSON,
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_estado (estado),
    FOREIGN KEY (creado_por) REFERENCES vf_usuarios(id) ON DELETE SET NULL
)`,

// 2. CATÁLOGO DE COMPETENCIAS (debe ir antes que las relaciones)
`CREATE TABLE IF NOT EXISTS vf_competencias_catalogo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50),
    nivel_requerido ENUM('basico', 'intermedio', 'avanzado', 'experto') DEFAULT 'basico',
    certificacion_requerida BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_nivel (nivel_requerido),
    INDEX idx_activo (activo)
)`,

// 3. TABLA DE PERFILES DE TÉCNICOS
`CREATE TABLE IF NOT EXISTS vf_tecnicos_perfiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL,
    numero_identificacion VARCHAR(50) UNIQUE,
    fecha_nacimiento DATE,
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'España',
    experiencia_anos INT DEFAULT 0,
    nivel_experiencia ENUM('junior', 'intermedio', 'senior', 'experto') DEFAULT 'junior',
    disponibilidad ENUM('disponible', 'ocupado', 'vacaciones', 'inactivo') DEFAULT 'disponible',
    tarifa_por_hora DECIMAL(10,2),
    moneda VARCHAR(3) DEFAULT 'EUR',
    biografia TEXT,
    foto_perfil VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES vf_usuarios(id) ON DELETE CASCADE,
    INDEX idx_disponibilidad (disponibilidad),
    INDEX idx_nivel (nivel_experiencia),
    INDEX idx_ciudad (ciudad)
)`,

// 4. TABLA DE CLIENTES
`CREATE TABLE IF NOT EXISTS vf_clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL,
    nombre_empresa VARCHAR(200) NOT NULL,
    cif VARCHAR(20) UNIQUE,
    direccion_fiscal TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'España',
    telefono_corporativo VARCHAR(20),
    sitio_web VARCHAR(255),
    sector_actividad VARCHAR(100),
    numero_empleados INT,
    configuracion_validacion JSON,
    requiere_validacion_doble BOOLEAN DEFAULT FALSE,
    tiempo_limite_validacion INT DEFAULT 72,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES vf_usuarios(id) ON DELETE CASCADE,
    INDEX idx_empresa (nombre_empresa),
    INDEX idx_sector (sector_actividad),
    INDEX idx_ciudad (ciudad)
)`,

// 5. RELACIÓN TÉCNICOS-COMPETENCIAS
`CREATE TABLE IF NOT EXISTS vf_tecnicos_competencias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tecnico_id INT NOT NULL,
    competencia_id INT NOT NULL,
    nivel_actual ENUM('basico', 'intermedio', 'avanzado', 'experto') DEFAULT 'basico',
    certificado BOOLEAN DEFAULT FALSE,
    fecha_certificacion DATE,
    fecha_vencimiento DATE,
    validado_por INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_tecnico_competencia (tecnico_id, competencia_id),
    FOREIGN KEY (tecnico_id) REFERENCES vf_tecnicos_perfiles(id) ON DELETE CASCADE,
    FOREIGN KEY (competencia_id) REFERENCES vf_competencias_catalogo(id) ON DELETE CASCADE,
    FOREIGN KEY (validado_por) REFERENCES vf_usuarios(id) ON DELETE SET NULL,
    INDEX idx_nivel (nivel_actual),
    INDEX idx_certificado (certificado)
)`,

// 6. DOCUMENTOS DE TÉCNICOS
`CREATE TABLE IF NOT EXISTS vf_tecnicos_documentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tecnico_id INT NOT NULL,
    tipo_documento ENUM('cv', 'certificacion', 'identificacion', 'seguridad', 'otro') NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamaño_archivo INT,
    tipo_mime VARCHAR(100),
    descripcion TEXT,
    fecha_vencimiento DATE,
    estado ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
    validado_por INT,
    comentarios_validacion TEXT,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_validacion TIMESTAMP NULL,
    FOREIGN KEY (tecnico_id) REFERENCES vf_tecnicos_perfiles(id) ON DELETE CASCADE,
    FOREIGN KEY (validado_por) REFERENCES vf_usuarios(id) ON DELETE SET NULL,
    INDEX idx_tipo (tipo_documento),
    INDEX idx_estado (estado),
    INDEX idx_tecnico (tecnico_id)
)`,

// 7. VALIDADORES DE CLIENTES
`CREATE TABLE IF NOT EXISTS vf_clientes_validadores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    usuario_id INT NOT NULL,
    nivel_autorizacion ENUM('validador', 'supervisor', 'gerente') DEFAULT 'validador',
    puede_aprobar BOOLEAN DEFAULT TRUE,
    puede_rechazar BOOLEAN DEFAULT TRUE,
    limite_monto DECIMAL(10,2),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por INT,
    UNIQUE KEY uk_cliente_validador (cliente_id, usuario_id),
    FOREIGN KEY (cliente_id) REFERENCES vf_clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES vf_usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (creado_por) REFERENCES vf_usuarios(id) ON DELETE SET NULL,
    INDEX idx_nivel (nivel_autorizacion),
    INDEX idx_activo (activo)
)`,

// 8. TABLA DE PROYECTOS
`CREATE TABLE IF NOT EXISTS vf_proyectos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    cliente_id INT NOT NULL,
    estado ENUM('planificacion', 'activo', 'pausado', 'completado', 'cancelado') DEFAULT 'planificacion',
    fecha_inicio DATE,
    fecha_fin_estimada DATE,
    fecha_fin_real DATE,
    presupuesto DECIMAL(12,2),
    moneda VARCHAR(3) DEFAULT 'EUR',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES vf_clientes(id),
    INDEX idx_cliente_id (cliente_id),
    INDEX idx_estado (estado)
)`,

// 9. ASIGNACIONES TÉCNICO-CLIENTE
`CREATE TABLE IF NOT EXISTS vf_asignaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tecnico_id INT NOT NULL,
    cliente_id INT NOT NULL,
    proyecto_nombre VARCHAR(200),
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin_estimada DATE,
    fecha_fin_real DATE,
    estado ENUM('activa', 'pausada', 'finalizada', 'cancelada') DEFAULT 'activa',
    tarifa_acordada DECIMAL(10,2),
    moneda VARCHAR(3) DEFAULT 'EUR',
    horas_estimadas INT,
    competencias_requeridas JSON,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creado_por INT NOT NULL,
    FOREIGN KEY (tecnico_id) REFERENCES vf_tecnicos_perfiles(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES vf_clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (creado_por) REFERENCES vf_usuarios(id) ON DELETE RESTRICT,
    INDEX idx_tecnico (tecnico_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado),
    INDEX idx_fechas (fecha_inicio, fecha_fin_estimada)
)`,

// 9. ACTIVIDADES REGISTRADAS POR TÉCNICOS
`CREATE TABLE IF NOT EXISTS vf_actividades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asignacion_id INT NOT NULL,
    tecnico_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_actividad DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    horas_trabajadas DECIMAL(4,2) GENERATED ALWAYS AS (
        TIME_TO_SEC(TIMEDIFF(hora_fin, hora_inicio)) / 3600
    ) STORED,
    tipo_actividad ENUM('desarrollo', 'mantenimiento', 'soporte', 'consultoria', 'otro') DEFAULT 'desarrollo',
    ubicacion VARCHAR(200),
    estado ENUM('borrador', 'enviada', 'validada', 'rechazada') DEFAULT 'borrador',
    archivos_adjuntos JSON,
    observaciones_tecnico TEXT,
    fecha_envio TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (asignacion_id) REFERENCES vf_asignaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (tecnico_id) REFERENCES vf_tecnicos_perfiles(id) ON DELETE CASCADE,
    INDEX idx_asignacion (asignacion_id),
    INDEX idx_tecnico (tecnico_id),
    INDEX idx_fecha (fecha_actividad),
    INDEX idx_estado (estado)
)`,

// 10. VALIDACIONES DE ACTIVIDADES
`CREATE TABLE IF NOT EXISTS vf_validaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    actividad_id INT NOT NULL,
    validador_id INT NOT NULL,
    estado ENUM('aprobada', 'rechazada', 'pendiente_revision') NOT NULL,
    comentarios TEXT,
    horas_aprobadas DECIMAL(4,2),
    monto_aprobado DECIMAL(10,2),
    archivos_validacion JSON,
    requiere_segunda_validacion BOOLEAN DEFAULT FALSE,
    validacion_padre_id INT,
    fecha_validacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actividad_id) REFERENCES vf_actividades(id) ON DELETE CASCADE,
    FOREIGN KEY (validador_id) REFERENCES vf_usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (validacion_padre_id) REFERENCES vf_validaciones(id) ON DELETE SET NULL,
    INDEX idx_actividad (actividad_id),
    INDEX idx_validador (validador_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_validacion)
)`,

// 11. HISTORIAL DE VALIDACIONES
`CREATE TABLE IF NOT EXISTS vf_historial_validaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    actividad_id INT NOT NULL,
    validacion_id INT,
    accion ENUM('enviada', 'aprobada', 'rechazada', 'revision_solicitada') NOT NULL,
    usuario_id INT NOT NULL,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50),
    comentarios TEXT,
    metadatos JSON,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actividad_id) REFERENCES vf_actividades(id) ON DELETE CASCADE,
    FOREIGN KEY (validacion_id) REFERENCES vf_validaciones(id) ON DELETE SET NULL,
    FOREIGN KEY (usuario_id) REFERENCES vf_usuarios(id) ON DELETE RESTRICT,
    INDEX idx_actividad (actividad_id),
    INDEX idx_accion (accion),
    INDEX idx_fecha (fecha_accion)
)`,

// 12. NOTIFICACIONES
`CREATE TABLE IF NOT EXISTS vf_notificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo ENUM('actividad_enviada', 'actividad_validada', 'actividad_rechazada', 'asignacion_nueva', 'invitacion', 'sistema') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    enlace VARCHAR(500),
    leida BOOLEAN DEFAULT FALSE,
    enviada_email BOOLEAN DEFAULT FALSE,
    metadatos JSON,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES vf_usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_tipo (tipo),
    INDEX idx_leida (leida),
    INDEX idx_fecha (fecha_creacion)
)`
];

const dataStatements = [
// Insertar competencias básicas
`INSERT IGNORE INTO vf_competencias_catalogo (nombre, descripcion, categoria, nivel_requerido) VALUES
('JavaScript', 'Programación en JavaScript', 'Desarrollo Web', 'intermedio'),
('React', 'Framework React para frontend', 'Desarrollo Web', 'intermedio'),
('Node.js', 'Desarrollo backend con Node.js', 'Desarrollo Web', 'intermedio'),
('MySQL', 'Base de datos MySQL', 'Base de Datos', 'basico'),
('Docker', 'Contenedores Docker', 'DevOps', 'intermedio'),
('Git', 'Control de versiones Git', 'Herramientas', 'basico'),
('Nginx', 'Servidor web Nginx', 'Infraestructura', 'intermedio'),
('Redis', 'Cache Redis', 'Base de Datos', 'basico'),
('JWT', 'Autenticación con JWT', 'Seguridad', 'intermedio'),
('API REST', 'Diseño de APIs REST', 'Desarrollo Web', 'intermedio')`,

// Crear usuario administrador inicial
`INSERT IGNORE INTO vf_usuarios (
    email, 
    password_hash, 
    nombre, 
    apellido, 
    rol, 
    estado, 
    email_verificado
) VALUES (
    'admin@bluesystem.io',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Administrador',
    'Verifika',
    'admin',
    'activo',
    TRUE
)`
];

const createTablesSQL = `
-- 1. TABLA DE USUARIOS
CREATE TABLE IF NOT EXISTS vf_usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    rol ENUM('admin', 'tecnico', 'cliente', 'validador') NOT NULL,
    estado ENUM('activo', 'inactivo', 'pendiente', 'suspendido') DEFAULT 'pendiente',
    email_verificado BOOLEAN DEFAULT FALSE,
    fecha_ultimo_login TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creado_por INT,
    metadatos JSON,
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_estado (estado),
    FOREIGN KEY (creado_por) REFERENCES vf_usuarios(id) ON DELETE SET NULL
);

-- 2. TABLA DE PERFILES DE TÉCNICOS
CREATE TABLE IF NOT EXISTS vf_tecnicos_perfiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL,
    numero_identificacion VARCHAR(50) UNIQUE,
    fecha_nacimiento DATE,
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'España',
    experiencia_anos INT DEFAULT 0,
    nivel_experiencia ENUM('junior', 'intermedio', 'senior', 'experto') DEFAULT 'junior',
    disponibilidad ENUM('disponible', 'ocupado', 'vacaciones', 'inactivo') DEFAULT 'disponible',
    tarifa_por_hora DECIMAL(10,2),
    moneda VARCHAR(3) DEFAULT 'EUR',
    biografia TEXT,
    foto_perfil VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES vf_usuarios(id) ON DELETE CASCADE,
    INDEX idx_disponibilidad (disponibilidad),
    INDEX idx_nivel (nivel_experiencia),
    INDEX idx_ciudad (ciudad)
);

-- 3. CATÁLOGO DE COMPETENCIAS
CREATE TABLE IF NOT EXISTS vf_competencias_catalogo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50),
    nivel_requerido ENUM('basico', 'intermedio', 'avanzado', 'experto') DEFAULT 'basico',
    certificacion_requerida BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_nivel (nivel_requerido),
    INDEX idx_activo (activo)
);

-- 4. RELACIÓN TÉCNICOS-COMPETENCIAS
CREATE TABLE IF NOT EXISTS vf_tecnicos_competencias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tecnico_id INT NOT NULL,
    competencia_id INT NOT NULL,
    nivel_actual ENUM('basico', 'intermedio', 'avanzado', 'experto') DEFAULT 'basico',
    certificado BOOLEAN DEFAULT FALSE,
    fecha_certificacion DATE,
    fecha_vencimiento DATE,
    validado_por INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_tecnico_competencia (tecnico_id, competencia_id),
    FOREIGN KEY (tecnico_id) REFERENCES vf_tecnicos_perfiles(id) ON DELETE CASCADE,
    FOREIGN KEY (competencia_id) REFERENCES vf_competencias_catalogo(id) ON DELETE CASCADE,
    FOREIGN KEY (validado_por) REFERENCES vf_usuarios(id) ON DELETE SET NULL,
    INDEX idx_nivel (nivel_actual),
    INDEX idx_certificado (certificado)
);

-- 5. DOCUMENTOS DE TÉCNICOS
CREATE TABLE IF NOT EXISTS vf_tecnicos_documentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tecnico_id INT NOT NULL,
    tipo_documento ENUM('cv', 'certificacion', 'identificacion', 'seguridad', 'otro') NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamaño_archivo INT,
    tipo_mime VARCHAR(100),
    descripcion TEXT,
    fecha_vencimiento DATE,
    estado ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
    validado_por INT,
    comentarios_validacion TEXT,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_validacion TIMESTAMP NULL,
    FOREIGN KEY (tecnico_id) REFERENCES vf_tecnicos_perfiles(id) ON DELETE CASCADE,
    FOREIGN KEY (validado_por) REFERENCES vf_usuarios(id) ON DELETE SET NULL,
    INDEX idx_tipo (tipo_documento),
    INDEX idx_estado (estado),
    INDEX idx_tecnico (tecnico_id)
);

-- 6. TABLA DE CLIENTES
CREATE TABLE IF NOT EXISTS vf_clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL,
    nombre_empresa VARCHAR(200) NOT NULL,
    cif VARCHAR(20) UNIQUE,
    direccion_fiscal TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'España',
    telefono_corporativo VARCHAR(20),
    sitio_web VARCHAR(255),
    sector_actividad VARCHAR(100),
    numero_empleados INT,
    configuracion_validacion JSON,
    requiere_validacion_doble BOOLEAN DEFAULT FALSE,
    tiempo_limite_validacion INT DEFAULT 72,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES vf_usuarios(id) ON DELETE CASCADE,
    INDEX idx_empresa (nombre_empresa),
    INDEX idx_sector (sector_actividad),
    INDEX idx_ciudad (ciudad)
);

-- 7. VALIDADORES DE CLIENTES
CREATE TABLE IF NOT EXISTS vf_clientes_validadores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    usuario_id INT NOT NULL,
    nivel_autorizacion ENUM('validador', 'supervisor', 'gerente') DEFAULT 'validador',
    puede_aprobar BOOLEAN DEFAULT TRUE,
    puede_rechazar BOOLEAN DEFAULT TRUE,
    limite_monto DECIMAL(10,2),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por INT,
    UNIQUE KEY uk_cliente_validador (cliente_id, usuario_id),
    FOREIGN KEY (cliente_id) REFERENCES vf_clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES vf_usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (creado_por) REFERENCES vf_usuarios(id) ON DELETE SET NULL,
    INDEX idx_nivel (nivel_autorizacion),
    INDEX idx_activo (activo)
);

-- 8. TABLA DE PROYECTOS
CREATE TABLE IF NOT EXISTS vf_proyectos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    cliente_id INT NOT NULL,
    estado ENUM('planificacion', 'activo', 'pausado', 'completado', 'cancelado') DEFAULT 'planificacion',
    fecha_inicio DATE,
    fecha_fin_estimada DATE,
    fecha_fin_real DATE,
    presupuesto DECIMAL(12,2),
    moneda VARCHAR(3) DEFAULT 'EUR',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES vf_clientes(id),
    INDEX idx_cliente_id (cliente_id),
    INDEX idx_estado (estado)
);

-- 9. ASIGNACIONES TÉCNICO-CLIENTE
CREATE TABLE IF NOT EXISTS vf_asignaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tecnico_id INT NOT NULL,
    cliente_id INT NOT NULL,
    proyecto_nombre VARCHAR(200),
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin_estimada DATE,
    fecha_fin_real DATE,
    estado ENUM('activa', 'pausada', 'finalizada', 'cancelada') DEFAULT 'activa',
    tarifa_acordada DECIMAL(10,2),
    moneda VARCHAR(3) DEFAULT 'EUR',
    horas_estimadas INT,
    competencias_requeridas JSON,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creado_por INT NOT NULL,
    FOREIGN KEY (tecnico_id) REFERENCES vf_tecnicos_perfiles(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES vf_clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (creado_por) REFERENCES vf_usuarios(id) ON DELETE RESTRICT,
    INDEX idx_tecnico (tecnico_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado),
    INDEX idx_fechas (fecha_inicio, fecha_fin_estimada)
);

-- 9. ACTIVIDADES REGISTRADAS POR TÉCNICOS
CREATE TABLE IF NOT EXISTS vf_actividades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asignacion_id INT NOT NULL,
    tecnico_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_actividad DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    horas_trabajadas DECIMAL(4,2) GENERATED ALWAYS AS (
        TIME_TO_SEC(TIMEDIFF(hora_fin, hora_inicio)) / 3600
    ) STORED,
    tipo_actividad ENUM('desarrollo', 'mantenimiento', 'soporte', 'consultoria', 'otro') DEFAULT 'desarrollo',
    ubicacion VARCHAR(200),
    estado ENUM('borrador', 'enviada', 'validada', 'rechazada') DEFAULT 'borrador',
    archivos_adjuntos JSON,
    observaciones_tecnico TEXT,
    fecha_envio TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (asignacion_id) REFERENCES vf_asignaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (tecnico_id) REFERENCES vf_tecnicos_perfiles(id) ON DELETE CASCADE,
    INDEX idx_asignacion (asignacion_id),
    INDEX idx_tecnico (tecnico_id),
    INDEX idx_fecha (fecha_actividad),
    INDEX idx_estado (estado)
);

-- 10. VALIDACIONES DE ACTIVIDADES
CREATE TABLE IF NOT EXISTS vf_validaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    actividad_id INT NOT NULL,
    validador_id INT NOT NULL,
    estado ENUM('aprobada', 'rechazada', 'pendiente_revision') NOT NULL,
    comentarios TEXT,
    horas_aprobadas DECIMAL(4,2),
    monto_aprobado DECIMAL(10,2),
    archivos_validacion JSON,
    requiere_segunda_validacion BOOLEAN DEFAULT FALSE,
    validacion_padre_id INT,
    fecha_validacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actividad_id) REFERENCES vf_actividades(id) ON DELETE CASCADE,
    FOREIGN KEY (validador_id) REFERENCES vf_usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (validacion_padre_id) REFERENCES vf_validaciones(id) ON DELETE SET NULL,
    INDEX idx_actividad (actividad_id),
    INDEX idx_validador (validador_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_validacion)
);

-- 11. HISTORIAL DE VALIDACIONES
CREATE TABLE IF NOT EXISTS vf_historial_validaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    actividad_id INT NOT NULL,
    validacion_id INT,
    accion ENUM('enviada', 'aprobada', 'rechazada', 'revision_solicitada') NOT NULL,
    usuario_id INT NOT NULL,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50),
    comentarios TEXT,
    metadatos JSON,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actividad_id) REFERENCES vf_actividades(id) ON DELETE CASCADE,
    FOREIGN KEY (validacion_id) REFERENCES vf_validaciones(id) ON DELETE SET NULL,
    FOREIGN KEY (usuario_id) REFERENCES vf_usuarios(id) ON DELETE RESTRICT,
    INDEX idx_actividad (actividad_id),
    INDEX idx_accion (accion),
    INDEX idx_fecha (fecha_accion)
);

-- 12. NOTIFICACIONES
CREATE TABLE IF NOT EXISTS vf_notificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo ENUM('actividad_enviada', 'actividad_validada', 'actividad_rechazada', 'asignacion_nueva', 'invitacion', 'sistema') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    enlace VARCHAR(500),
    leida BOOLEAN DEFAULT FALSE,
    enviada_email BOOLEAN DEFAULT FALSE,
    metadatos JSON,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES vf_usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_tipo (tipo),
    INDEX idx_leida (leida),
    INDEX idx_fecha (fecha_creacion)
);
`;

const insertInitialData = `
-- Insertar competencias básicas
INSERT IGNORE INTO vf_competencias_catalogo (nombre, descripcion, categoria, nivel_requerido) VALUES
('JavaScript', 'Programación en JavaScript', 'Desarrollo Web', 'intermedio'),
('React', 'Framework React para frontend', 'Desarrollo Web', 'intermedio'),
('Node.js', 'Desarrollo backend con Node.js', 'Desarrollo Web', 'intermedio'),
('MySQL', 'Base de datos MySQL', 'Base de Datos', 'basico'),
('Docker', 'Contenedores Docker', 'DevOps', 'intermedio'),
('Git', 'Control de versiones Git', 'Herramientas', 'basico'),
('Nginx', 'Servidor web Nginx', 'Infraestructura', 'intermedio'),
('Redis', 'Cache Redis', 'Base de Datos', 'basico'),
('JWT', 'Autenticación con JWT', 'Seguridad', 'intermedio'),
('API REST', 'Diseño de APIs REST', 'Desarrollo Web', 'intermedio');

-- Crear usuario administrador inicial
INSERT IGNORE INTO vf_usuarios (
    email, 
    password_hash, 
    nombre, 
    apellido, 
    rol, 
    estado, 
    email_verificado
) VALUES (
    'admin@bluesystem.io',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Administrador',
    'Verifika',
    'admin',
    'activo',
    TRUE
);
`;

async function createTables() {
  try {
    logger.info('🔄 Creando tablas de Verifika...');

    // Inicializar base de datos
    await database.initialize();

    // Ejecutar creación de tablas una por una
    logger.info(`📝 Ejecutando ${tableStatements.length} declaraciones de tabla...`);

    for (let i = 0; i < tableStatements.length; i++) {
      const statement = tableStatements[i];
      try {
        await database.query(statement);
        logger.info(`✅ Tabla ${i + 1}/${tableStatements.length} creada`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          logger.info(`⏭️ Tabla ${i + 1} omitida (ya existe)`);
        } else {
          logger.error(`❌ Error en tabla ${i + 1}:`, error.message);
        }
      }
    }

    // Ejecutar datos iniciales
    logger.info(`📝 Ejecutando ${dataStatements.length} declaraciones de datos iniciales...`);

    for (let i = 0; i < dataStatements.length; i++) {
      const statement = dataStatements[i];
      try {
        await database.query(statement);
        logger.info(`✅ Datos ${i + 1}/${dataStatements.length} insertados`);
      } catch (error) {
        if (error.message.includes('Duplicate entry')) {
          logger.info(`⏭️ Datos ${i + 1} omitidos (ya existen)`);
        } else {
          logger.error(`❌ Error en datos ${i + 1}:`, error.message);
        }
      }
    }

    // Verificar tablas creadas
    const tables = await database.query("SHOW TABLES LIKE 'vf_%'");
    logger.info(`📊 Tablas de Verifika creadas: ${tables.length}`);
    
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      logger.info(`  - ${tableName}`);
    });

    await database.close();
    logger.info('✅ Migración de tablas completada exitosamente');
    process.exit(0);

  } catch (error) {
    logger.error('❌ Error creando tablas:', error);
    await database.close();
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  createTables();
}

module.exports = createTables;