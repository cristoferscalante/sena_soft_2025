# Comandos Git por Issue - Commits Independientes

Este documento contiene los comandos de Git para subir los archivos del proyecto en commits separados, organizados por cada issue identificado en `ISSUES_V2.md`.

---

## Issue 1 — Migraciones y modelado de base de datos (Backend)

**Archivos a incluir:**
- Migraciones de base de datos
- Modelos Eloquent

```bash
# Commit 1.1: Migraciones de tablas principales
git add database/migrations/2025_10_22_000001_create_ciudades_table.php
git add database/migrations/2025_10_22_000002_create_modelos_aeronave_table.php
git add database/migrations/2025_10_22_000003_create_aeronaves_table.php
git add database/migrations/2025_10_22_000004_create_vuelos_table.php
git commit -m "feat(db): agregar migraciones para tablas ciudades, modelos_aeronave, aeronaves y vuelos

- Crear tabla ciudades con códigos IATA e índices
- Crear tabla modelos_aeronave con configuración de capacidad
- Crear tabla aeronaves con llave foránea a modelos
- Crear tabla vuelos con ciudades origen/destino y precios

Issue #1"

# Commit 1.2: Migraciones de tablas de reservas y pagadores
git add database/migrations/2025_10_22_000005_create_pagadores_table.php
git add database/migrations/2025_10_22_000006_create_reservas_table.php
git commit -m "feat(db): agregar migraciones para tablas pagadores y reservas

- Crear tabla pagadores con validación de documentos
- Crear tabla reservas con código único y expiración
- Agregar índices para consultas eficientes
- Agregar enum de estado para ciclo de vida de reservas

Issue #1"

# Commit 1.3: Migraciones de asientos y relaciones
git add database/migrations/2025_10_22_000007_create_asientos_table.php
git add database/migrations/2025_10_22_000008_create_reservas_vuelos_table.php
git add database/migrations/2025_10_22_000009_create_pasajeros_table.php
git add database/migrations/2025_10_22_000010_create_pasajeros_asientos_table.php
git commit -m "feat(db): agregar migraciones para asientos, pasajeros y tablas pivote

- Crear tabla asientos con bloqueo optimista (campo version)
- Crear tabla pivote reservas_vuelos
- Crear tabla pasajeros con información completa del pasajero
- Crear tabla pivote pasajeros_asientos con restricciones únicas

Issue #1"

# Commit 1.4: Migraciones de pagos y tiquetes
git add database/migrations/2025_10_22_000011_create_pagos_table.php
git add database/migrations/2025_10_22_000012_create_tiquetes_table.php
git commit -m "feat(db): agregar migraciones para tablas pagos y tiquetes

- Crear tabla pagos con método de pago y estado
- Crear tabla tiquetes con códigos únicos y almacenamiento de archivos
- Agregar columnas JSON para almacenamiento flexible de datos

Issue #1"

# Commit 1.5: Modelos Eloquent
git add app/Models/Ciudad.php
git add app/Models/ModeloAeronave.php
git add app/Models/Aeronave.php
git add app/Models/Vuelo.php
git commit -m "feat(models): agregar modelos Eloquent para entidades principales del sistema de vuelos

- Agregar modelo Ciudad con scopes y relaciones
- Agregar modelo ModeloAeronave con cálculos de capacidad
- Agregar modelo Aeronave con enum de estado
- Agregar modelo Vuelo con scope de disponibilidad

Issue #1"

# Commit 1.6: Modelos de reservas y pagos
git add app/Models/Pagador.php
git add app/Models/Reserva.php
git add app/Models/Asiento.php
git add app/Models/Pasajero.php
git add app/Models/Pago.php
git add app/Models/Tiquete.php
git commit -m "feat(models): agregar modelos Eloquent para entidades de reservas y pagos

- Agregar modelo Reserva con lógica de expiración y codigo_unico
- Agregar modelo Pasajero con accessor de nombre completo
- Agregar modelo Asiento con version para bloqueo optimista
- Agregar modelos Pago y Tiquete con relaciones

Issue #1"

# Commit 1.7: Seeders
git add database/seeders/CiudadSeeder.php
git add database/seeders/ModeloAeronaveSeeder.php
git add database/seeders/AeronaveSeeder.php
git add database/seeders/VueloSeeder.php
git add database/seeders/AdminUserSeeder.php
git add database/seeders/DatabaseSeeder.php
git commit -m "feat(seeders): agregar seeders de base de datos para pruebas y desarrollo

- Agregar CiudadSeeder con ciudades colombianas
- Agregar ModeloAeronaveSeeder con configuraciones de aeronaves
- Agregar AeronaveSeeder con aeronaves de ejemplo
- Agregar VueloSeeder con vuelos programados
- Agregar AdminUserSeeder para acceso de administrador

Issue #1"
```

