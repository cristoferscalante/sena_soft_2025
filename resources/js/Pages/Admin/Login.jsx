import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { 
    ShieldCheckIcon,
    EnvelopeIcon, 
    LockClosedIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function AdminLogin({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login.post'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <MainLayout>
            <Head title="Admin - Iniciar Sesión" />

            <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-12">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-secondary-500 rounded-full mb-4 shadow-2xl">
                            <ShieldCheckIcon className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Panel de Administración
                        </h1>
                        <p className="text-primary-100">
                            Acceso exclusivo para administradores
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">{status}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="bg-white rounded-lg shadow-2xl p-8">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    <EnvelopeIcon className="w-5 h-5 mr-2 text-primary-500" />
                                    Correo de Administrador
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                    placeholder="admin@airguider.com"
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
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
                                    placeholder="••••••••"
                                    required
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg flex items-center justify-center space-x-2 ${
                                    processing
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                                }`}
                            >
                                <ShieldCheckIcon className="w-6 h-6" />
                                <span>{processing ? 'Verificando...' : 'Acceder al Panel'}</span>
                                {!processing && <ArrowRightIcon className="w-5 h-5" />}
                            </button>
                        </form>

                        {/* Warning */}
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-xs text-yellow-800 text-center">
                                <strong>⚠️ Área Restringida:</strong> Solo personal autorizado
                            </p>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-primary-100 hover:text-white text-sm font-medium"
                        >
                            ← Volver al sitio principal
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

