# Issues generales - Cambios versión 2025-10-22

Este documento agrupa issues generales derivados de los cambios detectados en la versión actual del proyecto. Cada issue indica: componente afectado (frontend/backend), descripción, impacto, tareas sugeridas y prioridad.

---

## Resumen de cambios detectados

### Backend
- **Servicios nuevos** en `app/Services/`: `BookingService`, `FlightService`, `PaymentService`, `SeatService`, `TicketService`
- **Job nuevo**: `ReleaseExpiredSeatsJob` en `app/Jobs/`
- **Migraciones nuevas** (2025-10-22): 10 tablas creadas (`ciudades`, `modelos_aeronave`, `aeronaves`, `vuelos`, `pagadores`, `reservas`, `asientos`, `pasajeros`, `tiquetes`, `pagos`, `reservas_vuelos`, `pasajeros_asientos`)
- **Controllers nuevos**: `FlightController`, `SeatController`, `BookingController`, `PaymentController`, `TicketController`
- **Rutas nuevas** en `routes/web.php`: grupos `flights.*`, `seats.*`, `booking.*`, `payment.*`, `tickets.*`

### Frontend
- **Páginas React/Inertia nuevas**: `Flights/Search.jsx`, `Flights/Results.jsx`, `Seats/Select.jsx`, `Booking/Passengers.jsx`, `Payment/Simulate.jsx`, `Booking/Confirmation.jsx`, `MyTrips.jsx`
- **Componentes nuevos**: Formularios de búsqueda, mapa de asientos, formularios de pago, confirmación de reserva
- **Flujo completo**: Búsqueda → Selección de vuelos → Selección de asientos → Ingreso de pasajeros → Pago → Confirmación

---

## Issues Backend

### Issue 1 — Migraciones y modelado de base de datos (Backend)
**Componente**: Backend (Database, Migrations, Models)

**Descripción**: Se crearon 10 nuevas migraciones que definen la estructura completa del sistema de reservas de vuelos: ciudades, aeronaves, vuelos, asientos, reservas, pasajeros, pagos y tiquetes.

**Impacto**:
- Cambio estructural completo en la base de datos
- Requiere ejecutar migraciones en todos los entornos
- Relaciones complejas entre tablas (FKs, pivotes)
- Campo `version` en `asientos` para optimistic locking
- Índices específicos para optimizar búsquedas

**Tareas sugeridas**:
1. Ejecutar migraciones en staging y validar integridad
2. Verificar seeders existentes (`CiudadSeeder`, `ModeloAeronaveSeeder`, `AeronaveSeeder`, `VueloSeeder`, `AdminUserSeeder`)
3. Documentar decisión de no usar FK en `asientos.reserva_id`
4. Crear factories para testing de todas las nuevas entidades
5. Validar índices para queries de búsqueda frecuentes

**Prioridad**: Alta

---

### Issue 2 — BookingService y lógica de reservas (Backend)
**Componente**: Backend (Services)

**Descripción**: `BookingService` implementa todo el ciclo de vida de una reserva: creación, validación, confirmación, cancelación y liberación de expiradas. Coordina con `SeatService` y maneja transacciones.

**Impacto**:
- Lógica de negocio centralizada en servicio
- Validaciones: 1-5 pasajeros, términos aceptados, edades de infantes, capacidad de vuelos
- Manejo transaccional con rollback automático
- Cálculo de totales y expiración de reservas (15 minutos)

**Tareas sugeridas**:
1. Testear método `crearReserva` con casos: éxito, asientos insuficientes, validaciones fallidas
2. Testear `liberarReservasExpiradas` con diferentes estados de reserva
3. Validar que `validarDatosReserva` cubra todos los casos de borde
4. Documentar formato esperado del payload de entrada
5. Añadir logs para debugging de flujos de reserva

**Prioridad**: Alta

---

### Issue 3 — SeatService y control de concurrencia (Backend)
**Componente**: Backend (Services)

**Descripción**: `SeatService` implementa reserva de asientos con optimistic locking (campo `version`) y `lockForUpdate()`. Genera asientos automáticamente y maneja liberación.

**Impacto**:
- Control de concurrencia crítico para evitar doble reserva
- Actualización atómica de contadores en tabla `vuelos`
- Uso de transacciones y bloqueos de base de datos

**Tareas sugeridas**:
1. Realizar tests de carga para validar comportamiento bajo concurrencia
2. Verificar que `version` se incremente correctamente en cada actualización
3. Testear `reservarAsientos` con múltiples usuarios simultáneos
4. Validar que `generarAsientosParaVuelo` maneje correctamente la configuración del modelo
5. Añadir métricas de conflictos de concurrencia

**Prioridad**: Alta

---

### Issue 4 — FlightService y sistema de búsqueda (Backend)
**Componente**: Backend (Services)