---

## Issue 2 — BookingService y lógica de reservas (Backend)

**Archivos a incluir:**
- BookingService
- BookingController
- Rutas relacionadas

```bash
# Commit 2.1: BookingService
git add app/Services/BookingService.php
git commit -m "feat(services): agregar BookingService con lógica completa de reservas

- Implementar crearReserva con manejo de transacciones
- Agregar validarDatosReserva con reglas de negocio (1-5 pasajeros, términos)
- Agregar métodos confirmarReserva y cancelarReserva
- Agregar liberarReservasExpiradas para limpieza automática
- Integrar con SeatService para reserva de asientos

Issue #2"

# Commit 2.2: BookingController
git add app/Http/Controllers/BookingController.php
git commit -m "feat(controllers): agregar BookingController para endpoints de reservas

- Agregar método store para crear reservas
- Agregar método show para obtener reserva por código
- Agregar método cancel para cancelar reservas
- Integrar con BookingService

Issue #2"

# Commit 2.3: Rutas de reservas
git add routes/web.php
git commit -m "feat(routes): agregar grupo de rutas de reservas

- Agregar POST /reservas para crear reservas
- Agregar GET /reservas/{codigo} para obtener reservas
- Agregar POST /reservas/{id}/cancelar para cancelaciones

Issue #2"
```

---

## Issue 3 — SeatService y control de concurrencia (Backend)

**Archivos a incluir:**
- SeatService
- SeatController

```bash
# Commit 3.1: SeatService
git add app/Services/SeatService.php
git commit -m "feat(services): agregar SeatService con bloqueo optimista para concurrencia

- Implementar reservarAsientos con bloqueo basado en versión
- Agregar lockForUpdate para prevenir condiciones de carrera
- Agregar métodos liberarAsientos y confirmarAsientos
- Agregar generarAsientosParaVuelo para generación automática de asientos
- Agregar obtenerMapaAsientos para visualización del mapa de asientos

Issue #3"

# Commit 3.2: SeatController
git add app/Http/Controllers/SeatController.php
git commit -m "feat(controllers): agregar SeatController para gestión de asientos

- Agregar método index para obtención del mapa de asientos
- Agregar método reserve para selección de asientos
- Integrar con SeatService para control de concurrencia

Issue #3"
```

---

## Issue 4 — FlightService y sistema de búsqueda (Backend)

**Archivos a incluir:**
- FlightService
- FlightController

```bash
# Commit 4.1: FlightService
git add app/Services/FlightService.php
git commit -m "feat(services): agregar FlightService con caché y lógica de búsqueda

- Implementar buscarVuelos con caché de 5 minutos
- Agregar validaciones para rango de fechas (hoy a +60 días)
- Agregar buscarCiudades con soporte de autocompletado
- Agregar obtenerDetallesVuelo con carga previa
- Agregar validarDisponibilidad para verificación de capacidad

Issue #4"

# Commit 4.2: FlightController
git add app/Http/Controllers/FlightController.php
git commit -m "feat(controllers): agregar FlightController para búsqueda de vuelos

- Agregar método index para formulario de búsqueda
- Agregar método search con filtros
- Agregar método show para detalles de vuelo
- Integrar con FlightService y caché

Issue #4"
```

---

## Issue 5 — PaymentService (simulación de pagos) (Backend)

**Archivos a incluir:**
- PaymentService
- PaymentController

