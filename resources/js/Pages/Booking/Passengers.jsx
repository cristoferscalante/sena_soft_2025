import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import LoginSuggestion from '@/Components/LoginSuggestion';
import { 
    UserGroupIcon,
    CreditCardIcon,
    CheckCircleIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Passengers({ vuelos, asientos, cantidad_pasajeros }) {
    const [pasajeros, setPasajeros] = useState(
        Array(cantidad_pasajeros).fill(null).map(() => ({
            primer_apellido: '',
            segundo_apellido: '',
            nombres: '',
            fecha_nacimiento: '',
            genero: '',
            tipo_documento: 'CC',
            numero_documento: '',
            es_infante: false,
            celular: '',
            correo: '',
        }))
    );

    const [pagador, setPagador] = useState({
        nombre_completo: '',
        tipo_documento: 'CC',
        numero_documento: '',
        correo: '',
        telefono: '',
    });

    const [terminosAceptados, setTerminosAceptados] = useState(false);
    const [errors, setErrors] = useState({});

    const handlePasajeroChange = (index, field, value) => {
        const newPasajeros = [...pasajeros];
        newPasajeros[index][field] = value;
        setPasajeros(newPasajeros);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        if (!terminosAceptados) {
            setErrors({ terminos: 'Debes aceptar los términos y condiciones' });
            return;
        }

        router.post(route('booking.store'), {
            pagador,
            pasajeros,
            vuelos: vuelos.map(v => ({ vuelo_id: v.id, tipo_viaje: 'ida' })),
            asientos,
            terminos_aceptados: terminosAceptados,
        });
    };

    return (
        <MainLayout>
            <Head title="Datos de Pasajeros" />

            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                                        <CheckCircleIcon className="w-5 h-5" />
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-700">Vuelos</span>
                                </div>
                                <div className="w-16 h-1 bg-green-500"></div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                                        <CheckCircleIcon className="w-5 h-5" />
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-700">Asientos</span>
                                </div>
                                <div className="w-16 h-1 bg-primary-500"></div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                                        3
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-primary-700">Pasajeros</span>
                                </div>
                                <div className="w-16 h-1 bg-gray-300"></div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
                                        4
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-500">Pago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sugerencia de Login/Registro */}
                    <LoginSuggestion />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Datos de Pasajeros */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <UserGroupIcon className="w-8 h-8 mr-3 text-primary-600" />
                                Datos de los Pasajeros
                            </h2>

                            {pasajeros.map((pasajero, index) => (
                                <div key={index} className="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
                                    <h3 className="text-lg font-semibold text-primary-600 mb-4">
                                        Pasajero {index + 1}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Primer Apellido *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={pasajero.primer_apellido}
                                                onChange={(e) => handlePasajeroChange(index, 'primer_apellido', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Segundo Apellido
                                            </label>
                                            <input
                                                type="text"
                                                value={pasajero.segundo_apellido}
                                                onChange={(e) => handlePasajeroChange(index, 'segundo_apellido', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombres *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={pasajero.nombres}
                                                onChange={(e) => handlePasajeroChange(index, 'nombres', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Fecha de Nacimiento *
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                max={new Date().toISOString().split('T')[0]}
                                                value={pasajero.fecha_nacimiento}
                                                onChange={(e) => handlePasajeroChange(index, 'fecha_nacimiento', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Género *
                                            </label>
                                            <select
                                                required
                                                value={pasajero.genero}
                                                onChange={(e) => handlePasajeroChange(index, 'genero', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            >
                                                <option value="">Seleccionar</option>
                                                <option value="M">Masculino</option>
                                                <option value="F">Femenino</option>
                                                <option value="Otro">Otro</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tipo de Documento *
                                            </label>
                                            <select
                                                required
                                                value={pasajero.tipo_documento}
                                                onChange={(e) => handlePasajeroChange(index, 'tipo_documento', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            >
                                                <option value="CC">Cédula de Ciudadanía</option>
                                                <option value="CE">Cédula de Extranjería</option>
                                                <option value="Pasaporte">Pasaporte</option>
                                                <option value="TI">Tarjeta de Identidad</option>
                                                <option value="RC">Registro Civil</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Número de Documento *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={pasajero.numero_documento}
                                                onChange={(e) => handlePasajeroChange(index, 'numero_documento', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Celular *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={pasajero.celular}
                                                onChange={(e) => handlePasajeroChange(index, 'celular', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Correo Electrónico *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={pasajero.correo}
                                                onChange={(e) => handlePasajeroChange(index, 'correo', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={pasajero.es_infante}
                                                onChange={(e) => handlePasajeroChange(index, 'es_infante', e.target.checked)}
                                                className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 text-sm text-gray-700">
                                                Es infante (menor de 3 años)
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Datos del Pagador */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <CreditCardIcon className="w-8 h-8 mr-3 text-primary-600" />
                                Datos del Pagador
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre Completo *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={pagador.nombre_completo}
                                        onChange={(e) => setPagador({ ...pagador, nombre_completo: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo de Documento *
                                    </label>
                                    <select
                                        required
                                        value={pagador.tipo_documento}
                                        onChange={(e) => setPagador({ ...pagador, tipo_documento: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="CE">Cédula de Extranjería</option>
                                        <option value="Pasaporte">Pasaporte</option>
                                        <option value="TI">Tarjeta de Identidad</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Número de Documento *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={pagador.numero_documento}
                                        onChange={(e) => setPagador({ ...pagador, numero_documento: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Correo Electrónico *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={pagador.correo}
                                        onChange={(e) => setPagador({ ...pagador, correo: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Teléfono *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={pagador.telefono}
                                        onChange={(e) => setPagador({ ...pagador, telefono: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Términos y Condiciones */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    checked={terminosAceptados}
                                    onChange={(e) => setTerminosAceptados(e.target.checked)}
                                    className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                                />
                                <label className="ml-3 text-sm text-gray-700">
                                    Acepto los{' '}
                                    <a href="/terminos-condiciones" target="_blank" className="text-primary-600 hover:underline font-semibold">
                                        términos y condiciones
                                    </a>{' '}
                                    de AirGuider *
                                </label>
                            </div>
                            {errors.terminos && (
                                <p className="mt-2 text-sm text-red-600">{errors.terminos}</p>
                            )}
                        </div>

                        {/* Botón de continuar */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <button
                                type="submit"
                                className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg flex items-center justify-center space-x-2"
                            >
                                <span>Continuar al Pago</span>
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}

