import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { 
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';

export default function Contact() {
    return (
        <MainLayout>
            <Head title="Contacto" />

            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                            <EnvelopeIcon className="w-10 h-10 mr-4 text-primary-600" />
                            Contáctanos
                        </h1>
                        <p className="text-xl text-gray-600">
                            Estamos aquí para ayudarte en lo que necesites
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {/* Información de Contacto */}
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Información de Contacto
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <EnvelopeIcon className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Email</div>
                                        <div className="font-semibold text-gray-900">info@airguider.com</div>
                                        <div className="text-sm text-gray-600">soporte@airguider.com</div>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <PhoneIcon className="w-6 h-6 text-secondary-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Teléfono</div>
                                        <div className="font-semibold text-gray-900">+57 300 123 4567</div>
                                        <div className="text-sm text-gray-600">Lun - Vie: 8:00 AM - 6:00 PM</div>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPinIcon className="w-6 h-6 text-accent-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Dirección</div>
                                        <div className="font-semibold text-gray-900">Calle 100 #8A-55</div>
                                        <div className="text-sm text-gray-600">Bogotá, Colombia</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Formulario de Contacto */}
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Envíanos un Mensaje
                            </h2>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Asunto *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mensaje *
                                    </label>
                                    <textarea
                                        required
                                        rows="5"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Enviar Mensaje
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

