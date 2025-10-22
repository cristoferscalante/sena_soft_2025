import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useFormNotifications from '@/hooks/useFormNotifications';
import { MapPinIcon, ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function CreateCiudad() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        codigo_iata: '',
        pais: 'Colombia',
    });

    const { showSuccess, showError } = useFormNotifications();

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.ciudades.store'), {
            onSuccess: () => {
                showSuccess('Ciudad creada exitosamente');
            },
            onError: () => {
                showError('Error al crear la ciudad. Verifica los campos.');
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Crear Ciudad" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <MapPinIcon className="w-8 h-8 mr-3 text-primary-600" />
                        Nueva Ciudad
                    </h1>
                    <Link
                        href={route('admin.ciudades.index')}
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
                                Nombre de la Ciudad *
                            </label>
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                placeholder="Bogotá"
                                required
                            />
                            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Código IATA *
                            </label>
                            <input
                                type="text"
                                value={data.codigo_iata}
                                onChange={(e) => setData('codigo_iata', e.target.value.toUpperCase())}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                placeholder="BOG"
                                maxLength="3"
                                required
                            />
                            {errors.codigo_iata && <p className="mt-1 text-sm text-red-600">{errors.codigo_iata}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                País *
                            </label>
                            <input
                                type="text"
                                value={data.pais}
                                onChange={(e) => setData('pais', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                placeholder="Colombia"
                                required
                            />
                            {errors.pais && <p className="mt-1 text-sm text-red-600">{errors.pais}</p>}
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                            <Link
                                href={route('admin.ciudades.index')}
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
                                <span>{processing ? 'Guardando...' : 'Crear Ciudad'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

