import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import useFormNotifications from '@/hooks/useFormNotifications';
import { 
    UserIcon, 
    EnvelopeIcon, 
    LockClosedIcon,
    CheckCircleIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const { showSuccess, showError } = useFormNotifications();

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onSuccess: () => {
                showSuccess('¡Cuenta creada exitosamente! Bienvenido a AirGuider.');
            },
            onError: () => {
                showError('Error al crear la cuenta. Verifica los campos.');
            },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <MainLayout>
            <Head title="Crear Cuenta" />

            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {/* Benefits Column */}
                        <div className="md:col-span-2 hidden md:block">
                            <div className="sticky top-24">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    ¿Por qué crear una cuenta?
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                <CheckCircleIcon className="w-6 h-6 text-primary-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Historial de Reservas</h3>
                                            <p className="text-sm text-gray-600">
                                                Accede a todas tus reservas desde un solo lugar
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                                                <CheckCircleIcon className="w-6 h-6 text-secondary-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                                            <p className="text-sm text-gray-600">
                                                Recibe alertas de cambios en tus vuelos
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                                                <CheckCircleIcon className="w-6 h-6 text-accent-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Descuentos Exclusivos</h3>
                                            <p className="text-sm text-gray-600">
                                                Ofertas especiales para usuarios registrados
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Compra Más Rápida</h3>
                                            <p className="text-sm text-gray-600">
                                                Tus datos guardados para futuras reservas
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="md:col-span-3">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-full mb-4">
                                    <UserIcon className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Crear Cuenta
                                </h1>
                                <p className="text-gray-600">
                                    Es gratis y solo toma un minuto
                                </p>
                            </div>

                            {/* Register Form */}
                            <div className="bg-white rounded-lg shadow-xl p-8">
                                <form onSubmit={submit} className="space-y-5">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                            <UserIcon className="w-5 h-5 mr-2 text-primary-500" />
                                            Nombre Completo
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            autoComplete="name"
                                            autoFocus
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Juan Pérez"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                            <EnvelopeIcon className="w-5 h-5 mr-2 text-primary-500" />
                                            Correo Electrónico
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            autoComplete="username"
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="tu@email.com"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                            <LockClosedIcon className="w-5 h-5 mr-2 text-primary-500" />
                                            Contraseña
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="••••••••"
                                            required
                                        />
                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            Mínimo 8 caracteres
                                        </p>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                            <LockClosedIcon className="w-5 h-5 mr-2 text-primary-500" />
                                            Confirmar Contraseña
                                        </label>
                                        <input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="••••••••"
                                            required
                                        />
                                        {errors.password_confirmation && (
                                            <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                                        )}
                                    </div>

                                    {/* Terms */}
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-600">
                                            Al crear una cuenta, aceptas nuestros{' '}
                                            <Link href="/terminos-condiciones" className="text-primary-600 hover:underline font-semibold">
                                                Términos y Condiciones
                                            </Link>
                                            {' '}y{' '}
                                            <Link href="/terminos-condiciones" className="text-primary-600 hover:underline font-semibold">
                                                Política de Privacidad
                                            </Link>
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`w-full font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg flex items-center justify-center space-x-2 ${
                                            processing
                                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                                : 'bg-secondary-500 hover:bg-secondary-600 text-white'
                                        }`}
                                    >
                                        <span>{processing ? 'Creando cuenta...' : 'Crear Cuenta Gratis'}</span>
                                        {!processing && <ArrowRightIcon className="w-5 h-5" />}
                                    </button>
                                </form>

                                {/* Login Link */}
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600">
                                        ¿Ya tienes una cuenta?{' '}
                                        <Link
                                            href={route('login')}
                                            className="text-primary-600 hover:text-primary-700 font-bold"
                                        >
                                            Inicia Sesión
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Continue as Guest */}
                            <div className="mt-6 text-center">
                                <Link
                                    href="/"
                                    className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                                >
                                    ← Continuar sin registrarme
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
