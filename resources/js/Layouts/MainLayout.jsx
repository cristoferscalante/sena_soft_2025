import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    UserCircleIcon,
    ChevronDownIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function MainLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 shadow-lg bg-primary-600">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-3">
                                <img
                                    src="/image/logo.png"
                                    alt="AirGuider"
                                    className="w-auto h-12"
                                />
                                <span className="text-2xl font-bold text-white">
                                    AirGuider
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="items-center hidden space-x-8 md:flex">
                            <Link
                                href="/"
                                className="px-3 py-2 text-base font-medium text-white transition-colors rounded-md hover:text-secondary-300"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/mis-viajes"
                                className="px-3 py-2 text-base font-medium text-white transition-colors rounded-md hover:text-secondary-300"
                            >
                                Mis Viajes
                            </Link>
                            <Link
                                href="/contacto"
                                className="px-3 py-2 text-base font-medium text-white transition-colors rounded-md hover:text-secondary-300"
                            >
                                Contacto
                            </Link>

                            {/* User Menu */}
                            {auth?.user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center space-x-2 text-white transition-colors hover:text-secondary-300"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 font-bold rounded-full bg-secondary-500">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium">{auth.user.name}</span>
                                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {userMenuOpen && (
                                        <div className="absolute right-0 z-50 w-56 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl">
                                            <div className="px-4 py-3 border-b border-gray-200">
                                                <p className="text-sm font-semibold text-gray-900">{auth.user.name}</p>
                                                <p className="text-xs text-gray-600 truncate">{auth.user.email}</p>
                                            </div>
                                            <Link
                                                href={route('profile.edit')}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                                            >
                                                <UserCircleIcon className="w-5 h-5 mr-3 text-gray-500" />
                                                Mi Perfil
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 transition-colors hover:bg-red-50"
                                            >
                                                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                                                Cerrar Sesión
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-lg shadow-lg bg-secondary-500 hover:bg-secondary-600"
                                >
                                    <UserIcon className="w-5 h-5" />
                                    <span>Iniciar Sesión</span>
                                </Link>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 text-white rounded-md hover:text-secondary-300 hover:bg-primary-700 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <div className="border-t md:hidden border-primary-700">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-primary-600">
                            <Link
                                href="/"
                                className="block px-3 py-2 text-base font-medium text-white rounded-md hover:text-secondary-300 hover:bg-primary-700"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/mis-viajes"
                                className="block px-3 py-2 text-base font-medium text-white rounded-md hover:text-secondary-300 hover:bg-primary-700"
                            >
                                Mis Viajes
                            </Link>
                            <Link
                                href="/contacto"
                                className="block px-3 py-2 text-base font-medium text-white rounded-md hover:text-secondary-300 hover:bg-primary-700"
                            >
                                Contacto
                            </Link>

                            {auth?.user ? (
                                <>
                                    <div className="px-3 py-2 mt-2 border-t border-primary-700">
                                        <p className="text-sm text-primary-100">Sesión iniciada como</p>
                                        <p className="font-semibold text-white">{auth.user.name}</p>
                                    </div>
                                    <Link
                                        href={route('profile.edit')}
                                        className="flex items-center px-3 py-2 text-base font-medium text-white rounded-md hover:text-secondary-300 hover:bg-primary-700"
                                    >
                                        <UserCircleIcon className="w-5 h-5 mr-2" />
                                        Mi Perfil
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex items-center w-full px-3 py-2 text-base font-medium text-left text-white rounded-md hover:bg-red-600"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                                        Cerrar Sesión
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="block px-3 py-2 text-base font-medium text-white rounded-md bg-secondary-500 hover:bg-secondary-600"
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
            <footer className="mt-auto text-white bg-primary-700">
                <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Logo y descripción */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <img
                                    src="/image/logo.png"
                                    alt="AirGuider"
                                    className="w-auto h-10"
                                />
                                <span className="text-xl font-bold">AirGuider</span>
                            </div>
                            <p className="text-sm text-primary-100">
                                Tu compañero de viaje para encontrar los mejores vuelos al mejor precio.
                            </p>
                        </div>

                        {/* Enlaces rápidos */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Enlaces</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/terminos-condiciones" className="transition-colors text-primary-100 hover:text-white">
                                        Términos y Condiciones
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contacto" className="transition-colors text-primary-100 hover:text-white">
                                        Contacto
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contacto */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Contacto</h3>
                            <ul className="space-y-2 text-sm text-primary-100">
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
                    <div className="pt-8 mt-8 text-sm text-center border-t border-primary-600 text-primary-100">
                        <p>&copy; {new Date().getFullYear()} AirGuider - SENASOFT 2025. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

