# Diseño de Base de Datos – AirGuider Sistema de Compra de Tiquetes Aéreos

**Documento:** versión 2.0  
**Fecha:** 2025-10-23  
**Proyecto:** SENASOFT 2025  
**Demo:** [https://airguide.clubgestion.com/](https://airguide.clubgestion.com/)

---

## 1. Introducción

Este documento describe el diseño completo de la base de datos del sistema **AirGuider**, implementado con MySQL 8.0+ y Laravel 12. El diseño garantiza integridad referencial, control de concurrencia optimista y optimización para consultas frecuentes.

### 1.1 Tecnologías Utilizadas

- **DBMS:** MySQL 8.0+
- **ORM:** Laravel Eloquent
- **Migraciones:** Laravel Migrations
- **Seeders:** Laravel Database Seeders
- **Charset:** utf8mb4 (soporte completo Unicode)
- **Collation:** utf8mb4_unicode_ci

---

## 2. Modelo Entidad-Relación (ER)

### 2.1 Diagrama ER Actualizado

```mermaid
erDiagram
    USERS {
        bigint id PK
        string name
        string email UK
        timestamp email_verified_at
        string password
        string remember_token
        timestamps
    }
    
    CIUDADES {
        bigint id PK
        string ciudad
        string codigo_iata UK
        string pais
        timestamps
    }
    
    MODELOS_AERONAVE {
        bigint id PK
        string nombre
        string fabricante
        int capacidad_total
        int filas
        int asientos_por_fila
        timestamps
    }
    
    AERONAVES {
        bigint id PK
        bigint modelo_id FK
        string matricula UK
        int anio_fabricacion
        string estado
        timestamps
    }
    
    VUELOS {
        bigint id PK
        string codigo UK
        bigint ciudad_origen_id FK
        bigint ciudad_destino_id FK
        bigint aeronave_id FK
        date fecha_salida
        time hora_salida
        date fecha_llegada
        time hora_llegada
        decimal precio_base
        int capacidad_total
        int asientos_disponibles
        string estado
        timestamps
    }
    
    ASIENTOS {
        bigint id PK
        bigint vuelo_id FK
        string numero
        string tipo
        string estado
        int version
        timestamp reservado_hasta
        timestamps
    }
    
    PAGADORES {
        bigint id PK
        string nombre_completo
        string tipo_documento
        string numero_documento
        string correo
        string telefono
        timestamps
    }
    
    RESERVAS {
        bigint id PK
        bigint pagador_id FK
        string codigo_unico UK
        string estado
        decimal total
        int cantidad_pasajeros
        timestamp fecha_expiracion
        timestamps
    }
    
    RESERVAS_VUELOS {
        bigint id PK
        bigint reserva_id FK
        bigint vuelo_id FK
        string tipo_viaje
        timestamps
    }
    
    PASAJEROS {
        bigint id PK
        bigint reserva_id FK
        string primer_apellido
        string segundo_apellido
        string nombres
        date fecha_nacimiento
        string genero
        string tipo_documento
        string numero_documento
        boolean es_infante
        string celular
        string correo
        timestamps
    }
    
    PASAJEROS_ASIENTOS {
        bigint id PK
        bigint pasajero_id FK
        bigint asiento_id FK
        timestamps
    }
    
    PAGOS {
        bigint id PK
        bigint reserva_id FK
        string metodo_pago
        decimal subtotal
        decimal impuestos
        decimal total
        string referencia_pago UK
        string estado
        text detalles_json
        timestamps
    }
    
    TIQUETES {
        bigint id PK
        bigint reserva_id FK
        bigint pasajero_id FK
        string codigo_reserva
        string codigo_qr
        string estado
        timestamp fecha_emision
        timestamps
    }
    
    CACHE {
        string key PK
        text value
        int expiration
    }
    
    CACHE_LOCKS {
        string key PK
        string owner
        int expiration
    }
    
    SESSIONS {
        string id PK
        bigint user_id FK
        string ip_address
        text user_agent
        text payload
        int last_activity
    }
    
    PASSWORD_RESET_TOKENS {
        string email PK
        string token
        timestamp created_at
    }

    %% Relaciones
    USERS ||--o{ SESSIONS : "tiene"
    USERS ||--o{ PASSWORD_RESET_TOKENS : "puede resetear"
    
    CIUDADES ||--o{ VUELOS : "origen"
    CIUDADES ||--o{ VUELOS : "destino"
    
    MODELOS_AERONAVE ||--o{ AERONAVES : "tiene"
    AERONAVES ||--o{ VUELOS : "opera"
    
    VUELOS ||--o{ ASIENTOS : "tiene"
    VUELOS ||--o{ RESERVAS_VUELOS : "incluido en"
    
    PAGADORES ||--o{ RESERVAS : "realiza"
    
    RESERVAS ||--o{ RESERVAS_VUELOS : "contiene"
    RESERVAS ||--o{ PASAJEROS : "tiene"
    RESERVAS ||--|| PAGOS : "tiene"
    RESERVAS ||--o{ TIQUETES : "genera"
    
    PASAJEROS ||--o{ PASAJEROS_ASIENTOS : "asignado a"
    PASAJEROS ||--o{ TIQUETES : "recibe"
    
    ASIENTOS ||--o{ PASAJEROS_ASIENTOS : "ocupado por"
```
    
    PAGADOR {
        int id PK
        string nombre_completo
        string tipo_documento
        string numero_documento
```

### 2.2 Resumen de Tablas

| # | Tabla | Registros (Seeder) | Descripción |
|---|-------|-------------------|-------------|
| 1 | **users** | Variable | Usuarios del sistema con autenticación |
| 2 | **ciudades** | 15 | Ciudades colombianas con códigos IATA |
| 3 | **modelos_aeronave** | 4 | Modelos de aeronaves (capacidad y configuración) |
| 4 | **aeronaves** | 8 | Aeronaves de la flota |
| 5 | **vuelos** | 976 | Vuelos programados (próximos 60 días) |
| 6 | **asientos** | 125,734 | Asientos generados automáticamente |
| 7 | **pagadores** | Variable | Compradores de reservas |
| 8 | **reservas** | Variable | Reservas generadas |
| 9 | **reservas_vuelos** | Variable | Relación N:M reserva-vuelo |
| 10 | **pasajeros** | Variable | Pasajeros por reserva (máx. 5) |
| 11 | **pasajeros_asientos** | Variable | Asignación de asientos a pasajeros |
| 12 | **pagos** | Variable | Transacciones de pago |
| 13 | **tiquetes** | Variable | Tiquetes emitidos |
| 14 | **cache** | Sistema | Caché de Laravel |
| 15 | **cache_locks** | Sistema | Locks de concurrencia |
| 16 | **sessions** | Sistema | Sesiones activas |
| 17 | **password_reset_tokens** | Sistema | Tokens de recuperación |

---

## 3. Esquemas de Tablas (DDL)

### 3.1 Tabla `users`

**Descripción:** Usuarios del sistema con autenticación Laravel Breeze.

```sql
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
    `password` VARCHAR(255) NOT NULL,
    `remember_token` VARCHAR(100) NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    INDEX `users_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos clave:**
- `email`: Único, usado para login
- `password`: Hash bcrypt
- `remember_token`: Para "recordarme"

---

### 3.2 Tabla `ciudades`

**Descripción:** Ciudades colombianas con códigos IATA para rutas de vuelos.

```sql
CREATE TABLE `ciudades` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `ciudad` VARCHAR(100) NOT NULL,
    `codigo_iata` VARCHAR(3) NOT NULL UNIQUE,
    `pais` VARCHAR(100) NOT NULL DEFAULT 'Colombia',
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    INDEX `ciudades_codigo_iata_index` (`codigo_iata`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Datos ejemplo:**
```
Bogotá    - BOG
Medellín  - MDE
Cali      - CLO
Cartagena - CTG
```

---

### 3.3 Tabla `modelos_aeronave`

**Descripción:** Modelos de aeronaves con capacidad y configuración de asientos.

```sql
CREATE TABLE `modelos_aeronave` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL,
    `fabricante` VARCHAR(100) NOT NULL,
    `capacidad_total` INT NOT NULL,
    `filas` INT NOT NULL,
    `asientos_por_fila` INT NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Datos ejemplo:**
```
Airbus A320      - 180 asientos (30 filas x 6)
Boeing 737-800   - 189 asientos (32 filas x 6)
Embraer E190     - 100 asientos (25 filas x 4)
ATR 72-600       - 70 asientos (18 filas x 4)
```

---

### 3.4 Tabla `aeronaves`

**Descripción:** Aeronaves de la flota con matrícula única.

```sql
CREATE TABLE `aeronaves` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `modelo_id` BIGINT UNSIGNED NOT NULL,
    `matricula` VARCHAR(20) NOT NULL UNIQUE,
    `anio_fabricacion` INT NOT NULL,
    `estado` ENUM('activa', 'mantenimiento', 'fuera_de_servicio') NOT NULL DEFAULT 'activa',
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`modelo_id`) REFERENCES `modelos_aeronave`(`id`) ON DELETE RESTRICT,
    INDEX `aeronaves_modelo_id_index` (`modelo_id`),
    INDEX `aeronaves_matricula_index` (`matricula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3.5 Tabla `vuelos`

**Descripción:** Vuelos programados con origen, destino y aeronave asignada.

```sql
CREATE TABLE `vuelos` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `codigo` VARCHAR(10) NOT NULL UNIQUE,
    `ciudad_origen_id` BIGINT UNSIGNED NOT NULL,
    `ciudad_destino_id` BIGINT UNSIGNED NOT NULL,
    `aeronave_id` BIGINT UNSIGNED NOT NULL,
    `fecha_salida` DATE NOT NULL,
    `hora_salida` TIME NOT NULL,
    `fecha_llegada` DATE NOT NULL,
    `hora_llegada` TIME NOT NULL,
    `precio_base` DECIMAL(10, 2) NOT NULL,
    `capacidad_total` INT NOT NULL,
    `asientos_disponibles` INT NOT NULL,
    `estado` ENUM('programado', 'abordando', 'en_vuelo', 'aterrizado', 'cancelado') NOT NULL DEFAULT 'programado',
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`ciudad_origen_id`) REFERENCES `ciudades`(`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`ciudad_destino_id`) REFERENCES `ciudades`(`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`aeronave_id`) REFERENCES `aeronaves`(`id`) ON DELETE RESTRICT,
    INDEX `vuelos_codigo_index` (`codigo`),
    INDEX `vuelos_origen_destino_fecha_index` (`ciudad_origen_id`, `ciudad_destino_id`, `fecha_salida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Índices compuestos:** Optimizan búsquedas por origen, destino y fecha.

---

### 3.6 Tabla `asientos`

**Descripción:** Asientos generados automáticamente para cada vuelo.

```sql
CREATE TABLE `asientos` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `vuelo_id` BIGINT UNSIGNED NOT NULL,
    `numero` VARCHAR(5) NOT NULL,
    `tipo` ENUM('economica', 'ejecutiva', 'primera_clase') NOT NULL DEFAULT 'economica',
    `estado` ENUM('disponible', 'reservado', 'emitido') NOT NULL DEFAULT 'disponible',
    `version` INT NOT NULL DEFAULT 0,
    `reservado_hasta` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`vuelo_id`) REFERENCES `vuelos`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `asientos_vuelo_numero_unique` (`vuelo_id`, `numero`),
    INDEX `asientos_vuelo_estado_index` (`vuelo_id`, `estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Control de concurrencia:**
- `version`: Optimistic locking
- `reservado_hasta`: Timeout de 5 minutos
- `estado`: disponible, reservado, emitido

---

### 3.7 Tabla `pagadores`

**Descripción:** Datos de los compradores (pagadores de la reserva).

```sql
CREATE TABLE `pagadores` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre_completo` VARCHAR(255) NOT NULL,
    `tipo_documento` ENUM('CC', 'TI', 'Pasaporte', 'CE') NOT NULL,
    `numero_documento` VARCHAR(50) NOT NULL,
    `correo` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(20) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    INDEX `pagadores_correo_index` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3.8 Tabla `reservas`

**Descripción:** Reservas generadas con código único y estado.

```sql
CREATE TABLE `reservas` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `pagador_id` BIGINT UNSIGNED NOT NULL,
    `codigo_unico` VARCHAR(10) NOT NULL UNIQUE,
    `estado` ENUM('pendiente', 'confirmada', 'cancelada', 'expirada') NOT NULL DEFAULT 'pendiente',
    `total` DECIMAL(10, 2) NOT NULL,
    `cantidad_pasajeros` INT NOT NULL,
    `fecha_expiracion` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`pagador_id`) REFERENCES `pagadores`(`id`) ON DELETE RESTRICT,
    INDEX `reservas_codigo_unico_index` (`codigo_unico`),
    INDEX `reservas_estado_index` (`estado`),
    INDEX `reservas_pagador_id_index` (`pagador_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Código único:** Alfanumérico de 8 caracteres (ej: A30NMTY9).

---

### 3.9 Tabla `reservas_vuelos`

**Descripción:** Relación N:M entre reservas y vuelos (ida y vuelta).

```sql
CREATE TABLE `reservas_vuelos` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `reserva_id` BIGINT UNSIGNED NOT NULL,
    `vuelo_id` BIGINT UNSIGNED NOT NULL,
    `tipo_viaje` ENUM('ida', 'regreso') NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`reserva_id`) REFERENCES `reservas`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`vuelo_id`) REFERENCES `vuelos`(`id`) ON DELETE RESTRICT,
    INDEX `reservas_vuelos_reserva_id_index` (`reserva_id`),
    INDEX `reservas_vuelos_vuelo_id_index` (`vuelo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3.10 Tabla `pasajeros`

**Descripción:** Pasajeros registrados por reserva (máximo 5).

```sql
CREATE TABLE `pasajeros` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `reserva_id` BIGINT UNSIGNED NOT NULL,
    `primer_apellido` VARCHAR(100) NOT NULL,
    `segundo_apellido` VARCHAR(100) NULL,
    `nombres` VARCHAR(100) NOT NULL,
    `fecha_nacimiento` DATE NOT NULL,
    `genero` ENUM('masculino', 'femenino', 'otro') NOT NULL,
    `tipo_documento` ENUM('CC', 'TI', 'Pasaporte', 'CE') NOT NULL,
    `numero_documento` VARCHAR(50) NOT NULL,
    `es_infante` BOOLEAN NOT NULL DEFAULT FALSE,
    `celular` VARCHAR(20) NOT NULL,
    `correo` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`reserva_id`) REFERENCES `reservas`(`id`) ON DELETE CASCADE,
    INDEX `pasajeros_reserva_id_index` (`reserva_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Validación:**
- `es_infante`: TRUE si edad < 3 años

---

### 3.11 Tabla `pasajeros_asientos`

**Descripción:** Asignación de asientos a pasajeros.

```sql
CREATE TABLE `pasajeros_asientos` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `pasajero_id` BIGINT UNSIGNED NOT NULL,
    `asiento_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`pasajero_id`) REFERENCES `pasajeros`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`asiento_id`) REFERENCES `asientos`(`id`) ON DELETE RESTRICT,
    UNIQUE KEY `pasajeros_asientos_pasajero_asiento_unique` (`pasajero_id`, `asiento_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3.12 Tabla `pagos`

**Descripción:** Transacciones de pago con referencia única.

```sql
CREATE TABLE `pagos` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `reserva_id` BIGINT UNSIGNED NOT NULL,
    `metodo_pago` ENUM('tarjeta_credito', 'tarjeta_debito', 'pse') NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `impuestos` DECIMAL(10, 2) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `referencia_pago` VARCHAR(50) NOT NULL UNIQUE,
    `estado` ENUM('aprobado', 'rechazado', 'pendiente') NOT NULL DEFAULT 'pendiente',
    `detalles_json` TEXT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`reserva_id`) REFERENCES `reservas`(`id`) ON DELETE RESTRICT,
    INDEX `pagos_reserva_id_index` (`reserva_id`),
    INDEX `pagos_referencia_pago_index` (`referencia_pago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Impuestos:** 19% IVA sobre el subtotal.

---

### 3.13 Tabla `tiquetes`

**Descripción:** Tiquetes emitidos con código QR.

```sql
CREATE TABLE `tiquetes` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `reserva_id` BIGINT UNSIGNED NOT NULL,
    `pasajero_id` BIGINT UNSIGNED NOT NULL,
    `codigo_reserva` VARCHAR(10) NOT NULL,
    `codigo_qr` TEXT NULL,
    `estado` ENUM('emitido', 'usado', 'cancelado') NOT NULL DEFAULT 'emitido',
    `fecha_emision` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`reserva_id`) REFERENCES `reservas`(`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`pasajero_id`) REFERENCES `pasajeros`(`id`) ON DELETE RESTRICT,
    INDEX `tiquetes_reserva_id_index` (`reserva_id`),
    INDEX `tiquetes_codigo_reserva_index` (`codigo_reserva`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3.14 Tablas del Sistema Laravel

#### `cache`

```sql
CREATE TABLE `cache` (
    `key` VARCHAR(255) NOT NULL PRIMARY KEY,
    `value` MEDIUMTEXT NOT NULL,
    `expiration` INT NOT NULL,
    INDEX `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### `cache_locks`

```sql
CREATE TABLE `cache_locks` (
    `key` VARCHAR(255) NOT NULL PRIMARY KEY,
    `owner` VARCHAR(255) NOT NULL,
    `expiration` INT NOT NULL,
    INDEX `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### `sessions`

```sql
CREATE TABLE `sessions` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NULL DEFAULT NULL,
    `ip_address` VARCHAR(45) NULL DEFAULT NULL,
    `user_agent` TEXT NULL DEFAULT NULL,
    `payload` LONGTEXT NOT NULL,
    `last_activity` INT NOT NULL,
    INDEX `sessions_user_id_index` (`user_id`),
    INDEX `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### `password_reset_tokens`

```sql
CREATE TABLE `password_reset_tokens` (
    `email` VARCHAR(255) NOT NULL PRIMARY KEY,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    INDEX `password_reset_tokens_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 4. Índices y Optimizaciones

### 4.1 Índices Principales

| Tabla | Índice | Columnas | Tipo | Propósito |
|-------|--------|----------|------|-----------|
| **vuelos** | `vuelos_origen_destino_fecha_index` | `ciudad_origen_id`, `ciudad_destino_id`, `fecha_salida` | COMPOSITE | Búsqueda de vuelos |
| **asientos** | `asientos_vuelo_estado_index` | `vuelo_id`, `estado` | COMPOSITE | Consulta de asientos disponibles |
| **reservas** | `reservas_codigo_unico_index` | `codigo_unico` | UNIQUE | Búsqueda rápida por código |
| **pagos** | `pagos_referencia_pago_index` | `referencia_pago` | UNIQUE | Validación de pagos |
| **ciudades** | `ciudades_codigo_iata_index` | `codigo_iata` | UNIQUE | Autocompletado |

### 4.2 Foreign Keys con Cascadas

```sql
-- Ejemplo: Al eliminar una reserva, se eliminan pasajeros y tiquetes
ALTER TABLE pasajeros ADD CONSTRAINT fk_pasajeros_reserva 
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE;

ALTER TABLE tiquetes ADD CONSTRAINT fk_tiquetes_reserva 
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE;
```

---

## 5. Control de Concurrencia

### 5.1 Optimistic Locking en Asientos

**Estrategia:** Usar campo `version` para detectar modificaciones concurrentes.

```sql
-- Actualización con optimistic locking
UPDATE asientos 
SET estado = 'reservado', 
    version = version + 1,
    reservado_hasta = NOW() + INTERVAL 5 MINUTE
WHERE id = :asiento_id 
  AND version = :version_actual
  AND estado = 'disponible';

-- Si afecta 0 filas, el asiento ya fue reservado por otro usuario
```

### 5.2 Liberación Automática de Asientos

**Job ejecutado cada minuto:**

```php
// app/Jobs/ReleaseExpiredSeatsJob.php
Asiento::where('estado', 'reservado')
    ->where('reservado_hasta', '<', now())
    ->update([
        'estado' => 'disponible',
        'reservado_hasta' => null
    ]);
```

---

## 6. Seeders

### 6.1 Orden de Ejecución

```php
// database/seeders/DatabaseSeeder.php
$this->call([
    CiudadSeeder::class,           // 15 ciudades
    ModeloAeronaveSeeder::class,   // 4 modelos
    AeronaveSeeder::class,         // 8 aeronaves
    VueloSeeder::class,            // 976 vuelos
    AsientoSeeder::class,          // 125,734 asientos
]);
```

### 6.2 Datos de Prueba

```bash
php artisan migrate:fresh --seed
```

**Resultado:**
- ✅ 15 ciudades colombianas
- ✅ 4 modelos de aeronaves
- ✅ 8 aeronaves en la flota
- ✅ 976 vuelos (próximos 60 días)
- ✅ 125,734 asientos disponibles

---

## 7. Consultas Frecuentes Optimizadas

### 7.1 Búsqueda de Vuelos

```sql
SELECT v.*, 
       co.ciudad AS ciudad_origen, co.codigo_iata AS codigo_origen,
       cd.ciudad AS ciudad_destino, cd.codigo_iata AS codigo_destino,
       a.matricula, m.nombre AS modelo
FROM vuelos v
INNER JOIN ciudades co ON v.ciudad_origen_id = co.id
INNER JOIN ciudades cd ON v.ciudad_destino_id = cd.id
INNER JOIN aeronaves a ON v.aeronave_id = a.id
INNER JOIN modelos_aeronave m ON a.modelo_id = m.id
WHERE v.ciudad_origen_id = :origen
  AND v.ciudad_destino_id = :destino
  AND v.fecha_salida = :fecha
  AND v.asientos_disponibles > 0
  AND v.estado = 'programado'
ORDER BY v.hora_salida ASC;
```

### 7.2 Historial de Reservas de Usuario

```sql
SELECT r.*, p.nombre_completo, pa.estado AS pago_estado
FROM reservas r
INNER JOIN pagadores p ON r.pagador_id = p.id
LEFT JOIN pagos pa ON r.id = pa.reserva_id
WHERE p.correo = :email
ORDER BY r.created_at DESC;
```

---

## 8. Backup y Mantenimiento

### 8.1 Backup Diario

```bash
mysqldump -u usuario -p airguider > backup_$(date +%Y%m%d).sql
```

### 8.2 Limpieza de Reservas Expiradas

```sql
DELETE FROM reservas 
WHERE estado = 'pendiente' 
  AND fecha_expiracion < NOW();
```

---

## 9. Conclusiones

El diseño de base de datos implementado garantiza:

- ✅ **Integridad referencial** con foreign keys
- ✅ **Control de concurrencia** con optimistic locking
- ✅ **Optimización de consultas** con índices compuestos
- ✅ **Escalabilidad** con arquitectura normalizada
- ✅ **Mantenimiento automático** con jobs programados

**Tecnologías:** MySQL 8.0+, Laravel 12, Eloquent ORM

**Demo:** [https://airguide.clubgestion.com/](https://airguide.clubgestion.com/)

---

**Documento actualizado:** 2025-10-23  
**Versión:** 2.0
        RESERVA ---|"1..*"| TIQUETE
        PAGADOR ---|"1..*"| RESERVA
        ASIENTO ---|"0..1"| PASAJERO_ASIENTO
        PASAJERO ---|"0..*"| PASAJERO_ASIENTO
        ASIENTO ---|"0..1"| TIQUETE
        PASAJERO ---|"0..*"| TIQUETE
```

## 3. Definición detallada de tablas

### 3.1 Tabla: `ciudades`

Almacena las ciudades disponibles para origen/destino de vuelos.

```sql
CREATE TABLE ciudades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo_iata VARCHAR(3) NOT NULL UNIQUE,
    pais VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_ciudad_nombre (nombre),
    INDEX idx_ciudad_iata (codigo_iata)
);
```

**Datos de ejemplo:**
```sql
INSERT INTO ciudades (nombre, codigo_iata, pais) VALUES
('Bogotá', 'BOG', 'Colombia'),
('Medellín', 'MDE', 'Colombia'),
('Cali', 'CLO', 'Colombia'),
('Cartagena', 'CTG', 'Colombia'),
('Barranquilla', 'BAQ', 'Colombia'),
('Santa Marta', 'SMR', 'Colombia');
```

### 3.2 Tabla: `aeropuertos` (opcional)

```sql
CREATE TABLE aeropuertos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    ciudad_id INTEGER NOT NULL REFERENCES ciudades(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_aeropuerto_ciudad (ciudad_id)
);
```

### 3.3 Tabla: `modelos_aeronave`

Define los modelos de avión y su capacidad.

```sql
CREATE TABLE modelos_aeronave (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fabricante VARCHAR(100) NOT NULL,
    capacidad_total INTEGER NOT NULL CHECK (capacidad_total > 0),
    filas INTEGER NOT NULL,
    asientos_por_fila INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_capacidad CHECK (capacidad_total = filas * asientos_por_fila)
);
```

**Datos de ejemplo:**
```sql
INSERT INTO modelos_aeronave (nombre, fabricante, capacidad_total, filas, asientos_por_fila) VALUES
('Boeing 737-800', 'Boeing', 180, 30, 6),
('Airbus A320', 'Airbus', 150, 25, 6),
('Embraer E190', 'Embraer', 100, 25, 4),
('ATR 72-600', 'ATR', 72, 18, 4);
```

### 3.4 Tabla: `aeronaves`

Aeronaves específicas de la flota.

```sql
CREATE TABLE aeronaves (
    id SERIAL PRIMARY KEY,
    modelo_id INTEGER NOT NULL REFERENCES modelos_aeronave(id),
    matricula VARCHAR(20) NOT NULL UNIQUE,
    anio_fabricacion INTEGER,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'mantenimiento', 'fuera_servicio')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_aeronave_modelo (modelo_id),
    INDEX idx_aeronave_estado (estado)
);
```

### 3.5 Tabla: `vuelos`

Información de vuelos programados.

```sql
CREATE TABLE vuelos (
    id SERIAL PRIMARY KEY,
    codigo_vuelo VARCHAR(10) NOT NULL,
    origen_ciudad_id INTEGER NOT NULL REFERENCES ciudades(id),
    destino_ciudad_id INTEGER NOT NULL REFERENCES ciudades(id),
    aeronave_id INTEGER NOT NULL REFERENCES aeronaves(id),
    fecha_salida DATE NOT NULL,
    hora_salida TIME NOT NULL,
    fecha_llegada DATE NOT NULL,
    hora_llegada TIME NOT NULL,
    precio_base DECIMAL(10,2) NOT NULL CHECK (precio_base > 0),
    capacidad_total INTEGER NOT NULL,
    asientos_disponibles INTEGER NOT NULL,
    estado VARCHAR(20) DEFAULT 'programado' CHECK (estado IN ('programado', 'en_vuelo', 'completado', 'cancelado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_origen_destino CHECK (origen_ciudad_id != destino_ciudad_id),
    CONSTRAINT chk_fecha_llegada CHECK (fecha_llegada >= fecha_salida),
    CONSTRAINT chk_asientos CHECK (asientos_disponibles >= 0 AND asientos_disponibles <= capacidad_total),
    
    INDEX idx_vuelo_origen_destino_fecha (origen_ciudad_id, destino_ciudad_id, fecha_salida),
    INDEX idx_vuelo_fecha (fecha_salida),
    INDEX idx_vuelo_codigo (codigo_vuelo),
    INDEX idx_vuelo_estado (estado)
);
```

**Trigger para actualizar disponibilidad:**
```sql
CREATE OR REPLACE FUNCTION actualizar_asientos_disponibles()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE vuelos
    SET asientos_disponibles = capacidad_total - (
        SELECT COUNT(*) FROM asientos 
        WHERE vuelo_id = NEW.vuelo_id 
        AND estado IN ('reservado', 'emitido')
    )
    WHERE id = NEW.vuelo_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_disponibilidad
AFTER INSERT OR UPDATE OF estado ON asientos
FOR EACH ROW
EXECUTE FUNCTION actualizar_asientos_disponibles();
```

### 3.6 Tabla: `asientos`

Control de asientos por vuelo con versionado para concurrencia.

```sql
CREATE TABLE asientos (
    id SERIAL PRIMARY KEY,
    vuelo_id INTEGER NOT NULL REFERENCES vuelos(id) ON DELETE CASCADE,
    numero VARCHAR(10) NOT NULL,
    clase VARCHAR(20) DEFAULT 'economica' CHECK (clase IN ('economica', 'ejecutiva', 'primera')),
    estado VARCHAR(20) DEFAULT 'disponible' CHECK (estado IN ('disponible', 'reservado', 'emitido', 'bloqueado')),
    version INTEGER DEFAULT 0 NOT NULL,  -- Para optimistic locking
    reserva_id INTEGER REFERENCES reservas(id) ON DELETE SET NULL,
    reservado_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (vuelo_id, numero),
    
    INDEX idx_asiento_vuelo_estado (vuelo_id, estado),
    INDEX idx_asiento_reserva (reserva_id)
);
```

**Trigger para generar asientos al crear vuelo:**
```sql
CREATE OR REPLACE FUNCTION generar_asientos_vuelo()
RETURNS TRIGGER AS $$
DECLARE
    modelo_rec RECORD;
    fila INTEGER;
    col INTEGER;
    letra CHAR;
BEGIN
    -- Obtener configuración del modelo
    SELECT m.filas, m.asientos_por_fila
    INTO modelo_rec
    FROM modelos_aeronave m
    JOIN aeronaves a ON a.modelo_id = m.id
    WHERE a.id = NEW.aeronave_id;
    
    -- Generar asientos
    FOR fila IN 1..modelo_rec.filas LOOP
        FOR col IN 1..modelo_rec.asientos_por_fila LOOP
            letra := CHR(64 + col);  -- A, B, C, D, E, F
            INSERT INTO asientos (vuelo_id, numero, clase)
            VALUES (NEW.id, fila || letra, 'economica');
        END LOOP;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_asientos
AFTER INSERT ON vuelos
FOR EACH ROW
EXECUTE FUNCTION generar_asientos_vuelo();
```

### 3.7 Tabla: `pagadores`

Información del pagador de la reserva.

```sql
CREATE TABLE pagadores (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(200) NOT NULL,
    tipo_documento VARCHAR(20) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'Pasaporte', 'TI')),
    numero_documento VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_pagador_documento (tipo_documento, numero_documento)
);
```

### 3.8 Tabla: `reservas`

Reservas realizadas por los usuarios.

```sql
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    codigo_unico VARCHAR(8) NOT NULL UNIQUE,  -- Ej: "AB12CD34"
    pagador_id INTEGER NOT NULL REFERENCES pagadores(id),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagada', 'confirmada', 'cancelada', 'expirada')),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    cantidad_pasajeros INTEGER NOT NULL CHECK (cantidad_pasajeros BETWEEN 1 AND 5),
    terminos_aceptados BOOLEAN DEFAULT FALSE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL,  -- 5 minutos después de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_reserva_codigo (codigo_unico),
    INDEX idx_reserva_estado (estado),
    INDEX idx_reserva_fecha_creacion (fecha_creacion),
    INDEX idx_reserva_expiracion (fecha_expiracion, estado)
);
```

**Función para generar código único:**
```sql
CREATE OR REPLACE FUNCTION generar_codigo_reserva()
RETURNS TRIGGER AS $$
BEGIN
    NEW.codigo_unico := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    NEW.fecha_expiracion := CURRENT_TIMESTAMP + INTERVAL '5 minutes';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_codigo_reserva
