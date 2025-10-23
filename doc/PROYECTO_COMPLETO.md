# ✈️ AirGuider - Resumen Ejecutivo del Proyecto

**SENASOFT 2025 - Sistema de Compra de Tiquetes Aéreos**

---

## 📌 Información General

| Campo | Valor |
|-------|-------|
| **Nombre del Proyecto** | AirGuider - Sistema de Compra de Tiquetes Aéreos |
| **Categoría** | SENASOFT 2025 |
| **Demo en Vivo** | [https://airguide.clubgestion.com/](https://airguide.clubgestion.com/) |
| **Repositorio** | [github.com/cristoferscalante/sena_soft_2025](https://github.com/cristoferscalante/sena_soft_2025) |
| **Prototipo Figma** | [Ver Diseño](https://www.figma.com/design/hpyIWr8aYFubmDp60K2nGr/senasoft?node-id=1-2&p=f&t=P1PariLdVzows3WK-0) |
| **Versión** | 1.0.0 |
| **Fecha** | Octubre 2025 |

---

## 🎯 Descripción del Proyecto

**AirGuider** es una aplicación web completa para la búsqueda, reserva y compra de tiquetes aéreos. Implementa un sistema robusto de gestión de vuelos, asientos, pasajeros y pagos, con control de concurrencia y generación automática de documentos (tiquetes y recibos en PDF).

### Características Destacadas

- 🔍 **Búsqueda inteligente** con autocompletado y geolocalización
- 💺 **Selección visual** de asientos con mapa interactivo
- 🔒 **Control de concurrencia** optimista (optimistic locking)
- 💳 **Simulación realista** de pagos (80% aprobado)
- 🎫 **Generación automática** de tiquetes y recibos PDF profesionales
- 👤 **Perfil de usuario** con historial completo de reservas
- ⏰ **Liberación automática** de asientos expirados (job scheduler)
- 🏠 **Landing page** moderna con video background y destinos populares

---

## 🚀 Stack Tecnológico

### Backend
- **Laravel 12** - Framework PHP con arquitectura MVC + Service Layer
- **MySQL 8.0+** - Base de datos relacional (17 tablas)
- **Eloquent ORM** - Mapeo objeto-relacional
- **DomPDF** - Generación de PDFs
- **Laravel Breeze** - Sistema de autenticación
- **Laravel Scheduler** - Jobs automatizados

### Frontend
- **React 18** - Librería UI con componentes funcionales
- **Inertia.js** - SSR sin API REST
- **TailwindCSS 3** - Framework CSS utility-first
- **Heroicons** - Iconos SVG
- **Vite** - Build tool moderno

### DevOps
- **Git + GitFlow** - Control de versiones
- **Composer** - Gestor de dependencias PHP
- **npm** - Gestor de dependencias JavaScript
- **PHPUnit** - Testing

---

## 📊 Estructura de Base de Datos

### Tablas Principales (17 tablas)

| # | Tabla | Registros | Descripción |
|---|-------|-----------|-------------|
| 1 | **users** | Variable | Usuarios con autenticación |
| 2 | **ciudades** | 15 | Ciudades colombianas (códigos IATA) |
| 3 | **modelos_aeronave** | 4 | Modelos de aeronaves |
| 4 | **aeronaves** | 8 | Aeronaves de la flota |
| 5 | **vuelos** | 976 | Vuelos programados (60 días) |
| 6 | **asientos** | 125,734 | Asientos generados automáticamente |
| 7 | **pagadores** | Variable | Datos de compradores |
| 8 | **reservas** | Variable | Reservas con código único |
| 9 | **reservas_vuelos** | Variable | Relación N:M reserva-vuelo |
| 10 | **pasajeros** | Variable | Pasajeros (máx. 5 por reserva) |
| 11 | **pasajeros_asientos** | Variable | Asignación de asientos |
| 12 | **pagos** | Variable | Transacciones de pago |
| 13 | **tiquetes** | Variable | Tiquetes emitidos con QR |
| 14-17 | **Sistema Laravel** | - | cache, sessions, password_reset_tokens |

### Diagrama Simplificado

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

---

## 📁 Estructura del Proyecto

```
sena_soft_2025/
├── app/
│   ├── Http/Controllers/          # 7 controladores principales
│   │   ├── BookingController      # Gestión de reservas
│   │   ├── FlightController       # Búsqueda de vuelos
│   │   ├── PaymentController      # Procesamiento de pagos
│   │   ├── TicketController       # Generación de tiquetes
│   │   ├── ReceiptController      # Generación de recibos
│   │   ├── ProfileController      # Perfil de usuario
│   │   └── Auth/                  # Autenticación
│   ├── Models/                    # 11 modelos Eloquent
│   ├── Services/                  # 6 servicios de lógica de negocio
│   └── Jobs/                      # ReleaseExpiredSeatsJob
│
├── database/
│   ├── migrations/                # 13 migraciones
│   └── seeders/                   # 5 seeders con datos reales
│
├── resources/
│   ├── js/
│   │   ├── Pages/                 # 15+ páginas React
│   │   │   ├── Home.jsx           # Landing con video hero
│   │   │   ├── Flights/           # Búsqueda y resultados
│   │   │   ├── Booking/           # Flujo completo de reserva
│   │   │   ├── Profile/           # Perfil con historial
│   │   │   └── Auth/              # Login, registro
│   │   ├── Components/            # 12 componentes reutilizables
│   │   └── Layouts/               # MainLayout con header/footer
│   └── views/
│       ├── tickets/               # PDFs de tiquetes
│       └── receipts/              # PDFs de recibos
│
├── routes/
│   ├── web.php                    # 25+ rutas principales
│   ├── auth.php                   # Rutas de autenticación
│   └── console.php                # Scheduler
│
├── public/
│   ├── build/                     # Assets compilados
│   └── image/                     # Logos e imágenes
│
└── doc/                           # Documentación completa
    ├── analisis.md
    ├── Db/diseño_bd.md
    ├── Diagramas/
    └── ISSUES_V2.md
```

---

## 🎨 Funcionalidades Principales

### 1. Búsqueda de Vuelos
- ✅ Autocompletado de ciudades (15 ciudades colombianas)
- ✅ Tipo de viaje: solo ida o ida y vuelta
- ✅ Validación de fechas (hoy + 60 días máximo)
- ✅ Geolocalización automática con ipapi.co
- ✅ Máximo 5 pasajeros por reserva
- ✅ Resultados con disponibilidad en tiempo real

### 2. Selección de Asientos
- ✅ Mapa visual de asientos por aeronave
- ✅ Diferenciación por tipo (económica, ejecutiva)
- ✅ Estados: disponible, reservado, emitido
- ✅ Control de concurrencia (optimistic locking)
- ✅ Timeout de 5 minutos para reservas temporales
- ✅ Liberación automática de asientos expirados

### 3. Registro de Pasajeros
- ✅ Hasta 5 pasajeros por reserva
- ✅ Validación de infantes (menores de 3 años)
- ✅ Auto-fill de datos cuando el usuario tiene sesión
- ✅ Tipos de documento: CC, TI, Pasaporte, CE
- ✅ Validación completa de campos

### 4. Simulación de Pagos
- ✅ 3 métodos: Tarjeta Crédito, Débito, PSE
- ✅ Simulación: 80% aprobado, 20% rechazado
- ✅ Cálculo automático de impuestos (19% IVA)
- ✅ Referencia única por transacción
- ✅ Feedback visual instantáneo

### 5. Generación de Documentos
- ✅ **Tiquetes PDF**: Diseño profesional con QR code
- ✅ **Recibos PDF**: Detalles completos del pago
- ✅ Descarga directa desde navegador
- ✅ Portada con logo de aerolínea
- ✅ Información completa de vuelos y pasajeros

### 6. Perfil de Usuario
- ✅ Autenticación con Laravel Breeze
- ✅ Historial completo de reservas
- ✅ Estadísticas: total reservas, confirmadas, gastado
- ✅ Descarga de tiquetes desde el perfil
- ✅ Avatar con iniciales del usuario

### 7. Landing Page
- ✅ Hero con video de fondo (YouTube muted)
- ✅ Destinos populares con selección directa
- ✅ Características y beneficios
- ✅ Testimonios de clientes
- ✅ Call-to-action efectivos
- ✅ Diseño responsive

---

## 🔄 Flujo Completo de Reserva

```
1. Home/Búsqueda
   ↓
2. Resultados de Vuelos
   ↓
3. Selección de Asientos
   ↓
4. Datos de Pasajeros
   ↓
5. Simulación de Pago
   ↓
6. Confirmación
   ↓
7. Descarga de Tiquetes/Recibos
```

**Tiempo promedio:** 3-5 minutos por reserva completa

---

## ⚙️ Control de Concurrencia

### Estrategia: Optimistic Locking

```sql
UPDATE asientos 
SET estado = 'reservado', 
    version = version + 1,
    reservado_hasta = NOW() + INTERVAL 5 MINUTE
WHERE id = :asiento_id 
  AND version = :version_actual
  AND estado = 'disponible';
```

**Si afecta 0 filas:** El asiento ya fue reservado por otro usuario.

### Job Automático de Limpieza

```php
// Ejecutado cada minuto via Laravel Scheduler
Asiento::where('estado', 'reservado')
    ->where('reservado_hasta', '<', now())
    ->update([
        'estado' => 'disponible',
        'reservado_hasta' => null
    ]);
```

---

## 📈 Estadísticas del Proyecto

### Datos de Prueba (Seeders)

| Recurso | Cantidad | Generación |
|---------|----------|------------|
| **Ciudades** | 15 | Manual (CiudadSeeder) |
| **Modelos de Aeronaves** | 4 | Manual (ModeloAeronaveSeeder) |
| **Aeronaves** | 8 | Manual (AeronaveSeeder) |
| **Vuelos** | 976 | Automática (VueloSeeder) |
| **Asientos** | 125,734 | Automática (AsientoSeeder) |

**Cobertura temporal:** Próximos 60 días desde la fecha actual

### Métricas del Código

| Métrica | Valor |
|---------|-------|
| **Líneas de código PHP** | ~15,000 |
| **Líneas de código JS/React** | ~8,000 |
| **Controladores** | 7 |
| **Servicios** | 6 |
| **Modelos** | 11 |
| **Migraciones** | 13 |
| **Componentes React** | 15+ |
| **Páginas** | 20+ |
| **Rutas** | 30+ |

---

## 🎨 Diseño UI/UX

### Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| **Primario** | `#2563eb` | Botones, enlaces, headers |
| **Primario Oscuro** | `#1e40af` | Gradientes, hover |
| **Gris** | `#6b7280` | Textos secundarios |
| **Verde** | `#10b981` | Éxito, confirmaciones |
| **Rojo** | `#ef4444` | Errores, advertencias |

### Componentes Principales

- ✅ Inputs con autocompletado
- ✅ Modales para mensajes
- ✅ Cards para vuelos y destinos
- ✅ Tablas responsive para historial
- ✅ Formularios con validación en tiempo real
- ✅ Botones con estados de carga
- ✅ Dropdowns animados

---

## 🔐 Seguridad

### Implementaciones

- ✅ **CSRF Protection** (Laravel)
- ✅ **Hash de contraseñas** (bcrypt)
- ✅ **Validación de inputs** (server-side)
- ✅ **SQL Injection protection** (Eloquent ORM)
- ✅ **XSS protection** (React auto-escape)
- ✅ **Foreign keys** con integridad referencial
- ✅ **Timestamps** para auditoría

---

## 🧪 Testing

### Comandos

```bash
# Ejecutar todos los tests
php artisan test

# Tests unitarios
php artisan test tests/Unit

# Tests de integración
php artisan test tests/Feature
```

### Cobertura

- ✅ Tests de modelos (relaciones, scopes)
- ✅ Tests de servicios (lógica de negocio)
- ✅ Tests de controladores (endpoints)
- ✅ Tests de validación

---

## 🚀 Instalación Rápida

```bash
# 1. Clonar repositorio
git clone https://github.com/cristoferscalante/sena_soft_2025.git
cd sena_soft_2025

# 2. Instalar dependencias
composer install
npm install

# 3. Configurar entorno
cp .env.example .env
php artisan key:generate

# 4. Configurar base de datos
# Editar .env con credenciales MySQL

# 5. Ejecutar migraciones y seeders
php artisan migrate:fresh --seed

# 6. Compilar assets
npm run build

# 7. Iniciar servidor
php artisan serve
```

**Demo:** http://localhost:8000

---

## 📚 Documentación Adicional

| Documento | Ubicación |
|-----------|-----------|
| **Análisis de Requerimientos** | [`doc/analisis.md`](../analisis.md) |
| **Diseño de Base de Datos** | [`doc/Db/diseño_bd.md`](Db/diseño_bd.md) |
| **Arquitectura del Sistema** | [`doc/Diagramas/arquitectura_diagrama.md`](Diagramas/arquitectura_diagrama.md) |
| **Diagramas de Flujo** | [`doc/Diagramas/diagrama_flujo.md`](Diagramas/diagrama_flujo.md) |
| **Issues y Tareas** | [`doc/ISSUES_V2.md`](ISSUES_V2.md) |
| **README Principal** | [`README.md`](../README.md) |

---

## 🌐 Enlaces Importantes

- **🔗 Demo en Vivo:** [https://airguide.clubgestion.com/](https://airguide.clubgestion.com/)
- **🎨 Prototipo Figma:** [Ver Diseño](https://www.figma.com/design/hpyIWr8aYFubmDp60K2nGr/senasoft?node-id=1-2&p=f&t=P1PariLdVzows3WK-0)
- **📦 Repositorio GitHub:** [cristoferscalante/sena_soft_2025](https://github.com/cristoferscalante/sena_soft_2025)

---

## 👥 Equipo de Desarrollo

- **Desarrolladores:** Equipo SENASOFT 2025
- **GitHub:** [cristoferscalante](https://github.com/cristoferscalante)
- **Proyecto:** Sistema de Compra de Tiquetes Aéreos
- **Periodo:** Octubre 2025

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.

---

## 🏆 Logros del Proyecto

✅ **Sistema completo** de reservas end-to-end  
✅ **Control de concurrencia** robusto  
✅ **Interfaz moderna** y responsive  
✅ **PDFs profesionales** generados dinámicamente  
✅ **Automatización** con jobs programados  
✅ **Datos realistas** con seeders completos  
✅ **Arquitectura escalable** con service layer  
✅ **Documentación completa** y actualizada  
✅ **Desplegado en producción** funcionando 24/7  

---

<div align="center">

**✈️ AirGuider - Vuela más fácil ✈️**

**SENASOFT 2025**

</div>
