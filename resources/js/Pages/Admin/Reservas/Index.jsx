import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { TicketIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function ReservasIndex({ reservas }) {
    return (
        <AdminLayout>
            <Head title="Reservas" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <TicketIcon className="w-8 h-8 mr-3 text-primary-600" />
                        Todas las Reservas
                    </h1>
                    <p className="text-gray-600 mt-1">Vista completa de todas las reservas del sistema</p>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-primary-600">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Código</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Pagador</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Pasajeros</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Fecha</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reservas.data.map((reserva) => (
                                <tr key={reserva.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-primary-600">{reserva.codigo_unico}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{reserva.pagador?.nombre_completo}</div>
                                        <div className="text-xs text-gray-500">{reserva.pagador?.correo}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{reserva.pasajeros_count}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">${reserva.total?.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                                            reserva.estado === 'pagada' ? 'bg-blue-100 text-blue-800' :
                                            reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                            reserva.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {reserva.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Date(reserva.created_at).toLocaleDateString('es-CO')}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(reserva.created_at).toLocaleTimeString('es-CO')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Link
                                            href={route('admin.reservas.show', reserva.id)}
                                            className="text-primary-600 hover:text-primary-900"
                                        >
                                            <EyeIcon className="w-5 h-5 inline" />
                                        </Link>
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

