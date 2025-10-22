import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BuildingOfficeIcon, ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function EditAeronave({ aeronave, modelos }) {
    const { data, setData, put, processing, errors } = useForm({
        modelo_id: aeronave.modelo_id || '',
        matricula: aeronave.matricula || '',
        anio_fabricacion: aeronave.anio_fabricacion || new Date().getFullYear(),
        estado: aeronave.estado || 'activo',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.aeronaves.update', aeronave.id));
    };

    return (
        <AdminLayout>
            <Head title="Editar Aeronave" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <BuildingOfficeIcon className="w-8 h-8 mr-3 text-primary-600" />
                        Editar Aeronave: {aeronave.matricula}
                    </h1>
                    <Link
                        href={route('admin.aeronaves.index')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>Volver</span>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Modelo de Aeronave *
                            </label>
                            <select
                                value={data.modelo_id}
                                onChange={(e) => setData('modelo_id', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                required
                            >
                                <option value="">Seleccionar modelo</option>
                                {modelos?.map((modelo) => (
                                    <option key={modelo.id} value={modelo.id}>
                                        {modelo.nombre} - {modelo.fabricante} ({modelo.capacidad_total} asientos)
                                    </option>
                                ))}
                            </select>
                            {errors.modelo_id && <p className="mt-1 text-sm text-red-600">{errors.modelo_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Matrícula *
                            </label>
                            <input
                                type="text"
                                value={data.matricula}
                                onChange={(e) => setData('matricula', e.target.value.toUpperCase())}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                placeholder="HK-5050"
                                required
                            />
                            {errors.matricula && <p className="mt-1 text-sm text-red-600">{errors.matricula}</p>}
                            <p className="mt-1 text-xs text-gray-500">
                                Identificación única de la aeronave
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Año de Fabricación
                            </label>
                            <input
                                type="number"
                                value={data.anio_fabricacion}
                                onChange={(e) => setData('anio_fabricacion', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                min="1900"
                                max={new Date().getFullYear() + 1}
                            />
                            {errors.anio_fabricacion && <p className="mt-1 text-sm text-red-600">{errors.anio_fabricacion}</p>}
                        </div>

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
                                <option value="activo">Activo</option>
                                <option value="mantenimiento">En Mantenimiento</option>
                                <option value="fuera_servicio">Fuera de Servicio</option>
                            </select>
                            {errors.estado && <p className="mt-1 text-sm text-red-600">{errors.estado}</p>}
                            <p className="mt-1 text-xs text-gray-500">
                                Solo aeronaves activas pueden ser asignadas a nuevos vuelos
                            </p>
                        </div>

                        {/* Info adicional */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-blue-900 mb-2">Información actual:</h3>
                            <div className="grid grid-cols-1 gap-2 text-sm text-blue-800">
                                <div>
                                    <span className="font-medium">Modelo actual:</span> {aeronave.modelo?.nombre}
                                </div>
                                <div>
                                    <span className="font-medium">Fabricante:</span> {aeronave.modelo?.fabricante}
                                </div>
                                <div>
                                    <span className="font-medium">Capacidad:</span> {aeronave.modelo?.capacidad_total} asientos
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                            <Link
                                href={route('admin.aeronaves.index')}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`flex items-center space-x-2 font-bold py-3 px-6 rounded-lg transition-colors shadow-lg ${
                                    processing ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-secondary-500 hover:bg-secondary-600 text-white'
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
