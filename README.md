# SENASOFT 2025 - Sistema de Compra de Tiquetes Aéreos

Sistema web para la compra de tiquetes aéreos desarrollado para el reto SENASOFT 2025. Implementa búsqueda de vuelos, selección de asientos con control de concurrencia, registro de pasajeros y simulación de pagos.

## 📋 Documentación de Planeación

Toda la documentación del análisis, arquitectura y diseño se encuentra en la carpeta **`doc/`**:

- **[`doc/analisis.md`](doc/analisis.md)** - Análisis completo de requerimientos, casos de uso, modelo de datos y plan de trabajo
- **[`doc/Diagramas/arquitectura_diagrama.md`](doc/Diagramas/arquitectura_diagrama.md)** - Arquitectura del sistema con Laravel + Inertia.js + React + MySQL, diagramas de componentes, flujos y estrategias de concurrencia
- **[`doc/Db/diseño_bd.md`](doc/Db/diseño_bd.md)** - Diseño de base de datos con diagramas ER, DDL, triggers, stored procedures y seeders
- **[`doc/Diagramas/diagrama_flujo.md`](doc/Diagramas/diagrama_flujo.md)** - Diagramas de flujo detallados de todas las operaciones del sistema

## 🎨 Diseño UI/UX

El diseño visual y los prototipos están disponibles en Figma:
- **[Ver diseño en Figma](https://www.figma.com/design/hpyIWr8aYFubmDp60K2nGr/senasoft?node-id=1-2&p=f&t=P1PariLdVzows3WK-0)**

## 🚀 Stack Tecnológico

- **Frontend:** React 18+ con Inertia.js client, TailwindCSS, Heroicons
- **Backend:** Laravel 12+ (monolítico) con Inertia.js server adapter
- **Base de datos:** MySQL 8.0+
- **Caché/Queues:** Redis (opcional)
- **Build tool:** Vite
- **Control de versiones:** Git con GitFlow

## ⚙️ Instalación

### Requisitos Previos

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/cristoferscalante/sena_soft_2025.git
cd sena_soft_2025
```

2. **Instalar dependencias de PHP**
```bash
composer install
```

3. **Instalar dependencias de Node.js**
```bash
npm install
```

4. **Configurar el archivo .env**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configurar la base de datos en .env**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=airguider
DB_USERNAME=root
DB_PASSWORD=
```

6. **Ejecutar migraciones y seeders**
```bash
php artisan migrate:fresh --seed
```

7. **Compilar assets**
```bash
npm run dev
# O para producción:
npm run build
```

8. **Iniciar el servidor**
```bash
php artisan serve
```

9. **Configurar el scheduler (opcional)**
```bash
# Añadir a crontab (Linux/Mac):
* * * * * cd /ruta-al-proyecto && php artisan schedule:run >> /dev/null 2>&1

# Windows: Ejecutar manualmente cada minuto o usar Task Scheduler
php artisan bookings:release-expired
```

10. **Acceder a la aplicación**
```
http://localhost:8000
```

## 📊 Datos de Prueba

Después de ejecutar los seeders, tendrás:
- ✅ 15 ciudades colombianas
- ✅ 976 vuelos programados (próximos 60 días)
- ✅ 125,734 asientos disponibles
- ✅ 4 modelos de aeronaves
- ✅ 8 aeronaves en la flota

## 🎯 Características Principales

### ✈️ Búsqueda de Vuelos
- Filtros de origen, destino y fechas
- Búsqueda de solo ida o ida y regreso
- Autocompletado de ciudades
- Validación de fechas (hoy + 60 días)
- Máximo 5 pasajeros por reserva

### 💺 Selección de Asientos
- Mapa interactivo de asientos por vuelo
- Control de concurrencia con optimistic locking
- Estados: disponible, reservado, emitido
- Visualización en tiempo real

### 👥 Registro de Pasajeros
- Hasta 5 pasajeros por reserva
- Validación de edad para infantes (< 3 años)
- Datos completos: nombres, documentos, contacto
- Asignación automática de asientos

### 💳 Simulación de Pago
- 3 métodos: Tarjeta Crédito, Débito, PSE
- Simulación: 80% aprobado, 20% rechazado
- Generación de referencia única
- Confirmación instantánea

### 🎫 Generación de Tiquetes
- Formatos: PDF y JSON
- Código QR único por tiquete
- Descarga inmediata
- Envío por correo electrónico

### ⏰ Sistema Automático
- Liberación de asientos expirados cada minuto
- Timeout de 5 minutos para reservas pendientes
- Jobs en background con Laravel Queue

## 🏗️ Arquitectura

```
Frontend (React + Inertia)
    ↓
Controladores (Laravel)
    ↓
Servicios (Lógica de Negocio)
    ↓
Modelos (Eloquent ORM)
    ↓
Base de Datos (MySQL)
```

## 🎨 Paleta de Colores

- **Primario:** #375372 (Azul oscuro elegante)
- **Secundario:** #f5a833 (Naranja cálido)
- **Acento:** #39afc0 (Turquesa)

## 📁 Estructura del Proyecto

```
sena_soft_2025/
├── app/
│   ├── Http/Controllers/    # Controladores Inertia
│   ├── Models/               # Modelos Eloquent
│   ├── Services/             # Lógica de negocio
│   └── Jobs/                 # Jobs de background
├── database/
│   ├── migrations/           # 13 migraciones
│   └── seeders/              # Datos de prueba
├── resources/
│   ├── js/
│   │   ├── Components/       # Componentes React reutilizables
│   │   ├── Layouts/          # Layouts (MainLayout)
│   │   └── Pages/            # Páginas Inertia
│   └── views/                # Vistas Blade (tickets)
├── routes/
│   ├── web.php               # Rutas web
│   └── console.php           # Scheduler
└── doc/                      # Documentación completa
```

## 🧪 Testing

```bash
# Ejecutar tests
php artisan test

# Test de un componente específico
php artisan test --filter=BookingTest
```

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
