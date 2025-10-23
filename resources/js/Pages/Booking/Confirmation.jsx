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

            <div className="min-h-screen py-8 bg-gray-50">
                <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
                    {/* Success Message */}
                    <div className="p-8 mb-8 text-center text-white rounded-lg shadow-xl bg-gradient-to-r from-green-500 to-green-600">
                        <div className="flex justify-center mb-4">
                            <PaperAirplaneIcon className="w-20 h-20" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold md:text-4xl">
                            ¡Reserva Confirmada!
                        </h1>
                        <p className="mb-4 text-xl text-green-100">
                            Tu pago ha sido procesado exitosamente
                        </p>
                        <div className="inline-block p-4 bg-white rounded-lg bg-opacity-20">
                            <div className="mb-1 text-sm text-green-100">Código de Reserva</div>
                            <div className="text-3xl font-bold tracking-wider">
                                {reserva.codigo_reserva}
                            </div>
                        </div>
                    </div>

                    {/* Información del Pagador */}
                    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                        <h2 className="flex items-center mb-4 text-xl font-bold text-gray-900">
                            <CreditCardIcon className="w-6 h-6 mr-2 text-primary-600" />
                            Información del Pagador
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                        <h2 className="flex items-center mb-4 text-xl font-bold text-gray-900">
                            <PaperAirplaneIcon className="w-6 h-6 mr-2 text-primary-600" />
                            Detalles de Vuelos
                        </h2>
                        <div className="space-y-4">
                            {reserva.vuelos?.map((vuelo, index) => (
                                <div key={index} className="p-4 rounded-lg bg-gray-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-3 py-1 text-sm font-semibold rounded-full text-primary-600 bg-primary-100">
                                            {vuelo.codigo}
                                        </span>
                                    </div>
                                    <div className="grid items-center grid-cols-3 gap-4">
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
                                    <div className="mt-2 text-sm text-center text-gray-600">
                                        📅 {vuelo.fecha_salida}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pasajeros y Asientos */}
                    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                        <h2 className="flex items-center mb-4 text-xl font-bold text-gray-900">
                            <UserGroupIcon className="w-6 h-6 mr-2 text-primary-600" />
                            Pasajeros
                        </h2>
                        <div className="space-y-3">
                            {reserva.pasajeros?.map((pasajero, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
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
                                                <span className="px-3 py-1 font-semibold text-white rounded-full bg-secondary-500">
                                                    {asiento.numero}
                                                </span>
                                                <span className="ml-2 text-xs text-gray-600">
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
                        <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                            <h2 className="flex items-center mb-4 text-xl font-bold text-gray-900">
                                <CreditCardIcon className="w-6 h-6 mr-2 text-primary-600" />
                                Información de Pago
                            </h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                    <div className="flex items-center font-semibold text-green-600">
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
                    <div className="p-6 mb-6 border-2 rounded-lg shadow-md bg-primary-50 border-primary-200">
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-gray-900">Total Pagado</span>
                            <span className="text-3xl font-bold text-primary-600">
                                ${reserva.total?.toLocaleString()} COP
                            </span>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h2 className="flex items-center mb-4 text-xl font-bold text-gray-900">
                            <ArrowDownTrayIcon className="w-6 h-6 mr-2 text-primary-600" />
                            Descargar Tiquetes
                        </h2>
                        <p className="mb-4 text-gray-600">
                            Tus tiquetes electrónicos están listos. Descárgalos y preséntalos en el aeropuerto junto con tu documento de identidad.
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <button
                                onClick={handleDescargarTodos}
                                className="flex items-center justify-center flex-1 px-6 py-3 space-x-2 font-bold text-white transition-colors rounded-lg bg-secondary-500 hover:bg-secondary-600"
                            >
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                <span>Descargar Todos los Tiquetes</span>
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center justify-center flex-1 px-6 py-3 space-x-2 font-bold text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                <PrinterIcon className="w-5 h-5" />
                                <span>Imprimir</span>
                            </button>
                        </div>

                        <div className="p-4 mt-6 border border-yellow-200 rounded-lg bg-yellow-50">
                            <div className="flex items-start">
                                <ExclamationTriangleIcon className="flex-shrink-0 w-6 h-6 mr-3 text-yellow-600" />
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
                            className="inline-flex items-center px-8 py-3 space-x-2 font-bold text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
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

