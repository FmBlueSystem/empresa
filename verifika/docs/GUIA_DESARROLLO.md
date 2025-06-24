# 🛠️ Guía de Desarrollo - Proyecto Verifika

**Proyecto Dart AI ID:** slF0dOywYY8R  
**Para desarrolladores:** Frontend, Backend, Full-Stack

---

## 🚀 SETUP INICIAL PARA DESARROLLADORES

### ✅ Prerrequisitos
```bash
# Versiones requeridas
node --version    # >= 18.0.0
npm --version     # >= 9.0.0
docker --version  # >= 20.0.0
mysql --version   # >= 8.0.0
```

### 🔧 Configuración de Entorno

#### 1. Clonar y Setup
```bash
# Ya está en el proyecto BlueSystem
cd /path/to/BlueSystem/verifika

# Setup script de desarrollo
./scripts/verifika-dev.sh setup

# Verificar configuración
./scripts/verifika-dev.sh status
```

#### 2. Variables de Entorno
```bash
# Copiar template de variables
cp .env.example .env

# Configurar variables críticas
vim .env
```

**Variables Críticas:**
```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bluesystem_verifika
DB_USER=root
DB_PASSWORD=tu_password

# JWT y Seguridad
JWT_SECRET=tu_jwt_secret_super_seguro
SESSION_SECRET=tu_session_secret
API_KEY=tu_api_key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=tu_redis_password

# Email (para invitaciones)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password

# Dart AI
DART_TOKEN=dsa_df88b54b32408afbe42489b08d25bfbf91759ab7d2d1cdac26f4d72b51c71583
```

---

## 🗂️ ESTRUCTURA DE ARCHIVOS

```
verifika/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Lógica de endpoints
│   │   │   ├── authController.js
│   │   │   ├── tecnicosController.js
│   │   │   ├── clientesController.js
│   │   │   ├── asignacionesController.js
│   │   │   ├── actividadesController.js
│   │   │   └── validacionesController.js
│   │   ├── models/          # Modelos de datos
│   │   │   ├── Usuario.js
│   │   │   ├── TecnicoPerfiles.js
│   │   │   ├── ClientePerfiles.js
│   │   │   ├── Asignaciones.js
│   │   │   ├── Actividades.js
│   │   │   └── Validaciones.js
│   │   ├── middleware/      # Middleware personalizado
│   │   │   ├── auth.js      # JWT validation
│   │   │   ├── roles.js     # Role-based access
│   │   │   ├── validation.js # Input validation
│   │   │   └── upload.js    # File upload
│   │   ├── routes/          # Definición de rutas
│   │   │   ├── auth.js
│   │   │   ├── tecnicos.js
│   │   │   ├── clientes.js
│   │   │   ├── asignaciones.js
│   │   │   ├── actividades.js
│   │   │   └── validaciones.js
│   │   ├── services/        # Lógica de negocio
│   │   │   ├── emailService.js
│   │   │   ├── fileService.js
│   │   │   ├── notificationService.js
│   │   │   └── reportService.js
│   │   ├── config/          # Configuraciones
│   │   │   ├── database.js
│   │   │   ├── redis.js
│   │   │   ├── jwt.js
│   │   │   └── email.js
│   │   └── utils/           # Utilidades
│   │       ├── validators.js
│   │       ├── helpers.js
│   │       └── constants.js
│   ├── tests/              # Pruebas backend
│   │   ├── unit/
│   │   ├── integration/
│   │   └── fixtures/
│   ├── uploads/            # Archivos subidos
│   ├── package.json
│   ├── server.js           # Entry point
│   └── Dockerfile
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── InvitationForm.jsx
│   │   │   │   └── ResetPasswordForm.jsx
│   │   │   ├── Tecnicos/
│   │   │   │   ├── TecnicosListPage.jsx
│   │   │   │   ├── TecnicoCreateForm.jsx
│   │   │   │   ├── TecnicoEditForm.jsx
│   │   │   │   ├── TecnicoPerfilPage.jsx
│   │   │   │   └── TecnicoOnboardingWizard.jsx
│   │   │   ├── Clientes/
│   │   │   ├── Asignaciones/
│   │   │   ├── Actividades/
│   │   │   ├── Validaciones/
│   │   │   └── Common/      # Componentes comunes
│   │   │       ├── Layout.jsx
│   │   │       ├── Navbar.jsx
│   │   │       ├── FileUpload.jsx
│   │   │       ├── DataTable.jsx
│   │   │       └── Modal.jsx
│   │   ├── pages/          # Páginas principales
│   │   │   ├── LoginPage.jsx
│   │   │   ├── TecnicoPage.jsx
│   │   │   ├── ClientePage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── hooks/          # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useApi.js
│   │   │   ├── useTechnicos.js
│   │   │   └── useNotifications.js
│   │   ├── services/       # API calls
│   │   │   ├── api.js      # Base API config
│   │   │   ├── authService.js
│   │   │   ├── tecnicosService.js
│   │   │   └── clientesService.js
│   │   ├── utils/          # Utilidades frontend
│   │   │   ├── timeUtils.js
│   │   │   ├── fileUtils.js
│   │   │   ├── formatters.js
│   │   │   └── validators.js
│   │   ├── context/        # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   ├── NotificationContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   └── styles/         # Estilos
│   │       ├── globals.css
│   │       └── components.css
│   ├── public/
│   ├── tests/              # Pruebas frontend
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
└── docs/                   # Documentación
    ├── API.md              # Documentación API
    ├── COMPONENTS.md       # Documentación componentes
    ├── DEPLOYMENT.md       # Guía deployment
    └── TESTING.md          # Guía testing
```

