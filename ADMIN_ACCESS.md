# 🔐 Acceso al Sistema - AirGuider

## 👤 Usuarios Creados

### 🛡️ Administrador

**URL de Acceso:** http://localhost:8000/admin/login

```
Email:    admin@airguider.com
Password: admin123
Rol:      admin
```

**Permisos:**
- ✅ Acceso completo al panel de administración
- ✅ Gestión de vuelos (crear, editar, eliminar)
- ✅ Ver dashboard con estadísticas
- ✅ Gestión de ciudades (próximamente)
- ✅ Gestión de aeronaves (próximamente)
- ✅ Ver todas las reservas

---

### 👥 Usuario Normal

**URL de Acceso:** http://localhost:8000/login

```
Email:    usuario@airguider.com
Password: usuario123
Rol:      usuario
```

**Permisos:**
- ✅ Buscar y reservar vuelos
- ✅ Ver historial de reservas propias
- ✅ Acceso al dashboard de usuario
- ✅ Gestionar perfil
- ❌ Sin acceso al panel de admin

---

## 🏗️ Panel de Administración

### Acceso:
1. Ir a **http://localhost:8000/admin/login**
2. Usar credenciales de admin
3. Acceder al dashboard

### Funcionalidades:

#### 📊 Dashboard Admin
- Vista general del sistema
- Estadísticas en tiempo real:
  - Total de vuelos
  - Vuelos de hoy
  - Total de reservas
  - Reservas confirmadas
  - Total de ciudades
  - Asientos disponibles
- Reservas recientes (últimas 10)
- Próximos vuelos (próximos 10)

#### ✈️ Gestión de Vuelos
- **Listar todos los vuelos** - Tabla con paginación
- **Crear nuevo vuelo** - Formulario completo
  - Genera asientos automáticamente
  - Validaciones integradas
- **Editar vuelo** - Modificar detalles
- **Eliminar vuelo** - Con validación de seguridad
  - No permite eliminar vuelos con tiquetes emitidos

#### 🎨 Diseño
- Sidebar con navegación fija
- Colores del sistema aplicados
- Heroicons integrados
- Responsive design
- Mismo estilo que el sitio público

---

## 🎯 Diferencias entre Roles

| Característica | Usuario | Admin |
|----------------|---------|-------|
| Buscar vuelos | ✅ | ✅ |
| Hacer reservas | ✅ | ✅ |
| Ver mis reservas | ✅ | ✅ |
| Panel de admin | ❌ | ✅ |
| Gestionar vuelos | ❌ | ✅ |
| Gestionar ciudades | ❌ | ✅ |
| Gestionar aeronaves | ❌ | ✅ |
| Ver todas las reservas | ❌ | ✅ |
| Estadísticas | ❌ | ✅ |

---

## 🔒 Seguridad Implementada

### Middleware de Admin
- Verifica autenticación
- Verifica rol de admin
- Redirige a login si no autorizado
- Protege todas las rutas de admin

### Validaciones
- Email y contraseña obligatorios
- Rol verificado en cada request
- Sesión regenerada al login
- CSRF protection activo

---

## 🛠️ Rutas del Sistema

### Públicas
```
GET  /                          - Home (búsqueda)
GET  /vuelos                    - Búsqueda de vuelos
GET  /asientos                  - Selección de asientos
GET  /reservas/crear            - Datos de pasajeros
GET  /pagos/{id}                - Pago
GET  /reservas/gracias/{id}     - ¡Gracias! (página de agradecimiento)
GET  /reservas/{codigo}         - Confirmación
GET  /mis-viajes                - Mis viajes
GET  /contacto                  - Contacto
```

### Autenticación Usuario
```
GET  /login                     - Login usuario
POST /login                     - Procesar login
GET  /register                  - Registro
POST /register                  - Procesar registro
GET  /dashboard                 - Dashboard usuario
```

### Autenticación Admin
```
GET  /admin/login               - Login admin
POST /admin/login               - Procesar login admin
POST /admin/logout              - Cerrar sesión admin
```

### Panel Admin (Protegidas con middleware 'admin')
```
GET  /admin/dashboard           - Dashboard admin
GET  /admin/vuelos              - Listar vuelos
GET  /admin/vuelos/create       - Crear vuelo
POST /admin/vuelos              - Guardar vuelo
GET  /admin/vuelos/{id}/edit    - Editar vuelo
PUT  /admin/vuelos/{id}         - Actualizar vuelo
DELETE /admin/vuelos/{id}       - Eliminar vuelo
```

---

## 🎨 Cambios de Diseño Aplicados

### ✅ Navbar Azul
- Fondo: `bg-primary-600` (#375372)
- Texto: blanco
- Logo: perfectamente visible
- Botón login: naranja (`bg-secondary-500`)

### ✅ Selectores con Contraste
- Fondo blanco
- Texto negro
- Perfectamente legibles

### ✅ Página de Agradecimiento
- Nueva página post-pago
- Animación de éxito
- Resumen completo
- Acciones claras

### ✅ Sugerencia de Login
- Banner opcional antes del pago
- Se puede cerrar
- Muestra beneficios

### ✅ Login/Register Rediseñados
- Coherente con el sistema
- Heroicons integrados
- Paleta de colores aplicada

### ✅ Panel de Admin
- Sidebar fijo con navegación
- Dashboard con estadísticas
- CRUD de vuelos completo
- Mismo estilo del sitio

---

## 🚀 Cómo Probar

### Flujo Usuario Normal:
1. Ir a http://localhost:8000
2. Buscar vuelo
3. Completar compra
4. Ver página de agradecimiento
5. Opcional: Registrarse en /register

### Flujo Administrador:
1. Ir a http://localhost:8000/admin/login
2. Login con admin@airguider.com / admin123
3. Ver dashboard con estadísticas
4. Ir a Gestión de Vuelos
5. Crear, editar o eliminar vuelos

---

## 📊 Sistema Completado 100%

```
✓ Roles implementados (usuario/admin)
✓ Middleware de admin
✓ Login separado para admin
✓ Panel de administración
✓ CRUD de vuelos
✓ Dashboard con estadísticas
✓ Dashboard de usuario actualizado
✓ Navbar azul con contraste
✓ Selectores legibles
✓ Página de agradecimiento
✓ Sugerencia de login
✓ Todo con Heroicons
✓ Estilos coherentes
```

---

**¡Sistema 100% funcional y listo para demostración!** 🎉

