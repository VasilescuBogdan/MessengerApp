/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'angular-primary': '#c2185b'
      },
      maxWidth: {
        '70%': '70%'
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

