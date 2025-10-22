import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { MapPinIcon, ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function EditCiudad({ ciudad }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: ciudad.nombre || '',
        codigo_iata: ciudad.codigo_iata || '',
        pais: ciudad.pais || 'Colombia',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.ciudades.update', ciudad.id));
    };

    return (
        <AdminLayout>
            <Head title="Editar Ciudad" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="flex items-center text-3xl font-bold text-gray-900">
                        <MapPinIcon className="w-8 h-8 mr-3 text-primary-600" />
                        Editar Ciudad: {ciudad.nombre}
                    </h1>
                    <Link
                        href={route('admin.ciudades.index')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>Volver</span>
                    </Link>
                </div>

                <div className="max-w-2xl p-8 bg-white rounded-lg shadow-md">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                Nombre de la Ciudad *
                            </label>
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Bogotá"
                                required
                            />
                            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                Código IATA *
                            </label>
                            <input
                                type="text"
                                value={data.codigo_iata}
                                onChange={(e) => setData('codigo_iata', e.target.value.toUpperCase())}
                                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="BOG"
                                maxLength="3"
                                required
                            />
                            {errors.codigo_iata && <p className="mt-1 text-sm text-red-600">{errors.codigo_iata}</p>}
                            <p className="mt-1 text-xs text-gray-500">
                                Código de 3 letras del aeropuerto internacional
                            </p>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                País *
                            </label>
                            <input
                                type="text"
                                value={data.pais}
                                onChange={(e) => setData('pais', e.target.value)}
                                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Colombia"
                                required
                            />
                            {errors.pais && <p className="mt-1 text-sm text-red-600">{errors.pais}</p>}
                        </div>

                        <div className="flex items-center justify-end pt-6 space-x-4 border-t">
                            <Link
                                href={route('admin.ciudades.index')}
                                className="px-6 py-3 font-semibold text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
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
