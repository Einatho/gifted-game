/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          gold: '#fbbf24',
          green: '#22c55e',
          purple: '#a855f7',
          pink: '#ec4899',
        },
        game: {
          math: '#3b82f6',
          verbal: '#8b5cf6',
          visual: '#f97316',
          logic: '#10b981',
        }
      },
      fontFamily: {
        heebo: ['Heebo', 'sans-serif'],
        'heebo-bold': ['Heebo-Bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