BEFORE INSERT ON reservas
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_reserva();
```

**Job para liberar reservas expiradas:**
```sql
-- Ejecutar periódicamente (cada minuto)
CREATE OR REPLACE FUNCTION liberar_reservas_expiradas()
RETURNS void AS $$
BEGIN
    -- Actualizar asientos a disponible
    UPDATE asientos
    SET estado = 'disponible', 
        reserva_id = NULL,
        reservado_at = NULL
    WHERE reserva_id IN (
        SELECT id FROM reservas 
        WHERE estado = 'pendiente' 
        AND fecha_expiracion < CURRENT_TIMESTAMP
    );
    
    -- Marcar reservas como expiradas
    UPDATE reservas
    SET estado = 'expirada'
    WHERE estado = 'pendiente'
    AND fecha_expiracion < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;
```

### 3.9 Tabla: `reservas_vuelos`

Relación muchos a muchos entre reservas y vuelos (para ida y regreso).

```sql
CREATE TABLE reservas_vuelos (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    vuelo_id INTEGER NOT NULL REFERENCES vuelos(id),
    tipo_viaje VARCHAR(10) CHECK (tipo_viaje IN ('ida', 'regreso')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (reserva_id, vuelo_id),
    INDEX idx_reserva_vuelo (reserva_id, vuelo_id)
);
```

### 3.10 Tabla: `pasajeros`

Datos de los pasajeros en cada reserva.

```sql
CREATE TABLE pasajeros (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    primer_apellido VARCHAR(100) NOT NULL,
    segundo_apellido VARCHAR(100),
    nombres VARCHAR(200) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero VARCHAR(20) CHECK (genero IN ('M', 'F', 'Otro')),
    tipo_documento VARCHAR(20) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'Pasaporte', 'TI', 'RC')),
    numero_documento VARCHAR(50) NOT NULL,
    es_infante BOOLEAN DEFAULT FALSE,  -- Menor de 3 años
    celular VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_pasajero_reserva (reserva_id),
    INDEX idx_pasajero_documento (tipo_documento, numero_documento)
);
```

**Trigger para validar edad de infante:**
```sql
CREATE OR REPLACE FUNCTION validar_infante()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.es_infante THEN
        IF (CURRENT_DATE - NEW.fecha_nacimiento) > INTERVAL '3 years' THEN
            RAISE EXCEPTION 'Un pasajero marcado como infante debe tener menos de 3 años';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_infante
