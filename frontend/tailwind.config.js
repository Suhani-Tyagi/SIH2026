/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ayush: {
          dark: '#0F3812',
          primary: '#1B5E20',
          medium: '#2E7D32',
          light: '#E8F5E9',
          accent: '#E8A33D',
          amber: '#D97706',
          bg: '#FBFBF7',
          card: '#FFFFFF',
          border: '#E2E8F0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}
