# Sistema para Compra de Tiquetes Aéreos – Análisis de Requerimientos

Documento: versión 1.0  •  Fecha: 2025-10-21

## 1. Resumen ejecutivo
Se requiere diseñar e implementar una aplicación web para la compra de tiquetes aéreos que gestione vuelos, asientos, pasajeros y pagos simulados. El sistema debe garantizar integridad de datos y control de concurrencia, evitando venta doble de asientos y respetando la capacidad definida por el modelo de avión. Se evaluará arquitectura, buenas prácticas, control de versiones (GitFlow) y experiencia de usuario; el despliegue es opcional con puntaje adicional.

## 2. Objetivo general
Diseñar e implementar una aplicación/sistema que permita buscar vuelos, registrar pasajeros, seleccionar asientos y realizar un pago simulado, asegurando la integridad de los datos, la usabilidad y el control de concurrencia.

## 3. Objetivos específicos
- Implementar un buscador de vuelos con opción de solo ida o ida y regreso.
- Restringir fechas válidas desde el día actual hasta dos meses hacia adelante.
- Autocompletar las ciudades de origen y destino.
- Registrar hasta 5 pasajeros por compra.
- Controlar la concurrencia y la venta de asientos según la capacidad del modelo de avión.
- Simular el proceso de pago de manera controlada y segura (tarjeta crédito, débito, PSE).
- Generar tiquetes electrónicos (PDF o JSON) con código de reserva único.
- Permitir la confirmación y visualización de la reserva y mostrar mensajes claros de éxito y error.
- Mantener control de versiones con GitFlow y commits de todos los integrantes del equipo.
- Desplegar la solución en Internet (opcional, con puntaje adicional).

## 4. Alcance
Incluye:
- Módulos: búsqueda de vuelos, selección de vuelo y asientos, registro de pasajeros (máx. 5), simulación de pago, generación y visualización de tiquetes, confirmación de reserva.
- Reglas de negocio de capacidad y no-duplicidad de asientos.
- Validaciones de datos y fechas.
- Panel administrativo básico para ver vuelos y reservas (opcional).
- Registro/autenticación (opcional).

Fuera de alcance (para esta versión):
- Integraciones reales con pasarelas de pago.
- Integraciones con sistemas GDS/airlines reales.
- Programación de vuelos automatizada; se asumirán vuelos de ejemplo o cargados por semilla/admin.

## 5. Stakeholders y roles
- Usuario comprador: busca vuelos, selecciona asientos, registra pasajeros, paga y descarga tiquetes.
- Administrador (opcional): gestiona vuelos, aeronaves/modelos, consulta reservas.
- Equipo de desarrollo: análisis, diseño, backend, frontend, QA, despliegue.
- Jurado/cliente: evaluación funcional, técnica y de UX.

## 6. Supuestos y dependencias
- La oferta de vuelos y modelos de avión estará precargada o gestionada por un módulo administrativo simple.
- No se requieren pagos reales; la simulación definirá estados exitoso/rechazado con lógica controlada.
- Zona horaria única de referencia para validar fechas.
- Despliegue opcional en un servicio PaaS/IaaS (p. ej., Render, Vercel, Railway, Azure Web App).

## 7. Reglas de negocio clave
1) No se puede vender el mismo asiento más de una vez (control de concurrencia y locking transaccional).
2) No se puede superar la capacidad del vuelo; la capacidad deriva del modelo de avión asignado.
3) Máximo cinco (5) pasajeros por compra.
4) Fechas de viaje válidas: desde hoy hasta dos (2) meses adelante.
5) Generar código de reserva único por compra (p. ej., alfanumérico de 6–8 caracteres).

## 8. Requisitos funcionales
1) Búsqueda de vuelos
	- Seleccionar tipo de viaje: solo ida o ida y regreso.
	- Fechas válidas: desde hoy hasta 2 meses adelante.
	- Ciudades de origen y destino con autocompletado.

2) Selección de vuelo
	- Listar vuelos disponibles con origen, destino, fecha, hora, modelo de avión, capacidad y precio.
	- Controlar la capacidad según el modelo de avión asignado.
	- Bloquear la reserva si no hay asientos disponibles.

3) Datos de pasajeros
	- Máximo 5 pasajeros por compra.
	- Datos requeridos: primer apellido, segundo apellido, nombres, fecha de nacimiento, género, tipo y número de documento, condición de infante (menor de 3 años), celular y correo electrónico.

4) Datos del pagador
	- Nombre completo, tipo y número de documento, correo y teléfono.

5) Aceptación de términos y condiciones
	- Debe ser obligatoria antes de procesar el pago.

6) Simulación de pago
	- Opciones: tarjeta de crédito, débito o PSE.
	- Simulación visual del pago exitoso o rechazado.

7) Generación de tiquetes
	- Visualización y descarga del tiquete en PDF o JSON.
	- Mostrar código único de reserva, pasajeros, vuelo y asientos.

8) Confirmación de reserva
	- Mostrar resumen completo con código, pasajeros, vuelo, asientos y valor total.

