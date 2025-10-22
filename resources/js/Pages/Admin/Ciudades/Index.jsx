import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { MapPinIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function CiudadesIndex({ ciudades }) {
    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar esta ciudad?')) {
            router.delete(route('admin.ciudades.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Gestión de Ciudades" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <MapPinIcon className="w-8 h-8 mr-3 text-primary-600" />
                            Gestión de Ciudades
                        </h1>
                    </div>
                    <Link
                        href={route('admin.ciudades.create')}
                        className="flex items-center space-x-2 bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Nueva Ciudad</span>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-primary-600">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Código IATA</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">País</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Vuelos</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {ciudades.data.map((ciudad) => (
                                <tr key={ciudad.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">{ciudad.nombre}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-primary-600 font-semibold">{ciudad.codigo_iata}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{ciudad.pais}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">
                                            {(ciudad.vuelos_origen_count || 0) + (ciudad.vuelos_destino_count || 0)} vuelos
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Link
                                            href={route('admin.ciudades.edit', ciudad.id)}
                                            className="text-primary-600 hover:text-primary-900 mr-4"
                                        >
                                            <PencilIcon className="w-5 h-5 inline" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(ciudad.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <TrashIcon className="w-5 h-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

