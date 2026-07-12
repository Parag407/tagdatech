/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyberDark: '#0B0116',
        cyberDeep: '#06010D',
        neonPurple: '#9D4EDD',
        neonMagenta: '#C77DFF',
        cyberGlow: '#E0AAFF'
      },
      fontFamily: {
        cyber: ['Orbitron', 'Rajdhani', 'sans-serif'],
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'cyber-neon': '0 0 15px rgba(157, 78, 221, 0.5)',
        'cyber-neon-strong': '0 0 25px rgba(199, 125, 255, 0.8)',
      }
    },
  },
  plugins: [],
}
