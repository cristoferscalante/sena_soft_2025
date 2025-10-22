import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import useFormNotifications from '@/hooks/useFormNotifications';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    PaperAirplaneIcon,
    MagnifyingGlassIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function VuelosIndex({ vuelos, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const { showSuccess, showError } = useFormNotifications();

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este vuelo?')) {
            router.delete(route('admin.vuelos.destroy', id), {
                onSuccess: () => {
                    showSuccess('Vuelo eliminado exitosamente');
                },
                onError: () => {
                    showError('No se pudo eliminar el vuelo');
                },
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.vuelos.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearSearch = () => {
        setSearch('');
        router.get(route('admin.vuelos.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Gestión de Vuelos" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="flex items-center text-3xl font-bold text-gray-900">
                            <PaperAirplaneIcon className="w-8 h-8 mr-3 text-primary-600" />
                            Gestión de Vuelos
                        </h1>
                        <p className="mt-1 text-gray-600">Administra todos los vuelos del sistema</p>
                    </div>
                    <Link
                        href={route('admin.vuelos.create')}
                        className="flex items-center px-6 py-3 space-x-2 font-bold text-white transition-colors rounded-lg shadow-lg bg-secondary-500 hover:bg-secondary-600"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Nuevo Vuelo</span>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="p-4 mb-6 bg-white rounded-lg shadow-md">
                    <form onSubmit={handleSearch} className="flex items-center space-x-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full py-3 pl-10 pr-10 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Buscar por código de vuelo, ciudad, aeronave o estado..."
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
                        >
                            <MagnifyingGlassIcon className="w-5 h-5" />
                            <span>Buscar</span>
                        </button>
                    </form>

                    {filters.search && (
                        <div className="flex items-center justify-between mt-3 text-sm">
                            <span className="text-gray-600">
                                Resultados para: <span className="font-semibold text-gray-900">"{filters.search}"</span>
                            </span>
                            <button
                                onClick={clearSearch}
                                className="font-medium text-primary-600 hover:text-primary-800"
                            >
                                Limpiar búsqueda
                            </button>
                        </div>
                    )}
                </div>

                {/* Vuelos Table */}
                <div className="overflow-hidden bg-white rounded-lg shadow-md">
                    {vuelos.data.length === 0 ? (
                        <div className="py-12 text-center">
                            <PaperAirplaneIcon className="w-12 h-12 mx-auto text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron vuelos</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {filters.search
                                    ? 'Intenta con otros términos de búsqueda.'
                                    : 'Comienza creando un nuevo vuelo.'}
                            </p>
                            {filters.search && (
                                <button
                                    onClick={clearSearch}
                                    className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700"
                                >
                                    Limpiar búsqueda
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-primary-600">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                                                Código
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                                                Ruta
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                                                Fecha/Hora
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                                                Precio
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                                                Asientos
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-white uppercase">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {vuelos.data.map((vuelo) => (
                                            <tr key={vuelo.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-primary-600">
                                                        {vuelo.codigo_vuelo}
                                                    </div>
                                                </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {vuelo.ciudad_origen?.nombre} → {vuelo.ciudad_destino?.nombre}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {vuelo.aeronave?.modelo?.nombre}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(vuelo.fecha_salida).toLocaleDateString('es-CO')}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {vuelo.hora_salida?.substring(0, 5)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">
                                                ${vuelo.precio_base?.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {vuelo.asientos_disponibles} / {vuelo.capacidad_total}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                vuelo.estado === 'programado' ? 'bg-green-100 text-green-800' :
                                                vuelo.estado === 'en_vuelo' ? 'bg-blue-100 text-blue-800' :
                                                vuelo.estado === 'completado' ? 'bg-gray-100 text-gray-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {vuelo.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                            <Link
                                                href={route('admin.vuelos.edit', vuelo.id)}
                                                className="mr-4 text-primary-600 hover:text-primary-900"
                                            >
                                                <PencilIcon className="inline w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(vuelo.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <TrashIcon className="inline w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {vuelos.links && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Mostrando <span className="font-medium">{vuelos.from}</span> a{' '}
                                    <span className="font-medium">{vuelos.to}</span> de{' '}
                                    <span className="font-medium">{vuelos.total}</span> resultados
                                </div>
                                <div className="flex space-x-2">
                                    {vuelos.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                link.active
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

