import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function TermsConditions() {
    return (
        <MainLayout>
            <Head title="Términos y Condiciones" />

            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            📜 Términos y Condiciones
                        </h1>
                        <p className="text-sm text-gray-600 mb-8">
                            Última actualización: {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>

                        <div className="prose max-w-none space-y-6">
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Aceptación de Términos</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Al utilizar el servicio de AirGuider, usted acepta estar sujeto a estos términos y condiciones. 
                                    Si no está de acuerdo con alguno de estos términos, por favor no utilice nuestros servicios.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Reservas y Pagos</h2>
                                <p className="text-gray-700 leading-relaxed mb-2">
                                    <strong>2.1 Proceso de Reserva:</strong> Las reservas se confirman únicamente después de recibir el pago completo.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-2">
                                    <strong>2.2 Tiempo de Expiración:</strong> Las reservas pendientes expiran automáticamente después de 5 minutos.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    <strong>2.3 Métodos de Pago:</strong> Aceptamos tarjetas de crédito, débito y PSE. Este es un sistema de simulación para fines demostrativos.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Selección de Asientos</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Los asientos están sujetos a disponibilidad. En caso de que un asiento no esté disponible al momento de la confirmación, 
                                    se le solicitará que seleccione otro asiento disponible.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Políticas de Pasajeros</h2>
                                <p className="text-gray-700 leading-relaxed mb-2">
                                    <strong>4.1 Máximo de Pasajeros:</strong> Se permite un máximo de 5 pasajeros por reserva.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-2">
                                    <strong>4.2 Infantes:</strong> Los pasajeros menores de 3 años se consideran infantes y deben viajar acompañados de un adulto.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    <strong>4.3 Documentación:</strong> Todos los pasajeros deben presentar un documento de identidad válido al abordar.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Cancelaciones y Cambios</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Las políticas de cancelación y cambios dependen de la tarifa adquirida. 
                                    Consulte con nuestro servicio al cliente para más información.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Responsabilidad</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    AirGuider actúa como intermediario entre el cliente y las aerolíneas. 
                                    No nos hacemos responsables por cambios de horarios, cancelaciones o retrasos de los vuelos.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Privacidad y Datos Personales</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Nos comprometemos a proteger su información personal. Los datos recopilados se utilizan únicamente 
                                    para procesar su reserva y cumplir con requisitos legales.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Contacto</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Para cualquier consulta sobre estos términos y condiciones, puede contactarnos en:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                                    <li>Email: info@airguider.com</li>
                                    <li>Teléfono: +57 300 123 4567</li>
                                    <li>Dirección: Calle 100 #8A-55, Bogotá, Colombia</li>
                                </ul>
                            </section>
                        </div>

                        <div className="mt-8 p-6 bg-primary-50 border border-primary-200 rounded-lg">
                            <p className="text-sm text-primary-800 text-center">
                                <strong>Nota:</strong> Este es un sistema de demostración creado para SENASOFT 2025. 
                                Los pagos son simulados y no se procesan transacciones reales.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

