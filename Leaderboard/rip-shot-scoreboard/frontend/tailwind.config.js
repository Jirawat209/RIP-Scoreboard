/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['"Roboto"', 'sans-serif'],
      },
      colors: {
        board: '#2b2b2b',
      },
      boxShadow: {
        glow: '0 0 5px rgba(255,255,255,0.4)',
        fire: '0 0 15px rgba(255, 120, 0, 0.8), 0 0 30px rgba(255, 0, 0, 0.6)'
      }
    },
  },
  plugins: [],
}
