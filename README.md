# ✈️ AirGuider - Sistema de Compra de Tiquetes Aéreos

> Sistema web profesional para búsqueda, reserva y compra de tiquetes aéreos desarrollado para SENASOFT 2025.

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=flat)](https://inertiajs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat&logo=mysql)](https://mysql.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)

## 🌐 Demo en Vivo

**🔗 [https://airguide.clubgestion.com/](https://airguide.clubgestion.com/)**

Accede a la aplicación desplegada y prueba todas las funcionalidades en tiempo real.

## 🎨 Diseño UI/UX

Diseño completo, prototipos interactivos y sistema de diseño disponibles en Figma:

**🎨 [Ver Prototipo en Figma →](https://www.figma.com/design/hpyIWr8aYFubmDp60K2nGr/senasoft?node-id=1-2&p=f&t=P1PariLdVzows3WK-0)**

El diseño incluye:
- 📱 Wireframes y mockups de alta fidelidad
- 🔄 Flujos de usuario completos (búsqueda → selección → pago → confirmación)
- 🎨 Sistema de diseño (colores, tipografía, componentes)
- ⚡ Estados de UI (loading, error, success, empty states)
- 📐 Versiones responsive (desktop, tablet, mobile)

---

## 📋 Tabla de Contenidos

- [Documentación](#-documentación-completa)
- [Stack Tecnológico](#-stack-tecnológico)
- [Características](#-características-principales)
- [Base de Datos](#-base-de-datos)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura](#-arquitectura-del-sistema)
- [Instalación](#️-instalación)
- [Uso](#-guía-de-uso)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## 📋 Documentación Completa

Toda la documentación técnica y de análisis se encuentra en **`doc/`**:

| Documento | Descripción |
|-----------|-------------|
| **[`doc/analisis.md`](doc/analisis.md)** | 📊 Análisis completo de requerimientos, casos de uso y plan de trabajo |
| **[`doc/Db/diseño_bd.md`](doc/Db/diseño_bd.md)** | 🗄️ Diseño de base de datos con diagramas ER, DDL y seeders |
| **[`doc/Diagramas/arquitectura_diagrama.md`](doc/Diagramas/arquitectura_diagrama.md)** | 🏗️ Arquitectura del sistema, componentes y estrategias de concurrencia |
| **[`doc/Diagramas/diagrama_flujo.md`](doc/Diagramas/diagrama_flujo.md)** | 🔄 Diagramas de flujo de todas las operaciones |


---

## 🚀 Stack Tecnológico

### Backend
- **🐘 Laravel 12+** - Framework PHP moderno con arquitectura MVC
- **🔗 Inertia.js Server** - Adapter para SSR con React
- **🗄️ MySQL 8.0+** - Base de datos relacional
- **📄 DomPDF** - Generación de PDFs para tiquetes y recibos

### Frontend
- **⚛️ React 18+** - Librería UI con hooks y componentes funcionales
- **🔗 Inertia.js Client** - SPA sin API REST
- **🎨 TailwindCSS 3+** - Framework CSS utility-first
- **🎯 Heroicons** - Iconos SVG optimizados
- **⚡ Vite** - Build tool ultrarrápido
- **🔧 PostCSS** - Procesador CSS

### DevOps & Herramientas
- **🔀 Git** - Control de versiones con GitFlow
- **📦 Composer** - Gestor de dependencias PHP
- **📦 npm** - Gestor de dependencias JavaScript
- **🧪 PHPUnit** - Testing unitario y de integración

---

## ✨ Características Principales

### 🔍 Búsqueda Inteligente de Vuelos
- ✅ Autocompletado de ciudades con sugerencias en tiempo real
- ✅ Búsqueda de solo ida o ida y vuelta
- ✅ Validación de fechas (hoy + 60 días máximo)
- ✅ Detección automática de ubicación (geolocalización con API ipapi.co)
- ✅ Máximo 5 pasajeros por reserva
- ✅ Filtros por origen, destino y fechas
- ✅ Interfaz intuitiva con inputs sugerentes

### 💺 Selección Interactiva de Asientos
- ✅ Mapa visual de asientos por aeronave
- ✅ Control de concurrencia con optimistic locking
- ✅ Estados en tiempo real: disponible, reservado, emitido
- ✅ Diferenciación visual por tipos de asiento
- ✅ Bloqueo temporal durante la reserva (5 minutos)
- ✅ Liberación automática de asientos expirados

### 👥 Gestión de Pasajeros
- ✅ Registro de hasta 5 pasajeros por reserva
- ✅ Validación automática de edad para infantes (< 3 años)
- ✅ Auto-fill de datos cuando el usuario tiene sesión iniciada
- ✅ Validación completa: nombres, documentos, contacto
- ✅ Asignación automática de asientos
- ✅ Tipos de documento: CC, TI, Pasaporte, CE

### 💳 Simulación de Pagos
- ✅ 3 métodos: Tarjeta Crédito, Débito, PSE
- ✅ Simulación realista: 80% aprobado, 20% rechazado
- ✅ Generación de referencia única por transacción
- ✅ Confirmación instantánea con feedback visual
- ✅ Cálculo automático de impuestos (19% IVA)
- ✅ Estados: aprobado, rechazado, pendiente

### 🎫 Generación de Tiquetes y Recibos
- ✅ PDFs profesionales con diseño moderno
- ✅ Código QR único por tiquete
- ✅ Descarga directa desde navegador
- ✅ Recibos de pago con detalles completos
- ✅ Formato alternativo JSON disponible
- ✅ Diseño inspirado en tiquetes aéreos reales
- ✅ Portada con logo de la aerolínea
- ✅ Información completa del vuelo y pasajeros

### 👤 Perfil de Usuario
- ✅ Autenticación con Laravel Breeze
- ✅ Historial completo de reservas
- ✅ Estadísticas personalizadas (total reservas, confirmadas, gastado)
- ✅ Descarga de tiquetes desde el perfil
- ✅ Información de cuenta editable
- ✅ Avatar con iniciales del usuario

### 🏠 Landing Page Atractiva
- ✅ Hero con video de fondo (YouTube embed muted)
- ✅ Destinos populares con selección directa
- ✅ Secciones de características y beneficios
- ✅ Testimonios de clientes
- ✅ Call-to-action claros
- ✅ Diseño responsive y moderno
- ✅ Integración con búsqueda de vuelos

### ⏰ Sistema Automático de Limpieza
- ✅ Job automático cada minuto (Laravel Scheduler)
- ✅ Liberación de asientos expirados (timeout 5 minutos)
- ✅ Limpieza de reservas pendientes
- ✅ Background jobs con Laravel Queue
- ✅ Logs de ejecución

### 🔍 Búsqueda de Reservas
- ✅ Consulta por código único
- ✅ Visualización de detalles completos
- ✅ Descarga de tiquetes sin registro
- ✅ Información de vuelos y pasajeros
- ✅ Estado de la reserva en tiempo real

---

## 📊 Base de Datos

### Tablas Principales

```
users                    - Usuarios del sistema (autenticación)
├── ciudades             - 15 ciudades colombianas con códigos IATA
├── modelos_aeronave     - 4 modelos de aeronaves (capacidad, configuración)
├── aeronaves            - 8 aeronaves en la flota (matrícula, modelo)
├── vuelos               - 976 vuelos programados (próximos 60 días)
├── asientos             - 125,734 asientos disponibles (generados automáticamente)
├── pagadores            - Datos de los compradores (contacto, documentos)
├── reservas             - Reservas generadas (código único, estado, total)
│   ├── reservas_vuelos  - Relación N:M reserva-vuelo
│   ├── pasajeros        - Pasajeros por reserva (máx. 5)
│   │   └── pasajeros_asientos - Asignación de asientos a pasajeros
│   ├── pagos            - Transacciones de pago (método, referencia, estado)
│   └── tiquetes         - Tiquetes emitidos (código, QR)
├── cache                - Caché del sistema (optimización)
├── cache_locks          - Locks para control de concurrencia
├── sessions             - Sesiones activas de usuarios
└── password_reset_tokens - Tokens de recuperación de contraseña
```

### Diagrama ER Simplificado

```
┌──────────┐      ┌──────────┐      ┌─────────────┐
│ciudades  │◄─────┤ vuelos   ├─────►│ aeronaves   │
└──────────┘      └────┬─────┘      └──────┬──────┘
                       │                   │
                       │            ┌──────▼────────┐
                       │            │modelos_aeronave│
                       │            └────────────────┘
                  ┌────▼─────┐
                  │ asientos │
                  └────┬─────┘
                       │
           ┌───────────▼───────────┐
           │ pasajeros_asientos    │
           └───────────┬───────────┘
                       │
           ┌───────────▼────────┐       ┌──────────┐
           │    pasajeros       ├──────►│ reservas │
           └────────────────────┘       └────┬─────┘
                                             │
                              ┌──────────────┼──────────────┐
                              │              │              │
                         ┌────▼───┐    ┌────▼────┐   ┌────▼─────┐
                         │ pagos  │    │pagadores│   │ tiquetes │
                         └────────┘    └─────────┘   └──────────┘
```

### Relaciones Clave

| Tabla Origen | Relación | Tabla Destino | Tipo |
|-------------|----------|---------------|------|
| **vuelos** | pertenece a | ciudades (origen) | N:1 |
| **vuelos** | pertenece a | ciudades (destino) | N:1 |
| **vuelos** | pertenece a | aeronaves | N:1 |
| **aeronaves** | pertenece a | modelos_aeronave | N:1 |
| **asientos** | pertenece a | vuelos | N:1 |
| **reservas** | tiene muchos | vuelos (via reservas_vuelos) | N:M |
| **reservas** | tiene muchos | pasajeros | 1:N |
| **reservas** | pertenece a | pagadores | N:1 |
| **reservas** | tiene uno | pagos | 1:1 |
| **reservas** | tiene muchos | tiquetes | 1:N |
| **pasajeros** | tiene muchos | asientos (via pasajeros_asientos) | N:M |

### Datos de Prueba (Seeders)

Después de ejecutar `php artisan migrate:fresh --seed`:

| Tabla | Registros | Descripción |
|-------|-----------|-------------|
| **ciudades** | 15 | Bogotá, Medellín, Cali, Barranquilla, Cartagena, Santa Marta, Pereira, etc. |
| **modelos_aeronave** | 4 | Airbus A320 (180), Boeing 737-800 (189), Embraer E190 (100), ATR 72-600 (70) |
| **aeronaves** | 8 | Matrícula HK-XXXX, asignadas a modelos |
| **vuelos** | 976 | Vuelos programados para los próximos 60 días con horarios variados |
| **asientos** | 125,734 | Asientos generados automáticamente por cada vuelo según modelo |

### Índices y Optimizaciones

- ✅ Índices en columnas de búsqueda frecuente (`codigo_iata`, `codigo_unico`)
- ✅ Índices compuestos para búsquedas de vuelos (`ciudad_origen_id`, `ciudad_destino_id`, `fecha_salida`)
- ✅ Foreign keys con `onDelete('cascade')` para integridad referencial
- ✅ Timestamps automáticos en todas las tablas
- ✅ Soft deletes en tablas críticas (opcional)

---

## 📁 Estructura del Proyecto

```
sena_soft_2025/
├── app/
│   ├── Console/
│   │   └── Kernel.php                 # Scheduler y comandos de consola
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── BookingController.php  # Gestión de reservas
│   │   │   ├── FlightController.php   # Búsqueda de vuelos
│   │   │   ├── PaymentController.php  # Procesamiento de pagos
│   │   │   ├── ReceiptController.php  # Generación de recibos PDF
│   │   │   ├── TicketController.php   # Generación de tiquetes PDF
│   │   │   ├── ProfileController.php  # Perfil de usuario con historial
│   │   │   └── Auth/                  # Controllers de autenticación
│   │   │       ├── AuthenticatedSessionController.php
│   │   │       ├── RegisteredUserController.php
│   │   │       └── PasswordResetLinkController.php
│   │   ├── Middleware/
│   │   │   ├── HandleInertiaRequests.php
│   │   │   └── ...
│   │   └── Requests/                  # Form requests (validación)
│   ├── Jobs/
│   │   └── ReleaseExpiredSeatsJob.php # Job de liberación automática
│   ├── Models/
│   │   ├── Aeronave.php
│   │   ├── Asiento.php
│   │   ├── Ciudad.php
│   │   ├── ModeloAeronave.php
│   │   ├── Pagador.php
│   │   ├── Pago.php
│   │   ├── Pasajero.php
│   │   ├── Reserva.php
│   │   ├── Tiquete.php
│   │   ├── User.php
│   │   └── Vuelo.php
│   ├── Providers/
│   │   └── AppServiceProvider.php
│   └── Services/
│       ├── BookingService.php         # Lógica de reservas
│       ├── FlightService.php          # Lógica de vuelos
│       ├── PaymentService.php         # Lógica de pagos y simulación
│       ├── ReceiptService.php         # Generación de recibos
│       ├── SeatService.php            # Gestión de asientos y concurrencia
│       └── TicketService.php          # Generación de tiquetes
│
├── bootstrap/
│   ├── app.php                        # Bootstrap de la aplicación
│   ├── providers.php
│   └── cache/
│
├── config/
│   ├── app.php                        # Configuración general
│   ├── auth.php                       # Configuración de autenticación
│   ├── database.php                   # Configuración de DB
│   ├── queue.php                      # Configuración de colas
│   ├── session.php                    # Configuración de sesiones
│   └── ...
│
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 2025_10_22_000001_create_ciudades_table.php
│   │   ├── 2025_10_22_000002_create_modelos_aeronave_table.php
│   │   ├── 2025_10_22_000003_create_aeronaves_table.php
│   │   ├── 2025_10_22_000004_create_vuelos_table.php
│   │   ├── 2025_10_22_000005_create_pagadores_table.php
│   │   ├── 2025_10_22_000006_create_reservas_table.php
│   │   ├── 2025_10_22_000007_create_asientos_table.php
│   │   ├── 2025_10_22_000008_create_reservas_vuelos_table.php
│   │   ├── 2025_10_22_000009_create_pasajeros_table.php
│   │   ├── 2025_10_22_000010_create_pasajeros_asientos_table.php
│   │   ├── 2025_10_22_000011_create_pagos_table.php
│   │   └── 2025_10_22_000012_create_tiquetes_table.php
│   ├── seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── CiudadSeeder.php
│   │   ├── ModeloAeronaveSeeder.php
│   │   ├── AeronaveSeeder.php
│   │   ├── VueloSeeder.php
│   │   └── AsientoSeeder.php
│   └── factories/
│       └── UserFactory.php
│
├── public/
│   ├── index.php                      # Entry point de la aplicación
│   ├── robots.txt
│   ├── build/                         # Assets compilados por Vite
│   │   ├── manifest.json
│   │   └── assets/
│   └── image/
│       ├── icono_azul.png             # Logo de AirGuider
│       └── logo.png
│
├── resources/
│   ├── css/
│   │   └── app.css                    # Estilos globales + Tailwind
│   ├── js/
│   │   ├── app.jsx                    # Entry point de React
│   │   ├── Components/                # Componentes reutilizables
│   │   │   ├── ApplicationLogo.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   ├── DangerButton.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── InputError.jsx
│   │   │   ├── InputLabel.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── NavLink.jsx
│   │   │   ├── PrimaryButton.jsx
│   │   │   ├── ResponsiveNavLink.jsx
│   │   │   ├── SecondaryButton.jsx
│   │   │   └── TextInput.jsx
│   │   ├── Layouts/
│   │   │   ├── AuthenticatedLayout.jsx
│   │   │   ├── GuestLayout.jsx
│   │   │   └── MainLayout.jsx         # Layout principal con header/footer
│   │   └── Pages/
│   │       ├── Home.jsx                # Landing page con hero y destinos
│   │       ├── Welcome.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Auth/                   # Páginas de autenticación
│   │       │   ├── Login.jsx
│   │       │   ├── Register.jsx
│   │       │   ├── ForgotPassword.jsx
│   │       │   ├── ResetPassword.jsx
│   │       │   └── VerifyEmail.jsx
│   │       ├── Profile/
│   │       │   └── Edit.jsx            # Perfil con historial de reservas
│   │       ├── Flights/
│   │       │   ├── Search.jsx          # Búsqueda de vuelos
│   │       │   └── Results.jsx         # Resultados de búsqueda
│   │       ├── Booking/
│   │       │   ├── Seats.jsx           # Selección de asientos
│   │       │   ├── Passengers.jsx      # Datos de pasajeros
│   │       │   ├── Payment.jsx         # Simulación de pago
│   │       │   ├── Confirmation.jsx    # Confirmación de reserva
│   │       │   └── ThankYou.jsx        # Página de agradecimiento
│   │       └── Reservations/
│   │           └── Search.jsx          # Búsqueda de reservas por código
│   └── views/
│       ├── app.blade.php               # Template base de Inertia
│       ├── tickets/
│       │   ├── combined-pdf.blade.php  # PDF de tiquetes (mejorado)
│       │   └── pdf.blade.php
│       └── receipts/
│           └── pdf.blade.php           # PDF de recibos
│
├── routes/
│   ├── web.php                         # Rutas principales de la app
│   ├── auth.php                        # Rutas de autenticación (Breeze)
│   └── console.php                     # Comandos y scheduler
│
├── storage/
│   ├── app/                            # Archivos de aplicación
│   ├── framework/
│   │   ├── cache/
│   │   ├── sessions/
│   │   └── views/
│   └── logs/
│       └── laravel.log                 # Logs de la aplicación
│
├── tests/
│   ├── Feature/                        # Tests de integración
│   └── Unit/                           # Tests unitarios
│
├── doc/                                # Documentación del proyecto
│   ├── analisis.md                     # Análisis de requerimientos
│   ├── ISSUES_V2.md
│   ├── GIT_COMMITS_BY_ISSUE.md
│   ├── Db/
│   │   └── diseño_bd.md                # Diseño de base de datos
│   └── Diagramas/
│       ├── arquitectura_diagrama.md
│       └── diagrama_flujo.md
│
├── .env.example                        # Ejemplo de variables de entorno
├── .gitignore
├── artisan                             # CLI de Laravel
├── composer.json                       # Dependencias PHP
├── composer.lock
├── package.json                        # Dependencias Node.js
├── package-lock.json
├── phpunit.xml                         # Configuración de PHPUnit
├── postcss.config.js                   # Configuración de PostCSS
├── tailwind.config.js                  # Configuración de Tailwind CSS
├── vite.config.js                      # Configuración de Vite
├── jsconfig.json                       # Configuración de JavaScript
├── README.md                           # Este archivo
├── DEPLOYMENT_GUIDE.md
├── INSTALLATION.md
├── PROJECT_SUMMARY.md
└── ADMIN_ACCESS.md
```

---

## 🏗️ Arquitectura del Sistema

### Patrón Arquitectónico: MVC + Service Layer

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Inertia)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │ Layouts  │  │  Hooks   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       └─────────────┴─────────────┴─────────────┘          │
│                         │                                   │
│                    Inertia.js                              │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTP (Props/Responses)
┌─────────────────────────┼───────────────────────────────────┐
│                    BACKEND (Laravel)                        │
│  ┌───────────────────────────────────────────────────┐     │
│  │              CONTROLLERS (HTTP Layer)             │     │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐  │     │
│  │  │ Flight │ │Booking │ │Payment │ │ Ticket   │  │     │
│  │  └───┬────┘ └───┬────┘ └───┬────┘ └────┬─────┘  │     │
│  └──────┼──────────┼──────────┼───────────┼─────────┘     │
│         │          │          │           │                │
│  ┌──────┼──────────┼──────────┼───────────┼─────────┐     │
│  │           SERVICES (Business Logic)              │     │
│  │  ┌──┴───────┐ ┌─┴────────┐ ┌─┴───────┐ ┌───┴────┐│     │
│  │  │FlightSvc │ │BookingSvc│ │PaymentSvc│ │TicketSvc││     │
│  │  └──┬───────┘ └─┬────────┘ └─┬───────┘ └───┬────┘│     │
│  └─────┼───────────┼────────────┼─────────────┼─────┘     │
│        │           │            │             │            │
│  ┌─────┼───────────┼────────────┼─────────────┼─────┐     │
│  │           MODELS (Eloquent ORM & Data)           │     │
│  │  Vuelo, Asiento, Reserva, Pasajero, Pago, etc.  │     │
│  └─────┬───────────┬────────────┬─────────────┬─────┘     │
└────────┼───────────┼────────────┼─────────────┼───────────┘
         │           │            │             │
┌────────┼───────────┼────────────┼─────────────┼───────────┐
│                    DATABASE (MySQL)                        │
│    vuelos, asientos, reservas, pasajeros, pagos, etc.     │
└────────────────────────────────────────────────────────────┘
```

### Flujo de una Reserva Completa

```
1. Búsqueda → 2. Selección → 3. Pasajeros → 4. Pago → 5. Confirmación
     │             │              │             │           │
  Search.jsx → Results.jsx → Passengers.jsx → Payment.jsx → ThankYou.jsx
     │             │              │             │           │
FlightSvc → SeatSvc/BookingSvc → BookingSvc → PaymentSvc → TicketSvc
     │             │              │             │           │
   Vuelo    → Asiento/Reserva → Pasajero  →   Pago    →  Tiquete
```

### Control de Concurrencia

```
Usuario A                    Usuario B
    │                            │
    ├─ Ver asiento 12A          │
    │  (disponible)              │
    │                            ├─ Ver asiento 12A
    │                            │  (disponible)
    ├─ Reservar 12A             │
    │  [LOCK 12A]               │
    │  ✅ Éxito                  │
    │                            ├─ Reservar 12A
    │                            │  [INTENTA LOCK]
    │                            │  ❌ Asiento no disponible
    │                            │  (Optimistic Locking)
    ├─ Pagar                    │
    │  [EMITE TIQUETE]          │
    │                            ├─ Seleccionar otro asiento
```

**Estrategia:** Optimistic Locking con timestamps y estados

---

## ⚙️ Instalación

### Requisitos Previos

Asegúrate de tener instalado:

- ✅ **PHP 8.2+** ([Descargar](https://www.php.net/downloads))
- ✅ **Composer 2.x+** ([Descargar](https://getcomposer.org/download/))
- ✅ **Node.js 18+ y npm** ([Descargar](https://nodejs.org/))
- ✅ **MySQL 8.0+** ([Descargar](https://www.mysql.com/downloads/))
- ✅ **Git** ([Descargar](https://git-scm.com/downloads))

### Pasos de Instalación

#### 1. Clonar el repositorio

```bash
git clone https://github.com/cristoferscalante/sena_soft_2025.git
cd sena_soft_2025
```

#### 2. Instalar dependencias de PHP

```bash
composer install
```

#### 3. Instalar dependencias de Node.js

```bash
npm install
```

#### 4. Configurar el archivo .env

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

Luego generar la key de la aplicación:

```bash
php artisan key:generate
```

#### 5. Configurar la base de datos

Edita el archivo `.env` y configura tu conexión MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=airguider
DB_USERNAME=root
DB_PASSWORD=tu_password
```

Crea la base de datos:

```sql
CREATE DATABASE airguider CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 6. Ejecutar migraciones y seeders

```bash
php artisan migrate:fresh --seed
```

Esto creará todas las tablas y poblará la base de datos con:
- 15 ciudades colombianas
- 4 modelos de aeronaves
- 8 aeronaves
- 976 vuelos (próximos 60 días)
- 125,734 asientos

#### 7. Compilar assets del frontend

Para desarrollo:

```bash
npm run dev
```

Para producción:

```bash
npm run build
```

#### 8. Iniciar el servidor de desarrollo

```bash
php artisan serve
```

La aplicación estará disponible en: **[http://localhost:8000](http://localhost:8000)**

#### 9. Configurar el Scheduler (Opcional)

Para la liberación automática de asientos expirados:

**Linux/Mac (Crontab):**

```bash
* * * * * cd /ruta-al-proyecto && php artisan schedule:run >> /dev/null 2>&1
```

**Windows (Task Scheduler):**

```powershell
# Ejecutar manualmente cada minuto o configurar tarea programada:
php artisan bookings:release-expired
```

### Verificación de la Instalación

Visita las siguientes URLs para verificar:

- **Home:** [http://localhost:8000](http://localhost:8000)
- **Buscar Vuelos:** [http://localhost:8000/vuelos/buscar](http://localhost:8000/vuelos/buscar)
- **Login:** [http://localhost:8000/login](http://localhost:8000/login)
- **Registro:** [http://localhost:8000/register](http://localhost:8000/register)

---

## 📖 Guía de Uso

### 1. Búsqueda de Vuelos

1. Accede a la **Home** o **Buscar Vuelos**
2. Selecciona el tipo de viaje (solo ida o ida y vuelta)
3. Ingresa la ciudad de origen (autocompleta)
4. Ingresa la ciudad de destino (autocompleta)
5. Selecciona la fecha de salida (y regreso si aplica)
6. Indica el número de pasajeros (máx. 5)
7. Haz clic en **"Buscar Vuelos"**

### 2. Selección de Vuelo y Asientos

1. Revisa los vuelos disponibles en los resultados
2. Haz clic en **"Seleccionar Vuelo"**
3. Visualiza el mapa de asientos
4. Selecciona los asientos deseados (según el número de pasajeros)
5. Haz clic en **"Continuar con la Reserva"**

### 3. Registro de Pasajeros

1. Completa los datos del **Pagador** (persona que paga)
2. Completa los datos de cada **Pasajero**:
   - Nombres y apellidos
   - Tipo y número de documento
   - Fecha de nacimiento
   - Género
   - Contacto (celular, correo)
3. Marca la casilla de **Términos y Condiciones**
4. Haz clic en **"Continuar al Pago"**

### 4. Simulación de Pago

1. Selecciona el método de pago:
   - Tarjeta de Crédito
   - Tarjeta de Débito
   - PSE
2. Completa los datos de pago simulados
3. Haz clic en **"Procesar Pago"**
4. Espera la respuesta (80% aprobado, 20% rechazado)

### 5. Confirmación y Descarga

1. Si el pago es aprobado:
   - Visualiza el resumen de la reserva
   - Descarga los **Tiquetes** (PDF)
   - Descarga el **Recibo** de pago (PDF)
   - Anota el **código de reserva** único

2. Si el pago es rechazado:
   - Reintenta con otro método
   - O selecciona otros asientos

### 6. Consultar Reserva

1. Accede a **"Buscar Reserva"** en el menú
2. Ingresa el código único de reserva
3. Visualiza los detalles completos
4. Descarga nuevamente los tiquetes si es necesario

### 7. Perfil de Usuario (Opcional)

1. **Regístrate** o **Inicia Sesión**
2. Accede a **"Mi Perfil"** en el menú de usuario
3. Visualiza tu historial de reservas
4. Revisa estadísticas personalizadas
5. Descarga tiquetes de reservas anteriores

---

## 🎨 Paleta de Colores

| Color | Hex | RGB | Uso |
|-------|-----|-----|-----|
| **Primario Oscuro** | `#1e40af` | `rgb(30, 64, 175)` | Headers, gradientes |
| **Primario** | `#2563eb` | `rgb(37, 99, 235)` | Botones principales, enlaces |
| **Primario Claro** | `#3b82f6` | `rgb(59, 130, 246)` | Hover states |
| **Gris Oscuro** | `#1f2937` | `rgb(31, 41, 55)` | Textos principales |
| **Gris Medio** | `#6b7280` | `rgb(107, 114, 128)` | Textos secundarios, labels |
| **Gris Claro** | `#9ca3af` | `rgb(156, 163, 175)` | Textos deshabilitados |
| **Fondo Gris** | `#f9fafb` | `rgb(249, 250, 251)` | Fondos de secciones |
| **Blanco** | `#ffffff` | `rgb(255, 255, 255)` | Fondos principales |
| **Verde Éxito** | `#10b981` | `rgb(16, 185, 129)` | Confirmaciones, éxito |
| **Rojo Error** | `#ef4444` | `rgb(239, 68, 68)` | Errores, advertencias |
| **Amarillo** | `#f59e0b` | `rgb(245, 158, 11)` | Warnings, highlights |

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
php artisan test

# Tests con cobertura
php artisan test --coverage

# Test de un archivo específico
php artisan test --filter=BookingTest

# Tests unitarios
php artisan test tests/Unit

# Tests de integración
php artisan test tests/Feature
```

### Escribir Tests

```php
// tests/Feature/BookingTest.php
public function test_user_can_create_booking()
{
    $response = $this->post('/reservas', [
        'vuelo_id' => 1,
        'asientos' => [1, 2],
        'pasajeros' => [/* ... */],
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('reservas', [
        'vuelo_id' => 1,
    ]);
}
```

---

## 🚀 Despliegue

### Despliegue en Producción

El proyecto está desplegado en: **[https://airguide.clubgestion.com/](https://airguide.clubgestion.com/)**

#### Pasos Generales para Despliegue

1. **Configurar variables de entorno de producción**

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://airguide.clubgestion.com

DB_CONNECTION=mysql
DB_HOST=tu_host_mysql
DB_PORT=3306
DB_DATABASE=airguider_prod
DB_USERNAME=usuario_prod
DB_PASSWORD=password_seguro
```

2. **Optimizar para producción**

```bash
# Instalar dependencias de producción
composer install --optimize-autoloader --no-dev

# Compilar assets
npm run build

# Cachear configuraciones
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

3. **Configurar permisos**

```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

4. **Configurar Cron Job para Scheduler**

```bash
* * * * * cd /ruta-al-proyecto && php artisan schedule:run >> /dev/null 2>&1
```

5. **Configurar servidor web (Nginx)**

```nginx
server {
    listen 80;
    server_name airguide.clubgestion.com;
    root /var/www/airguider/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## 🤝 Contribución

### GitFlow Workflow

Este proyecto sigue la metodología **GitFlow**:

- **`main`** - Producción estable
- **`develop`** - Desarrollo activo
- **`feature/*`** - Nuevas características
- **`hotfix/*`** - Correcciones urgentes

### Cómo Contribuir

1. **Fork del repositorio**
2. **Crear rama feature:**
   ```bash
   git checkout develop
   git checkout -b feature/nueva-caracteristica
   ```
3. **Hacer commits descriptivos:**
   ```bash
   git commit -m "feat: agregar búsqueda avanzada de vuelos"
   ```
4. **Push a tu fork:**
   ```bash
   git push origin feature/nueva-caracteristica
   ```
5. **Crear Pull Request** a `develop`

### Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (sin afectar lógica)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

**Laravel Framework:** Open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

## 👥 Equipo

Desarrollado por el equipo de **SENASOFT 2025**

- **GitHub:** [cristoferscalante](https://github.com/cristoferscalante)
- **Repositorio:** [sena_soft_2025](https://github.com/cristoferscalante/sena_soft_2025)

---

## 📞 Soporte

¿Tienes preguntas o problemas?

- 📧 **Email:** soporte@airguider.com
- 🌐 **Web:** [https://airguide.clubgestion.com/](https://airguide.clubgestion.com/)
- 📚 **Documentación:** Ver carpeta `doc/`
- 🐛 **Issues:** [GitHub Issues](https://github.com/cristoferscalante/sena_soft_2025/issues)

---

## 🙏 Agradecimientos

- **Laravel** - Framework PHP moderno y elegante
- **React** - Librería UI declarativa
- **Inertia.js** - Puente perfecto entre Laravel y React
- **TailwindCSS** - Framework CSS utility-first
- **SENASOFT** - Por la oportunidad de participar en este reto

---

<div align="center">

**⭐ Si te gusta este proyecto, considera darle una estrella en GitHub ⭐**

[⬆ Volver arriba](#️-airguider---sistema-de-compra-de-tiquetes-aéreos)

</div>
