# 🚀 Guía Completa de Deployment - BlueSystem.io

Esta guía te llevará paso a paso para configurar **BlueSystem.io** en un VPS KVM 1 de Hostinger.

## 📋 Tabla de Contenidos

1. [Preparativos del Servidor](#1-preparativos-del-servidor)
2. [Configuración Automática](#2-configuración-automática)
3. [Configuración Manual](#3-configuración-manual)
4. [Verificación y Pruebas](#4-verificación-y-pruebas)
5. [Configuración de Dominio y SSL](#5-configuración-de-dominio-y-ssl)
6. [Monitoreo y Mantenimiento](#6-monitoreo-y-mantenimiento)
7. [Solución de Problemas](#7-solución-de-problemas)

---

## 1. Preparativos del Servidor

### 🖥️ Configuración Inicial en Hostinger

1. **Accede al Panel de Hostinger**
   - Ve a tu panel de control de VPS
   - Selecciona tu VPS KVM 1

2. **Instalar Plantilla Base**
   ```
   Plantilla: Ubuntu 24.04 + Docker + Docker‑Compose
   ```

3. **Instalar Portainer (Opcional)**
   ```
   Plantilla adicional: Portainer CE
   ```

4. **Configurar Firewall Básico**
   - Puerto 22 (SSH)
   - Puerto 80 (HTTP)
   - Puerto 443 (HTTPS)
   - Puerto 9000 (Portainer)

5. **Habilitar Características**
   - ✅ Snapshots automáticos semanales
   - ✅ Escaneo de malware
   - ✅ Backup automático

### 🔑 Acceso SSH

```bash
# Conectar al VPS
ssh root@TU_IP_DEL_VPS

# Verificar que Docker esté funcionando
docker --version
docker-compose --version
```

---

## 2. Configuración Automática

### 🚀 Opción Rápida (Recomendada)

Ejecuta el script de configuración automática:

```bash
# Descargar y ejecutar script de setup
curl -fsSL https://raw.githubusercontent.com/FmBlueSystem/empresa/main/scripts/setup-vps.sh -o setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

El script automáticamente:
- ✅ Actualiza el sistema
- ✅ Instala Docker y Docker Compose
- ✅ Configura el firewall UFW
- ✅ Clona el repositorio
- ✅ Genera contraseñas seguras
- ✅ Configura servicios
- ✅ Despliega la aplicación
- ✅ Configura backups automáticos

**⏱️ Tiempo estimado: 5-10 minutos**

---

## 3. Configuración Manual

### 📁 Paso 1: Clonar Repositorio

```bash
# Crear directorio del proyecto
cd /root
git clone https://github.com/FmBlueSystem/empresa.git bluesystem
cd bluesystem
```

### ⚙️ Paso 2: Configurar Variables de Entorno

```bash
# Copiar archivo de configuración
cp .env.example .env

# Editar configuración
nano .env
```

**Variables importantes a cambiar:**
```bash
# Contraseñas seguras (genera las tuyas)
DB_PASSWORD=tu_password_seguro_aqui
DB_ROOT_PASSWORD=tu_root_password_aqui
REDIS_PASSWORD=tu_redis_password_aqui
JWT_SECRET=tu_jwt_secret_muy_largo_aqui
API_KEY=tu_api_key_aqui

# Dominio (si tienes uno)
DOMAIN=tu-dominio.com
SSL_EMAIL=tu-email@dominio.com
```

### 🐳 Paso 3: Desplegar con Docker

```bash
# Dar permisos a scripts
chmod +x scripts/*.sh

# Desplegar aplicación
./scripts/deploy.sh deploy
```

### 🔥 Paso 4: Configurar Firewall

```bash
# Instalar y configurar UFW
apt install ufw -y

# Configurar reglas básicas
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 9000/tcp  # Portainer

# Activar firewall
ufw enable

# Verificar estado
ufw status
```

---

## 4. Verificación y Pruebas

### 🔍 Verificar Servicios

```bash
# Estado de contenedores
docker-compose ps

# Logs de servicios
docker-compose logs -f

# Health checks
curl http://localhost/health
curl http://localhost/health/detailed
```

### 🌐 Verificar Acceso Web

1. **Frontend**: `http://TU_IP_DEL_VPS`
2. **Portainer**: `http://TU_IP_DEL_VPS:9000`
3. **API Health**: `http://TU_IP_DEL_VPS/health`

### 🧪 Pruebas de Funcionalidad

```bash
# Prueba del frontend
curl -I http://localhost/

# Prueba de la API
curl http://localhost/api

# Prueba de autenticación
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bluesystem.io","password":"admin123"}'
```

---

## 5. Configuración de Dominio y SSL

### 🌍 Configurar Dominio

1. **Configurar DNS**
   ```
   Tipo: A
   Nombre: @ (o tu subdominio)
   Valor: IP_DE_TU_VPS
   TTL: 300
   ```

2. **Actualizar configuración**
   ```bash
   nano .env
   ```
   ```
   DOMAIN=tu-dominio.com
   SSL_EMAIL=tu-email@dominio.com
   ```

### 🔒 Configurar SSL con Certbot

```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
certbot --nginx -d tu-dominio.com

# Configurar renovación automática
crontab -e
# Añadir: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 📝 Actualizar Nginx para HTTPS

```bash
# Editar configuración de Nginx
nano nginx/nginx.conf

# Descomentar secciones HTTPS
# Reiniciar servicios
docker-compose restart web
```

---

## 6. Monitoreo y Mantenimiento

### 📊 Monitoreo Básico

```bash
# Ver estado de sistema
/root/docker-stats.sh

# Ver logs en tiempo real
docker-compose logs -f

# Monitoreo de recursos
htop
iotop
df -h
```

### 🔄 Backups Automáticos

Los backups se ejecutan automáticamente cada día a las 2 AM:

```bash
# Ejecutar backup manual
/root/backup-bluesystem.sh

# Ver backups existentes
ls -la /root/backups/

# Restaurar desde backup
cd /root/bluesystem
docker-compose exec db mysql -u root -p < /root/backups/db_backup_FECHA.sql
```

### 📈 Comandos de Mantenimiento

```bash
# Actualizar aplicación
cd /root/bluesystem
git pull origin main
./scripts/deploy.sh deploy

# Limpiar recursos Docker
./scripts/deploy.sh cleanup

# Reiniciar servicios
./scripts/deploy.sh restart

# Ver estado completo
./scripts/deploy.sh status
```

---

## 7. Solución de Problemas

### 🚨 Problemas Comunes

#### Puerto 80 ocupado
```bash
# Verificar qué usa el puerto
sudo lsof -i :80
sudo systemctl stop nginx  # Si hay nginx del sistema
sudo systemctl disable nginx
```

#### Error de conexión a base de datos
```bash
# Verificar logs de MySQL
docker-compose logs db

# Reiniciar base de datos
docker-compose restart db

# Verificar conexión
docker-compose exec db mysql -u root -p
```

#### Frontend no carga
```bash
# Verificar logs de Nginx
docker-compose logs web

# Reconstruir frontend
docker-compose build frontend --no-cache
docker-compose restart frontend web
```

#### Aplicación lenta o sin memoria
```bash
# Verificar recursos
free -h
df -h
docker stats

# Limpiar logs y caché
docker system prune -f
docker volume prune -f
```

### 🔧 Comandos de Diagnóstico

```bash
# Estado completo del sistema
curl http://localhost/health/detailed

# Logs detallados
docker-compose logs --tail=100

# Reinicio completo
docker-compose down
docker-compose up -d

# Verificar conectividad
ping 8.8.8.8
nslookup tu-dominio.com
```

### 📞 Comandos de Emergencia

```bash
# Parar todo y limpiar
docker-compose down -v
docker system prune -a -f

# Restaurar desde backup
cd /root/bluesystem
./scripts/deploy.sh deploy --no-backup

# Monitoreo en tiempo real
watch -n 2 'docker ps; echo ""; docker stats --no-stream'
```

---

## 📚 Recursos Adicionales

### 🔗 Enlaces Útiles

- [Documentación Docker](https://docs.docker.com/)
- [Guía Nginx](https://nginx.org/en/docs/)
- [Configuración UFW](https://help.ubuntu.com/community/UFW)
- [Certbot SSL](https://certbot.eff.org/)

### 📱 Comandos de Referencia Rápida

```bash
# Ver aplicación
curl http://localhost

# Ver estado
./scripts/deploy.sh status

# Backup manual
/root/backup-bluesystem.sh

# Monitorear recursos
/root/docker-stats.sh

# Logs en vivo
docker-compose logs -f app
```

---

## ✅ Lista de Verificación Final

- [ ] ✅ VPS configurado con Ubuntu 24.04 + Docker
- [ ] ✅ Firewall UFW configurado (puertos 22, 80, 443, 9000)
- [ ] ✅ Repositorio clonado en `/root/bluesystem`
- [ ] ✅ Variables de entorno configuradas en `.env`
- [ ] ✅ Aplicación desplegada con `./scripts/deploy.sh deploy`
- [ ] ✅ Frontend accesible en `http://TU_IP`
- [ ] ✅ Portainer accesible en `http://TU_IP:9000`
- [ ] ✅ API respondiendo en `http://TU_IP/health`
- [ ] ✅ Backups automáticos configurados
- [ ] ✅ Monitoreo básico funcionando
- [ ] ✅ SSL configurado (si aplica)
- [ ] ✅ Dominio apuntando al VPS (si aplica)

---

## 🎉 ¡Deployment Completado!

Tu aplicación **BlueSystem.io** está ahora funcionando en producción.

**URLs de acceso:**
- **Aplicación**: `http://TU_IP` o `https://tu-dominio.com`
- **Portainer**: `http://TU_IP:9000`

**Credenciales por defecto:**
- Email: `admin@bluesystem.io`
- Password: `admin123`

---

¿Tienes problemas? Revisa la sección de **Solución de Problemas** o contacta al soporte técnico. 