**Descripción**: `FlightService` implementa búsqueda de vuelos con caché (5 min), validaciones de fecha (máx 60 días), búsqueda de ciudades y detalles de vuelos.

**Impacto**:
- Caché de búsquedas reduce carga de DB
- Validación estricta de fechas y rutas
- Mapeo de respuestas con formato específico para frontend

**Tareas sugeridas**:
1. Configurar driver de caché apropiado (Redis recomendado)
2. Testear invalidación de caché cuando cambian datos de vuelos
3. Validar formato de respuesta con frontend
4. Documentar estructura de datos retornados
5. Optimizar queries con eager loading

**Prioridad**: Media

---

### Issue 5 — PaymentService (simulación de pagos) (Backend)
**Componente**: Backend (Services)

**Descripción**: `PaymentService` simula procesamiento de pagos (80% éxito) para tarjetas de crédito/débito y PSE. Sanitiza datos sensibles y registra transacciones.

**Impacto**:
- **ES UNA SIMULACIÓN** - No apta para producción
- Sanitización de datos de tarjeta (solo últimos 4 dígitos)
- No guarda CVV ni contraseñas
- Actualiza estado de reserva y confirma asientos al aprobar

**Tareas sugeridas**:
1. **CRÍTICO**: Reemplazar por integración real antes de producción
2. Documentar claramente que es mock en código y README
3. Testear flujos: aprobado, rechazado, reintentos
4. Validar detección de tipo de tarjeta (Visa, Mastercard, Amex)
5. Implementar auditoría de intentos de pago

**Prioridad**: Alta

---

### Issue 6 — TicketService y generación de documentos (Backend)
**Componente**: Backend (Services)

**Descripción**: `TicketService` genera tiquetes en PDF (simulado con HTML) o JSON. Guarda archivos en `storage/app/public/tickets` y crea registros en BD.

**Impacto**:
- Actualmente simula PDF guardando HTML
- Requiere `php artisan storage:link` en producción
- Generación de código QR pendiente
- Envío de correo comentado

**Tareas sugeridas**:
1. Integrar librería real de PDF (Dompdf, Snappy)
2. Implementar generación de QR codes
3. Configurar y testear envío de correos con tiquetes adjuntos
4. Validar permisos de escritura en `storage/app/public/tickets`
5. Crear plantilla profesional de tiquete

**Prioridad**: Media

---

### Issue 7 — ReleaseExpiredSeatsJob y automatización (Backend)
**Componente**: Backend (Jobs/Queues)

**Descripción**: Job que libera automáticamente asientos de reservas expiradas. Implementa `ShouldQueue` y registra logs de ejecución.

**Impacto**:
- Requiere configuración de queues (Redis, database)
- Debe programarse en scheduler (cada 5-10 min)
- Libera recursos automáticamente

**Tareas sugeridas**:
1. Añadir comando al scheduler en `app/Console/Kernel.php`
2. Configurar supervisor para workers en producción
3. Testear ejecución manual y programada
4. Añadir alertas si fallan liberaciones
5. Documentar configuración de queue driver

**Prioridad**: Media

---

## Issues Frontend

### Issue 8 — Página de búsqueda de vuelos (Frontend)
**Componente**: Frontend (`Flights/Search.jsx`)

**Descripción**: Interfaz de búsqueda con selección de origen/destino, fechas (ida/ida-regreso), cantidad de pasajeros (1-5). Validaciones client-side.

**Impacto**:
- Formulario principal de entrada al sistema
- Validaciones: fechas válidas (hoy a +60 días), origen ≠ destino, 1-5 pasajeros
- Integración con endpoint `POST /vuelos/buscar`

**Tareas sugeridas**:
1. Validar que el componente maneje correctamente los errores del servidor
2. Añadir autocompletado para ciudades si es necesario
3. Mejorar UX: deshabilitar fechas inválidas en datepicker
4. Añadir loading states durante la búsqueda
5. Testear flujo completo con diferentes combinaciones

**Prioridad**: Alta

---

### Issue 9 — Selección de asientos interactiva (Frontend)
**Componente**: Frontend (`Seats/Select.jsx`)

**Descripción**: Mapa visual de asientos del avión. Muestra estados (disponible, reservado, seleccionado) y permite seleccionar hasta 5 asientos. Organiza por filas.

**Impacto**:
- Interfaz crítica para UX del sistema
- Manejo de estados visuales (colores, hover, disabled)
- Sincronización con cantidad de pasajeros
- Envía IDs de asientos al backend

**Tareas sugeridas**:
1. Añadir feedback visual cuando asientos no están disponibles (tooltip)
2. Implementar loading spinner durante la reserva
3. Manejar errores de concurrencia (asiento tomado por otro usuario)
4. Mejorar accesibilidad (navegación por teclado)
5. Testear con diferentes configuraciones de avión

