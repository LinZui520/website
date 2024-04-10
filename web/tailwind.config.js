/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'calc-32': 'calc(100% - 128px)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