BEFORE INSERT OR UPDATE ON pasajeros
FOR EACH ROW
EXECUTE FUNCTION validar_infante();
```

### 3.11 Tabla: `pasajeros_asientos`

Asignación de asientos a pasajeros específicos.

```sql
CREATE TABLE pasajeros_asientos (
    id SERIAL PRIMARY KEY,
    pasajero_id INTEGER NOT NULL REFERENCES pasajeros(id) ON DELETE CASCADE,
    asiento_id INTEGER NOT NULL REFERENCES asientos(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (pasajero_id, asiento_id),
    UNIQUE (asiento_id),  -- Un asiento solo puede estar asignado a un pasajero
    
    INDEX idx_pasajero_asiento (pasajero_id),
    INDEX idx_asiento_pasajero (asiento_id)
);
```

### 3.12 Tabla: `pagos`

Registro de transacciones de pago (simuladas).

```sql
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('tarjeta_credito', 'tarjeta_debito', 'pse')),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado', 'anulado')),
    referencia VARCHAR(50) UNIQUE,
    monto DECIMAL(10,2) NOT NULL,
    datos_pago_json JSONB,  -- Datos adicionales del pago (últimos 4 dígitos, banco, etc.)
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_pago_reserva (reserva_id),
    INDEX idx_pago_estado (estado),
    INDEX idx_pago_referencia (referencia)
);
```

**Función para generar referencia de pago:**
```sql
CREATE OR REPLACE FUNCTION generar_referencia_pago()
RETURNS TRIGGER AS $$
BEGIN
    NEW.referencia := 'PAY-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || 
                      LPAD(nextval('seq_pago_referencia')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE seq_pago_referencia START 1;

CREATE TRIGGER trg_referencia_pago
BEFORE INSERT ON pagos
FOR EACH ROW
EXECUTE FUNCTION generar_referencia_pago();
```

### 3.13 Tabla: `tiquetes`

Tiquetes electrónicos generados.

```sql
CREATE TABLE tiquetes (
    id SERIAL PRIMARY KEY,
    codigo_tiquete VARCHAR(16) NOT NULL UNIQUE,  -- Ej: "TKT-AB12CD34-001"
    reserva_id INTEGER NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    pasajero_id INTEGER NOT NULL REFERENCES pasajeros(id) ON DELETE CASCADE,
    vuelo_id INTEGER NOT NULL REFERENCES vuelos(id),
    asiento_id INTEGER NOT NULL REFERENCES asientos(id),
    formato VARCHAR(10) CHECK (formato IN ('pdf', 'json')),
    url_archivo TEXT,  -- URL del PDF en storage
    contenido_json JSONB,  -- Contenido estructurado del tiquete
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_tiquete_codigo (codigo_tiquete),
    INDEX idx_tiquete_reserva (reserva_id),
    INDEX idx_tiquete_pasajero (pasajero_id)
);
```

**Función para generar código de tiquete:**
```sql
CREATE OR REPLACE FUNCTION generar_codigo_tiquete()
RETURNS TRIGGER AS $$
DECLARE
    codigo_reserva VARCHAR(8);
    numero_secuencial INTEGER;
BEGIN
    SELECT codigo_unico INTO codigo_reserva
    FROM reservas WHERE id = NEW.reserva_id;
    
    SELECT COUNT(*) + 1 INTO numero_secuencial
    FROM tiquetes WHERE reserva_id = NEW.reserva_id;
    
    NEW.codigo_tiquete := 'TKT-' || codigo_reserva || '-' || LPAD(numero_secuencial::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_codigo_tiquete
BEFORE INSERT ON tiquetes
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_tiquete();
```

## 4. Índices adicionales para optimización

```sql
-- Índices compuestos para búsquedas frecuentes
CREATE INDEX idx_vuelo_busqueda ON vuelos (origen_ciudad_id, destino_ciudad_id, fecha_salida, estado);
CREATE INDEX idx_vuelo_disponibilidad ON vuelos (fecha_salida, asientos_disponibles) WHERE estado = 'programado';

-- Índices parciales
CREATE INDEX idx_asientos_disponibles ON asientos (vuelo_id) WHERE estado = 'disponible';
CREATE INDEX idx_reservas_activas ON reservas (fecha_expiracion) WHERE estado = 'pendiente';

-- Índices para reportes
CREATE INDEX idx_pago_fecha ON pagos (fecha_pago, estado);
CREATE INDEX idx_reserva_fecha ON reservas (fecha_creacion, estado);
```

## 5. Vistas útiles

### 5.1 Vista de vuelos disponibles

```sql
CREATE VIEW vista_vuelos_disponibles AS
SELECT 
    v.id,
    v.codigo_vuelo,
    co.nombre AS ciudad_origen,
    co.codigo_iata AS origen_iata,
    cd.nombre AS ciudad_destino,
    cd.codigo_iata AS destino_iata,
    v.fecha_salida,
    v.hora_salida,
    v.fecha_llegada,
    v.hora_llegada,
    v.precio_base,
    v.asientos_disponibles,
    ma.nombre AS modelo_aeronave,
    ma.capacidad_total
FROM vuelos v
JOIN ciudades co ON v.origen_ciudad_id = co.id
JOIN ciudades cd ON v.destino_ciudad_id = cd.id
JOIN aeronaves a ON v.aeronave_id = a.id
JOIN modelos_aeronave ma ON a.modelo_id = ma.id
WHERE v.estado = 'programado'
  AND v.asientos_disponibles > 0
  AND v.fecha_salida >= CURRENT_DATE;
```

### 5.2 Vista de reservas completas

```sql
CREATE VIEW vista_reservas_completas AS
SELECT 
    r.id AS reserva_id,
    r.codigo_unico,
    r.estado AS estado_reserva,
    r.total,
    r.cantidad_pasajeros,
    r.fecha_creacion,
    pg.nombre_completo AS pagador,
    pg.correo AS correo_pagador,
    COUNT(DISTINCT p.id) AS total_pasajeros,
    COUNT(DISTINCT rv.vuelo_id) AS total_vuelos,
    MAX(pa.estado) AS estado_pago
FROM reservas r
JOIN pagadores pg ON r.pagador_id = pg.id
LEFT JOIN pasajeros p ON p.reserva_id = r.id
LEFT JOIN reservas_vuelos rv ON rv.reserva_id = r.id
LEFT JOIN pagos pa ON pa.reserva_id = r.id
GROUP BY r.id, r.codigo_unico, r.estado, r.total, r.cantidad_pasajeros, 
         r.fecha_creacion, pg.nombre_completo, pg.correo;
```

## 6. Estrategia de control de concurrencia

### 6.1 Reserva de asientos con optimistic locking

```sql
-- Función para reservar asiento
CREATE OR REPLACE FUNCTION reservar_asiento(
    p_asiento_id INTEGER,
    p_reserva_id INTEGER,
    p_version_actual INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    filas_afectadas INTEGER;
BEGIN
    UPDATE asientos
    SET 
        estado = 'reservado',
        reserva_id = p_reserva_id,
        reservado_at = CURRENT_TIMESTAMP,
        version = version + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE 
        id = p_asiento_id
        AND estado = 'disponible'
        AND version = p_version_actual;
    
    GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
    
    RETURN filas_afectadas > 0;
END;
$$ LANGUAGE plpgsql;
```

### 6.2 Confirmar reserva y emitir tiquetes

```sql
CREATE OR REPLACE FUNCTION confirmar_reserva_y_emitir(
    p_reserva_id INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Iniciar transacción implícita
    
    -- Actualizar estado de reserva
    UPDATE reservas
    SET estado = 'confirmada',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_reserva_id
      AND estado = 'pendiente';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Reserva no encontrada o ya confirmada';
    END IF;
    
    -- Actualizar asientos a emitido
    UPDATE asientos
    SET estado = 'emitido',
        updated_at = CURRENT_TIMESTAMP
    WHERE reserva_id = p_reserva_id
      AND estado = 'reservado';
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

## 7. Procedimientos almacenados útiles

### 7.1 Buscar vuelos disponibles

```sql
CREATE OR REPLACE FUNCTION buscar_vuelos(
    p_origen_id INTEGER,
    p_destino_id INTEGER,
    p_fecha_salida DATE,
    p_pasajeros INTEGER DEFAULT 1
)
RETURNS TABLE (
    vuelo_id INTEGER,
    codigo_vuelo VARCHAR,
    ciudad_origen VARCHAR,
    ciudad_destino VARCHAR,
    fecha_salida DATE,
    hora_salida TIME,
    precio_base DECIMAL,
    asientos_disponibles INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.codigo_vuelo,
        co.nombre,
        cd.nombre,
        v.fecha_salida,
        v.hora_salida,
        v.precio_base,
        v.asientos_disponibles
    FROM vuelos v
    JOIN ciudades co ON v.origen_ciudad_id = co.id
    JOIN ciudades cd ON v.destino_ciudad_id = cd.id
    WHERE v.origen_ciudad_id = p_origen_id
      AND v.destino_ciudad_id = p_destino_id
      AND v.fecha_salida = p_fecha_salida
      AND v.estado = 'programado'
      AND v.asientos_disponibles >= p_pasajeros
    ORDER BY v.hora_salida;
END;
$$ LANGUAGE plpgsql;
```

### 7.2 Crear reserva completa (transaccional)

```sql
CREATE OR REPLACE FUNCTION crear_reserva_completa(
    p_pagador_json JSONB,
    p_pasajeros_json JSONB,
    p_vuelos_json JSONB,
    p_asientos_json JSONB,
    p_total DECIMAL
)
RETURNS VARCHAR AS $$  -- Retorna código de reserva
DECLARE
    v_pagador_id INTEGER;
    v_reserva_id INTEGER;
    v_codigo_reserva VARCHAR(8);
    v_pasajero JSONB;
    v_vuelo JSONB;
    v_asiento JSONB;
    v_pasajero_id INTEGER;
BEGIN
    -- 1. Insertar pagador
    INSERT INTO pagadores (nombre_completo, tipo_documento, numero_documento, correo, telefono)
    VALUES (
        p_pagador_json->>'nombre_completo',
        p_pagador_json->>'tipo_documento',
        p_pagador_json->>'numero_documento',
        p_pagador_json->>'correo',
        p_pagador_json->>'telefono'
    )
    RETURNING id INTO v_pagador_id;
    
    -- 2. Crear reserva
    INSERT INTO reservas (pagador_id, total, cantidad_pasajeros, terminos_aceptados)
    VALUES (
        v_pagador_id,
        p_total,
        jsonb_array_length(p_pasajeros_json),
        TRUE
    )
    RETURNING id, codigo_unico INTO v_reserva_id, v_codigo_reserva;
    
    -- 3. Insertar vuelos de la reserva
    FOR v_vuelo IN SELECT * FROM jsonb_array_elements(p_vuelos_json)
    LOOP
        INSERT INTO reservas_vuelos (reserva_id, vuelo_id, tipo_viaje)
        VALUES (
            v_reserva_id,
            (v_vuelo->>'vuelo_id')::INTEGER,
            v_vuelo->>'tipo_viaje'
        );
    END LOOP;
    
    -- 4. Insertar pasajeros y reservar asientos
    FOR v_pasajero IN SELECT * FROM jsonb_array_elements(p_pasajeros_json)
    LOOP
        INSERT INTO pasajeros (
            reserva_id, primer_apellido, segundo_apellido, nombres,
            fecha_nacimiento, genero, tipo_documento, numero_documento,
            es_infante, celular, correo
        )
        VALUES (
            v_reserva_id,
            v_pasajero->>'primer_apellido',
            v_pasajero->>'segundo_apellido',
            v_pasajero->>'nombres',
            (v_pasajero->>'fecha_nacimiento')::DATE,
            v_pasajero->>'genero',
            v_pasajero->>'tipo_documento',
            v_pasajero->>'numero_documento',
            (v_pasajero->>'es_infante')::BOOLEAN,
            v_pasajero->>'celular',
            v_pasajero->>'correo'
        )
        RETURNING id INTO v_pasajero_id;
        
        -- Reservar asiento para este pasajero
        -- (Aquí iría la lógica de asignación de asiento específica)
    END LOOP;
    
    -- 5. Reservar asientos
    FOR v_asiento IN SELECT * FROM jsonb_array_elements(p_asientos_json)
    LOOP
        UPDATE asientos
        SET estado = 'reservado',
            reserva_id = v_reserva_id,
            reservado_at = CURRENT_TIMESTAMP,
            version = version + 1
        WHERE id = (v_asiento->>'asiento_id')::INTEGER
          AND estado = 'disponible';
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Asiento % no disponible', v_asiento->>'asiento_id';
        END IF;
    END LOOP;
    
    RETURN v_codigo_reserva;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;
```

## 8. Datos de prueba (seeds)

```sql
-- Script completo en: scripts/seeds.sql

-- Ciudades
INSERT INTO ciudades (nombre, codigo_iata, pais) VALUES
('Bogotá', 'BOG', 'Colombia'),
('Medellín', 'MDE', 'Colombia'),
('Cali', 'CLO', 'Colombia'),
('Cartagena', 'CTG', 'Colombia');

-- Modelos de aeronave
INSERT INTO modelos_aeronave (nombre, fabricante, capacidad_total, filas, asientos_por_fila) VALUES
('Boeing 737-800', 'Boeing', 180, 30, 6),
('Airbus A320', 'Airbus', 150, 25, 6);

-- Aeronaves
INSERT INTO aeronaves (modelo_id, matricula, anio_fabricacion) VALUES
(1, 'HK-5050', 2018),
(2, 'HK-5100', 2020);

-- Vuelos (próximos 30 días)
-- Ver script completo para múltiples vuelos
```

## 9. Backup y mantenimiento

### 9.1 Estrategia de backup
- **Backup completo**: Diario a las 02:00 AM
- **Backup incremental**: Cada 6 horas
- **Retención**: 30 días de backups

### 9.2 Jobs de mantenimiento
```sql
-- Ejecutar diariamente
VACUUM ANALYZE vuelos;
VACUUM ANALYZE asientos;
VACUUM ANALYZE reservas;

-- Limpiar reservas expiradas (ejecutar cada hora)
SELECT liberar_reservas_expiradas();

-- Archivar reservas antiguas (ejecutar mensualmente)
-- Mover reservas completadas con más de 90 días a tabla de archivo
```

## 10. Consideraciones de escalabilidad

### 10.1 Particionamiento (futuro)
- Particionar tabla `vuelos` por fecha
- Particionar tabla `reservas` por mes
- Particionar tabla `tiquetes` por año

### 10.2 Réplicas de lectura
- Configurar réplica read-only para consultas de búsqueda
- Master para escrituras (reservas, pagos)

### 10.3 Archivado
- Mover vuelos completados a tabla de archivo después de 6 meses
- Mover reservas antiguas después de 1 año

---

## Resumen

Este diseño de base de datos proporciona:
- ✅ Integridad referencial completa
- ✅ Control de concurrencia con optimistic locking
- ✅ Triggers automáticos para generación de datos
- ✅ Vistas optimizadas para consultas frecuentes
- ✅ Procedimientos almacenados para operaciones complejas
- ✅ Índices estratégicos para rendimiento
- ✅ Validaciones a nivel de BD
- ✅ Auditoría básica con timestamps

**Próximos pasos:**
1. Ejecutar scripts DDL en entorno de desarrollo
2. Cargar datos de prueba (seeds)
3. Implementar tests de concurrencia
4. Optimizar consultas según métricas reales