```bash
# Commit 5.1: PaymentService
git add app/Services/PaymentService.php
git commit -m "feat(services): agregar PaymentService con simulación de pagos (MOCK)

⚠️ ADVERTENCIA: Esta es una SIMULACIÓN solo para desarrollo
- Simular procesamiento de pagos (80% de aprobación)
- Soportar tarjetas de crédito, débito y PSE
- Sanitizar datos sensibles (solo guardar últimos 4 dígitos)
- Nunca almacenar CVV o contraseñas
- Actualizar estado de reserva al aprobar

TODO: Reemplazar con pasarela de pago real antes de producción

Issue #5"

# Commit 5.2: PaymentController
git add app/Http/Controllers/PaymentController.php
git commit -m "feat(controllers): agregar PaymentController para procesamiento de pagos

- Agregar método create para formulario de pago
- Agregar métodos processCredit, processDebit, processPSE
- Agregar método thankYou para página de éxito
- Integrar con PaymentService

Issue #5"
```

---

## Issue 6 — TicketService y generación de documentos (Backend)

**Archivos a incluir:**
- TicketService
- TicketController
- Vista de tiquetes

```bash
# Commit 6.1: TicketService
git add app/Services/TicketService.php
git commit -m "feat(services): agregar TicketService para generación de tiquetes

⚠️ NOTA: La generación de PDF está actualmente simulada con HTML
- Generar tiquetes en formatos PDF (simulado) y JSON
- Guardar archivos en storage/app/public/tickets
- Crear registros en base de datos con códigos únicos
- Preparar estructura de datos para tiquetes
- Agregar métodos de validación y descarga

TODO: Integrar librería real de PDF (Dompdf/Snappy) antes de producción

Issue #6"

# Commit 6.2: TicketController y vista
git add app/Http/Controllers/TicketController.php
git add resources/views/tickets/pdf.blade.php
git commit -m "feat(tickets): agregar TicketController y plantilla PDF

- Agregar TicketController para descarga y envío de tiquetes
- Agregar plantilla Blade para renderizado de PDF de tiquetes
- Agregar rutas para obtención de tiquetes

Issue #6"
```

---

## Issue 7 — ReleaseExpiredSeatsJob y automatización (Backend)

**Archivos a incluir:**
- ReleaseExpiredSeatsJob
- Configuración de scheduler

```bash
# Commit 7.1: Job de liberación de asientos
git add app/Jobs/ReleaseExpiredSeatsJob.php
git commit -m "feat(jobs): agregar ReleaseExpiredSeatsJob para liberación automática de asientos

- Implementar ShouldQueue para procesamiento en segundo plano
- Llamar a BookingService::liberarReservasExpiradas
- Agregar logging para monitoreo
- Configurar para queue worker

Issue #7"

# Commit 7.2: Configuración de scheduler
git add app/Console/Kernel.php
git commit -m "feat(scheduler): configurar ReleaseExpiredSeatsJob para ejecutarse cada 5 minutos

- Programar ejecución del job vía Laravel scheduler
- Agregar documentación de entrada cron

Issue #7"
```

---

## Issue 8 — Página de búsqueda de vuelos (Frontend)

**Archivos a incluir:**
- Flights/Search.jsx

```bash
# Commit 8: Página de búsqueda de vuelos
git add resources/js/Pages/Flights/Search.jsx
git commit -m "feat(frontend): agregar página de búsqueda de vuelos con validaciones

- Crear formulario de búsqueda con selección de origen/destino
- Agregar selectores de fecha con validación de rango (hoy a +60 días)
- Agregar selector de cantidad de pasajeros (1-5)
- Implementar toggle de tipo de viaje (ida/ida y vuelta)
- Agregar validaciones del lado del cliente
- Integrar con endpoint POST /vuelos/buscar

Issue #8"
```

---

## Issue 9 — Selección de asientos interactiva (Frontend)

**Archivos a incluir:**
- Seats/Select.jsx

```bash
# Commit 9: Mapa interactivo de asientos
git add resources/js/Pages/Seats/Select.jsx
git commit -m "feat(frontend): agregar mapa interactivo de selección de asientos

- Crear mapa visual de asientos organizado por filas
- Implementar gestión de estados de asientos (disponible, reservado, seleccionado)
- Agregar leyenda con código de colores
- Permitir selección de hasta 5 asientos
- Agregar retroalimentación visual en hover y click
- Integrar con endpoint POST /asientos/reservar

Issue #9"
```

