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
        if (!formData.origen_id) newErrors.origen_id = 'Selecciona una ciudad de origen';
        if (!formData.destino_id) newErrors.destino_id = 'Selecciona una ciudad de destino';
        if (formData.origen_id === formData.destino_id) newErrors.destino_id = 'El destino debe ser diferente al origen';
        if (!formData.fecha_ida) newErrors.fecha_ida = 'Selecciona la fecha de ida';
        if (tipoViaje === 'ida_regreso' && !formData.fecha_regreso) newErrors.fecha_regreso = 'Selecciona la fecha de regreso';
        if (formData.pasajeros < 1 || formData.pasajeros > 5) newErrors.pasajeros = 'Entre 1 y 5 pasajeros';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Enviar búsqueda
        router.post(route('flights.search'), {
            ...formData,
            tipo_viaje: tipoViaje,
        });
    };

    // Persistir la cantidad de pasajeros en localStorage para que la vista de selección
    // de asientos pueda leerla si la navegación no incluye explícitamente el valor.
    useEffect(() => {
        try {
            localStorage.setItem('pasajeros', String(formData.pasajeros));
        } catch (e) {
            // Silent fail (p. ej. en entornos donde localStorage está deshabilitado)
        }
    }, [formData.pasajeros]);

    return (
        <MainLayout>
            <Head title="Buscar Vuelos" />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
                            <PaperAirplaneIcon className="w-12 h-12 mr-4" />
                            Encuentra tu próximo destino
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-50">
                            Compara y reserva los mejores vuelos al mejor precio
                        </p>
                    </div>

                    {/* Search Form */}
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
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
                                        <PaperAirplaneIcon className="w-5 h-5 inline-block mr-2" />
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
                                        <ArrowPathIcon className="w-5 h-5 inline-block mr-2" />
                                        Ida y Regreso
                                    </button>
                                </div>

                                {/* Ciudades y Fechas */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Desde */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
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
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
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
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                            <CalendarIcon className="w-5 h-5 mr-2 text-primary-500" />
                                            Fecha de inicio
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.fecha_ida}
                                            onChange={(e) => setFormData({ ...formData, fecha_ida: e.target.value })}
                                            min={today}
                                            max={maxDateStr}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                errors.fecha_ida ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.fecha_ida && (
                                            <p className="mt-1 text-sm text-red-600">{errors.fecha_ida}</p>
                                        )}
                                    </div>

                                    {/* Fecha de Finalización */}
                                    {tipoViaje === 'ida_regreso' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <CalendarIcon className="w-5 h-5 mr-2 text-primary-500" />
                                                Fecha de finalización
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.fecha_regreso}
                                                onChange={(e) => setFormData({ ...formData, fecha_regreso: e.target.value })}
                                                min={formData.fecha_ida || today}
                                                max={maxDateStr}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                    errors.fecha_regreso ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.fecha_regreso && (
                                                <p className="mt-1 text-sm text-red-600">{errors.fecha_regreso}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Pasajeros */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                        <UserGroupIcon className="w-5 h-5 mr-2 text-primary-500" />
                                        Adultos (máximo 5)
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, pasajeros: Math.max(1, formData.pasajeros - 1) })}
                                            className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold flex items-center justify-center transition-colors"
                                        >
                                            <MinusIcon className="w-6 h-6" />
                                        </button>
                                        <span className="text-2xl font-bold text-gray-700 w-16 text-center">
                                            {formData.pasajeros}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, pasajeros: Math.min(5, formData.pasajeros + 1) })}
                                            className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold flex items-center justify-center transition-colors"
                                        >
                                            <PlusIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                    {errors.pasajeros && (
                                        <p className="mt-1 text-sm text-red-600">{errors.pasajeros}</p>
                                    )}
                                </div>

                                {/* Botón de búsqueda */}
                                <button
                                    type="submit"
                                    className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
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
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        ¿Por qué elegir AirGuider?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CurrencyDollarIcon className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mejores Precios</h3>
                            <p className="text-gray-600">
                                Encuentra las tarifas más competitivas del mercado
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BoltIcon className="w-8 h-8 text-secondary-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Reserva Rápida</h3>
                            <p className="text-gray-600">
                                Proceso de reserva simple y en pocos pasos
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LockClosedIcon className="w-8 h-8 text-accent-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Pago Seguro</h3>
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

