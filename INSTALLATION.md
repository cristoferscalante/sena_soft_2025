# 🚀 Guía de Instalación - AirGuider

## Requisitos del Sistema

- **PHP** 8.2 o superior
- **Composer** 2.x
- **Node.js** 18.x o superior
- **NPM** 9.x o superior
- **MySQL** 8.0 o superior
- **Git**

## Instalación Rápida

### 1. Clonar el Repositorio

```bash
git clone https://github.com/cristoferscalante/sena_soft_2025.git
cd sena_soft_2025
```

### 2. Instalar Dependencias

```bash
# Dependencias PHP
composer install

# Dependencias JavaScript
npm install
```

### 3. Configurar el Entorno

```bash
# Copiar el archivo de configuración
cp .env.example .env

# Generar la clave de aplicación
php artisan key:generate
```

### 4. Configurar la Base de Datos

Edita el archivo `.env` con tus credenciales de MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=airguider
DB_USERNAME=root
DB_PASSWORD=tu_password
```

### 5. Crear la Base de Datos

```bash
# Opción 1: Crear manualmente en MySQL
mysql -u root -p
CREATE DATABASE airguider CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Opción 2: Usar el comando de Laravel (si tienes permisos)
php artisan db:create
```

### 6. Ejecutar Migraciones y Seeders

```bash
# Ejecutar todas las migraciones y poblar con datos de prueba
php artisan migrate:fresh --seed
```

Esto creará:
- ✅ 13 tablas con integridad referencial
- ✅ 15 ciudades colombianas
- ✅ 976 vuelos (próximos 60 días)
- ✅ 125,734 asientos disponibles
- ✅ 4 modelos de aeronaves
- ✅ 8 aeronaves activas

### 7. Crear el Enlace Simbólico para Storage

```bash
php artisan storage:link
```

### 8. Compilar Assets

```bash
# Modo desarrollo (con hot reload)
npm run dev

# Modo producción (optimizado)
npm run build
```

### 9. Iniciar el Servidor

```bash
# Servidor de desarrollo
php artisan serve
```

La aplicación estará disponible en: **http://localhost:8000**

### 10. Configurar el Scheduler (Opcional)

Para liberar automáticamente las reservas expiradas:

#### Linux/Mac:
```bash
crontab -e
# Añadir esta línea:
* * * * * cd /ruta-completa-al-proyecto && php artisan schedule:run >> /dev/null 2>&1
```

#### Windows:
```bash
# Ejecutar manualmente:
php artisan bookings:release-expired

# O usar Task Scheduler de Windows para ejecutar cada minuto
```

## Verificación de la Instalación

### Verificar que todo funciona:

```bash
# 1. Verificar migraciones
php artisan migrate:status

# 2. Verificar datos
php artisan tinker
>>> App\Models\Ciudad::count()
>>> App\Models\Vuelo::count()
>>> App\Models\Asiento::count()

# 3. Verificar rutas
php artisan route:list
```

## Solución de Problemas

### Error: "Could not find driver"
```bash
# Habilitar la extensión pdo_mysql en php.ini
extension=pdo_mysql
```

### Error: "Access denied for user"
```bash
# Verificar credenciales de MySQL en .env
# Asegurarse de que el usuario tenga permisos
```

### Error al compilar assets
```bash
# Limpiar caché de npm
npm cache clean --force
rm -rf node_modules
npm install
```

### Permisos en Linux/Mac
```bash
chmod -R 775 storage bootstrap/cache
chown -R $USER:www-data storage bootstrap/cache
```

## Configuración Adicional

### Redis (Opcional)

Si deseas usar Redis para cache y queues:

```env
CACHE_STORE=redis
QUEUE_CONNECTION=redis
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### Correo Electrónico

Para enviar tiquetes por correo (configura en `.env`):

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu_username
MAIL_PASSWORD=tu_password
MAIL_ENCRYPTION=tls
```

## Comandos Útiles

```bash
# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Ver logs en tiempo real
php artisan pail

# Ejecutar tests
php artisan test

# Optimizar para producción
php artisan optimize
```

## ¡Listo!

Tu instalación de AirGuider está completa. Accede a **http://localhost:8000** para empezar a usar el sistema.

---

**Desarrollado para SENASOFT 2025**

