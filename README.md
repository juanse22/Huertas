# 🌱 CALI VERDE - MVP Huertas Comunitarias

[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://juanse22.github.io/Huertas/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Plataforma web para conectar y visibilizar huertas comunitarias en Cali, Colombia.

---

## 🚀 Demo en Vivo

### **Repositorio GitHub:**
👉 [https://github.com/juanse22/Huertas](https://github.com/juanse22/Huertas)

> ⚠️ **Nota importante:** Este proyecto usa PHP + SQLite/MySQL, por lo que **NO puede ejecutarse completamente en GitHub Pages** (solo HTML estático). Para ver la aplicación funcionando, sigue las instrucciones de instalación local o usa hosting PHP gratuito.

## 🎯 Objetivo del MVP

- Landing con propuesta de valor
- Registro de huertas con ubicación geográfica
- Mapa interactivo con Leaflet
- API REST para CRUD de huertas
- 10+ huertas semilla en barrios de Cali

---

## 📦 Stack Tecnológico (Opción Principal)

- **Backend:** PHP 8.2 + PDO
- **Base de datos:** MySQL 8.0
- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **Mapa:** Leaflet.js + OpenStreetMap
- **Servidor:** Apache (XAMPP/MAMP) o PHP Built-in Server

---

## ⚡ Instalación Rápida (Menos de 1 hora)

### **Paso 1: Requisitos previos**

- PHP >= 8.0 ([Descargar XAMPP](https://www.apachefriends.org/))
- MySQL >= 8.0 (incluido en XAMPP)
- Navegador moderno (Chrome, Firefox, Edge)

### **Paso 2: Clonar o descargar el proyecto**

```powershell
# Opción 1: Si tienes Git
git clone <repo-url> cali-verde-php
cd cali-verde-php

# Opción 2: Descargar ZIP y extraer en c:\xampp\htdocs\cali-verde-php
```

### **Paso 3: Crear base de datos**

#### **Usando phpMyAdmin (recomendado para principiantes):**

1. Abre XAMPP Control Panel
2. Inicia **Apache** y **MySQL**
3. Abre http://localhost/phpmyadmin
4. Clic en "Nuevo" para crear base de datos
5. Nombre: `cali_verde`, Cotejamiento: `utf8mb4_unicode_ci`
6. Clic en "Importar" → Seleccionar `db/schema.sql` → "Continuar"
7. Luego importar `db/seed.sql`

#### **Usando línea de comandos:**

```powershell
# Conectar a MySQL (la contraseña por defecto en XAMPP está vacía)
mysql -u root -p

# Ejecutar scripts
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seed.sql
```

### **Paso 4: Configurar conexión a BD**

Edita `api/config.php` si tus credenciales son diferentes:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'cali_verde');
define('DB_USER', 'root');
define('DB_PASS', ''); // Cambiar si tienes contraseña
```

### **Paso 5: Iniciar servidor**

#### **Opción A: Con XAMPP/MAMP**

1. Copia el proyecto a `c:\xampp\htdocs\cali-verde-php\`
2. Inicia Apache desde XAMPP Control Panel
3. Abre: **http://localhost/cali-verde-php/public/**

#### **Opción B: PHP Built-in Server (más rápido)**

```powershell
# Desde la raíz del proyecto
cd c:\Users\juan sebastian\Documents\proyecto_huertas
php -S localhost:8000 -t public

# Abre: http://localhost:8000
```

### **Paso 6: Probar la aplicación**

1. **Landing:** http://localhost:8000/
2. **Ver huertas:** http://localhost:8000/huertas.html
3. **Registrar huerta:** http://localhost:8000/nueva-huerta.html
4. **API:** http://localhost:8000/api/huertas.php

---

## 🧪 Pruebas de la API

### **GET - Obtener todas las huertas**

```powershell
# PowerShell
Invoke-WebRequest -Uri "http://localhost:8000/api/huertas.php" -Method GET

# O usando curl (si lo tienes instalado)
curl http://localhost:8000/api/huertas.php
```

**Respuesta esperada:** Array JSON con todas las huertas.

### **GET - Obtener una huerta por ID**

```powershell
curl http://localhost:8000/api/huertas.php/1
# o
curl "http://localhost:8000/api/huertas.php?id=1"
```

### **POST - Crear nueva huerta**

```powershell
# PowerShell
$body = @{
    nombre = "Huerta de Prueba"
    responsable = "Juan Pérez"
    barrio = "Granada"
    direccion = "Calle 5 #38-00"
    lat = 3.4516
    lng = -76.5320
    tipo = "comunitaria"
    practicas = @("agroecológica", "compostaje")
    contacto_tel = "3001234567"
    contacto_email = "test@huerta.com"
    fotos = @()
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/huertas.php" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

**Respuesta esperada:** `{"message": "Huerta creada exitosamente", "id": 11}`

### **PUT - Actualizar huerta**

```powershell
$body = @{
    nombre = "Huerta Actualizada"
    barrio = "Ciudad Jardín"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/huertas.php/11" `
    -Method PUT `
    -ContentType "application/json" `
    -Body $body
```

### **DELETE - Eliminar huerta**

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/huertas.php/11" -Method DELETE
```

---

## 🗺️ Datos de Ejemplo (Payload JSON)

```json
{
  "nombre": "Huerta Comunitaria La Merced",
  "responsable": "Carmen Rodríguez",
  "barrio": "La Merced",
  "direccion": "Carrera 4 #7-45",
  "lat": 3.4486,
  "lng": -76.5311,
  "tipo": "comunitaria",
  "practicas": ["agroecológica", "compostaje", "captación de lluvia"],
  "contacto_tel": "3209876543",
  "contacto_email": "lamerced.verde@gmail.com",
  "fotos": ["uploads/merced_1.jpg", "uploads/merced_2.jpg"]
}
```

---

## 📂 Estructura del Proyecto

```
proyecto_huertas/
├── api/
│   ├── config.php          # Configuración DB + helpers
│   └── huertas.php         # API REST (GET, POST, PUT, DELETE)
├── db/
│   ├── schema.sql          # Estructura de tablas
│   └── seed.sql            # Datos de ejemplo (10 huertas)
├── public/
│   ├── index.html          # Landing page
│   ├── nueva-huerta.html   # Formulario de registro
│   ├── huertas.html        # Lista + mapa
│   ├── css/
│   │   └── styles.css      # Estilos globales
│   └── js/
│       ├── app.js          # Lógica principal (lista)
│       ├── form.js         # Validación de formulario
│       └── map.js          # Leaflet map
├── uploads/                # Directorio para fotos
├── .htaccess               # Configuración Apache
└── README.md
```

---

## 🔒 Seguridad Implementada

- ✅ **PDO con Prepared Statements** (prevención de SQL Injection)
- ✅ **Sanitización de entradas** con `htmlspecialchars()` y `strip_tags()`
- ✅ **Validación de coordenadas** (rango de Cali)
- ✅ **Validación de tipos ENUM** (comunitaria, escolar, familiar)
- ✅ **Validación de email** con `filter_var()`
- ✅ **CORS configurado** para desarrollo
- ✅ **Manejo de errores** con mensajes JSON estructurados

---

## ✅ Criterios de Aceptación

### **Funcionalidades verificables:**

1. ✅ **Levantar proyecto local** en menos de 10 minutos
2. ✅ **Registrar una huerta nueva** desde el formulario
3. ✅ **Ver todas las huertas** en lista y mapa
4. ✅ **Filtrar huertas** por barrio y tipo
5. ✅ **Ver datos semilla** (10 huertas pre-cargadas)
6. ✅ **Centrar mapa** al hacer clic en una huerta de la lista
7. ✅ **Ver detalles** en popup del mapa
8. ✅ **Eliminar huerta** desde el modal de detalles
9. ✅ **Validación** de campos obligatorios (nombre, lat, lng)
10. ✅ **Mensajes de error** claros en caso de fallo

---

## 🐛 Solución de Problemas

### **Error: "Database connection failed"**

- Verifica que MySQL esté corriendo en XAMPP
- Revisa credenciales en `api/config.php`
- Asegúrate de haber creado la base de datos `cali_verde`

### **Error 404 en la API**

- Verifica la ruta: debe ser `http://localhost:8000/api/huertas.php`
- Si usas XAMPP, la ruta es `http://localhost/cali-verde-php/api/huertas.php`

### **El mapa no carga**

- Verifica conexión a internet (Leaflet usa tiles de OpenStreetMap)
- Abre la consola del navegador (F12) para ver errores JavaScript

### **No se ven las huertas**

- Verifica que `seed.sql` se haya ejecutado correctamente:
  ```sql
  SELECT COUNT(*) FROM huertas;
  -- Debe retornar al menos 10
  ```

---

## 🚀 Backlog Fase 2 (Post-MVP)

### **Funcionalidades prioritarias:**

1. **Sistema de autenticación**
   - Login/registro de usuarios
   - Roles: admin, responsable, visitante
   - Solo responsables pueden editar su huerta

2. **Módulo de voluntariado**
   - Formulario para unirse como voluntario
   - Match entre voluntarios y huertas cercanas
   - Agenda de actividades

3. **Gestión de eventos**
   - Calendario de talleres y jornadas
   - Registro de asistencia
   - Recordatorios por email/SMS

4. **Indicadores ambientales**
   - Dashboard con métricas: kg de compost, litros de agua ahorrados
   - Producción de alimentos (kg/mes)
   - CO2 capturado estimado

5. **Verificación de huertas**
   - Proceso de aprobación por admin
   - Estado: pendiente, verificada, inactiva
   - Insignias de certificación agroecológica

6. **Mejoras UX/UI**
   - Subida real de fotos (upload con preview)
   - Geocodificación inversa (seleccionar en mapa → lat/lng)
   - Modo oscuro
   - PWA (instalable en móviles)

7. **Reportes y analíticas**
   - Huertas por comuna
   - Tipos de cultivos más comunes
   - Exportar datos a CSV/Excel

8. **Integración con redes sociales**
   - Login con Google/Facebook
   - Compartir huertas en redes sociales
   - Feed de actividades

---

## 📞 Soporte

Para dudas o problemas:
- Revisar este README
- Consultar comentarios en el código
- Verificar logs de PHP: `c:\xampp\apache\logs\error.log`

---

## 📜 Licencia

Proyecto educativo - Universidad del Valle  
© 2025 Cali Verde - Todos los derechos reservados

---

## 🎓 Notas para el curso

Este MVP cubre los siguientes conceptos:

- **Backend:** PHP orientado a objetos, PDO, REST API
- **Frontend:** HTML semántico, CSS Grid/Flexbox, JavaScript ES6+
- **Base de datos:** Modelado relacional, JSON en MySQL, índices
- **Seguridad:** Sanitización, prepared statements, validación
- **Mapas:** Leaflet.js, GeoJSON, markers personalizados
- **UX:** Formularios accesibles, retroalimentación al usuario, responsive

**Tiempo estimado de instalación:** 30-45 minutos  
**Tiempo de desarrollo:** ~6-8 horas (ya realizado)

---

**¡Listo para usar! 🚀**
