export default function Alert({ type = 'info', children, className = '' }) {
    const styles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <div className={`border rounded-lg p-4 ${styles[type]} ${className}`}>
            <div className="flex items-start">
                <span className="text-2xl mr-3">{icons[type]}</span>
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}

