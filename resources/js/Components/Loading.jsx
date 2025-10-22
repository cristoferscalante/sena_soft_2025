export default function Loading({ message = 'Cargando...' }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-600 font-medium">{message}</p>
        </div>
    );
}

