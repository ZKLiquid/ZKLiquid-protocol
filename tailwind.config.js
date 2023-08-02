const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        gradient_custom:
          'linear-gradient(180deg, rgba(51, 237, 141, 0.2) 0%, rgba(9, 189, 187, 0.2) 100%)',
        main: 'linear-gradient(133.34deg,#fd371f -34.27%,#ff844b 99.35%)',
      },
      colors: {
        dark: {
          50: '#F2F4F7',
          100: '#87868C',
          200: '#67666E',
          300: '#212026',
          400: '#141217',
          500: '#0E0C12',
        },
        primary: '#ff844b',
      },
    },
    fontFamily: {
      sans: ['Inter', 'Poppins', 'Roboto', 'sans-serif'],
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        '.h-app': {
          height: '100vh',
          height: '100dvh',
        },
        '.min-h-app': {
          'min-height': '100vh',
          'min-height': '100dvh',
        },
      });
    }),
  ],
};
