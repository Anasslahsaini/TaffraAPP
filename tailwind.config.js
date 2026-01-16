/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['System'],
        display: ['System'],
      },
      colors: {
        bg: '#050505', 
        card: '#161616', 
        cardHover: '#1C1C1C',
        primary: '#10B981', 
        primaryDark: '#059669',
        secondary: '#F59E0B',
        mistake: '#EF4444',
        text: {
          main: '#FFFFFF',
          muted: '#9CA3AF',
          dark: '#6B7280'
        },
        input: '#262626'
      },
      boxShadow: {
        'glow': '0 0 20px rgba(16, 185, 129, 0.15)',
        'nav': '0 -4px 20px rgba(0,0,0, 0.4)'
      }
    },
  },
  plugins: [],
}
