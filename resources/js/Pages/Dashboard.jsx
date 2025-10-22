import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MainLayout from '@/Layouts/MainLayout';
import { 
    PaperAirplaneIcon,
    ClockIcon,
    CheckCircleIcon,
    TicketIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ auth }) {
    return (
        <MainLayout>
            <Head title="Mi Cuenta" />

            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Header */}
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-xl p-8 mb-8 text-white">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            ¡Hola, {auth.user.name}!
                        </h1>
                        <p className="text-primary-50 text-lg">
                            Bienvenido a tu panel de usuario de AirGuider
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link
                            href="/"
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                                    <MagnifyingGlassIcon className="w-7 h-7 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Buscar Vuelos</h3>
                                    <p className="text-sm text-gray-600">Encuentra tu próximo destino</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/mis-viajes"
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-secondary-100 rounded-full flex items-center justify-center">
                                    <PaperAirplaneIcon className="w-7 h-7 text-secondary-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Mis Viajes</h3>
                                    <p className="text-sm text-gray-600">Ver mis reservas</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route('profile.edit')}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-accent-100 rounded-full flex items-center justify-center">
                                    <CheckCircleIcon className="w-7 h-7 text-accent-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Mi Perfil</h3>
                                    <p className="text-sm text-gray-600">Editar información</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Actividad Reciente
                        </h2>
                        <div className="text-center py-12">
                            <PaperAirplaneIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">
                                Aún no tienes reservas
                            </p>
                            <Link
                                href="/"
                                className="inline-block mt-4 bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            >
                                Buscar Vuelos
                            </Link>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Beneficios de tu Cuenta
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start space-x-3">
                                <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Historial Completo</h3>
                                    <p className="text-sm text-gray-600">
                                        Accede a todas tus reservas pasadas y futuras
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                                    <p className="text-sm text-gray-600">
                                        Recibe alertas sobre cambios en tus vuelos
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Descuentos Exclusivos</h3>
                                    <p className="text-sm text-gray-600">
                                        Ofertas especiales solo para usuarios registrados
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Compra Rápida</h3>
                                    <p className="text-sm text-gray-600">
                                        Datos guardados para futuras reservas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
