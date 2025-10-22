import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { 
    CheckCircleIcon,
    PaperAirplaneIcon,
    ArrowDownTrayIcon,
    EnvelopeIcon,
    HomeIcon,
    ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

export default function ThankYou({ reserva, pago }) {
    return (
        <MainLayout>
            <Head title="¡Gracias por tu Compra!" />

            <div className="bg-gradient-to-br from-primary-50 to-accent-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Success Animation */}
                    <div className="text-center mb-8 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-32 h-32 bg-green-500 rounded-full mb-6 shadow-2xl animate-bounce">
                            <CheckCircleIcon className="w-20 h-20 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            ¡Pago Exitoso!
                        </h1>
                        <p className="text-xl text-gray-600 mb-2">
                            Tu reserva ha sido confirmada
                        </p>
                        <div className="inline-block bg-white rounded-lg shadow-lg px-8 py-4 mt-4">
                            <div className="text-sm text-gray-600 mb-1">Código de Reserva</div>
                            <div className="text-4xl font-bold text-primary-600 tracking-wider">
                                {reserva.codigo_reserva}
                            </div>
                        </div>
                    </div>

                    {/* Quick Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <PaperAirplaneIcon className="w-8 h-8 text-primary-600" />
                            </div>
                            <div className="text-sm text-gray-600 mb-1">Vuelos</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {reserva.vuelos?.length || 0}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <ClipboardDocumentListIcon className="w-8 h-8 text-secondary-600" />
                            </div>
                            <div className="text-sm text-gray-600 mb-1">Pasajeros</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {reserva.cantidad_pasajeros || 0}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircleIcon className="w-8 h-8 text-accent-600" />
                            </div>
                            <div className="text-sm text-gray-600 mb-1">Total Pagado</div>
                            <div className="text-2xl font-bold text-gray-900">
                                ${reserva.total?.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Información del Pago */}
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Detalles del Pago
                            </h2>
                            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold flex items-center">
                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                Aprobado
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Referencia de Pago</div>
                                <div className="text-lg font-bold text-gray-900">{pago.referencia}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Método de Pago</div>
                                <div className="text-lg font-semibold text-gray-900 capitalize">
                                    {pago.metodo_pago?.replace('_', ' ')}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Fecha del Pago</div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {new Date().toLocaleString('es-CO')}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Estado</div>
                                <div className="text-lg font-semibold text-green-600">
                                    Confirmado
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email enviado */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
                        <div className="flex items-start">
                            <EnvelopeIcon className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                    Confirmación Enviada
                                </h3>
                                <p className="text-blue-800">
                                    Hemos enviado un correo electrónico a <strong>{reserva.pagador?.correo}</strong> con:
                                </p>
                                <ul className="list-disc list-inside text-blue-800 mt-2 space-y-1">
                                    <li>Código de reserva</li>
                                    <li>Detalles del vuelo</li>
                                    <li>Tiquetes electrónicos adjuntos</li>
                                    <li>Instrucciones para el aeropuerto</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                            ¿Qué sigue ahora?
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Link
                                href={route('booking.show', { codigo: reserva.codigo_reserva })}
                                className="flex items-center justify-center space-x-3 bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg"
                            >
                                <ArrowDownTrayIcon className="w-6 h-6" />
                                <span>Descargar Tiquetes</span>
                            </Link>

                            <a
                                href={route('receipts.download', { referencia: pago.referencia })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center space-x-3 bg-accent-500 hover:bg-accent-600 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg"
                            >
                                <ArrowDownTrayIcon className="w-6 h-6" />
                                <span>Descargar Recibo</span>
                            </a>

                            <Link
                                href="/"
                                className="flex items-center justify-center space-x-3 bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg"
                            >
                                <HomeIcon className="w-6 h-6" />
                                <span>Buscar Otro Vuelo</span>
                            </Link>
                        </div>

                        <div className="text-center">
                            <Link
                                href="/mis-viajes"
                                className="text-primary-600 hover:text-primary-700 font-semibold underline"
                            >
                                Ver todas mis reservas
                            </Link>
                        </div>
                    </div>

                    {/* Recordatorios Importantes */}
                    <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-yellow-900 mb-4">
                            📋 Recordatorios Importantes
                        </h3>
                        <ul className="space-y-3 text-yellow-800">
                            <li className="flex items-start">
                                <span className="mr-3 font-bold">•</span>
                                <span>Llega con <strong>2 horas de anticipación</strong> para vuelos nacionales</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 font-bold">•</span>
                                <span>Presenta tu <strong>tiquete electrónico y documento de identidad</strong></span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 font-bold">•</span>
                                <span>Revisa las <strong>restricciones de equipaje</strong> de la aerolínea</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 font-bold">•</span>
                                <span>Guarda tu código de reserva: <strong className="text-primary-600">{reserva.codigo_reserva}</strong></span>
                            </li>
                        </ul>
                    </div>

                    {/* Mensaje final */}
                    <div className="mt-8 text-center">
                        <p className="text-2xl text-gray-700 mb-2">
                            ¡Gracias por volar con AirGuider! ✈️
                        </p>
                        <p className="text-gray-600">
                            Que tengas un excelente viaje
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

