/** @type {import('tailwindcss').Config} */
module.exports = {
  // Updated content paths to include your 'src' folder
  content: [
    './App.{js,ts,tsx}', 
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};