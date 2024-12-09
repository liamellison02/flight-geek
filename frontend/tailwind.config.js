/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'brand-dark': '#001524',
          'brand-cyan': '#40E0FF',
        },
        backgroundImage: {
          'gradient-custom': 'linear-gradient(to bottom right, #001524, #003355)',
        }
      },
    },
    plugins: [],
  }