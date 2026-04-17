/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        zen: {
          bg: '#FAFAFA',
          text: '#2D2D2D',
          accent: '#8AA399',
          muted: '#E5E5E5'
        }
      }
    },
  },
  plugins: [],
}
