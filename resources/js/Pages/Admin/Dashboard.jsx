import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    PaperAirplaneIcon,
    TicketIcon,
    MapPinIcon,
    ChartBarSquareIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard({ stats, reservasRecientes, vuelosProximos }) {
    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Resumen general del sistema AirGuider</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Vuelos</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total_vuelos}</p>
                            </div>
                            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                                <PaperAirplaneIcon className="w-7 h-7 text-primary-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Vuelos Hoy</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.vuelos_hoy}</p>
                            </div>
                            <div className="w-14 h-14 bg-secondary-100 rounded-full flex items-center justify-center">
                                <ClockIcon className="w-7 h-7 text-secondary-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Reservas</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total_reservas}</p>
                            </div>
                            <div className="w-14 h-14 bg-accent-100 rounded-full flex items-center justify-center">
                                <TicketIcon className="w-7 h-7 text-accent-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Reservas Confirmadas</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.reservas_confirmadas}</p>
                            </div>
                            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircleIcon className="w-7 h-7 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Ciudades</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total_ciudades}</p>
                            </div>
                            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                                <MapPinIcon className="w-7 h-7 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Asientos Disponibles</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.asientos_disponibles?.toLocaleString()}</p>
                            </div>
                            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                                <ChartBarSquareIcon className="w-7 h-7 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Reservas Recientes */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Reservas Recientes
                        </h2>
                        <div className="space-y-3">
                            {reservasRecientes?.map((reserva) => (
                                <div key={reserva.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-primary-600">{reserva.codigo_unico}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                                            reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {reserva.estado}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {reserva.pagador?.nombre_completo} • ${reserva.total}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date(reserva.created_at).toLocaleString('es-CO')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Próximos Vuelos */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Próximos Vuelos
                        </h2>
                        <div className="space-y-3">
                            {vuelosProximos?.map((vuelo) => (
                                <div key={vuelo.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-primary-600">{vuelo.codigo_vuelo}</span>
                                        <span className="text-xs text-gray-500">
                                            {vuelo.asientos_disponibles} asientos
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-900 font-medium">
                                        {vuelo.ciudadOrigen?.nombre} → {vuelo.ciudadDestino?.nombre}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date(vuelo.fecha_salida).toLocaleDateString('es-CO')} • {vuelo.hora_salida?.substring(0, 5)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

