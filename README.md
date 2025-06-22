# 🔵 BlueSystem.io

**Aplicación empresarial moderna desarrollada con Docker, Node.js y React**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/FmBlueSystem/empresa)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://docker.com)
[![Node.js](https://img.shields.io/badge/node.js-18.x-green.svg)](https://nodejs.org)

## 📋 Descripción

BlueSystem.io es una aplicación web empresarial completa que incluye:

- **Backend API REST** con Node.js y Express
- **Frontend moderno** con React y Vite
- **Base de datos** MySQL 8.0
- **Cache en memoria** con Redis
- **Servidor web** Nginx optimizado
- **Contenedorización completa** con Docker
- **Gestión visual** con Portainer

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│     Nginx       │────│   React App     │    │   Node.js API   │
│   (Port 80)     │    │   (Frontend)    │────│   (Port 3000)   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                              │
         │              ┌─────────────────┐            │
         │              │                 │            │
         └──────────────│     Redis       │────────────┘
                        │   (Cache)       │
                        │                 │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │                 │
                        │     MySQL       │
                        │   (Database)    │
                        │                 │
                        └─────────────────┘
```

## 📋 Requisitos del Sistema

### Para Desarrollo Local
- **Docker**: 20.10+ 
- **Docker Compose**: 2.0+
- **Git**: Para clonar el repositorio
- **macOS/Linux/Windows**: Compatible con todos los sistemas

### Para Producción (VPS)
- **VPS**: Mínimo 1GB RAM, 20GB almacenamiento
- **Ubuntu**: 20.04+ (recomendado 24.04)
- **Docker & Docker Compose**: Instalados
- **Puertos**: 80, 443, 22 disponibles

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/FmBlueSystem/empresa.git bluesystem
cd bluesystem
```

### 2. Configurar variables de entorno

```bash
# Copiar archivo de configuración
cp .env.example .env

# Editar configuración (opcional para desarrollo)
nano .env
```

### 3. Desarrollo Local (con Hot Reload)

```bash
# Iniciar todos los servicios en modo desarrollo
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Ver logs en tiempo real
docker-compose logs -f app frontend
```

### 4. Producción Local

```bash
# Opción 1: Usando el script de deployment (recomendado)
chmod +x scripts/deploy.sh
./scripts/deploy.sh deploy

# Opción 2: Usando Docker Compose directamente
docker-compose up -d
```

### 5. Acceder a la Aplicación

#### Modo Desarrollo
- **Frontend (Vite)**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Nginx (Proxy)**: http://localhost:8080
- **Adminer (Base de Datos)**: http://localhost:8081
- **Redis Commander**: http://localhost:8082
- **cAdvisor (Monitoreo Contenedores)**: http://localhost:8083
- **Uptime Kuma (Monitoreo Servicios)**: http://localhost:8084

#### Modo Producción
- **Aplicación web**: http://localhost
- **Portainer**: http://localhost:9000
- **API Health Check**: http://localhost/health

## 📁 Estructura del Proyecto

```
bluesystem/
├── 📁 app/                     # Backend Node.js
│   ├── 📁 config/             # Configuraciones (DB, Redis, Logger)
│   ├── 📁 routes/             # Rutas de la API
│   ├── 📄 Dockerfile          # Dockerfile del backend
│   ├── 📄 package.json        # Dependencias Node.js
│   ├── 📄 server.js           # Servidor principal
│   └── 📄 healthcheck.js      # Health check para Docker
├── 📁 frontend/               # Frontend React
│   ├── 📁 src/               # Código fuente React
│   │   ├── 📁 components/    # Componentes React
│   │   ├── 📄 App.jsx        # Componente principal
│   │   ├── 📄 main.jsx       # Punto de entrada
│   │   └── 📄 index.css      # Estilos principales
│   ├── 📄 Dockerfile         # Dockerfile del frontend
│   ├── 📄 package.json       # Dependencias React
│   ├── 📄 vite.config.js     # Configuración Vite
│   └── 📄 index.html         # HTML principal
├── 📁 nginx/                  # Configuración Nginx
│   ├── 📄 nginx.conf         # Configuración principal
│   └── 📁 conf.d/           # Configuraciones adicionales
├── 📁 database/              # Configuración base de datos
│   └── 📁 init/             # Scripts de inicialización
├── 📁 scripts/               # Scripts de automatización
│   └── 📄 deploy.sh          # Script de deployment
├── 📄 docker-compose.yml     # Configuración Docker Compose
├── 📄 .env.example           # Variables de entorno ejemplo
├── 📄 .gitignore             # Archivos ignorados por Git
└── 📄 README.md              # Este archivo
```

## 🔧 Scripts de Automatización

### Script de Deployment (`scripts/deploy.sh`)

```bash
# Deployment completo (recomendado)
./scripts/deploy.sh deploy

# Deployment rápido (solo restart)
./scripts/deploy.sh quick-deploy

# Otros comandos útiles
./scripts/deploy.sh start         # Iniciar servicios
./scripts/deploy.sh stop          # Detener servicios
./scripts/deploy.sh restart       # Reiniciar servicios
./scripts/deploy.sh health        # Verificar estado
./scripts/deploy.sh status        # Ver estado y logs
./scripts/deploy.sh backup        # Crear backup
./scripts/deploy.sh cleanup       # Limpiar recursos Docker
```

### Script de Backup de Base de Datos (`scripts/backup_db.sh`)

```bash
# Crear backup completo
./scripts/backup_db.sh

# Crear backup de base de datos específica
./scripts/backup_db.sh backup-db

# Listar backups disponibles
./scripts/backup_db.sh list

# Restaurar desde backup
./scripts/backup_db.sh restore backups/db_backup_20241201_1430.sql

# Limpiar backups antiguos (más de 7 días)
./scripts/backup_db.sh cleanup

# Ver ayuda completa
./scripts/backup_db.sh help
```

### Comandos de Desarrollo

```bash
# Iniciar en modo desarrollo
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Ver logs de desarrollo
docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

# Parar modo desarrollo
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

# Reconstruir contenedores de desarrollo
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache
```

## 🌐 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Información del sistema
- `GET /health` - Health check básico
- `GET /health/detailed` - Health check detallado
- `GET /api` - Información de la API
- `GET /api/test` - Endpoint de prueba con cache
- `GET /api/db-test` - Prueba de conexión a base de datos

### Usuarios
- `GET /api/users` - Listar usuarios

## 🔐 Credenciales por Defecto

Para pruebas y desarrollo:

```
Email: admin@bluesystem.io
Password: admin123
```

```
Email: demo@bluesystem.io  
Password: admin123
```

## ⚙️ Configuración de Producción

### Variables de Entorno Importantes

```bash
# Base de datos
DB_HOST=db
DB_NAME=bluesystem_db
DB_USER=bluesystem_user
DB_PASSWORD=tu_password_seguro
DB_ROOT_PASSWORD=tu_root_password_seguro

# Redis
REDIS_PASSWORD=tu_redis_password_seguro

# Seguridad
JWT_SECRET=tu_jwt_secret_muy_largo_y_seguro
API_KEY=tu_api_key_secreta

# Dominio (para HTTPS)
DOMAIN=tu-dominio.com
SSL_EMAIL=tu-email@dominio.com
```

### SSL/HTTPS

Para habilitar HTTPS, descomenta las secciones SSL en `nginx/nginx.conf` y coloca tus certificados en `ssl/`.

### Monitoreo

- **Health Checks**: `/health` y `/health/detailed`
- **Logs de aplicación**: `docker-compose logs`
- **Portainer**: Panel visual en http://localhost:9000

## 🔒 Seguridad

- Helmet.js para headers de seguridad
- Rate limiting en Nginx y Express
- Validación de entrada con Joi
- Hash de contraseñas con bcrypt
- Headers CSP y de seguridad
- Logs de auditoría

## 🐳 Docker Services

### Servicios incluidos:

1. **app** - Backend Node.js (Puerto interno: 3000)
2. **frontend** - Frontend React (Compilado y servido por Nginx)
3. **web** - Nginx (Puerto 80, 443)
4. **db** - MySQL 8.0 (Puerto interno: 3306)
5. **cache** - Redis (Puerto interno: 6379)
6. **portainer** - Gestión Docker (Puerto 9000)

### Volúmenes persistentes:

- `db_data` - Datos de MySQL
- `redis_data` - Datos de Redis
- `frontend_dist` - Build del frontend
- `nginx_logs` - Logs de Nginx
- `portainer_data` - Datos de Portainer

## 📊 Monitoreo y Logs

### Ver logs de servicios:
```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f app
docker-compose logs -f web
docker-compose logs -f db
```

### Monitoreo de recursos:
```bash
# Estado de contenedores
docker-compose ps

# Uso de recursos
docker stats

# Health checks
curl http://localhost/health/detailed
```

## 🛠️ Desarrollo

### Ejecutar en modo desarrollo:

```bash
# Backend
cd app
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Comandos útiles:

```bash
# Reconstruir imágenes
docker-compose build --no-cache

# Reiniciar un servicio específico
docker-compose restart app

# Ejecutar comandos en contenedor
docker-compose exec app npm install nueva-dependencia
docker-compose exec db mysql -u root -p
```

## 🚨 Solución de Problemas

### Problemas comunes:

1. **Puerto 80 ocupado**:
   ```bash
   sudo lsof -i :80
   # Cambiar puerto en docker-compose.yml si es necesario
   ```

2. **Error de conexión a base de datos**:
   ```bash
   docker-compose logs db
   # Verificar credenciales en .env
   ```

3. **Frontend no carga**:
   ```bash
   docker-compose logs web
   docker-compose restart frontend web
   ```

4. **Limpiar y reiniciar**:
   ```bash
   docker-compose down -v
   docker system prune -f
   ./scripts/deploy.sh deploy
   ```

## 📈 Próximas Funcionalidades

- [ ] Autenticación con JWT completa
- [ ] Sistema de roles y permisos
- [ ] API de gestión de usuarios
- [ ] Dashboard de métricas avanzado
- [ ] Notificaciones en tiempo real
- [ ] Backup automático de base de datos
- [ ] CI/CD con GitHub Actions
- [ ] Monitoreo con Prometheus/Grafana

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Freddy - BlueSystem**

- GitHub: [@FmBlueSystem](https://github.com/FmBlueSystem)
- Email: freddy@bluesystem.io

## 🔗 Enlaces Útiles

- [Documentación Docker](https://docs.docker.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

⭐ Si este proyecto te ha sido útil, ¡no olvides darle una estrella! 