import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    TicketIcon, 
    ArrowLeftIcon,
    UserIcon,
    CreditCardIcon,
    PaperAirplaneIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function ReservaShow({ reserva }) {
    return (
        <AdminLayout>
            <Head title={`Reserva ${reserva.codigo_unico}`} />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <TicketIcon className="w-8 h-8 mr-3 text-primary-600" />
                        Reserva: {reserva.codigo_unico}
                    </h1>
                    <Link
                        href={route('admin.reservas.index')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>Volver</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Información Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Pagador */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <UserIcon className="w-6 h-6 mr-2 text-primary-600" />
                                Información del Pagador
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600">Nombre</div>
                                    <div className="font-semibold">{reserva.pagador?.nombre_completo}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Documento</div>
                                    <div className="font-semibold">
                                        {reserva.pagador?.tipo_documento} {reserva.pagador?.numero_documento}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Correo</div>
                                    <div className="font-semibold">{reserva.pagador?.correo}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Teléfono</div>
                                    <div className="font-semibold">{reserva.pagador?.telefono}</div>
                                </div>
                            </div>
                        </div>

                        {/* Pasajeros */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Pasajeros ({reserva.pasajeros?.length})
                            </h2>
                            <div className="space-y-3">
                                {reserva.pasajeros?.map((pasajero, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                        <div className="font-semibold text-gray-900">
                                            {pasajero.primer_apellido} {pasajero.segundo_apellido} {pasajero.nombres}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {pasajero.tipo_documento} {pasajero.numero_documento}
                                        </div>
                                        {pasajero.asientos?.length > 0 && (
                                            <div className="text-sm mt-2">
                                                Asientos: {pasajero.asientos.map(a => a.numero).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Vuelos */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <PaperAirplaneIcon className="w-6 h-6 mr-2 text-primary-600" />
                                Vuelos
                            </h2>
                            <div className="space-y-3">
                                {reserva.vuelos?.map((vuelo, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                        <div className="font-semibold text-primary-600">{vuelo.codigo_vuelo}</div>
                                        <div className="text-sm text-gray-900">
                                            {vuelo.ciudad_origen?.nombre} → {vuelo.ciudad_destino?.nombre}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {new Date(vuelo.fecha_salida).toLocaleDateString('es-CO')} - {vuelo.hora_salida?.substring(0, 5)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Estado */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Estado</h3>
                            <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${
                                reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                                reserva.estado === 'pagada' ? 'bg-blue-100 text-blue-800' :
                                reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {reserva.estado}
                            </span>
                        </div>

                        {/* Pago */}
                        {reserva.pago && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <CreditCardIcon className="w-5 h-5 mr-2" />
                                    Pago
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <div className="text-gray-600">Método</div>
                                        <div className="font-semibold capitalize">
                                            {reserva.pago.metodo_pago?.replace('_', ' ')}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600">Referencia</div>
                                        <div className="font-semibold">{reserva.pago.referencia}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600">Monto</div>
                                        <div className="font-semibold text-green-600">
                                            ${reserva.pago.monto?.toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600">Estado</div>
                                        <div className={`font-semibold ${
                                            reserva.pago.estado === 'aprobado' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {reserva.pago.estado}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Totales */}
                        <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6">
                            <div className="text-sm text-gray-600 mb-1">Total</div>
                            <div className="text-3xl font-bold text-primary-600">
                                ${reserva.total?.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

