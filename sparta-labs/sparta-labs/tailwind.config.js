/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Geist Placeholder"', 'sans-serif'],
        heading: ['Michroma', '"Big Shoulders Display"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        background: '#000000',
        primary: '#e63946', // premium vibrant red
        'primary-dark': '#c32f3a',
        'card-bg': 'rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'spin-slow': 'spin 15s linear infinite',
      }
    },
  },
  plugins: [],
}
