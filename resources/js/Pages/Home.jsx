import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import {
    PaperAirplaneIcon,
    SparklesIcon,
    ShieldCheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    GlobeAmericasIcon,
    HeartIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    StarIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function Home() {
    const [userCity, setUserCity] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Detectar ubicación del usuario
    useEffect(() => {
        const detectLocation = async () => {
            try {
                setIsLoadingLocation(true);
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                setUserCity(data.city);
            } catch (error) {
                console.error('Error detectando ubicación:', error);
            } finally {
                setIsLoadingLocation(false);
            }
        };

        detectLocation();
    }, []);

    // Manejar clic en destino
    const handleDestinationClick = (destinationCode) => {
        // Redirigir a búsqueda con parámetros
        router.get(route('flights.index'), {
            destino: destinationCode,
            from_home: true
        });
    };
    const features = [
        {
            icon: CurrencyDollarIcon,
            title: 'Mejores Precios',
            description: 'Encuentra las tarifas más competitivas del mercado con precios transparentes y sin cargos ocultos.'
        },
        {
            icon: ShieldCheckIcon,
            title: 'Reserva Segura',
            description: 'Proceso de pago 100% seguro con encriptación de datos y protección de tu información personal.'
        },
        {
            icon: ClockIcon,
            title: 'Atención 24/7',
            description: 'Soporte al cliente disponible en todo momento para ayudarte con tus reservas y consultas.'
        },
        {
            icon: GlobeAmericasIcon,
            title: 'Destinos Nacionales',
            description: 'Conectamos las principales ciudades de Colombia para que llegues a donde necesitas.'
        }
    ];

    const benefits = [
        'Confirmación instantánea de tu reserva',
        'Modificación de vuelos sin complicaciones',
        'Selección de asientos preferidos',
        'Tiquetes electrónicos enviados a tu correo',
        'Sin tarifas ocultas ni sorpresas',
        'Proceso de reserva rápido y sencillo'
    ];

    const popularDestinations = [
        { city: 'Bogotá', code: 'BOG', image: '🏛️', description: 'Capital cultural' },
        { city: 'Medellín', code: 'MDE', image: '🌄', description: 'Ciudad de la eterna primavera' },
        { city: 'Cartagena', code: 'CTG', image: '🏖️', description: 'Playas del Caribe' },
        { city: 'Cali', code: 'CLO', image: '💃', description: 'Capital de la salsa' },
        { city: 'Santa Marta', code: 'SMR', image: '🌴', description: 'Paraíso tropical' },
        { city: 'Barranquilla', code: 'BAQ', image: '🎭', description: 'Puerta de oro' }
    ];

    return (
        <MainLayout>
            <Head title="Inicio - Tu aerolínea de confianza" />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
                {/* Video de fondo */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                    <iframe
                        className="absolute w-[300%] h-[300%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        src="https://www.youtube.com/embed/cyfPIPDna9M?autoplay=1&mute=1&loop=1&playlist=cyfPIPDna9M&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&playsinline=1&enablejsapi=1&start=0&end=0"
                        title="Video de fondo"
                        frameBorder="0"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        loading="eager"
                        style={{ border: 'none', margin: '-60px' }}
                    ></iframe>
                </div>
                {/* Capa azul translúcida */}
                <div className="absolute inset-0 bg-primary-600 opacity-80"></div>

                <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-32">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-6">
                            <PaperAirplaneIcon className="w-16 h-16 text-white animate-bounce" />
                        </div>
                        <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
                            Tu próxima aventura
                            <span className="block mt-2 text-accent-300">comienza aquí</span>
                        </h1>
                        <p className="max-w-3xl mx-auto mb-8 text-xl text-primary-100 md:text-2xl">
                            Vuela por Colombia con las mejores tarifas, reserva fácil y rápido.
                            Conectamos tus sueños con los destinos más increíbles del país.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                href={route('flights.index')}
                                className="inline-flex items-center px-8 py-4 text-lg font-bold transition-all transform bg-white rounded-lg shadow-xl text-primary-700 hover:bg-gray-50 hover:scale-105 hover:shadow-2xl"
                            >
                                <MagnifyingGlassIcon className="w-6 h-6 mr-2" />
                                Buscar Vuelos
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </Link>
                            <Link
                                href={route('my-trips')}
                                className="inline-flex items-center px-8 py-4 text-lg font-bold text-white transition-all transform border-2 border-white rounded-lg hover:bg-white hover:text-primary-700 hover:scale-105"
                            >
                                <ClockIcon className="w-6 h-6 mr-2" />
                                Mis Viajes
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid max-w-4xl grid-cols-2 gap-6 mx-auto mt-16 md:grid-cols-4">
                            <div className="p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl">
                                <div className="text-4xl font-bold text-white">15+</div>
                                <div className="text-sm text-primary-100">Destinos</div>
                            </div>
                            <div className="p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl">
                                <div className="text-4xl font-bold text-white">24/7</div>
                                <div className="text-sm text-primary-100">Soporte</div>
                            </div>
                            <div className="p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl">
                                <div className="text-4xl font-bold text-white">100%</div>
                                <div className="text-sm text-primary-100">Seguro</div>
                            </div>
                            <div className="p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl">
                                <div className="text-4xl font-bold text-white">5★</div>
                                <div className="text-sm text-primary-100">Calificación</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-gray-50">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-100">
                            <SparklesIcon className="w-8 h-8 text-primary-600" />
                        </div>
                        <h2 className="mb-4 text-4xl font-bold text-gray-900">
                            ¿Por qué elegirnos?
                        </h2>
                        <p className="max-w-2xl mx-auto text-xl text-gray-600">
                            Ofrecemos la mejor experiencia de vuelo con servicios diseñados para tu comodidad
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-8 text-center transition-all transform bg-white shadow-lg rounded-2xl hover:shadow-xl hover:scale-105"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-100">
                                    <feature.icon className="w-8 h-8 text-primary-600" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popular Destinations */}
            <div className="py-20 bg-white">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-secondary-100">
                            <GlobeAmericasIcon className="w-8 h-8 text-secondary-600" />
                        </div>
                        <h2 className="mb-4 text-4xl font-bold text-gray-900">
                            Destinos Populares
                        </h2>
                        <p className="max-w-2xl mx-auto text-xl text-gray-600">
                            Descubre los lugares más fascinantes de Colombia
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {popularDestinations.map((destination, index) => (
                            <button
                                key={index}
                                onClick={() => handleDestinationClick(destination.code)}
                                className="relative w-full overflow-hidden text-left transition-all transform shadow-lg bg-gradient-to-br from-primary-500 to-primary-700 group rounded-2xl hover:shadow-2xl hover:scale-105"
                            >
                                <div className="p-8 text-white">
                                    <div className="mb-4 text-6xl">{destination.image}</div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-2xl font-bold">{destination.city}</h3>
                                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-white/20 backdrop-blur-sm">
                                            {destination.code}
                                        </span>
                                    </div>
                                    <p className="text-primary-100">{destination.description}</p>
                                    <div className="flex items-center mt-4 text-sm font-semibold">
                                        Ver vuelos
                                        <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-20 bg-gradient-to-br from-accent-50 to-primary-50">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-accent-100">
                                <HeartIcon className="w-8 h-8 text-accent-600" />
                            </div>
                            <h2 className="mb-6 text-4xl font-bold text-gray-900">
                                Beneficios que te encantarán
                            </h2>
                            <p className="mb-8 text-xl text-gray-600">
                                Diseñamos cada detalle pensando en tu experiencia de viaje,
                                para que tu única preocupación sea disfrutar del destino.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start">
                                        <CheckCircleIcon className="flex-shrink-0 w-6 h-6 mr-3 text-accent-600" />
                                        <span className="text-lg text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="p-8 bg-white shadow-2xl rounded-3xl">
                                <div className="mb-6">
                                    <div className="flex items-center mb-4">
                                        <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                                        <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                                        <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                                        <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                                        <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                                    </div>
                                    <p className="mb-4 text-lg italic text-gray-700">
                                        "Excelente servicio, reserva súper fácil y rápida. Los precios son
                                        muy competitivos y el proceso de pago es muy seguro. ¡Totalmente recomendado!"
                                    </p>
                                    <div className="flex items-center">
                                        <div className="flex items-center justify-center w-12 h-12 mr-4 font-bold text-white rounded-full bg-primary-500">
                                            MC
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">María Camila</div>
                                            <div className="text-sm text-gray-600">Cliente frecuente</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-gray-200">
                                    <div className="mb-4">
                                        <div className="flex items-center mb-4">
                                            <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                                            <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                                            <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                                            <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                                            <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                                        </div>
                                        <p className="mb-4 text-lg italic text-gray-700">
                                            "Pude seleccionar mis asientos favoritos y todo llegó al instante a mi correo.
                                            La mejor experiencia reservando vuelos online."
                                        </p>
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center w-12 h-12 mr-4 font-bold text-white rounded-full bg-secondary-500">
                                                JR
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">Juan Rodríguez</div>
                                                <div className="text-sm text-gray-600">Viajero frecuente</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative py-20 overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
                    <PaperAirplaneIcon className="w-20 h-20 mx-auto mb-6 text-white animate-pulse" />
                    <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                        ¿Listo para despegar?
                    </h2>
                    <p className="max-w-2xl mx-auto mb-8 text-xl text-white">
                        Encuentra el vuelo perfecto para ti y comienza tu aventura hoy mismo
                    </p>
                    <Link
                        href={route('flights.index')}
                        className="inline-flex items-center px-10 py-5 text-xl font-bold transition-all transform bg-white rounded-lg shadow-2xl text-primary-700 hover:bg-gray-50 hover:scale-105"
                    >
                        <MagnifyingGlassIcon className="w-6 h-6 mr-3" />
                        Buscar Vuelos Ahora
                        <ArrowRightIcon className="w-6 h-6 ml-3" />
                    </Link>
                </div>
            </div>

            {/* Trust Section */}
            <div className="py-16 bg-gray-50">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="mb-8 text-2xl font-bold text-gray-900">
                            Confían en nosotros
                        </h3>
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm">
                                <ShieldCheckIcon className="w-12 h-12 text-primary-600" />
                            </div>
                            <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm">
                                <UserGroupIcon className="w-12 h-12 text-secondary-600" />
                            </div>
                            <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm">
                                <GlobeAmericasIcon className="w-12 h-12 text-accent-600" />
                            </div>
                            <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm">
                                <HeartIcon className="w-12 h-12 text-primary-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
