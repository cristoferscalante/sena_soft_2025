import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import {
    ChartBarSquareIcon,
    PaperAirplaneIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Select({ mapas_asientos, vuelos_ids }) {
    const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);
    const [pasajeros, setPasajeros] = useState(1);
    const [infantes, setInfantes] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');

    // Determinar la cantidad requerida de adultos e infantes
    useEffect(() => {
        // Intentar leer pasajeros de query string o localStorage
        try {
            const params = new URLSearchParams(window.location.search);
            const p = params.get('pasajeros');
            if (p && !Number.isNaN(Number(p))) {
                setPasajeros(Math.max(1, Math.min(5, Number(p))));
            } else {
                const stored = localStorage.getItem('pasajeros');
                if (stored && !Number.isNaN(Number(stored))) {
                    setPasajeros(Math.max(1, Math.min(5, Number(stored))));
                }
            }
        } catch (e) {
            // ignore
        }

        // Intentar leer infantes
        try {
            const infantesStored = localStorage.getItem('infantes');
            if (infantesStored && !Number.isNaN(Number(infantesStored))) {
                setInfantes(Math.max(0, Math.min(2, Number(infantesStored))));
            }
        } catch (e) {
            // ignore
        }
    }, []);

    // Si hay múltiples vuelos (ida y vuelta), asumimos selección por vuelo; por ahora
    // cantidadRequerida es solo adultos (infantes no ocupan asiento)
    const cantidadRequerida = pasajeros;

    const toggleAsiento = (asientoId, estado) => {
        if (estado !== 'disponible') return;

        if (asientosSeleccionados.includes(asientoId)) {
            setAsientosSeleccionados(prev => prev.filter(id => id !== asientoId));
            setErrorMsg('');
        } else {
            if (asientosSeleccionados.length < cantidadRequerida) {
                setAsientosSeleccionados(prev => [...prev, asientoId]);
                setErrorMsg('');
            } else {
                setErrorMsg(`Sólo puedes seleccionar ${cantidadRequerida} asiento${cantidadRequerida > 1 ? 's' : ''}.`);
            }
        }
    };

    const getAsientoColor = (asiento) => {
        if (asientosSeleccionados.includes(asiento.id)) {
            return 'bg-secondary-500 text-white border-secondary-600 shadow-lg scale-110';
        }
        switch (asiento.estado) {
            case 'disponible':
                return 'bg-white border-gray-300 hover:bg-primary-50 hover:border-primary-500 cursor-pointer';
            case 'reservado':
            case 'emitido':
                return 'bg-gray-300 border-gray-400 cursor-not-allowed opacity-50';
            default:
                return 'bg-gray-200 border-gray-300';
        }
    };

    const handleContinuar = () => {
        if (asientosSeleccionados.length < cantidadRequerida) {
            setErrorMsg(`Debes seleccionar ${cantidadRequerida} asiento${cantidadRequerida > 1 ? 's' : ''}. Falta/n ${cantidadRequerida - asientosSeleccionados.length}.`);
            return;
        }

        router.post(route('seats.reserve'), {
            asientos: asientosSeleccionados,
            vuelos: vuelos_ids,
            pasajeros: pasajeros,
            infantes: infantes,
        });
    };

    const MapaAsientos = ({ mapa }) => {
        // Organizar asientos por filas
        const asientosPorFila = {};
        Object.values(mapa.asientos).flat().forEach(asiento => {
            const fila = parseInt(asiento.numero.replace(/[^0-9]/g, ''));
            if (!asientosPorFila[fila]) {
                asientosPorFila[fila] = [];
            }
            asientosPorFila[fila].push(asiento);
        });

        // Ordenar las filas
        const filasOrdenadas = Object.keys(asientosPorFila).sort((a, b) => a - b);

        return (
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="mb-6">
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                        Vuelo {mapa.codigo_vuelo}
                    </h3>
                    <div className="text-sm text-gray-600">
                        Configuración: {mapa.configuracion.filas} filas × {mapa.configuracion.asientos_por_fila} asientos
                    </div>
                </div>

                {/* Leyenda */}
                <div className="flex flex-wrap gap-4 p-4 mb-6 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded"></div>
                        <span className="text-sm text-gray-700">Disponible</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 border-2 rounded bg-secondary-500 border-secondary-600"></div>
                        <span className="text-sm text-gray-700">Seleccionado</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 border-2 border-gray-400 rounded opacity-50"></div>
                        <span className="text-sm text-gray-700">Ocupado</span>
                    </div>
                </div>

                    {/* Avión */}
                <div className="max-w-2xl mx-auto">
                    {/* Cabina */}
                    <div className="p-4 rounded-t-full bg-gradient-to-b from-primary-100 to-transparent">
                        <div className="flex items-center justify-center text-sm font-semibold text-center text-primary-700">
                            <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                            Cabina
                        </div>
                    </div>

                    {/* Asientos */}
                    <div className="p-6 bg-gray-100 rounded-b-3xl">
                        {filasOrdenadas.map(fila => (
                            <div key={fila} className="flex items-center justify-center mb-3">
                                {/* Número de fila */}
                                <div className="w-8 text-sm font-semibold text-center text-gray-600">
                                    {fila}
                                </div>

                                {/* Asientos del lado izquierdo */}
                                <div className="flex space-x-2">
                                    {asientosPorFila[fila]
                                        .sort((a, b) => a.numero.localeCompare(b.numero))
                                        .slice(0, Math.ceil(asientosPorFila[fila].length / 2))
                                        .map(asiento => (
                                            <button
                                                key={asiento.id}
                                                onClick={() => toggleAsiento(asiento.id, asiento.estado)}
                                                disabled={asiento.estado !== 'disponible'}
                                                className={`w-12 h-12 rounded-lg border-2 font-semibold text-sm transition-all ${getAsientoColor(asiento)}`}
                                                title={`Asiento ${asiento.numero} - ${asiento.estado}`}
                                            >
                                                {asiento.numero}
                                            </button>
                                        ))}
                                </div>

                                {/* Pasillo */}
                                <div className="w-12"></div>

                                {/* Asientos del lado derecho */}
                                <div className="flex space-x-2">
                                    {asientosPorFila[fila]
                                        .sort((a, b) => a.numero.localeCompare(b.numero))
                                        .slice(Math.ceil(asientosPorFila[fila].length / 2))
                                        .map(asiento => (
                                            <button
                                                key={asiento.id}
                                                onClick={() => toggleAsiento(asiento.id, asiento.estado)}
                                                disabled={asiento.estado !== 'disponible'}
                                                className={`w-12 h-12 rounded-lg border-2 font-semibold text-sm transition-all ${getAsientoColor(asiento)}`}
                                                title={`Asiento ${asiento.numero} - ${asiento.estado}`}
                                            >
                                                {asiento.numero}
                                            </button>
                                        ))}
                                </div>

                                {/* Número de fila derecha */}
                                <div className="w-8 text-sm font-semibold text-center text-gray-600">
                                    {fila}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title="Selección de Asientos" />

            <div className="min-h-screen py-8 bg-gray-50">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                        <h1 className="flex items-center mb-2 text-2xl font-bold text-gray-900">
                            <ChartBarSquareIcon className="w-8 h-8 mr-3 text-primary-600" />
                            Selección de Asientos
                        </h1>
                        <p className="text-gray-600">
                            Selecciona {cantidadRequerida} asiento{cantidadRequerida > 1 ? 's' : ''} para {pasajeros} adulto{pasajeros > 1 ? 's' : ''}
                            {infantes > 0 && ` (${infantes} infante${infantes > 1 ? 's' : ''} viaja${infantes > 1 ? 'n' : ''} en brazos sin asiento)`}
                        </p>
                        <div className="flex items-center mt-4 space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Asientos seleccionados:</span>
                                <span className="text-lg font-bold text-secondary-600">
                                    {asientosSeleccionados.length}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">
                                • Necesarios: <span className="font-semibold">{cantidadRequerida} (adultos)</span>
                            </div>
                            {infantes > 0 && (
                                <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-sm font-medium text-blue-600">
                                        + {infantes} infante{infantes > 1 ? 's' : ''} (sin asiento)
                                    </span>
                                </>
                            )}
                        </div>
                        {errorMsg && (
                            <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
                        )}
                    </div>

                    {/* Mapas de asientos */}
                    <div className="mb-8 space-y-8">
                        {mapas_asientos.map((mapa, index) => (
                            <MapaAsientos key={index} mapa={mapa} />
                        ))}
                    </div>

                    {/* Botón continuar */}
                    {asientosSeleccionados.length > 0 && (
                        <div className="sticky bottom-0 p-6 bg-white border-t border-gray-200 shadow-xl rounded-t-xl">
                            <div className="flex flex-col items-center justify-between mx-auto max-w-7xl md:flex-row">
                                <div className="mb-4 md:mb-0">
                                    <div className="text-lg font-semibold text-gray-900">
                                        {asientosSeleccionados.length} {asientosSeleccionados.length === 1 ? 'asiento seleccionado' : 'asientos seleccionados'}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Continúa para ingresar los datos de los pasajeros
                                    </div>
                                </div>
                                <button
                                    onClick={handleContinuar}
                                    className="flex items-center justify-center w-full px-8 py-4 space-x-2 text-lg font-bold text-white transition-colors rounded-lg shadow-lg md:w-auto bg-secondary-500 hover:bg-secondary-600"
                                >
                                    <span>Continuar a Datos de Pasajeros</span>
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

