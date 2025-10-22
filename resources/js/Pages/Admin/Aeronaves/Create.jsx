import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BuildingOfficeIcon, ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function CreateAeronave({ modelos }) {
    const { data, setData, post, processing, errors } = useForm({
        modelo_id: '',
        matricula: '',
        anio_fabricacion: new Date().getFullYear(),
        estado: 'activo',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.aeronaves.store'));
    };

    return (
        <AdminLayout>
            <Head title="Crear Aeronave" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <BuildingOfficeIcon className="w-8 h-8 mr-3 text-primary-600" />
                        Nueva Aeronave
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
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                            <Link
                                href={route('admin.aeronaves.index')}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`flex items-center space-x-2 font-bold py-3 px-6 rounded-lg shadow-lg ${
                                    processing ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-secondary-500 hover:bg-secondary-600 text-white'
                                }`}
                            >
                                <CheckIcon className="w-5 h-5" />
                                <span>{processing ? 'Guardando...' : 'Crear Aeronave'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

