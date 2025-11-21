# 🚀 Quick Start - Cali Verde

## ✅ Lo que ya está hecho:

- ✅ Proyecto en GitHub: https://github.com/juanse22/Huertas
- ✅ MVP funcional corriendo en local: http://localhost:8000
- ✅ Base de datos SQLite con 11 huertas
- ✅ Documentación completa (README.md + DEPLOY.md)

---

## 📌 URLs Importantes:

| Recurso | URL |
|---------|-----|
| **Repositorio GitHub** | https://github.com/juanse22/Huertas |
| **Configurar GitHub Pages** | https://github.com/juanse22/Huertas/settings/pages |
| **Local - Landing** | http://localhost:8000/ |
| **Local - Mapa Huertas** | http://localhost:8000/huertas.html |
| **Local - Nueva Huerta** | http://localhost:8000/nueva-huerta.html |
| **Local - API** | http://localhost:8000/api/huertas.php |

---

## 🎯 Acciones Pendientes (Opcionales):

### 1. Habilitar GitHub Pages (Solo demo estático)
```
1. Ve a: https://github.com/juanse22/Huertas/settings/pages
2. Source: Branch main, Folder: / (root)
3. Save
4. Sitio en: https://juanse22.github.io/Huertas/
```

### 2. Desplegar en Hosting PHP (MVP completo funcional)

**InfinityFree (Gratis):**
```
1. Crear cuenta: https://infinityfree.net/
2. Crear sitio (ej: caliverde.rf.gd)
3. Subir archivos por FTP a htdocs/
4. Crear BD MySQL e importar db/schema.sql y db/seed.sql
5. Actualizar api/config.php con credenciales
6. ¡Listo! http://caliverde.rf.gd
```

**Ver guía completa:** [DEPLOY.md](DEPLOY.md)

---

## 💻 Comandos Útiles Git:

```bash
# Ver estado
git status

# Ver commits
git log --oneline

# Subir cambios
git add .
git commit -m "Tu mensaje"
git push origin main

# Clonar en otro PC
git clone https://github.com/juanse22/Huertas.git
```

---

## 🔧 Comandos Servidor Local:

```bash
# Iniciar servidor PHP
cd "c:\Users\juan sebastian\Documents\proyecto_huertas"
php -S localhost:8000 -t public

# Detener servidor
Ctrl + C (en la ventana del servidor)

# Verificar PHP
php --version

# Crear/recrear base de datos
cd db
php -r "$pdo = new PDO('sqlite:cali_verde.db'); $pdo->exec(file_get_contents('schema_sqlite.sql'));"
```

---

## 🧪 Probar API:

```powershell
# GET todas las huertas
Invoke-RestMethod -Uri "http://localhost:8000/api/huertas.php"

# GET una huerta
Invoke-RestMethod -Uri "http://localhost:8000/api/huertas.php/1"

# POST nueva huerta
$huerta = @{
    nombre = "Mi Huerta"
    lat = 3.45
    lng = -76.53
    tipo = "comunitaria"
    practicas = @("agroecológica")
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/huertas.php" `
    -Method POST `
    -ContentType "application/json" `
    -Body $huerta
```

---

## 📱 Acceso desde Móvil (misma red WiFi):

```bash
# 1. Obtener tu IP local
ipconfig
# Buscar "IPv4 Address" (ej: 192.168.1.10)

# 2. En el móvil, abrir:
http://192.168.1.10:8000
```

---

## 🐛 Solución Rápida de Problemas:

| Problema | Solución |
|----------|----------|
| Servidor no inicia | Verificar que el puerto 8000 esté libre |
| API no responde | Verificar ruta de BD en `api/config.php` |
| No se ven huertas | Recrear BD con el comando de arriba |
| Mapa no carga | Verificar conexión a internet (usa Leaflet CDN) |

---

## 📚 Documentación:

- **README.md** - Información general del proyecto
- **DEPLOY.md** - Guía completa de despliegue
- **OPCION_B_NEXTJS.md** - Alternativa con Next.js + Supabase

---

## 🎓 Estructura de Archivos:

```
proyecto_huertas/
├── api/              # API REST (copiar a public/api/)
├── db/               # Schemas y seeds
├── public/           # Frontend (servir desde aquí)
│   ├── api/         # API (copia de /api)
│   ├── css/
│   ├── js/
│   └── *.html
├── uploads/          # Fotos (vacío por ahora)
├── index.html       # Landing para GitHub Pages
├── README.md
├── DEPLOY.md
└── QUICK_START.md   # Este archivo
```

---

## 🌟 Próximos Pasos Recomendados:

1. ✅ Explorar el proyecto local completo
2. ✅ Subir a GitHub ✓ (YA HECHO)
3. ⏳ Configurar GitHub Pages (opcional)
4. ⏳ Desplegar en hosting PHP gratuito
5. ⏳ Agregar dominio propio (opcional)
6. ⏳ Implementar funcionalidades Fase 2

---

**¡Disfruta tu proyecto Cali Verde! 🌱**

Si tienes dudas, revisa:
- README.md para información general
- DEPLOY.md para despliegue
- O abre un issue en GitHub
