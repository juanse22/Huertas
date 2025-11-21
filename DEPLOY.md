# 🚀 Guía de Despliegue - Cali Verde

Esta guía te ayudará a desplegar el MVP de Cali Verde en diferentes plataformas.

---

## 📊 Comparación de Opciones

| Opción | Pros | Contras | Ideal para |
|--------|------|---------|------------|
| **GitHub Pages** | Gratis, rápido, SSL automático | Solo HTML/CSS/JS estático | Demo/Portfolio |
| **InfinityFree** | Gratis, PHP + MySQL, sin ads | Límite de recursos | MVP/Desarrollo |
| **000webhost** | Gratis, PHP 7.4+, fácil setup | Con ads (removibles) | Testing |
| **Hosting pago** | Control total, rendimiento | Costo mensual ($3-10) | Producción |

---

## 🌐 Opción 1: GitHub Pages (Solo Frontend Estático)

### ✅ **Ya está configurado!**

Tu proyecto ya está en GitHub. Para activar GitHub Pages:

1. Ve a: https://github.com/juanse22/Huertas/settings/pages
2. En **"Source"**, selecciona: `Branch: main`
3. En **"Folder"**, deja: `/ (root)`
4. Clic en **"Save"**
5. Espera 1-2 minutos

**URL del sitio:** https://juanse22.github.io/Huertas/

### ⚠️ Limitaciones:
- Solo muestra la página informativa
- NO ejecuta PHP ni base de datos
- Útil para mostrar el código fuente y documentación

---

## 🆓 Opción 2: InfinityFree (Recomendado - PHP + MySQL Gratuito)

### 📋 Pasos:

#### **1. Crear cuenta**
- Ve a: https://infinityfree.net/
- Clic en "Sign Up Now"
- Completa el formulario (email, contraseña)

#### **2. Crear sitio**
- En el panel, clic en "Create Account"
- Elige un subdominio: `caliverde.rf.gd` (o el que prefieras)
- O conecta tu propio dominio

#### **3. Configurar base de datos**
- En el panel de control, ve a "MySQL Databases"
- Clic en "Create Database"
- Nombre: `cali_verde`
- Guarda las credenciales:
  - **Host:** sql123.infinityfree.com
  - **Database:** `epizXXXXX_cali_verde`
  - **User:** `epizXXXXX_usuario`
  - **Password:** tu_contraseña

#### **4. Subir archivos**

**Opción A: FileZilla (FTP)**
```
Host: ftpupload.net
Username: tu_usuario (ej: epiz12345678)
Password: tu_contraseña_ftp
Port: 21
```

Sube todo el contenido de la carpeta `public/` a `htdocs/`

**Opción B: File Manager**
- Desde el panel, abre "File Manager"
- Ve a `htdocs/`
- Sube los archivos manualmente

#### **5. Importar base de datos**
- En el panel, abre "phpMyAdmin"
- Selecciona tu base de datos
- Clic en "Import"
- Sube `db/schema.sql`
- Luego sube `db/seed.sql`

#### **6. Configurar API**
Edita `htdocs/api/config.php`:

```php
// Cambiar de SQLite a MySQL
define('DB_HOST', 'sql123.infinityfree.com');
define('DB_NAME', 'epizXXXXX_cali_verde');
define('DB_USER', 'epizXXXXX_usuario');
define('DB_PASS', 'tu_contraseña');

function getDBConnection() {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS);
    return $pdo;
}
```

#### **7. Probar**
Visita: `http://caliverde.rf.gd`

### ✅ Características:
- ✅ PHP 7.4+
- ✅ MySQL (400MB)
- ✅ Sin anuncios
- ✅ SSL gratuito
- ✅ Soporte FTP

---

## 🌍 Opción 3: 000webhost

### 📋 Pasos:

#### **1. Crear cuenta**
- Ve a: https://www.000webhost.com/
- Clic en "Free Sign Up"

#### **2. Crear sitio**
- Nombre del sitio: `caliverde`
- Contraseña y configuración

#### **3. Subir archivos**
- Ve a "File Manager"
- Sube archivos a `public_html/`

#### **4. Crear base de datos**
- En "Tools", ve a "Database Manager"
- Crear nueva base de datos MySQL
- Importar `schema.sql` y `seed.sql`

#### **5. Configurar**
- Actualizar `api/config.php` con credenciales

**URL:** `http://caliverde.000webhostapp.com`

---

## 💰 Opción 4: Hosting Pago (Producción)

Para un sitio en producción con dominio profesional:

### **HostGator (Recomendado)**
- Desde $2.75/mes
- cPanel + PHP 8.0 + MySQL
- Dominio gratis primer año
- SSL incluido
- https://www.hostgator.com/

### **Bluehost**
- Desde $2.95/mes
- Optimizado para WordPress/PHP
- https://www.bluehost.com/

### **DigitalOcean (Avanzado)**
- Droplet desde $6/mes
- Control total (VPS)
- Requiere conocimientos de servidor
- https://www.digitalocean.com/

---

## 🔧 Script de Deploy Automatizado

Crea `deploy.sh`:

```bash
#!/bin/bash

# Configuración
FTP_HOST="ftpupload.net"
FTP_USER="tu_usuario"
FTP_PASS="tu_contraseña"

# Subir archivos
lftp -c "
set ftp:ssl-allow no;
open -u $FTP_USER,$FTP_PASS $FTP_HOST;
mirror -R public/ htdocs/;
bye
"

echo "✅ Deploy completado!"
```

Ejecutar:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🐛 Solución de Problemas

### **Error: "Database connection failed"**
- Verifica credenciales en `api/config.php`
- Asegúrate de que la base de datos esté creada
- Comprueba que las tablas estén importadas

### **Error 404 en la API**
- Verifica que `.htaccess` esté en la raíz
- Asegúrate de que mod_rewrite esté habilitado
- Revisa la ruta en `config.php`

### **No se ven las huertas**
- Abre la consola del navegador (F12)
- Verifica que `api/huertas.php` retorne JSON
- Comprueba que los datos estén en la BD

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de PHP
2. Verifica la consola del navegador
3. Abre un issue en GitHub: https://github.com/juanse22/Huertas/issues

---

**¡Buena suerte con el despliegue! 🚀**
