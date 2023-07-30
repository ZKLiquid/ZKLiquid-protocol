/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        Inter: ['Inter', 'sans-serif'],
        Poppins: ['Poppins', 'sans-serif'],
        Roboto: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        boxShadows: 'box-shadow: 0px 8px 24px -8px #FD622133',
      },
      backgroundImage: {
        gradient_custom:
          'linear-gradient(180deg, rgba(51, 237, 141, 0.2) 0%, rgba(9, 189, 187, 0.2) 100%)',
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
      },
    },
  },
};
