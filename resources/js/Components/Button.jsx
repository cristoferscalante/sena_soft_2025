export default function Button({ type = 'button', className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            type={type}
            disabled={disabled}
            className={
                `inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg font-semibold text-sm uppercase tracking-widest transition ease-in-out duration-150 ${
                    disabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                } ` + className
            }
        >
            {children}
        </button>
    );
}

