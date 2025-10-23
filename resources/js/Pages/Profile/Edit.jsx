import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    UserCircleIcon,
    TicketIcon,
    CheckCircleIcon,
    ClockIcon,
    CurrencyDollarIcon,
    PaperAirplaneIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export default function Edit({ mustVerifyEmail, status, reservas, estadisticas }) {
    const { auth } = usePage().props;

    const getEstadoBadge = (estado) => {
        const badges = {
            'confirmada': 'bg-green-100 text-green-800',
            'pendiente': 'bg-yellow-100 text-yellow-800',
            'cancelada': 'bg-red-100 text-red-800',
        };
        return badges[estado] || 'bg-gray-100 text-gray-800';
    };

    return (
        <MainLayout>
            <Head title="Mi Perfil" />

            <div className="min-h-screen py-8 bg-gray-50">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header del Perfil */}
                    <div className="p-8 mb-8 bg-white rounded-lg shadow-md">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center justify-center w-24 h-24 text-4xl font-bold text-white rounded-full bg-primary-500">
                                {auth.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                                    {auth.user.name}
                                </h1>
                                <p className="text-gray-600">{auth.user.email}</p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Miembro desde {new Date(auth.user.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm text-gray-600">Total Reservas</p>
                                    <p className="text-3xl font-bold text-primary-600">{estadisticas.total_reservas}</p>
                                </div>
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100">
                                    <TicketIcon className="w-6 h-6 text-primary-600" />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm text-gray-600">Confirmadas</p>
                                    <p className="text-3xl font-bold text-green-600">{estadisticas.reservas_confirmadas}</p>
                                </div>
                                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm text-gray-600">Total Gastado</p>
                                    <p className="text-3xl font-bold text-secondary-600">
                                        ${(estadisticas.total_gastado || 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary-100">
                                    <CurrencyDollarIcon className="w-6 h-6 text-secondary-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historial de Reservas */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h2 className="flex items-center mb-6 text-2xl font-bold text-gray-900">
                            <ClockIcon className="mr-3 w-7 h-7 text-primary-600" />
                            Historial de Reservas
                        </h2>

                        {reservas.length === 0 ? (
                            <div className="py-12 text-center">
                                <PaperAirplaneIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="mb-2 text-xl font-semibold text-gray-700">
                                    No tienes reservas aún
                                </h3>
                                <p className="mb-6 text-gray-600">
                                    Comienza a explorar nuestros destinos y reserva tu próximo vuelo
                                </p>
                                <Link
                                    href={route('flights.index')}
                                    className="inline-flex items-center px-6 py-3 text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
                                >
                                    Buscar Vuelos
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reservas.map((reserva) => (
                                    <div key={reserva.id} className="p-6 transition-shadow border border-gray-200 rounded-lg hover:shadow-md">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center mb-2 space-x-3">
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        Reserva #{reserva.codigo}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(reserva.estado)}`}>
                                                        {reserva.estado.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Fecha de reserva: {reserva.fecha_reserva}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Total</p>
                                                <p className="text-2xl font-bold text-primary-600">
                                                    ${reserva.total.toLocaleString()} COP
                                                </p>
                                            </div>
                                        </div>

                                        {/* Vuelos */}
                                        <div className="mb-4 space-y-2">
                                            {reserva.vuelos.map((vuelo, index) => (
                                                <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50">
                                                    <PaperAirplaneIcon className="w-5 h-5 mr-3 text-primary-600" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <span className="font-semibold text-gray-900">{vuelo.origen}</span>
                                                            <span className="text-gray-400">→</span>
                                                            <span className="font-semibold text-gray-900">{vuelo.destino}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-600">
                                                            Vuelo {vuelo.codigo} • {vuelo.fecha_salida}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Información adicional */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <span>👥 {reserva.cantidad_pasajeros} pasajero{reserva.cantidad_pasajeros > 1 ? 's' : ''}</span>
                                                <span>🎫 {reserva.tiquetes_count} tiquete{reserva.tiquetes_count > 1 ? 's' : ''}</span>
                                                {reserva.pago && (
                                                    <span>💳 {reserva.pago.metodo}</span>
                                                )}
                                            </div>
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route('booking.show', { codigo: reserva.codigo })}
                                                    className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
                                                >
                                                    Ver Detalles
                                                </Link>
                                                {reserva.estado === 'confirmada' && (
                                                    <Link
                                                        href={route('tickets.reserva.pdf', { codigo: reserva.codigo })}
                                                        className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-secondary-500 hover:bg-secondary-600"
                                                    >
                                                        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                                                        Tiquetes
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