**Prioridad**: Alta

---

### Issue 10 — Formulario de datos de pasajeros (Frontend)
**Componente**: Frontend (`Booking/Passengers.jsx`)

**Descripción**: Formulario dinámico que genera campos para cada pasajero (nombres, apellidos, documento, fecha nacimiento, género, etc.) y datos del pagador. Incluye checkbox de términos.

**Impacto**:
- Formulario extenso con múltiples validaciones
- Campos dinámicos según cantidad de pasajeros
- Validación de edades (infantes <3 años)
- Barra de progreso del flujo (paso 3 de 4)

**Tareas sugeridas**:
1. Añadir validaciones en tiempo real por campo
2. Implementar guardado temporal en localStorage (recuperación)
3. Validar formatos de documento según tipo
4. Mejorar UX: resaltar campos con error
5. Añadir opción de copiar datos del pagador a primer pasajero

**Prioridad**: Alta

---

### Issue 11 — Simulación de pago (Frontend)
**Componente**: Frontend (`Payment/Simulate.jsx`)

**Descripción**: Formulario de pago con 3 métodos (crédito, débito, PSE). Formateo de número de tarjeta, validación de campos y estados de procesamiento.

**Impacto**:
- Manejo de información sensible (tarjetas)
- Estados: idle, procesando, aprobado, rechazado
- Integración con 3 endpoints diferentes según método
- Barra de progreso (paso 4 de 4)

**Tareas sugeridas**:
1. Mejorar validación de tarjetas (algoritmo de Luhn completo)
2. Añadir máscaras de entrada para CVV y fecha
3. Mostrar mensajes claros en rechazo (opción de reintentar)
4. Implementar timeout para evitar múltiples envíos
5. Ocultar datos sensibles en logs del navegador

**Prioridad**: Alta

---

### Issue 12 — Confirmación de reserva y descarga (Frontend)
**Componente**: Frontend (`Booking/Confirmation.jsx`)

**Descripción**: Página de éxito que muestra resumen completo: código de reserva, datos del pagador, vuelos, pasajeros con asientos. Permite descarga de tiquetes.

**Impacto**:
- Página final del flujo exitoso
- Muestra toda la información consolidada
- Enlace de descarga de tiquetes
- Opciones de impresión

**Tareas sugeridas**:
1. Implementar descarga individual de tiquetes por pasajero
2. Añadir opción de envío por correo desde la interfaz
3. Mejorar diseño para impresión (CSS @media print)
4. Añadir botón para compartir código de reserva
5. Implementar redirección automática a "Mis Viajes"

**Prioridad**: Media

---

### Issue 13 — Consulta de reservas (Frontend)
**Componente**: Frontend (`MyTrips.jsx`)

**Descripción**: Buscador de reservas por código. Permite a usuarios consultar estado sin necesidad de login.

**Impacto**:
- Acceso público a datos de reserva
- Búsqueda por código único
- Redirección a página de detalle

**Tareas sugeridas**:
1. Añadir validación de formato de código (8 caracteres)
2. Mejorar manejo de errores (código no encontrado)
3. Implementar historial de búsquedas (localStorage)
4. Añadir opción de cancelación desde esta vista
5. Mostrar indicador visual de estado de reserva

**Prioridad**: Media

---

### Issue 14 — Página de resultados de vuelos (Frontend)
**Componente**: Frontend (`Flights/Results.jsx`)

**Descripción**: Listado de vuelos disponibles con filtros, ordenamiento y selección. Muestra origen, destino, horarios, precios y disponibilidad.

**Impacto**:
- Presentación de resultados de búsqueda
- Filtros dinámicos (precio, horario, aerolínea)
- Ordenamiento (precio, duración, salida)
- Selección de vuelos ida/regreso

**Tareas sugeridas**:
1. Implementar filtros en tiempo real sin recargar
2. Añadir comparador visual de precios
3. Mejorar diseño responsive para móviles
4. Añadir paginación si hay muchos resultados
5. Implementar "No hay resultados" con sugerencias

**Prioridad**: Alta

---

## Notas finales

### Cambios reales detectados:
- ✅ **7 issues backend** (migraciones, servicios, job)
- ✅ **7 issues frontend** (páginas React/Inertia)
- ✅ Total: **14 issues** equilibrados

### Avisos importantes:
- `PaymentService` es **simulación** - reemplazar antes de producción
- `TicketService` genera HTML en vez de PDF - integrar librería real
- Configurar colas y scheduler para `ReleaseExpiredSeatsJob`
- Ejecutar `php artisan storage:link` en despliegues
- Configurar Redis para caché y queues (recomendado)

---

**Generado**: 2025-10-22  
**Archivos analizados**: Services, Jobs, Migrations, Controllers, Routes, Pages JSX
