# 🚀 CHECKLIST DE DESPLIEGUE VPS - BLUESYSTEM.IO

## 📋 **RESUMEN**
Esta checklist te guiará paso a paso para desplegar BlueSystem.io en un VPS de producción sin errores.

**Tiempo estimado:** 45-60 minutos  
**Nivel:** Intermedio  
**Requisitos:** VPS con Ubuntu 20.04+ y acceso root

---

## ✅ **FASE 1: PREPARACIÓN DEL SERVIDOR VPS**

### 🔧 **1.1 Conexión inicial al servidor**
```bash
# Conectar al VPS via SSH
ssh root@TU_IP_DEL_VPS

# Actualizar sistema
apt update && apt upgrade -y
```

- [ ] ✅ Conexión SSH exitosa
- [ ] ✅ Sistema actualizado

### 🔒 **1.2 Configuración de seguridad básica**
```bash
# Crear usuario no-root
adduser bluesystem
usermod -aG sudo bluesystem

# Configurar firewall
ufw enable
ufw allow ssh
ufw allow 80
ufw allow 443
ufw status
```

- [ ] ✅ Usuario `bluesystem` creado
- [ ] ✅ Firewall configurado
- [ ] ✅ Puertos 80, 443 y SSH abiertos

### 🐳 **1.3 Instalación de Docker**
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Agregar usuario al grupo docker
usermod -aG docker bluesystem

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version
```

- [ ] ✅ Docker instalado correctamente
- [ ] ✅ Docker Compose instalado
- [ ] ✅ Versiones verificadas

### 🌐 **1.4 Configuración de dominio**
```bash
# Verificar que el dominio apunte al VPS
nslookup bluesystem.io
nslookup api.bluesystem.io
```

- [ ] ✅ Dominio principal configurado
- [ ] ✅ Subdominio API configurado
- [ ] ✅ DNS propagado correctamente

---

## ✅ **FASE 2: CLONADO Y CONFIGURACIÓN DEL PROYECTO**

### 📥 **2.1 Clonado del repositorio**
```bash
# Cambiar al usuario bluesystem
su - bluesystem

# Clonar repositorio
git clone https://github.com/FmBlueSystem/empresa.git
cd empresa

# Verificar archivos
ls -la
```

- [ ] ✅ Repositorio clonado
- [ ] ✅ Archivos principales presentes
- [ ] ✅ Directorio correcto

### ⚙️ **2.2 Configuración de variables de entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar configuración (usar nano o vim)
nano .env
```

**Variables CRÍTICAS a cambiar:**
```bash
# OBLIGATORIO: Cambiar estos valores
NODE_ENV=production
DOMAIN=bluesystem.io
FRONTEND_URL=https://bluesystem.io
BACKEND_URL=https://api.bluesystem.io

# OBLIGATORIO: Generar secretos seguros
JWT_SECRET=$(openssl rand -base64 64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64)
SESSION_SECRET=$(openssl rand -base64 32)
API_KEY=$(openssl rand -hex 32)

# OBLIGATORIO: Contraseñas seguras
DB_PASSWORD=$(openssl rand -base64 32)
DB_ROOT_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)
```

- [ ] ✅ Archivo `.env` creado
- [ ] ✅ `NODE_ENV=production` configurado
- [ ] ✅ Dominios configurados correctamente
- [ ] ✅ Secretos JWT generados
- [ ] ✅ Contraseñas de DB generadas
- [ ] ✅ Configuración SMTP configurada (opcional)

### 📧 **2.3 Configuración de certificados SSL**
```bash
# Instalar Certbot para Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y

# Generar certificados (DESPUÉS de que nginx esté corriendo)
# Este comando se ejecutará más tarde
```

- [ ] ✅ Certbot instalado
- [ ] ⏳ Certificados (se generarán después)

---

## ✅ **FASE 3: DESPLIEGUE DE LA APLICACIÓN**

### 🚀 **3.1 Construcción y arranque inicial**
```bash
# Construir y levantar servicios
docker-compose -f docker-compose.yml up --build -d

# Verificar que todos los contenedores estén corriendo
docker ps

# Ver logs si hay problemas
docker-compose logs
```

