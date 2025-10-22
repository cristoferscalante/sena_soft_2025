import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import {
    PaperAirplaneIcon,
    ArrowPathIcon,
    MapPinIcon,
    CalendarIcon,
    UserGroupIcon,
    MinusIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    CurrencyDollarIcon,
    BoltIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';

export default function Search({ ciudades }) {
    const [tipoViaje, setTipoViaje] = useState('ida');
    const [formData, setFormData] = useState({
        origen_id: '',
        destino_id: '',
        fecha_ida: '',
        fecha_regreso: '',
        pasajeros: 1,
        infantes: 0, // Menores de 3 años
    });
    const [errors, setErrors] = useState({});

    // Calcular fechas mínimas y máximas
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        // Validaciones
        const newErrors = {};
        const totalPasajeros = formData.pasajeros + formData.infantes;

        if (!formData.origen_id) newErrors.origen_id = 'Selecciona una ciudad de origen';
        if (!formData.destino_id) newErrors.destino_id = 'Selecciona una ciudad de destino';
        if (formData.origen_id === formData.destino_id) newErrors.destino_id = 'El destino debe ser diferente al origen';
        if (!formData.fecha_ida) newErrors.fecha_ida = 'Selecciona la fecha de ida';
        if (tipoViaje === 'ida_regreso' && !formData.fecha_regreso) newErrors.fecha_regreso = 'Selecciona la fecha de regreso';
        if (formData.pasajeros < 1 || formData.pasajeros > 5) newErrors.pasajeros = 'Entre 1 y 5 adultos';
        if (formData.infantes < 0 || formData.infantes > 2) newErrors.infantes = 'Máximo 2 infantes';
        if (formData.infantes > formData.pasajeros) newErrors.infantes = 'No puede haber más infantes que adultos';
        if (totalPasajeros > 5) {
            newErrors.infantes = 'El total de adultos + infantes no puede superar 5 pasajeros';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Enviar búsqueda
        router.post(route('flights.search.post'), {
            ...formData,
            tipo_viaje: tipoViaje,
        });
    };

    // Persistir la cantidad de pasajeros en localStorage para que la vista de selección
    // de asientos pueda leerla si la navegación no incluye explícitamente el valor.
    useEffect(() => {
        try {
            localStorage.setItem('pasajeros', String(formData.pasajeros));
            localStorage.setItem('infantes', String(formData.infantes));
        } catch (e) {
            // Silent fail (p. ej. en entornos donde localStorage está deshabilitado)
        }
    }, [formData.pasajeros, formData.infantes]);

    return (
        <MainLayout>
            <Head title="Buscar Vuelos" />

            {/* Hero Section */}
            <div className="relative text-white bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h1 className="flex items-center justify-center mb-4 text-4xl font-bold md:text-5xl">
                            <PaperAirplaneIcon className="w-12 h-12 mr-4" />
                            Encuentra tu próximo destino
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-50">
                            Compara y reserva los mejores vuelos al mejor precio
                        </p>
                    </div>

                    {/* Search Form */}
                    <div className="max-w-5xl mx-auto">
                        <div className="p-6 bg-white shadow-2xl rounded-2xl md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Tipo de viaje */}
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setTipoViaje('ida')}
                                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                                            tipoViaje === 'ida'
                                        ? 'bg-primary-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <PaperAirplaneIcon className="inline-block w-5 h-5 mr-2" />
                                        Solo Ida
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTipoViaje('ida_regreso')}
                                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                                            tipoViaje === 'ida_regreso'
                                                ? 'bg-primary-500 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <ArrowPathIcon className="inline-block w-5 h-5 mr-2" />
                                        Ida y Regreso
                                    </button>
                                </div>

                                {/* Ciudades y Fechas */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Desde */}
                                    <div>
                                        <label className="flex items-center block mb-2 text-sm font-semibold text-gray-700">
                                            <MapPinIcon className="w-5 h-5 mr-2 text-primary-500" />
                                            Desde
                                        </label>
                                        <select
                                            value={formData.origen_id}
                                            onChange={(e) => setFormData({ ...formData, origen_id: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                errors.origen_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Selecciona ciudad de origen</option>
                                            {ciudades.map((ciudad) => (
                                                <option key={ciudad.id} value={ciudad.id}>
                                                    {ciudad.nombre} ({ciudad.codigo_iata})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.origen_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.origen_id}</p>
                                        )}
                                    </div>

                                    {/* Hasta */}
                                    <div>
                                        <label className="flex items-center block mb-2 text-sm font-semibold text-gray-700">
                                            <MapPinIcon className="w-5 h-5 mr-2 text-primary-500" />
                                            Hasta
                                        </label>
                                        <select
                                            value={formData.destino_id}
                                            onChange={(e) => setFormData({ ...formData, destino_id: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                errors.destino_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Selecciona ciudad de destino</option>
                                            {ciudades.map((ciudad) => (
                                                <option key={ciudad.id} value={ciudad.id}>
                                                    {ciudad.nombre} ({ciudad.codigo_iata})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.destino_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.destino_id}</p>
                                        )}
                                    </div>

                                    {/* Fecha de Inicio */}
                                    <div>
                                        <label className="flex items-center block mb-2 text-sm font-semibold text-gray-700">
                                            <CalendarIcon className="w-5 h-5 mr-2 text-primary-500" />
                                            Fecha de inicio
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.fecha_ida}
                                            onChange={(e) => setFormData({ ...formData, fecha_ida: e.target.value })}
                                            min={today}
                                            max={maxDateStr}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 ${
                                                errors.fecha_ida ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            style={{ colorScheme: 'light' }}
                                        />
                                        {errors.fecha_ida && (
                                            <p className="mt-1 text-sm text-red-600">{errors.fecha_ida}</p>
                                        )}
                                    </div>

                                    {/* Fecha de Finalización */}
                                    {/* Fecha de Finalización */}
                                    {tipoViaje === 'ida_regreso' && (
                                        <div>
                                            <label className="flex items-center block mb-2 text-sm font-semibold text-gray-700">
                                                <CalendarIcon className="w-5 h-5 mr-2 text-primary-500" />
                                                Fecha de finalización
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.fecha_regreso}
                                                onChange={(e) => setFormData({ ...formData, fecha_regreso: e.target.value })}
                                                min={formData.fecha_ida || today}
                                                max={maxDateStr}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 ${
                                                    errors.fecha_regreso ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                style={{ colorScheme: 'light' }}
                                            />
                                            {errors.fecha_regreso && (
                                                <p className="mt-1 text-sm text-red-600">{errors.fecha_regreso}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Pasajeros e Infantes en fila */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Adultos */}
                                    <div>
                                        <label className="flex items-center block mb-2 text-sm font-semibold text-gray-700">
                                            <UserGroupIcon className="w-5 h-5 mr-2 text-primary-500" />
                                            Adultos
                                        </label>
                                        <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const nuevosAdultos = Math.max(1, formData.pasajeros - 1);
                                                    setFormData({ ...formData, pasajeros: nuevosAdultos });
                                                }}
                                                disabled={formData.pasajeros <= 1}
                                                className="flex items-center justify-center w-10 h-10 font-bold text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <MinusIcon className="w-5 h-5" />
                                            </button>
                                            <span className="w-12 text-3xl font-bold text-center text-gray-700">
                                                {formData.pasajeros}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const totalActual = formData.pasajeros + formData.infantes;
                                                    if (totalActual < 5) {
                                                        setFormData({ ...formData, pasajeros: formData.pasajeros + 1 });
                                                    }
                                                }}
                                                disabled={formData.pasajeros + formData.infantes >= 5}
                                                className="flex items-center justify-center w-10 h-10 font-bold text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <PlusIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                        {errors.pasajeros && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pasajeros}</p>
                                        )}
                                    </div>

                                    {/* Infantes */}
                                    <div>
                                        <label className="flex items-center block mb-2 text-sm font-semibold text-gray-700">
                                            <UserGroupIcon className="w-5 h-5 mr-2 text-primary-500" />
                                            Infantes (&lt; 3 años)
                                        </label>
                                        <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, infantes: Math.max(0, formData.infantes - 1) })}
                                                disabled={formData.infantes <= 0}
                                                className="flex items-center justify-center w-10 h-10 font-bold text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <MinusIcon className="w-5 h-5" />
                                            </button>
                                            <span className="w-12 text-3xl font-bold text-center text-gray-700">
                                                {formData.infantes}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const totalActual = formData.pasajeros + formData.infantes;
                                                    if (totalActual < 5 && formData.infantes < 2 && formData.infantes < formData.pasajeros) {
                                                        setFormData({ ...formData, infantes: formData.infantes + 1 });
                                                    }
                                                }}
                                                disabled={formData.pasajeros + formData.infantes >= 5 || formData.infantes >= 2 || formData.infantes >= formData.pasajeros}
                                                className="flex items-center justify-center w-10 h-10 font-bold text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <PlusIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                        {errors.infantes && (
                                            <p className="mt-1 text-sm text-red-600">{errors.infantes}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Nota informativa */}
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>Total de pasajeros:</strong> {formData.pasajeros + formData.infantes} de 5 máximo
                                        <br />
                                        <span className="text-xs text-blue-700">
                                            Los infantes viajan en brazos, no pagan pasaje ni ocupan asiento
                                        </span>
                                    </p>
                                </div>

                                {/* Botón de búsqueda */}
                                <button
                                    type="submit"
                                    className="flex items-center justify-center w-full px-6 py-4 space-x-2 text-lg font-bold text-white transition-colors rounded-lg shadow-lg bg-secondary-500 hover:bg-secondary-600 hover:shadow-xl"
                                >
                                    <MagnifyingGlassIcon className="w-6 h-6" />
                                    <span>Buscar Vuelos</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
                        ¿Por qué elegir AirGuider?
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="p-6 text-center">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                                <CurrencyDollarIcon className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">Mejores Precios</h3>
                            <p className="text-gray-600">
                                Encuentra las tarifas más competitivas del mercado
                            </p>
                        </div>
                        <div className="p-6 text-center">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100">
                                <BoltIcon className="w-8 h-8 text-secondary-600" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">Reserva Rápida</h3>
                            <p className="text-gray-600">
                                Proceso de reserva simple y en pocos pasos
                            </p>
                        </div>
                        <div className="p-6 text-center">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-accent-100">
                                <LockClosedIcon className="w-8 h-8 text-accent-600" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">Pago Seguro</h3>
                            <p className="text-gray-600">
                                Transacciones protegidas y datos encriptados
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

