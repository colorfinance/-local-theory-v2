const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lt: {
          bg: '#0A0A0A',
          card: '#141414', 
          surface: '#1F1F1F',
          primary: '#6D28D9', // Purple-ish
          accent: '#A78BFA',
          muted: '#737373',
          border: '#262626'
        }
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
