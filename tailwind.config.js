/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      blur: {
        xs: '1px',
      },
      colors : {
        'aquainput' : '#5cebdf',
        'blueinput' : '#054861'
      }
    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}