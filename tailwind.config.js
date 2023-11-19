/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false
  },
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
  purge: ['./**/*.html'] // remove unused styles in production
}

