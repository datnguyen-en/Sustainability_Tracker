/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        air: {
          good: '#00e400',
          moderate: '#ffff00',
          unhealthy: '#ff7e00',
          very_unhealthy: '#ff0000',
          hazardous: '#8f3f97',
        }
      },
    },
  },
  plugins: [],
} 