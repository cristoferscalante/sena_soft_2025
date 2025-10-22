import { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import LoginSuggestion from '@/Components/LoginSuggestion';
import useFormNotifications from '@/hooks/useFormNotifications';
import {
    UserGroupIcon,
    CreditCardIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function Passengers({ vuelos, asientos, cantidad_pasajeros, cantidad_adultos, cantidad_infantes }) {
    const { errors: serverErrors } = usePage().props;
    const { showError, showSuccess } = useFormNotifications();

    // Calcular si un índice corresponde a un infante
    // Los primeros cantidad_adultos son adultos, los siguientes son infantes
    const esIndiceInfante = (index) => {
        // Solo considerar como infante si realmente hay infantes en la reserva
        return cantidad_infantes > 0 && cantidad_adultos && index >= cantidad_adultos;
    };

    // Intentar cargar datos del localStorage (válido por 1 hora)
    const loadFromCache = () => {
        try {
            const cached = localStorage.getItem('passengerData');
            if (cached) {
                const data = JSON.parse(cached);
                const cacheTime = localStorage.getItem('passengerDataTime');
                if (cacheTime && (Date.now() - parseInt(cacheTime)) < 3600000) {
                    return data;
                }
            }
        } catch (e) {
            console.error('Error loading cache:', e);
        }
        return null;
    };

    const cachedData = loadFromCache();

    const [pasajeros, setPasajeros] = useState(
        cachedData?.pasajeros || Array(cantidad_pasajeros).fill(null).map(() => ({
            primer_apellido: '',
            segundo_apellido: '',
            nombres: '',
            fecha_nacimiento: '',
            genero: '',
            tipo_documento: 'CC',
            numero_documento: '',
            celular: '',
            correo: '',
        }))
    );

    const [pagador, setPagador] = useState(cachedData?.pagador || {
        nombre_completo: '',
        tipo_documento: 'CC',
        numero_documento: '',
        correo: '',
        telefono: '',
    });

    const [terminosAceptados, setTerminosAceptados] = useState(false);
    const [errors, setErrors] = useState({});

    // Guardar en cache automáticamente
    useEffect(() => {
        try {
            localStorage.setItem('passengerData', JSON.stringify({ pasajeros, pagador }));
            localStorage.setItem('passengerDataTime', Date.now().toString());
        } catch (e) {
            console.error('Error saving cache:', e);
        }
    }, [pasajeros, pagador]);

    // Calcular si un pasajero es infante (menor de 3 años)
    const esInfante = (fechaNacimiento) => {
        if (!fechaNacimiento) return false;
        const hoy = new Date();
        const fechaNac = new Date(fechaNacimiento);
        const edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mesActual = hoy.getMonth();
        const mesNac = fechaNac.getMonth();

        if (mesActual < mesNac || (mesActual === mesNac && hoy.getDate() < fechaNac.getDate())) {
            return (edad - 1) < 3;
        }
        return edad < 3;
    };

    const handlePasajeroChange = (index, field, value) => {
        const newPasajeros = [...pasajeros];
        newPasajeros[index][field] = value;
        setPasajeros(newPasajeros);

        // Limpiar error específico del campo
        if (errors[`pasajero_${index}_${field}`]) {
            const newErrors = { ...errors };
            delete newErrors[`pasajero_${index}_${field}`];
            setErrors(newErrors);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        // Validaciones del lado del cliente
        const newErrors = {};

        // Validar pagador
        if (!pagador.nombre_completo.trim()) {
            newErrors.pagador_nombre = 'El nombre del pagador es requerido';
        }
        if (!pagador.numero_documento.trim()) {
            newErrors.pagador_documento = 'El documento del pagador es requerido';
        }
        if (!pagador.correo.trim()) {
            newErrors.pagador_correo = 'El correo del pagador es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pagador.correo)) {
            newErrors.pagador_correo = 'El correo del pagador no es válido';
        }
        if (!pagador.telefono.trim()) {
            newErrors.pagador_telefono = 'El teléfono del pagador es requerido';
        }

        // Validar cada pasajero
        pasajeros.forEach((pasajero, index) => {
            if (!pasajero.primer_apellido.trim()) {
                newErrors[`pasajero_${index}_primer_apellido`] = 'El primer apellido es requerido';
            }
            if (!pasajero.nombres.trim()) {
                newErrors[`pasajero_${index}_nombres`] = 'Los nombres son requeridos';
            }
            if (!pasajero.fecha_nacimiento) {
                newErrors[`pasajero_${index}_fecha_nacimiento`] = 'La fecha de nacimiento es requerida';
            } else {
                const fechaNac = new Date(pasajero.fecha_nacimiento);
                if (fechaNac > new Date()) {
                    newErrors[`pasajero_${index}_fecha_nacimiento`] = 'La fecha no puede ser futura';
                }
            }
            if (!pasajero.genero) {
                newErrors[`pasajero_${index}_genero`] = 'El género es requerido';
            }
            if (!pasajero.numero_documento.trim()) {
                newErrors[`pasajero_${index}_documento`] = 'El número de documento es requerido';
            }
            if (!pasajero.celular.trim()) {
                newErrors[`pasajero_${index}_celular`] = 'El celular es requerido';
            }
            if (!pasajero.correo.trim()) {
                newErrors[`pasajero_${index}_correo`] = 'El correo es requerido';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pasajero.correo)) {
                newErrors[`pasajero_${index}_correo`] = 'El correo no es válido';
            }
        });

        if (!terminosAceptados) {
            newErrors.terminos = 'Debes aceptar los términos y condiciones';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showError('Por favor, completa todos los campos requeridos correctamente');
            const firstErrorElement = document.querySelector('.border-red-500');
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        router.post(route('booking.store'), {
            pagador,
            pasajeros,
            vuelos: vuelos.map(v => ({ vuelo_id: v.id, tipo_viaje: 'ida' })),
            asientos,
            terminos_aceptados: terminosAceptados,
        }, {
            onSuccess: () => {
                try {
                    localStorage.removeItem('passengerData');
                    localStorage.removeItem('passengerDataTime');
                } catch (e) {
                    console.error('Error clearing cache:', e);
                }
            },
            onError: (errors) => {
                showError('Error al procesar la reserva. Verifica los datos ingresados.');
                setErrors(errors);
            }
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

                            {pasajeros.map((pasajero, index) => {
                                const esInfanteActual = esInfante(pasajero.fecha_nacimiento);
                                const esInfanteEsperado = esIndiceInfante(index);
                                const contadorAdulto = esInfanteEsperado ? null : index + 1;
                                const contadorInfante = esInfanteEsperado ? (index - cantidad_adultos + 1) : null;

                                return (
                                    <div
                                        key={index}
                                        className={`mb-8 pb-8 border-b border-gray-200 last:border-b-0 ${
                                            esInfanteEsperado ? 'bg-blue-50 p-6 rounded-lg border-2 border-blue-200' : ''
                                        }`}
                                    >
                                        <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                                            esInfanteEsperado ? 'text-blue-600' : 'text-primary-600'
                                        }`}>
                                            {esInfanteEsperado ? (
                                                <>
                                                    <ExclamationCircleIcon className="w-6 h-6 mr-2" />
                                                    Infante {contadorInfante} (Menor de 3 años - No paga pasaje)
                                                </>
                                            ) : (
                                                <>Pasajero {contadorAdulto} (Adulto)</>
                                            )}
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
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                        errors[`pasajero_${index}_primer_apellido`] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {errors[`pasajero_${index}_primer_apellido`] && (
                                                    <p className="mt-1 text-sm text-red-600">{errors[`pasajero_${index}_primer_apellido`]}</p>
                                                )}
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
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                        errors[`pasajero_${index}_nombres`] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {errors[`pasajero_${index}_nombres`] && (
                                                    <p className="mt-1 text-sm text-red-600">{errors[`pasajero_${index}_nombres`]}</p>
                                                )}
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
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                        errors[`pasajero_${index}_fecha_nacimiento`] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {errors[`pasajero_${index}_fecha_nacimiento`] && (
                                                    <p className="mt-1 text-sm text-red-600">{errors[`pasajero_${index}_fecha_nacimiento`]}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Género *
                                                </label>
                                                <select
                                                    required
                                                    value={pasajero.genero}
                                                    onChange={(e) => handlePasajeroChange(index, 'genero', e.target.value)}
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                        errors[`pasajero_${index}_genero`] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                >
                                                    <option value="">Seleccionar</option>
                                                    <option value="M">Masculino</option>
                                                    <option value="F">Femenino</option>
                                                    <option value="Otro">Otro</option>
                                                </select>
                                                {errors[`pasajero_${index}_genero`] && (
                                                    <p className="mt-1 text-sm text-red-600">{errors[`pasajero_${index}_genero`]}</p>
                                                )}
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
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                        errors[`pasajero_${index}_documento`] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {errors[`pasajero_${index}_documento`] && (
                                                    <p className="mt-1 text-sm text-red-600">{errors[`pasajero_${index}_documento`]}</p>
                                                )}
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
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                        errors[`pasajero_${index}_celular`] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {errors[`pasajero_${index}_celular`] && (
                                                    <p className="mt-1 text-sm text-red-600">{errors[`pasajero_${index}_celular`]}</p>
                                                )}
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
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                        errors[`pasajero_${index}_correo`] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {errors[`pasajero_${index}_correo`] && (
                                                    <p className="mt-1 text-sm text-red-600">{errors[`pasajero_${index}_correo`]}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Alerta visual para infantes */}
                                        {esInfanteEsperado && (
                                            <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                                                <div className="flex items-start">
                                                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                    <div className="ml-3">
                                                        <h4 className="text-sm font-medium text-blue-800">Formulario de Infante</h4>
                                                        <p className="mt-1 text-sm text-blue-700">
                                                            Este pasajero debe ser menor de 3 años. No ocupará asiento y no genera costo adicional.
                                                            Viajará en brazos de un adulto.
                                                        </p>
                                                        {!esInfanteActual && pasajero.fecha_nacimiento && (
                                                            <p className="mt-2 text-sm text-red-600 font-medium">
                                                                ⚠️ La fecha ingresada no corresponde a un infante (menor de 3 años)
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
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
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                            errors.pagador_nombre ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.pagador_nombre && (
                                        <p className="mt-1 text-sm text-red-600">{errors.pagador_nombre}</p>
                                    )}
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
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                            errors.pagador_documento ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.pagador_documento && (
                                        <p className="mt-1 text-sm text-red-600">{errors.pagador_documento}</p>
                                    )}
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
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                            errors.pagador_correo ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.pagador_correo && (
                                        <p className="mt-1 text-sm text-red-600">{errors.pagador_correo}</p>
                                    )}
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
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                            errors.pagador_telefono ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.pagador_telefono && (
                                        <p className="mt-1 text-sm text-red-600">{errors.pagador_telefono}</p>
                                    )}
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
                                    className={`w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1 ${
                                        errors.terminos ? 'border-red-500' : ''
                                    }`}
                                />
                                <label className="ml-3 text-sm text-gray-700">
                                    Acepto los{' '}
                                    <a href="/terminos-condiciones" target="_blank" className="text-primary-600 hover:text-primary-700 font-medium">
                                        términos y condiciones
                                    </a>
                                    {' '}del servicio *
                                </label>
                            </div>
                            {errors.terminos && (
                                <p className="mt-2 text-sm text-red-600">{errors.terminos}</p>
                            )}
                        </div>

                        {/* Botón Continuar */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                            >
                                Continuar al pago
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
