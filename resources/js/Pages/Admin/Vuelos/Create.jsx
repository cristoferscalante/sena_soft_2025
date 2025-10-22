import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useFormNotifications from '@/hooks/useFormNotifications';
import {
    PaperAirplaneIcon,
    ArrowLeftIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

export default function CreateVuelo({ ciudades, aeronaves }) {
    const { data, setData, post, processing, errors } = useForm({
        codigo_vuelo: '',
        origen_ciudad_id: '',
        destino_ciudad_id: '',
        aeronave_id: '',
        fecha_salida: '',
        hora_salida: '',
        fecha_llegada: '',
        hora_llegada: '',
        precio_base: '',
    });

    const { showSuccess, showError } = useFormNotifications();

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.vuelos.store'), {
            onSuccess: () => {
                showSuccess('Vuelo creado exitosamente');
            },
            onError: () => {
                showError('Error al crear el vuelo. Verifica los campos.');
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Crear Vuelo" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <PaperAirplaneIcon className="w-8 h-8 mr-3 text-primary-600" />
                        Crear Nuevo Vuelo
                    </h1>
                    <Link
                        href={route('admin.vuelos.index')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>Volver</span>
                    </Link>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Código de Vuelo */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Código de Vuelo *
                                </label>
                                <input
                                    type="text"
                                    value={data.codigo_vuelo}
                                    onChange={(e) => setData('codigo_vuelo', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                    placeholder="AG101"
                                    required
                                />
                                {errors.codigo_vuelo && (
                                    <p className="mt-1 text-sm text-red-600">{errors.codigo_vuelo}</p>
                                )}
                            </div>

                            {/* Aeronave */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Aeronave *
                                </label>
                                <select
                                    value={data.aeronave_id}
                                    onChange={(e) => setData('aeronave_id', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                    required
                                >
                                    <option value="">Seleccionar aeronave</option>
                                    {aeronaves.map((aeronave) => (
                                        <option key={aeronave.id} value={aeronave.id}>
                                            {aeronave.matricula} - {aeronave.modelo?.nombre} ({aeronave.modelo?.capacidad_total} asientos)
                                        </option>
                                    ))}
                                </select>
                                {errors.aeronave_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.aeronave_id}</p>
                                )}
                            </div>

                            {/* Origen */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ciudad Origen *
                                </label>
                                <select
                                    value={data.origen_ciudad_id}
                                    onChange={(e) => setData('origen_ciudad_id', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                    required
                                >
                                    <option value="">Seleccionar ciudad</option>
                                    {ciudades.map((ciudad) => (
                                        <option key={ciudad.id} value={ciudad.id}>
                                            {ciudad.nombre} ({ciudad.codigo_iata})
                                        </option>
                                    ))}
                                </select>
                                {errors.origen_ciudad_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.origen_ciudad_id}</p>
                                )}
                            </div>

                            {/* Destino */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ciudad Destino *
                                </label>
                                <select
                                    value={data.destino_ciudad_id}
                                    onChange={(e) => setData('destino_ciudad_id', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                    required
                                >
                                    <option value="">Seleccionar ciudad</option>
                                    {ciudades.map((ciudad) => (
                                        <option key={ciudad.id} value={ciudad.id}>
                                            {ciudad.nombre} ({ciudad.codigo_iata})
                                        </option>
                                    ))}
                                </select>
                                {errors.destino_ciudad_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.destino_ciudad_id}</p>
                                )}
                            </div>

                            {/* Fecha Salida */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Fecha de Salida *
                                </label>
                                <input
                                    type="date"
                                    value={data.fecha_salida}
                                    onChange={(e) => setData('fecha_salida', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                    required
                                />
                                {errors.fecha_salida && (
                                    <p className="mt-1 text-sm text-red-600">{errors.fecha_salida}</p>
                                )}
                            </div>

                            {/* Hora Salida */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Hora de Salida *
                                </label>
                                <input
                                    type="time"
                                    value={data.hora_salida}
                                    onChange={(e) => setData('hora_salida', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                    required
                                />
                                {errors.hora_salida && (
                                    <p className="mt-1 text-sm text-red-600">{errors.hora_salida}</p>
                                )}
                            </div>

                            {/* Fecha Llegada */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Fecha de Llegada *
                                </label>
                                <input
                                    type="date"
                                    value={data.fecha_llegada}
                                    onChange={(e) => setData('fecha_llegada', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                    required
                                />
                                {errors.fecha_llegada && (
                                    <p className="mt-1 text-sm text-red-600">{errors.fecha_llegada}</p>
                                )}
                            </div>

                            {/* Hora Llegada */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Hora de Llegada *
                                </label>
                                <input
                                    type="time"
                                    value={data.hora_llegada}
                                    onChange={(e) => setData('hora_llegada', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                    required
                                />
                                {errors.hora_llegada && (
                                    <p className="mt-1 text-sm text-red-600">{errors.hora_llegada}</p>
                                )}
                            </div>

                            {/* Precio Base */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Precio Base (COP) *
                                </label>
                                <input
                                    type="number"
                                    value={data.precio_base}
                                    onChange={(e) => setData('precio_base', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                    placeholder="250000"
                                    required
                                    min="0"
                                    step="1000"
                                />
                                {errors.precio_base && (
                                    <p className="mt-1 text-sm text-red-600">{errors.precio_base}</p>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                            <Link
                                href={route('admin.vuelos.index')}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`flex items-center space-x-2 font-bold py-3 px-6 rounded-lg transition-colors shadow-lg ${
                                    processing
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-secondary-500 hover:bg-secondary-600 text-white'
                                }`}
                            >
                                <CheckIcon className="w-5 h-5" />
                                <span>{processing ? 'Guardando...' : 'Crear Vuelo'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

