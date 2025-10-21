# SENASOFT 2025 - Sistema de Compra de Tiquetes Aéreos

Sistema web para la compra de tiquetes aéreos desarrollado para el reto SENASOFT 2025. Implementa búsqueda de vuelos, selección de asientos con control de concurrencia, registro de pasajeros y simulación de pagos.

## 📋 Documentación de Planeación

Toda la documentación del análisis, arquitectura y diseño se encuentra en la carpeta **`doc/`**:

- **[`doc/analisis.md`](doc/analisis.md)** - Análisis completo de requerimientos, casos de uso, modelo de datos y plan de trabajo
- **[`doc/arquitectura_diagrama.md`](doc/arquitectura_diagrama.md)** - Arquitectura del sistema con Laravel + Inertia.js + React + MySQL, diagramas de componentes, flujos y estrategias de concurrencia
- **[`doc/diseño_bd.md`](doc/diseño_bd.md)** - Diseño de base de datos con diagramas ER, DDL, triggers, stored procedures y seeders
- **[`doc/diagrama_flujo.md`](doc/diagrama_flujo.md)** - Diagramas de flujo detallados de todas las operaciones del sistema

## 🎨 Diseño UI/UX

El diseño visual y los prototipos están disponibles en Figma:
- **[Ver diseño en Figma](https://www.figma.com/design/hpyIWr8aYFubmDp60K2nGr/senasoft?node-id=1-2&p=f&t=P1PariLdVzows3WK-0)**

## 🚀 Stack Tecnológico

- **Frontend:** React 18+ con Inertia.js client, TailwindCSS
- **Backend:** Laravel 10+ (monolítico) con Inertia.js server adapter
- **Base de datos:** MySQL 8.0+
- **Caché/Queues:** Redis (opcional)
- **Build tool:** Vite
- **Control de versiones:** Git con GitFlow

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