---

## Issue 10 — Formulario de datos de pasajeros (Frontend)

**Archivos a incluir:**
- Booking/Passengers.jsx

```bash
# Commit 10: Formulario de pasajeros
git add resources/js/Pages/Booking/Passengers.jsx
git commit -m "feat(frontend): agregar formulario dinámico de información de pasajeros

- Crear formulario dinámico basado en cantidad de pasajeros
- Agregar campos para detalles de pasajeros (nombres, documento, fecha nacimiento, género)
- Agregar sección de información del pagador
- Implementar checkbox de términos y condiciones
- Agregar barra de progreso (paso 3 de 4)
- Validar edad de infantes (<3 años)
- Integrar con endpoint POST /reservas

Issue #10"
```

---

## Issue 11 — Simulación de pago (Frontend)

**Archivos a incluir:**
- Payment/Simulate.jsx

```bash
# Commit 11: Formulario de pago
git add resources/js/Pages/Payment/Simulate.jsx
git commit -m "feat(frontend): agregar formulario de pago con múltiples métodos

- Crear formulario de pago con 3 métodos (crédito, débito, PSE)
- Agregar entrada de tarjeta crédito/débito con formato
- Agregar formulario de selección de banco PSE
- Implementar enmascaramiento de número de tarjeta
- Agregar estados de procesamiento e indicadores de carga
- Agregar barra de progreso (paso 4 de 4)
- Integrar con endpoints de pago

Issue #11"
```

---

## Issue 12 — Confirmación de reserva y descarga (Frontend)

**Archivos a incluir:**
- Booking/Confirmation.jsx
- Booking/ThankYou.jsx

```bash
# Commit 12: Página de confirmación
git add resources/js/Pages/Booking/Confirmation.jsx
git add resources/js/Pages/Booking/ThankYou.jsx
git commit -m "feat(frontend): agregar páginas de confirmación de reserva y éxito

- Crear página de confirmación con resumen completo de reserva
- Mostrar código de reserva, info del pagador, vuelos, pasajeros
- Agregar botones de descarga de tiquetes
- Agregar diseño optimizado para impresión
- Crear página de agradecimiento para pagos exitosos

Issue #12"
```

---

## Issue 13 — Consulta de reservas (Frontend)

**Archivos a incluir:**
- MyTrips.jsx

```bash
# Commit 13: Página de consulta de reservas
git add resources/js/Pages/MyTrips.jsx
git commit -m "feat(frontend): agregar página de consulta de reservas

- Crear formulario de búsqueda para consulta de código de reserva
- Agregar validación de entrada (formato de código de 8 caracteres)
- Implementar funcionalidad de búsqueda sin necesidad de login
- Redirigir a página de detalles de reserva
- Agregar manejo de errores para códigos no encontrados

Issue #13"
```

---

## Issue 14 — Página de resultados de vuelos (Frontend)

**Archivos a incluir:**
- Flights/Results.jsx

```bash
# Commit 14: Página de resultados de búsqueda
git add resources/js/Pages/Flights/Results.jsx
git commit -m "feat(frontend): agregar página de resultados de búsqueda de vuelos

- Mostrar lista de vuelos con origen, destino, horarios, precios
- Agregar filtros por precio, horario, aerolínea
- Implementar opciones de ordenamiento (precio, duración, salida)
- Agregar selección de vuelos ida/ida y vuelta
- Mostrar información de disponibilidad y precios
- Agregar diseño responsive para dispositivos móviles

Issue #14"
```

---

## Archivos Adicionales (Configuración y Componentes Compartidos)

