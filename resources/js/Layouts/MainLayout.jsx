import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
    UserIcon, 
    EnvelopeIcon, 
    PhoneIcon 
} from '@heroicons/react/24/outline';

export default function MainLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar */}
            <nav className="bg-primary-600 shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-3">
                                <img 
                                    src="/image/logo.png" 
                                    alt="AirGuider" 
                                    className="h-12 w-auto"
                                />
                                <span className="text-2xl font-bold text-white">
                                    AirGuider
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link 
                                href="/" 
                                className="text-white hover:text-secondary-300 px-3 py-2 rounded-md text-base font-medium transition-colors"
                            >
                                Inicio
                            </Link>
                            <Link 
                                href="/mis-viajes" 
                                className="text-white hover:text-secondary-300 px-3 py-2 rounded-md text-base font-medium transition-colors"
                            >
                                Mis Viajes
                            </Link>
                            <Link 
                                href="/contacto" 
                                className="text-white hover:text-secondary-300 px-3 py-2 rounded-md text-base font-medium transition-colors"
                            >
                                Contacto
                            </Link>
                            
                            {/* User Menu */}
                            {auth?.user ? (
                                <div className="flex items-center space-x-3">
                                    <span className="text-white">
                                        Hola, {auth.user.name}
                                    </span>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="text-white hover:text-secondary-300"
                                    >
                                        Salir
                                    </Link>
                                </div>
                            ) : (
                                <Link 
                                    href={route('login')} 
                                    className="flex items-center space-x-2 bg-secondary-500 text-white px-4 py-2 rounded-lg hover:bg-secondary-600 transition-colors shadow-lg"
                                >
                                    <UserIcon className="w-5 h-5" />
                                    <span>Iniciar Sesión</span>
                                </Link>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-secondary-300 hover:bg-primary-700 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-primary-700">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-primary-600">
                            <Link
                                href="/"
                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-secondary-300 hover:bg-primary-700"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/mis-viajes"
                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-secondary-300 hover:bg-primary-700"
                            >
                                Mis Viajes
                            </Link>
                            <Link
                                href="/contacto"
                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-secondary-300 hover:bg-primary-700"
                            >
                                Contacto
                            </Link>
                            {!auth?.user && (
                                <Link
                                    href={route('login')}
                                    className="block px-3 py-2 rounded-md text-base font-medium bg-secondary-500 text-white hover:bg-secondary-600"
                                >
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-primary-700 text-white mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Logo y descripción */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <img 
                                    src="/image/logo.png" 
                                    alt="AirGuider" 
                                    className="h-10 w-auto"
                                />
                                <span className="text-xl font-bold">AirGuider</span>
                            </div>
                            <p className="text-primary-100 text-sm">
                                Tu compañero de viaje para encontrar los mejores vuelos al mejor precio.
                            </p>
                        </div>

                        {/* Enlaces rápidos */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/terminos-condiciones" className="text-primary-100 hover:text-white transition-colors">
                                        Términos y Condiciones
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contacto" className="text-primary-100 hover:text-white transition-colors">
                                        Contacto
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contacto */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                            <ul className="space-y-2 text-primary-100 text-sm">
                                <li className="flex items-center space-x-2">
                                    <EnvelopeIcon className="w-5 h-5" />
                                    <span>info@airguider.com</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <PhoneIcon className="w-5 h-5" />
                                    <span>+57 300 123 4567</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-8 pt-8 border-t border-primary-600 text-center text-primary-100 text-sm">
                        <p>&copy; {new Date().getFullYear()} AirGuider - SENASOFT 2025. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

