import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useFormNotifications from '@/hooks/useFormNotifications';
import {
    PaperAirplaneIcon,
    ArrowLeftIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

export default function EditVuelo({ vuelo, ciudades, aeronaves }) {
    const { data, setData, put, processing, errors } = useForm({
        codigo_vuelo: vuelo.codigo_vuelo || '',
        origen_ciudad_id: vuelo.origen_ciudad_id || '',
        destino_ciudad_id: vuelo.destino_ciudad_id || '',
        fecha_salida: vuelo.fecha_salida || '',
        hora_salida: vuelo.hora_salida?.substring(0, 5) || '',
        fecha_llegada: vuelo.fecha_llegada || '',
        hora_llegada: vuelo.hora_llegada?.substring(0, 5) || '',
        precio_base: vuelo.precio_base || '',
        estado: vuelo.estado || 'programado',
    });

    const { showSuccess, showError } = useFormNotifications();

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.vuelos.update', vuelo.id), {
            onSuccess: () => {
                showSuccess('Vuelo actualizado exitosamente');
            },
            onError: () => {
                showError('Error al actualizar el vuelo. Verifica los campos.');
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Editar Vuelo" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <PaperAirplaneIcon className="w-8 h-8 mr-3 text-primary-600" />
                        Editar Vuelo: {vuelo.codigo_vuelo}
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

                            {/* Estado */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Estado *
                                </label>
                                <select
                                    value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                    required
                                >
                                    <option value="programado">Programado</option>
                                    <option value="en_vuelo">En Vuelo</option>
                                    <option value="completado">Completado</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                                {errors.estado && (
                                    <p className="mt-1 text-sm text-red-600">{errors.estado}</p>
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

                            {/* Aeronave - Solo lectura */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Aeronave (no editable)
                                </label>
                                <input
                                    type="text"
                                    value={`${vuelo.aeronave?.matricula} - ${vuelo.aeronave?.modelo?.nombre}`}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                                    disabled
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    No se puede cambiar la aeronave una vez creado el vuelo
                                </p>
                            </div>
                        </div>

                        {/* Info adicional */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-blue-900 mb-2">Información del vuelo:</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
                                <div>
                                    <span className="font-medium">Capacidad total:</span> {vuelo.capacidad_total} asientos
                                </div>
                                <div>
                                    <span className="font-medium">Asientos disponibles:</span> {vuelo.asientos_disponibles}
                                </div>
                                <div>
                                    <span className="font-medium">Aeronave:</span> {vuelo.aeronave?.modelo?.nombre}
                                </div>
                                <div>
                                    <span className="font-medium">Matrícula:</span> {vuelo.aeronave?.matricula}
                                </div>
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
                                <span>{processing ? 'Guardando...' : 'Guardar Cambios'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