```bash
# Commit A1: Layouts y componentes base
git add resources/js/Layouts/MainLayout.jsx
git add resources/js/Layouts/GuestLayout.jsx
git add resources/js/Layouts/AuthenticatedLayout.jsx
git commit -m "feat(frontend): agregar componentes de layout

- Crear MainLayout para páginas públicas
- Crear GuestLayout para páginas de autenticación
- Crear AuthenticatedLayout para usuarios autenticados
- Agregar componentes de navegación y footer"

# Commit A2: Componentes reutilizables
git add resources/js/Components/LoginSuggestion.jsx
git add resources/js/Components/PrimaryButton.jsx
git add resources/js/Components/TextInput.jsx
git add resources/js/Components/InputLabel.jsx
git add resources/js/Components/InputError.jsx
git commit -m "feat(components): agregar componentes de UI reutilizables

- Agregar componentes de entrada de formulario
- Agregar componentes de botones
- Agregar componente de sugerencia de login
- Agregar componente de visualización de errores"

# Commit A3: Configuración de Tailwind y Vite
git add tailwind.config.js
git add postcss.config.js
git add vite.config.js
git add package.json
git commit -m "chore(config): configurar Tailwind CSS y Vite

- Configurar Tailwind con colores y tema personalizados
- Configurar PostCSS para procesamiento de CSS
- Configurar Vite para React/Inertia
- Agregar dependencias de npm"

# Commit A4: Configuración de Laravel
git add config/app.php
git add config/cache.php
git add config/queue.php
git add config/database.php
git commit -m "chore(config): actualizar configuración de Laravel

- Configurar driver de caché para Redis
- Configurar driver de cola para trabajos en segundo plano
- Actualizar configuración de conexión a base de datos
- Agregar proveedores de servicio"

# Commit A5: Documentación
git add README.md
git add INSTALLATION.md
git add DEPLOYMENT_GUIDE.md
git add PROJECT_SUMMARY.md
git add ADMIN_ACCESS.md
git add doc/ISSUES_V2.md
git add doc/analisis.md
git commit -m "docs: agregar documentación del proyecto

- Agregar guía de instalación
- Agregar guía de despliegue
- Agregar resumen del proyecto
- Agregar documentación de acceso de administrador
- Agregar documentación de issues
- Agregar análisis del sistema"

# Commit A6: Archivos de diagrama
git add doc/Diagramas/arquitectura_diagrama.md
git commit -m "docs: agregar diagramas de arquitectura

- Agregar diagrama de arquitectura del sistema
- Documentar patrón de capa de servicios
- Documentar flujo de datos y componentes"
```

---

## Comandos Útiles para Gestión de Commits

### Ver estado de los archivos
```bash
git status
```

### Ver diferencias antes de hacer commit
```bash
git diff
git diff --staged  # Ver cambios ya agregados al staging
```

### Deshacer el último commit (mantener cambios)
```bash
git reset --soft HEAD~1
```

### Modificar el último commit
```bash
git add archivo_olvidado.php
git commit --amend --no-edit
```

### Ver historial de commits
```bash
git log --oneline --graph --all
```

---

## Flujo de Trabajo Recomendado

1. **Revisar el estado actual**
   ```bash
   git status
   git diff
   ```

2. **Ejecutar commits por issue** (seguir el orden de este documento)
   - Comenzar con Issue 1 (fundación de base de datos)
   - Continuar con Issues 2-7 (servicios backend)
   - Continuar con Issues 8-14 (páginas frontend)
   - Finalizar con commits adicionales A1-A6

3. **Después de cada commit**
   ```bash
   git log --oneline -1  # Verificar el último commit
   ```

4. **Push a la rama develop**
   ```bash
   git push origin develop
   ```

5. **Crear Pull Request a main**
   - Ir a GitHub
   - Crear PR de `develop` a `main`
   - Revisar cambios
   - Solicitar revisión si es necesario
   - Hacer merge

---

## Notas Importantes

- **No ejecutar todos los commits de una vez**: Esto permite mejor rastreabilidad y facilita la revisión.
- **Verificar archivos antes de cada commit**: Usar `git status` y `git diff` para confirmar cambios.
- **Mantener commits atómicos**: Cada commit debe representar un cambio lógico completo.
- **Mensajes en español**: Todos los mensajes de commit están en español para consistencia del equipo.
- **Formato de commit convencional**: Se usa el estándar `tipo(alcance): descripción`.
  - `feat`: Nueva funcionalidad
  - `fix`: Corrección de bug
  - `docs`: Cambios en documentación
  - `chore`: Tareas de mantenimiento/configuración
  - `refactor`: Refactorización de código
  - `test`: Agregar o modificar pruebas
