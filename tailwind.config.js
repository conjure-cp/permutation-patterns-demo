/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false
  },
  content: [
    "./*.html",
    "./index.js",
    "./component/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
