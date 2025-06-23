/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // This enables class-based dark mode
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#000000',
                    bgLighter: '#1a1a1a',
                    text: '#ffffff',
                    textSoft: '#d9d9d9',
                    soft: '#333333',
                },
                light: {
                    bg: '#f9f9f9',
                    bgLighter: '#ffffff',
                    text: '#000000',
                    textSoft: '#606060',
                    soft: '#D3D3D3',
                }
            },
        },
    },
    plugins: [],
}