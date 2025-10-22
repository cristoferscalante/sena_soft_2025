import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { 
    EnvelopeIcon, 
    LockClosedIcon,
    UserIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <MainLayout>
            <Head title="Iniciar Sesión" />

            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 py-12">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-full mb-4">
                            <UserIcon className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Bienvenido de vuelta
                        </h1>
                        <p className="text-gray-600">
                            Inicia sesión para continuar con tu reserva
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">{status}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <form onSubmit={submit} className="space-y-6">
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
                                    autoFocus
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
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    required
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Recordarme
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg flex items-center justify-center space-x-2 ${
                                    processing
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-primary-500 hover:bg-primary-600 text-white'
                                }`}
                            >
                                <span>{processing ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
                                {!processing && <ArrowRightIcon className="w-5 h-5" />}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">o</span>
                            </div>
                        </div>

                        {/* Register Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-3">
                                ¿No tienes una cuenta?
                            </p>
                            <Link
                                href={route('register')}
                                className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-bold"
                            >
                                <UserIcon className="w-5 h-5" />
                                <span>Crear cuenta gratis</span>
                            </Link>
                        </div>
                    </div>

                    {/* Continue as Guest */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                        >
                            ← Continuar sin iniciar sesión
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
