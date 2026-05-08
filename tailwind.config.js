/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        brand: {
          green:  '#3df070',
          'green-dark': '#1db845',
          magenta: '#e61e8c',
          'magenta-dark': '#b5166e',
          bg:     '#080c0a',
          card:   'rgba(255,255,255,0.06)',
          border: 'rgba(255,255,255,0.10)',
        },
      },
      fontFamily: {
        sans: ['var(--font-open-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(ellipse at 30% 50%, rgba(61,240,112,0.10) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(230,30,140,0.09) 0%, transparent 55%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
