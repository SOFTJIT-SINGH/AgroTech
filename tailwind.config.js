/** @type {import('tailwindcss').Config} */
module.exports = {
  // Updated content paths to include your 'src' folder
  content: [
    './App.{js,ts,tsx}', 
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'agro-green': {
          50: '#f0f7f0',
          100: '#dcf0dc',
          200: '#bbe0bb',
          300: '#8ec98e',
          400: '#5ba85b',
          500: '#3e8e3e',
          600: '#2d722d',
          700: '#255b25',
          800: '#1f481f',
          900: '#1a3c1a',
          950: '#0e210e',
        },
        'agro-earth': {
          50: '#f7f6f2',
          100: '#ebe9df',
          200: '#d6d1be',
          300: '#bab194',
          400: '#a29572',
          500: '#8f7e5d',
          600: '#7e6d4f',
          700: '#695a43',
          800: '#574b3a',
          900: '#4a4134',
          950: '#27221b',
        },
        'agro-accent': {
          50: '#fdfbe9',
          100: '#fbf5c6',
          200: '#f7eb91',
          300: '#f2da54',
          400: '#eac428',
          500: '#d7af18',
          600: '#b88a11',
          700: '#936511',
          800: '#785115',
          900: '#664317',
          950: '#3b2309',
        }
      }
    },
  },
  plugins: [],
};