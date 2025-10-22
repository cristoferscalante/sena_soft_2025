import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { usePage } from '@inertiajs/react';

export function useFormNotifications() {
    const { flash, errors } = usePage().props;

    useEffect(() => {
        // Mostrar mensaje de éxito si existe
        if (flash?.success) {
            toast.success(flash.success, {
                duration: 4000,
                icon: '✅',
            });
        }

        // Mostrar mensaje de error general si existe
        if (flash?.error) {
            toast.error(flash.error, {
                duration: 5000,
                icon: '❌',
            });
        }

        // Mostrar errores de validación
        if (errors && Object.keys(errors).length > 0) {
            const errorMessages = Object.values(errors);
            
            // Si hay un solo error, mostrarlo directamente
            if (errorMessages.length === 1) {
                toast.error(errorMessages[0], {
                    duration: 5000,
                    icon: '⚠️',
                });
            } else {
                // Si hay múltiples errores, mostrar el primero con un contador
                toast.error(
                    `${errorMessages[0]} (${errorMessages.length} errores encontrados)`,
                    {
                        duration: 6000,
                        icon: '⚠️',
                    }
                );
            }
        }
    }, [flash, errors]);

    return {
        showSuccess: (message) => toast.success(message, { icon: '✅' }),
        showError: (message) => toast.error(message, { icon: '❌' }),
        showWarning: (message) => toast(message, { 
            icon: '⚠️',
            style: {
                border: '2px solid #f59e0b',
            }
        }),
        showInfo: (message) => toast(message, { 
            icon: 'ℹ️',
            style: {
                border: '2px solid #3b82f6',
            }
        }),
        showPromise: (promise, messages) => {
            return toast.promise(promise, {
                loading: messages.loading || 'Procesando...',
                success: messages.success || '¡Completado!',
                error: messages.error || 'Ocurrió un error',
            });
        },
    };
}

export default useFormNotifications;
