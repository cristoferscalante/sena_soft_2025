import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    PlusIcon,
    PencilIcon,
    TrashIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/outline';

export default function VuelosIndex({ vuelos }) {
    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este vuelo?')) {
            router.delete(route('admin.vuelos.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Gestión de Vuelos" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <PaperAirplaneIcon className="w-8 h-8 mr-3 text-primary-600" />
                            Gestión de Vuelos
                        </h1>
                        <p className="text-gray-600 mt-1">Administra todos los vuelos del sistema</p>
                    </div>
                    <Link
                        href={route('admin.vuelos.create')}
                        className="flex items-center space-x-2 bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Nuevo Vuelo</span>
                    </Link>
                </div>

                {/* Vuelos Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-primary-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Código
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Ruta
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Fecha/Hora
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Precio
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Asientos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
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
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={route('admin.vuelos.edit', vuelo.id)}
                                                className="text-primary-600 hover:text-primary-900 mr-4"
                                            >
                                                <PencilIcon className="w-5 h-5 inline" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(vuelo.id)}
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

                    {/* Pagination */}
                    {vuelos.links && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
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
                </div>
            </div>
        </AdminLayout>
    );
}