- [ ] ✅ Imágenes construidas exitosamente
- [ ] ✅ Todos los contenedores corriendo
- [ ] ✅ Sin errores en logs

### 🔍 **3.2 Verificación de servicios**
```bash
# Verificar conectividad interna
curl -I http://localhost:3000/health
curl -I http://localhost:5173

# Verificar base de datos
docker exec -it bluesystem_mysql mysql -u root -p -e "SHOW DATABASES;"
```

- [ ] ✅ Backend respondiendo (puerto 3000)
- [ ] ✅ Frontend respondiendo (puerto 5173)
- [ ] ✅ Base de datos accesible
- [ ] ✅ Redis funcionando

### 🌐 **3.3 Configuración de Nginx y SSL**
```bash
# Generar certificados SSL
sudo certbot --nginx -d bluesystem.io -d api.bluesystem.io

# Verificar certificados
sudo certbot certificates

# Configurar renovación automática
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

- [ ] ✅ Certificados SSL generados
- [ ] ✅ HTTPS funcionando
- [ ] ✅ Renovación automática configurada

---

## ✅ **FASE 4: VERIFICACIÓN Y PRUEBAS**

### 🧪 **4.1 Pruebas de conectividad externa**
```bash
# Desde tu computadora local, probar:
curl -I https://bluesystem.io
curl -I https://api.bluesystem.io/health

# Verificar que redirija HTTP a HTTPS
curl -I http://bluesystem.io
```

- [ ] ✅ Frontend accesible via HTTPS
- [ ] ✅ API accesible via HTTPS
- [ ] ✅ Redirección HTTP → HTTPS funcionando
- [ ] ✅ Certificados válidos

### 👤 **4.2 Pruebas de funcionalidad**
```bash
# Acceder a la aplicación web
# https://bluesystem.io

# Probar login con credenciales por defecto:
# admin@bluesystem.io / admin123
# demo@bluesystem.io / admin123
```

- [ ] ✅ Aplicación web carga correctamente
- [ ] ✅ Login de administrador funciona
- [ ] ✅ Login de demo funciona
- [ ] ✅ Dashboard muestra datos

### 🗄️ **4.3 Verificación de base de datos**
```bash
# Verificar que las tablas y datos estén creados
docker exec -it bluesystem_mysql mysql -u bluesystem_user -p bluesystem -e "SHOW TABLES;"
docker exec -it bluesystem_mysql mysql -u bluesystem_user -p bluesystem -e "SELECT * FROM users;"
```

- [ ] ✅ Tablas creadas correctamente
- [ ] ✅ Usuarios por defecto presentes
- [ ] ✅ Datos iniciales cargados

---

## ✅ **FASE 5: CONFIGURACIÓN DE PRODUCCIÓN**

### 🔄 **5.1 Configuración de backups automáticos**
```bash
# Probar script de backup
./scripts/backup_db.sh backup

# Configurar cron para backups automáticos
crontab -e

# Agregar esta línea para backup diario a las 2 AM:
# 0 2 * * * cd /home/bluesystem/empresa && ./scripts/backup_db.sh backup
```

- [ ] ✅ Script de backup probado
- [ ] ✅ Backup automático configurado
- [ ] ✅ Directorio de backups creado

### 📊 **5.2 Configuración de monitoreo**
```bash
# Verificar servicios de monitoreo
curl -I http://localhost:8083  # cAdvisor
curl -I http://localhost:8084  # Uptime Kuma

# Configurar Uptime Kuma accediendo a:
# http://TU_IP_VPS:8084
```

- [ ] ✅ cAdvisor funcionando
- [ ] ✅ Uptime Kuma configurado
- [ ] ✅ Monitores creados para todos los servicios

### 🔐 **5.3 Seguridad adicional**
```bash
# Deshabilitar login root via SSH
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Configurar fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

- [ ] ✅ Login root deshabilitado
- [ ] ✅ Fail2ban instalado y configurado
- [ ] ✅ Seguridad SSH reforzada

---

## ✅ **FASE 6: OPTIMIZACIÓN Y MANTENIMIENTO**

