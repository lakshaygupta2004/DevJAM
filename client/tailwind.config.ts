/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{jsx,tsx}", "./*.html"],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                devjam: {
                    DEFAULT: '#160C25',
                    dark: '#120A1F',
                    light: '#25173d',
                    accent: '#3d2a57',
                    hover: '#2c1d47',
                    text: '#ffffff',
                    primary: '#7C3AED',
                    danger: '#ef4444',
                    muted: '#cbd5e1',
                    lightbg: '#f9fafb',
                  }
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
            },
            animation: {
                "up-down": "up-down 2s ease-in-out infinite alternate",
            },
        },
    },
    plugins: [],
}
