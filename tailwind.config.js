import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    50: '#f0f4f8',
                    100: '#d9e6f2',
                    200: '#b3cde5',
                    300: '#8db4d8',
                    400: '#679bcb',
                    500: '#375372', // Color principal
                    600: '#2d4359',
                    700: '#233340',
                    800: '#192228',
                    900: '#0f1214',
                },
                secondary: {
                    50: '#fef5e7',
                    100: '#fde8c3',
                    200: '#fbd89f',
                    300: '#f9c87b',
                    400: '#f7b857',
                    500: '#f5a833',
                    600: '#c48629',
                    700: '#93651f',
                    800: '#624314',
                    900: '#31220a',
                },
                accent: {
                    50: '#e8f5f7',
                    100: '#c5e7ec',
                    200: '#a2d9e1',
                    300: '#7fcbd6',
                    400: '#5cbdcb',
                    500: '#39afc0',
                    600: '#2e8c9a',
                    700: '#226973',
                    800: '#17464d',
                    900: '#0b2326',
                },
            },
        },
    },

    plugins: [forms],
};
