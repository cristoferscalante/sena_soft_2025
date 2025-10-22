import { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { 
    PaperAirplaneIcon,
    MagnifyingGlassIcon,
    EnvelopeIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function MyTrips() {
    const [codigoReserva, setCodigoReserva] = useState('');
    const [buscando, setBuscando] = useState(false);

    const handleBuscar = (e) => {
        e.preventDefault();
        if (codigoReserva.trim()) {
            setBuscando(true);
            window.location.href = route('booking.show', { codigo: codigoReserva.toUpperCase() });
        }
    };

    return (
        <MainLayout>
            <Head title="Mis Viajes" />

            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                            <PaperAirplaneIcon className="w-10 h-10 mr-4 text-primary-600" />
                            Mis Viajes
                        </h1>
                        <p className="text-xl text-gray-600">
                            Consulta el estado de tus reservas
                        </p>
                    </div>

                    {/* Búsqueda por código */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center">
                            <MagnifyingGlassIcon className="w-7 h-7 mr-3 text-primary-600" />
                            Buscar mi Reserva
                        </h2>

                        <form onSubmit={handleBuscar} className="max-w-md mx-auto">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Código de Reserva
                                </label>
                                <input
                                    type="text"
                                    value={codigoReserva}
                                    onChange={(e) => setCodigoReserva(e.target.value.toUpperCase())}
                                    placeholder="Ej: ABC12DEF"
                                    maxLength="8"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl font-bold tracking-widest"
                                />
                                <p className="mt-2 text-sm text-gray-600 text-center">
                                    Ingresa el código de 8 caracteres que recibiste al confirmar tu reserva
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={buscando || codigoReserva.length !== 8}
                                className={`w-full font-bold py-4 px-6 rounded-lg text-lg transition-colors flex items-center justify-center space-x-2 ${
                                    buscando || codigoReserva.length !== 8
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg'
                                }`}
                            >
                                <MagnifyingGlassIcon className="w-5 h-5" />
                                <span>{buscando ? 'Buscando...' : 'Buscar mi Reserva'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Ayuda */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <EnvelopeIcon className="w-8 h-8 text-accent-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    ¿No encuentras tu código?
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Revisa tu correo electrónico. Te enviamos el código de reserva al completar tu compra.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ChatBubbleLeftRightIcon className="w-8 h-8 text-secondary-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    ¿Necesitas ayuda?
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Contáctanos y te ayudaremos a recuperar tu información
                                </p>
                                <a
                                    href="/contacto"
                                    className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                                >
                                    Contactar
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

