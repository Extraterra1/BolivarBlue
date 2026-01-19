const { heroui } = require('@heroui/react');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        venezuela: {
          yellow: '#F7D000',
          blue: '#00247D',
          red: '#CF142B'
        }
      }
    }
  },
  darkMode: 'class',
  plugins: [heroui()]
};
