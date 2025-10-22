import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { 
    CheckCircleIcon,
    PaperAirplaneIcon,
    CreditCardIcon,
    UserGroupIcon,
    ArrowDownTrayIcon,
    PrinterIcon,
    HomeIcon,
    ClipboardDocumentListIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function Confirmation({ reserva }) {
    const handleDescargarTodos = () => {
        // Descargar directamente el PDF de tiquetes combinado
        const url = route('tickets.reserva.pdf', { codigo: reserva.codigo_reserva });
        const link = document.createElement('a');
        link.href = url;
        link.download = `tiquetes_${reserva.codigo_reserva}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <MainLayout>
            <Head title="Confirmación de Reserva" />

            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Success Message */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-xl p-8 mb-8 text-white text-center">
                        <div className="flex justify-center mb-4">
                            <PaperAirplaneIcon className="w-20 h-20" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            ¡Reserva Confirmada!
                        </h1>
                        <p className="text-xl text-green-100 mb-4">
                            Tu pago ha sido procesado exitosamente
                        </p>
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 inline-block">
                            <div className="text-sm text-green-100 mb-1">Código de Reserva</div>
                            <div className="text-3xl font-bold tracking-wider">
                                {reserva.codigo_reserva}
                            </div>
                        </div>
                    </div>

                    {/* Información del Pagador */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <CreditCardIcon className="w-6 h-6 mr-2 text-primary-600" />
                            Información del Pagador
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-600">Nombre</div>
                                <div className="font-semibold">{reserva.pagador?.nombre}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Documento</div>
                                <div className="font-semibold">{reserva.pagador?.documento}</div>
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

                    {/* Vuelos */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <PaperAirplaneIcon className="w-6 h-6 mr-2 text-primary-600" />
                            Detalles de Vuelos
                        </h2>
                        <div className="space-y-4">
                            {reserva.vuelos?.map((vuelo, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                                            {vuelo.codigo}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {vuelo.hora_salida}
                                            </div>
                                            <div className="text-sm text-gray-600">{vuelo.origen}</div>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-2xl">→</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {vuelo.hora_llegada || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-600">{vuelo.destino}</div>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600 text-center">
                                        📅 {vuelo.fecha_salida}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pasajeros y Asientos */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <UserGroupIcon className="w-6 h-6 mr-2 text-primary-600" />
                            Pasajeros
                        </h2>
                        <div className="space-y-3">
                            {reserva.pasajeros?.map((pasajero, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {pasajero.nombre_completo}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {pasajero.documento}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {pasajero.asientos?.map((asiento, idx) => (
                                            <div key={idx} className="text-sm">
                                                <span className="bg-secondary-500 text-white px-3 py-1 rounded-full font-semibold">
                                                    {asiento.numero}
                                                </span>
                                                <span className="text-xs text-gray-600 ml-2">
                                                    {asiento.vuelo}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Información de Pago */}
                    {reserva.pago && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <CreditCardIcon className="w-6 h-6 mr-2 text-primary-600" />
                                Información de Pago
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600">Método de Pago</div>
                                    <div className="font-semibold capitalize">
                                        {reserva.pago.metodo?.replace('_', ' ')}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Referencia</div>
                                    <div className="font-semibold">{reserva.pago.referencia}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Estado</div>
                                    <div className="font-semibold text-green-600 flex items-center">
                                        <CheckCircleIcon className="w-5 h-5 mr-1" />
                                        {reserva.pago.estado}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Fecha</div>
                                    <div className="font-semibold">{reserva.pago.fecha}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Total */}
                    <div className="bg-primary-50 border-2 border-primary-200 rounded-lg shadow-md p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-900">Total Pagado</span>
                            <span className="text-3xl font-bold text-primary-600">
                                ${reserva.total?.toLocaleString()} COP
                            </span>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <ArrowDownTrayIcon className="w-6 h-6 mr-2 text-primary-600" />
                            Descargar Tiquetes
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Tus tiquetes electrónicos están listos. Descárgalos y preséntalos en el aeropuerto junto con tu documento de identidad.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleDescargarTodos}
                                className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                            >
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                <span>Descargar Todos los Tiquetes</span>
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                            >
                                <PrinterIcon className="w-5 h-5" />
                                <span>Imprimir</span>
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start">
                                <ExclamationTriangleIcon className="w-6 h-6 mr-3 text-yellow-600 flex-shrink-0" />
                                <div className="text-sm text-yellow-800">
                                    <strong>Importante:</strong> Te recomendamos llegar con 2 horas de anticipación para vuelos nacionales. 
                                    Presenta tu tiquete electrónico y documento de identidad en el aeropuerto.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botón volver al inicio */}
                    <div className="mt-8 text-center">
                        <a
                            href="/"
                            className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            <HomeIcon className="w-5 h-5" />
                            <span>Volver al Inicio</span>
                        </a>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