### ⚡ **6.1 Optimización de rendimiento**
```bash
# Verificar uso de recursos
docker stats

# Configurar límites de memoria si es necesario
# (editar docker-compose.yml si el VPS tiene poca RAM)
```

- [ ] ✅ Uso de recursos verificado
- [ ] ✅ Límites configurados si es necesario

### 📝 **6.2 Configuración de logs**
```bash
# Configurar rotación de logs
sudo nano /etc/logrotate.d/docker

# Agregar configuración para logs de Docker
```

- [ ] ✅ Rotación de logs configurada
- [ ] ✅ Logs no crecerán indefinidamente

### 🔄 **6.3 Procedimientos de actualización**
```bash
# Crear script de actualización
cat > update.sh << 'EOF'
#!/bin/bash
echo "Actualizando BlueSystem.io..."
git pull origin main
docker-compose -f docker-compose.yml up --build -d
echo "Actualización completada"
EOF

chmod +x update.sh
```

- [ ] ✅ Script de actualización creado
- [ ] ✅ Procedimiento de actualización documentado

---

## 🎉 **VERIFICACIÓN FINAL**

### ✅ **Checklist de verificación completa**

**Conectividad:**
- [ ] ✅ https://bluesystem.io carga correctamente
- [ ] ✅ https://api.bluesystem.io/health responde OK
- [ ] ✅ Certificados SSL válidos y funcionando
- [ ] ✅ Redirección HTTP → HTTPS activa

**Funcionalidad:**
- [ ] ✅ Login de administrador funciona
- [ ] ✅ Dashboard muestra métricas
- [ ] ✅ Base de datos con datos iniciales
- [ ] ✅ Cache Redis funcionando

**Seguridad:**
- [ ] ✅ Firewall configurado
- [ ] ✅ Usuario root SSH deshabilitado
- [ ] ✅ Contraseñas seguras configuradas
- [ ] ✅ Fail2ban activo

**Monitoreo y Backups:**
- [ ] ✅ Backups automáticos configurados
- [ ] ✅ Monitoreo funcionando
- [ ] ✅ Logs configurados

**Mantenimiento:**
- [ ] ✅ Procedimientos de actualización listos
- [ ] ✅ Documentación completa

---

## 🆘 **SOLUCIÓN DE PROBLEMAS COMUNES**

### 🔧 **Error: Contenedores no arrancan**
```bash
# Ver logs detallados
docker-compose logs [nombre_servicio]

# Verificar espacio en disco
df -h

# Verificar memoria
free -h
```

### 🔧 **Error: No se puede acceder al sitio**
```bash
# Verificar nginx
docker logs bluesystem_nginx

# Verificar puertos
netstat -tlnp | grep :80
netstat -tlnp | grep :443

# Verificar DNS
nslookup bluesystem.io
```

### 🔧 **Error: Base de datos no conecta**
```bash
# Verificar contenedor MySQL
docker logs bluesystem_mysql

# Verificar conexión
docker exec -it bluesystem_mysql mysql -u root -p

# Verificar variables de entorno
docker exec -it bluesystem_backend env | grep DB_
```

---

## 📞 **CONTACTO Y SOPORTE**

Si encuentras problemas durante el despliegue:

1. **Revisa los logs:** `docker-compose logs`
2. **Verifica la configuración:** Asegúrate de que `.env` esté correctamente configurado
3. **Consulta la documentación:** Revisa `README.md` para información adicional

---

## ✅ **CONFIRMACIÓN FINAL**

**¡FELICITACIONES!** 🎉

Si todas las casillas están marcadas, BlueSystem.io está correctamente desplegado en producción.

**URLs de acceso:**
- **Aplicación principal:** https://bluesystem.io
- **API:** https://api.bluesystem.io
- **Monitoreo:** http://TU_IP_VPS:8084

**Credenciales por defecto:**
- **Admin:** admin@bluesystem.io / admin123
- **Demo:** demo@bluesystem.io / admin123

**⚠️ IMPORTANTE:** Cambia las contraseñas por defecto después del primer login.

---

**Fecha de despliegue:** _______________  
**Responsable:** _______________  
**IP del servidor:** _______________  
**Dominio:** _______________ 