---

## 🔧 COMANDOS DE DESARROLLO

### Backend Development
```bash
# Navegar al backend
cd verifika/backend

# Instalar dependencias
npm install

# Desarrollo con hot reload
npm run dev

# Ejecutar tests
npm test
npm run test:watch
npm run test:coverage

# Validar código
npm run lint
npm run lint:fix

# Base de datos
npm run db:migrate
npm run db:seed
npm run db:reset
```

### Frontend Development
```bash
# Navegar al frontend
cd verifika/frontend

# Instalar dependencias
npm install

# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build
npm run preview

# Testing
npm test
npm run test:ui

# Linting
npm run lint
npm run lint:fix
```

### Scripts Integrados
```bash
# Desarrollo completo
./scripts/verifika-dev.sh dev

# Testing completo
./scripts/verifika-dev.sh test

# Build y deploy
./scripts/verifika-dev.sh build
./scripts/verifika-dev.sh deploy

# Logs en tiempo real
./scripts/verifika-dev.sh logs

# Estado del proyecto
./scripts/verifika-dev.sh status
```

---

## 📊 ESTÁNDARES DE CÓDIGO

### Backend (Node.js)
```javascript
// Estructura de Controller
class TecnicosController {
  // JSDoc para documentación
  /**
   * Crear nuevo técnico
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   * @returns {Promise<void>}
   */
  async createTecnico(req, res) {
    try {
      // Validar input
      const { error, value } = validateTecnicoInput(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.details
        });
      }

      // Lógica de negocio
      const tecnico = await TecnicoService.create(value);

      // Respuesta estándar
      res.status(201).json({
        success: true,
        message: 'Técnico creado exitosamente',
        data: tecnico
      });
    } catch (error) {
      logger.error('Error creating tecnico:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}
```

### Frontend (React)
```jsx
// Estructura de Componente
import React, { useState, useEffect } from 'react';
import { useTecnicos } from '../hooks/useTecnicos';
import { toast } from 'react-toastify';

/**
 * Lista de técnicos con filtros y paginación
 */
const TecnicosListPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    especialidad: '',
    estado: 'activo'
  });

  const { 
    tecnicos, 
    loading, 
    error, 
    fetchTecnicos,
    deleteTecnico 
  } = useTecnicos();

  useEffect(() => {
    fetchTecnicos(filters);
  }, [filters]);

  const handleDelete = async (id) => {
    try {
      await deleteTecnico(id);
      toast.success('Técnico eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar técnico');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Técnicos</h1>
      
      {/* Filtros */}
      <FilterBar filters={filters} onChange={setFilters} />
      
      {/* Lista */}
      <DataTable
        data={tecnicos}
        columns={columns}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TecnicosListPage;
```

---

## 🗄️ PATRONES DE BASE DE DATOS

