/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        'aquainput' : '#5cebdf',
        'blueinput' : '#054861'
      }
    },
  },
  plugins: [],
}