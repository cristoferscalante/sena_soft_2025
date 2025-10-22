import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { 
    CreditCardIcon,
    BanknotesIcon,
    BuildingLibraryIcon,
    CheckCircleIcon,
    ClipboardDocumentListIcon,
    LockClosedIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export default function Simulate({ reserva }) {
    const [metodoPago, setMetodoPago] = useState('credito');
    const [procesando, setProcesando] = useState(false);

    const [datosTarjeta, setDatosTarjeta] = useState({
        numero_tarjeta: '',
        titular: '',
        fecha_expiracion: '',
        cvv: '',
    });

    const [datosPSE, setDatosPSE] = useState({
        banco: '',
        tipo_cuenta: 'ahorros',
        tipo_persona: 'natural',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcesando(true);

        let route_name = '';
        let data = { reserva_id: reserva.codigo_reserva };

        if (metodoPago === 'credito') {
            route_name = 'payment.credit';
            data = { ...data, ...datosTarjeta };
        } else if (metodoPago === 'debito') {
            route_name = 'payment.debit';
            data = { ...data, ...datosTarjeta };
        } else {
            route_name = 'payment.pse';
            data = { ...data, ...datosPSE };
        }

        router.post(route(route_name), data, {
            onFinish: () => setProcesando(false),
        });
    };

    const formatCardNumber = (value) => {
        return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    };

    return (
        <MainLayout>
            <Head title="Pago" />

            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                                        <CheckCircleIcon className="w-5 h-5" />
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-700">Vuelos</span>
                                </div>
                                <div className="w-16 h-1 bg-green-500"></div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                                        ✓
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-700">Asientos</span>
                                </div>
                                <div className="w-16 h-1 bg-green-500"></div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                                        ✓
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-700">Pasajeros</span>
                                </div>
                                <div className="w-16 h-1 bg-primary-500"></div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                                        4
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-primary-700">Pago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Formulario de Pago */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <CreditCardIcon className="w-8 h-8 mr-3 text-primary-600" />
                                    Método de Pago
                                </h2>

                                {/* Selector de método de pago */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setMetodoPago('credito')}
                                        className={`p-4 rounded-lg border-2 transition-all ${
                                            metodoPago === 'credito'
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="text-center">
                                            <div className="flex justify-center mb-2">
                                                <CreditCardIcon className="w-8 h-8 text-primary-600" />
                                            </div>
                                            <div className="text-sm font-semibold">Tarjeta Crédito</div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setMetodoPago('debito')}
                                        className={`p-4 rounded-lg border-2 transition-all ${
                                            metodoPago === 'debito'
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="text-center">
                                            <div className="flex justify-center mb-2">
                                                <BanknotesIcon className="w-8 h-8 text-primary-600" />
                                            </div>
                                            <div className="text-sm font-semibold">Tarjeta Débito</div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setMetodoPago('pse')}
                                        className={`p-4 rounded-lg border-2 transition-all ${
                                            metodoPago === 'pse'
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="text-center">
                                            <div className="flex justify-center mb-2">
                                                <BuildingLibraryIcon className="w-8 h-8 text-primary-600" />
                                            </div>
                                            <div className="text-sm font-semibold">PSE</div>
                                        </div>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {(metodoPago === 'credito' || metodoPago === 'debito') && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Número de Tarjeta *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    maxLength="19"
                                                    placeholder="1234 5678 9012 3456"
                                                    value={datosTarjeta.numero_tarjeta}
                                                    onChange={(e) => setDatosTarjeta({ 
                                                        ...datosTarjeta, 
                                                        numero_tarjeta: formatCardNumber(e.target.value) 
                                                    })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nombre del Titular *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Como aparece en la tarjeta"
                                                    value={datosTarjeta.titular}
                                                    onChange={(e) => setDatosTarjeta({ ...datosTarjeta, titular: e.target.value.toUpperCase() })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Fecha de Expiración *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="MM/AA"
                                                        maxLength="5"
                                                        value={datosTarjeta.fecha_expiracion}
                                                        onChange={(e) => {
                                                            let value = e.target.value.replace(/\D/g, '');
                                                            if (value.length >= 2) {
                                                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                                            }
                                                            setDatosTarjeta({ ...datosTarjeta, fecha_expiracion: value });
                                                        }}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        CVV *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="123"
                                                        maxLength="4"
                                                        value={datosTarjeta.cvv}
                                                        onChange={(e) => setDatosTarjeta({ ...datosTarjeta, cvv: e.target.value.replace(/\D/g, '') })}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {metodoPago === 'pse' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Banco *
                                                </label>
                                                <select
                                                    required
                                                    value={datosPSE.banco}
                                                    onChange={(e) => setDatosPSE({ ...datosPSE, banco: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                >
                                                    <option value="">Selecciona tu banco</option>
                                                    <option value="bancolombia">Bancolombia</option>
                                                    <option value="davivienda">Davivienda</option>
                                                    <option value="bbva">BBVA</option>
                                                    <option value="banco_bogota">Banco de Bogotá</option>
                                                    <option value="banco_occidente">Banco de Occidente</option>
                                                    <option value="colpatria">Scotiabank Colpatria</option>
                                                    <option value="av_villas">AV Villas</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tipo de Cuenta *
                                                </label>
                                                <select
                                                    required
                                                    value={datosPSE.tipo_cuenta}
                                                    onChange={(e) => setDatosPSE({ ...datosPSE, tipo_cuenta: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                >
                                                    <option value="ahorros">Ahorros</option>
                                                    <option value="corriente">Corriente</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tipo de Persona *
                                                </label>
                                                <select
                                                    required
                                                    value={datosPSE.tipo_persona}
                                                    onChange={(e) => setDatosPSE({ ...datosPSE, tipo_persona: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                >
                                                    <option value="natural">Persona Natural</option>
                                                    <option value="juridica">Persona Jurídica</option>
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={procesando}
                                        className={`w-full font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg flex items-center justify-center space-x-2 ${
                                            procesando
                                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                                : 'bg-secondary-500 hover:bg-secondary-600 text-white'
                                        }`}
                                    >
                                        {procesando ? (
                                            <>
                                                <ClockIcon className="w-6 h-6 animate-spin" />
                                                <span>Procesando Pago...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CreditCardIcon className="w-6 h-6" />
                                                <span>Pagar ${reserva.total?.toLocaleString()}</span>
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800 flex items-start">
                                        <LockClosedIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                        <span><strong>Pago Seguro:</strong> Este es un entorno de simulación. 
                                        El sistema tiene un 80% de probabilidad de aprobar el pago automáticamente.</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Resumen de la Reserva */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <ClipboardDocumentListIcon className="w-6 h-6 mr-2 text-primary-600" />
                                    Resumen de Reserva
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-gray-600">Código de Reserva</div>
                                        <div className="text-lg font-bold text-primary-600">
                                            {reserva.codigo_reserva}
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="text-sm text-gray-600 mb-2">Vuelos</div>
                                        {reserva.vuelos?.map((vuelo, index) => (
                                            <div key={index} className="text-sm mb-2">
                                                <div className="font-semibold">{vuelo.codigo}</div>
                                                <div className="text-gray-600">
                                                    {vuelo.origen} → {vuelo.destino}
                                                </div>
                                                <div className="text-gray-500">{vuelo.fecha_salida}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="text-sm text-gray-600">Pasajeros</div>
                                        <div className="text-lg font-semibold">
                                            {reserva.cantidad_pasajeros} {reserva.cantidad_pasajeros === 1 ? 'pasajero' : 'pasajeros'}
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-semibold">${reserva.total?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-600">
                                            <span>Impuestos incluidos</span>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold">Total</span>
                                            <span className="text-2xl font-bold text-primary-600">
                                                ${reserva.total?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