### Consultas Estándar
```javascript
// Service Pattern
class TecnicoService {
  static async findAll(filters = {}) {
    const query = `
      SELECT 
        u.id,
        u.nombre,
        u.apellidos,
        u.email,
        u.estado,
        tp.especialidad,
        tp.nivel_experiencia,
        COUNT(tc.competencia_id) as total_competencias
      FROM usuarios u
      LEFT JOIN tecnicos_perfiles tp ON u.id = tp.usuario_id
      LEFT JOIN tecnicos_competencias tc ON u.id = tc.tecnico_id
      WHERE u.rol = 'tecnico'
        AND u.estado = ?
        ${filters.especialidad ? 'AND tp.especialidad = ?' : ''}
        ${filters.search ? 'AND (u.nombre LIKE ? OR u.apellidos LIKE ?)' : ''}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const params = [filters.estado || 'activo'];
    if (filters.especialidad) params.push(filters.especialidad);
    if (filters.search) {
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    params.push(filters.limit || 20, filters.offset || 0);

    return await db.query(query, params);
  }
}
```

---

## 🧪 TESTING GUIDELINES

### Tests Unitarios Backend
```javascript
// tests/unit/controllers/tecnicosController.test.js
describe('TecnicosController', () => {
  describe('createTecnico', () => {
    it('should create tecnico with valid data', async () => {
      const mockReq = {
        body: {
          nombre: 'Juan',
          apellidos: 'Pérez',
          email: 'juan@example.com',
          especialidad: 'Frontend'
        },
        user: { id: 1, rol: 'admin' }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await TecnicosController.createTecnico(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Técnico creado exitosamente',
        data: expect.any(Object)
      });
    });
  });
});
```

### Tests Frontend
```javascript
// tests/components/TecnicosListPage.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TecnicosListPage from '../TecnicosListPage';

describe('TecnicosListPage', () => {
  it('should display tecnicos list', async () => {
    render(<TecnicosListPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Gestión de Técnicos')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });
});
```

---

## 🔒 SEGURIDAD

### Validación de Inputs
```javascript
// utils/validators.js
const Joi = require('joi');

const tecnicoSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  apellidos: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  telefono: Joi.string().pattern(/^[0-9+\-\s()]+$/).optional(),
  especialidad: Joi.string().valid('Frontend', 'Backend', 'FullStack', 'DevOps').required(),
  nivel_experiencia: Joi.string().valid('junior', 'semi_senior', 'senior', 'lead').required()
});

const validateTecnicoInput = (data) => {
  return tecnicoSchema.validate(data, { abortEarly: false });
};
```

### Middleware de Autorización
```javascript
// middleware/auth.js
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Token requerido'
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes'
      });
    }

    next();
  };
};

// Uso en rutas
router.post('/tecnicos', requireRole(['admin']), TecnicosController.create);
```

---

## 📈 PERFORMANCE

### Optimización de Consultas
```sql
-- Índices críticos
CREATE INDEX idx_usuarios_rol_estado ON usuarios(rol, estado);
CREATE INDEX idx_tecnicos_especialidad ON tecnicos_perfiles(especialidad);
CREATE INDEX idx_actividades_fecha_estado ON actividades(fecha, estado);
CREATE INDEX idx_asignaciones_activas ON asignaciones(tecnico_id, cliente_id, estado);
```

### Caching Strategy
```javascript
// services/cacheService.js
const redis = require('../config/redis');

class CacheService {
  static async get(key) {
    try {
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.warn('Cache get error:', error);
      return null;
    }
  }

  static async set(key, value, ttl = 3600) {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      logger.warn('Cache set error:', error);
    }
  }
}
```

---

## 🐛 DEBUGGING

### Logging Estándar
```javascript
// config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### Error Handling
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Datos inválidos',
      errors: err.details
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
};
```

---

## 🚀 DEPLOYMENT

### Docker Compose
```yaml
# docker-compose.verifika.yml
version: '3.8'
services:
  verifika-api:
    build: ./verifika/backend
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
    depends_on:
      - mysql
      - redis
```

### Scripts de Deploy
```bash
#!/bin/bash
# scripts/deploy-verifika.sh

echo "🚀 Deploying Verifika..."

# Build images
docker-compose -f docker-compose.yml -f docker-compose.verifika.yml build

# Run migrations
docker-compose exec verifika-api npm run db:migrate

# Start services
docker-compose -f docker-compose.yml -f docker-compose.verifika.yml up -d

echo "✅ Verifika deployed successfully!"
```

---

*Guía actualizada: 2025-06-24*  
*Para dudas: Consultar documentación adicional en `/docs`*