/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'integraflow-black': '#050505',
      },
      boxShadow: {
        '3xl': 'rgba(0, 0, 0, 0.16) 0px 5px 40px',
      }
    },
  },
  plugins: [],
};
