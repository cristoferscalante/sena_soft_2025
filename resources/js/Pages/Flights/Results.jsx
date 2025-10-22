import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { 
    PaperAirplaneIcon,
    CalendarIcon,
    UserGroupIcon,
    CheckCircleIcon,
    ClockIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Results({ vuelos_ida, vuelos_regreso, busqueda }) {
    const [vueloIdaSeleccionado, setVueloIdaSeleccionado] = useState(null);
    const [vueloRegresoSeleccionado, setVueloRegresoSeleccionado] = useState(null);

    const esIdaYRegreso = busqueda.tipo_viaje === 'ida_regreso';

    const handleContinuar = () => {
        const vuelosSeleccionados = [vueloIdaSeleccionado];
        if (esIdaYRegreso && vueloRegresoSeleccionado) {
            vuelosSeleccionados.push(vueloRegresoSeleccionado);
        }

        // Redirigir a selección de asientos
        router.get(route('seats.index'), {
            vuelos: vuelosSeleccionados,
        });
    };

    const VueloCard = ({ vuelo, seleccionado, onSelect, tipo }) => {
        const duracion = vuelo.hora_llegada ? `${Math.floor(Math.random() * 2 + 1)}h ${Math.floor(Math.random() * 60)}m` : '1h 30m';

        return (
            <div
                onClick={() => onSelect(vuelo.id)}
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-xl ${
                    seleccionado ? 'ring-4 ring-primary-500 bg-primary-50' : ''
                }`}
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Información del vuelo */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                                {vuelo.codigo_vuelo}
                            </span>
                            <span className="text-xs text-gray-500">
                                {vuelo.aeronave.modelo}
                            </span>
                        </div>

                        <div className="flex items-center space-x-8">
                            {/* Origen */}
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    {vuelo.hora_salida}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {vuelo.origen.codigo_iata}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {vuelo.origen.nombre}
                                </div>
                            </div>

                            {/* Línea de vuelo */}
                            <div className="flex-1 flex flex-col items-center">
                                <div className="text-xs text-gray-500 mb-1">{duracion}</div>
                                <div className="w-full relative">
                                    <div className="border-t-2 border-gray-300"></div>
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <PaperAirplaneIcon className="w-6 h-6 text-primary-500" />
                                    </div>
                                </div>
                                <div className="text-xs text-green-600 font-semibold mt-1 flex items-center justify-center">
                                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                                    Sin escalas
                                </div>
                            </div>

                            {/* Destino */}
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    {vuelo.hora_llegada}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {vuelo.destino.codigo_iata}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {vuelo.destino.nombre}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                            <ClockIcon className="w-4 h-4" />
                            <span>{vuelo.asientos_disponibles} asientos disponibles</span>
                        </div>
                    </div>

                    {/* Precio y botón */}
                    <div className="mt-4 md:mt-0 md:ml-8 flex flex-col items-end">
                        <div className="text-right mb-3">
                            <div className="text-3xl font-bold text-primary-600">
                                ${vuelo.precio_base.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                                por persona
                            </div>
                        </div>
                        <button
                            type="button"
                            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                                seleccionado
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {seleccionado ? '✓ Seleccionado' : 'Seleccionar'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title="Resultados de Búsqueda" />

            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Vuelos Disponibles
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center">
                                <PaperAirplaneIcon className="w-4 h-4 mr-1" />
                                {busqueda.origen_id} → {busqueda.destino_id}
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                {busqueda.fecha_ida}
                            </span>
                            {esIdaYRegreso && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center">
                                        <CalendarIcon className="w-4 h-4 mr-1" />
                                        Regreso: {busqueda.fecha_regreso}
                                    </span>
                                </>
                            )}
                            <span>•</span>
                            <span className="flex items-center">
                                <UserGroupIcon className="w-4 h-4 mr-1" />
                                {busqueda.pasajeros} {busqueda.pasajeros === 1 ? 'adulto' : 'adultos'}
                            </span>
                        </div>
                    </div>

                    {/* Vuelos de Ida */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <PaperAirplaneIcon className="w-6 h-6 mr-2 text-primary-600" />
                            Vuelos de Ida
                        </h2>
                        {vuelos_ida.length > 0 ? (
                            <div className="space-y-4">
                                {vuelos_ida.map((vuelo) => (
                                    <VueloCard
                                        key={vuelo.id}
                                        vuelo={vuelo}
                                        seleccionado={vueloIdaSeleccionado === vuelo.id}
                                        onSelect={setVueloIdaSeleccionado}
                                        tipo="ida"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <span className="text-6xl mb-4 block">😔</span>
                                <p className="text-xl text-gray-600">
                                    No hay vuelos disponibles para esta ruta
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Vuelos de Regreso */}
                    {esIdaYRegreso && vueloIdaSeleccionado && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <PaperAirplaneIcon className="w-6 h-6 mr-2 text-primary-600 transform rotate-180" />
                                Vuelos de Regreso
                            </h2>
                            {vuelos_regreso.length > 0 ? (
                                <div className="space-y-4">
                                    {vuelos_regreso.map((vuelo) => (
                                        <VueloCard
                                            key={vuelo.id}
                                            vuelo={vuelo}
                                            seleccionado={vueloRegresoSeleccionado === vuelo.id}
                                            onSelect={setVueloRegresoSeleccionado}
                                            tipo="regreso"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                    <span className="text-6xl mb-4 block">😔</span>
                                    <p className="text-xl text-gray-600">
                                        No hay vuelos de regreso disponibles
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Botón continuar */}
                    {vueloIdaSeleccionado && (!esIdaYRegreso || vueloRegresoSeleccionado) && (
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 shadow-xl rounded-t-xl">
                            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-4 md:mb-0">
                                    <div className="text-2xl font-bold text-primary-600">
                                        Total: ${(
                                            vuelos_ida.find(v => v.id === vueloIdaSeleccionado)?.precio_base * busqueda.pasajeros +
                                            (vueloRegresoSeleccionado ? vuelos_regreso.find(v => v.id === vueloRegresoSeleccionado)?.precio_base * busqueda.pasajeros : 0)
                                        ).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Para {busqueda.pasajeros} {busqueda.pasajeros === 1 ? 'pasajero' : 'pasajeros'}
                                    </div>
                                </div>
                                <button
                                    onClick={handleContinuar}
                                    className="w-full md:w-auto bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg flex items-center justify-center space-x-2"
                                >
                                    <span>Continuar a Selección de Asientos</span>
                                    <ArrowRightIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

