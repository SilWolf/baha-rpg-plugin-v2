/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [],
  important: '#bahaRpgPluginV2App',
  corePlugins: {
    preflight: false,
  },
}
