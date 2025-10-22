import { Link, usePage } from '@inertiajs/react';
import { UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function LoginSuggestion() {
    const { auth } = usePage().props;
    const [dismissed, setDismissed] = useState(false);

    // No mostrar si ya está autenticado o si fue descartado
    if (auth?.user || dismissed) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
            
            <button
                onClick={() => setDismissed(true)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
                <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <UserPlusIcon className="w-8 h-8 text-white" />
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                        ¿Quieres guardar tus reservas?
                    </h3>
                    <p className="text-primary-50 mb-4">
                        Crea una cuenta gratuita y obtén:
                    </p>
                    <ul className="space-y-2 text-primary-50 mb-6">
                        <li className="flex items-center">
                            <span className="mr-2">✓</span>
                            <span>Historial de todas tus reservas</span>
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">✓</span>
                            <span>Notificaciones de cambios en vuelos</span>
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">✓</span>
                            <span>Descuentos exclusivos</span>
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">✓</span>
                            <span>Proceso de compra más rápido</span>
                        </li>
                    </ul>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center space-x-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            <UserPlusIcon className="w-5 h-5" />
                            <span>Crear Cuenta Gratis</span>
                        </Link>
                        <Link
                            href={route('login')}
                            className="inline-flex items-center justify-center space-x-2 bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
                        >
                            <span>Ya tengo cuenta</span>
                        </Link>
                    </div>

                    <p className="text-xs text-primary-100 mt-4">
                        También puedes continuar sin registrarte
                    </p>
                </div>
            </div>
        </div>
    );
}

