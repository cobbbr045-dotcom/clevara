/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B132B',
          navy: '#1C2541',
          slate: '#3A506B',
          accent: '#059669',
          accentHover: '#047857',
          gold: '#C084FC',
          sand: '#F7F7F8',
          border: '#E2E8F0',
          muted: '#64748B',
          subtle: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'premium': '0 10px 30px -5px rgba(11, 19, 43, 0.08), 0 4px 6px -2px rgba(11, 19, 43, 0.04)',
        'elevated': '0 20px 40px -15px rgba(11, 19, 43, 0.12)'
      }
    },
  },
  plugins: [],
}