## 9. Requisitos no funcionales / técnicos
- Concurrencia e integridad: evitar venta duplicada de asientos mediante transacciones/locks a nivel de asiento o reserva; idempotencia en la confirmación.
- Validación: del lado cliente y servidor; sanitización de entradas; mensajes claros de error.
- Seguridad básica: protección contra CSRF/XSS, no exponer datos sensibles; sin pagos reales.
- Rendimiento: respuesta < 2 s para búsquedas típicas; paginación cuando aplique.
- Disponibilidad: 99% en entorno de demo; manejo de errores con reintentos controlados.
- Usabilidad y accesibilidad: formularios claros, estados de carga, foco y etiquetas; mínimo WCAG AA básico.
- Logging y auditoría: registro de eventos clave (búsqueda, reserva, pago simulado, emisión de tiquete).
- Versionado: GitFlow (main, develop, feature/*); commits de todos los integrantes.
- Despliegue (opcional): build automatizable, variables de entorno, documentación de runbook.

## 10. Casos de uso principales (UC)
- UC-01 Buscar vuelos: el usuario ingresa origen, destino, fechas y tipo de viaje; el sistema muestra opciones válidas.
- UC-02 Seleccionar vuelo(s): el usuario elige uno (ida) o dos (ida y regreso); el sistema verifica capacidad.
- UC-03 Seleccionar asientos: el usuario ve el mapa de asientos disponible y elige por pasajero.
- UC-04 Registrar pasajeros: captura datos requeridos hasta 5 pasajeros; valida formatos y reglas.
- UC-05 Registrar pagador y aceptar T&C: llena datos del pagador y acepta términos obligatoriamente.
- UC-06 Simular pago: el usuario escoge medio; el sistema simula resultado y retorna aprobación o rechazo.
- UC-07 Generar tiquetes: si el pago es exitoso, el sistema genera tiquetes (PDF/JSON) y código único.
- UC-08 Confirmar y visualizar reserva: muestra resumen completo y permite descarga de tiquetes.

## 11. Modelo de datos (propuesta)
- Ciudad(id, nombre, país)
- Aeropuerto(id, código, nombre, ciudad_id) [opcional]
- ModeloAeronave(id, nombre, capacidad)
- Aeronave(id, modelo_id, matrícula)
- Vuelo(id, origen, destino, fecha, hora_salida, hora_llegada, aeronave_id, precio_base, capacidad_calculada)
- Asiento(id, vuelo_id, numero, clase, estado[disponible,reservado,emitido])
- Reserva(id, codigo_unico, estado[pending,paid,cancelled], total, fecha_creacion, pagador_id)
- Pasajero(id, reserva_id, primer_apellido, segundo_apellido, nombres, fecha_nac, genero, tipo_doc, num_doc, infante, celular, correo)
- Pagador(id, nombre_completo, tipo_doc, num_doc, correo, telefono)
- Pago(id, reserva_id, metodo[credito,debito,PSE], estado[aprobado,rechazado], referencia, fecha)
- Tiquete(id, reserva_id, pasajero_id, vuelo_id, asiento_id, formato[pdf,json], url_o_blob)

Notas:
- La capacidad del vuelo se deriva de ModeloAeronave.capacidad y se materializa en Asientos para cada vuelo.
- Control de concurrencia: reservar asiento cambia estado a "reservado" con TTL/timeout o dentro de transacción de compra.

## 12. Criterios de aceptación (extracto)
- Búsqueda: no permite fechas fuera del rango [hoy, hoy+2 meses]; origen ≠ destino; autocompletado disponible.
- Selección de vuelo: si capacidad = 0, el botón "Continuar" debe estar deshabilitado.
- Asientos: un asiento no puede pasar a "emitido" si ya está "emitido" por otra reserva; mostrar feedback en tiempo real.
- Pasajeros: validaciones de campos obligatorios y formato (correo, documento, fecha de nacimiento); máximo 5 registros.
- Pago simulado: mostrar estados exitoso/rechazado con mensajes y no emitir tiquetes si es rechazado.
- Tiquetes: tras pago exitoso, generar archivo(s) por pasajero con código de reserva y datos del vuelo y asiento.
- Confirmación: mostrar resumen con totales y enlaces de descarga; el código de reserva debe ser único.

## 13. Flujos alternos y errores
- Pago rechazado: permite reintentar con otro método; reserva queda pendiente y asientos vuelven a disponible tras timeout.
- Tiempo agotado en selección de asientos: liberar asientos y notificar al usuario.
- Concurrencia: en conflicto por asiento, informar y solicitar nueva selección.

## 14. Interfaz de usuario (secciones mínimas)
- Home/búsqueda de vuelos.
- Resultados y selección de vuelo(s).
- Selección de asientos por pasajero.
- Formulario de pasajeros y pagador + aceptación de T&C.
- Simulación de pago y resultado.
- Confirmación de reserva + descarga de tiquetes.
- (Opcional) Panel admin: vuelos, modelos, reservas.

## 15. Plan de trabajo sugerido
- Día 1 (Análisis y diseño): requerimientos, modelo de datos, arquitectura, mockups, setup del repo con GitFlow.
- Día 2 (Desarrollo inicial): UI/UX base, APIs para vuelos/asientos/reservas, lógica de concurrencia básica.
- Día 3 (Implementación y pruebas): completar funcionalidades faltantes, pruebas, despliegue opcional y demo.

## 16. Métricas de éxito
- 100% de los requisitos mínimos implementados.
- 0 incidencias de doble venta de asiento en pruebas concurrentes.
- Tiempo de respuesta de búsqueda < 2 s en dataset de prueba.
- Documentación clara y demo funcional.

## 17. Riesgos y mitigaciones
- Concurrencia insuficiente → usar transacciones/locks a nivel de asiento y pruebas de carrera.
- Complejidad de UI de asientos → partir en componentes y estados claros; pruebas de usabilidad tempranas.
- Tiempo limitado → priorizar alcance mínimo viable según rúbrica.

## 18. Control de versiones
- GitFlow: ramas main, develop, feature/*, release/*, hotfix/*; PRs revisados por el equipo y commits de todos.

---
Este documento resume y estructura los requerimientos del reto para guiar el diseño, la implementación y la evaluación.

