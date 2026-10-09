/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E51926',
          darkRed: '#C4121F',
          lightRed: '#FEECEE',
          black: '#121212',
          darkGray: '#1E1E1E',
          cardGray: '#262626',
          borderGray: '#E5E7EB',
          textGray: '#6B7280',
          gold: '#FFB800',
          goldDark: '#D97706',
          goldLight: '#FEF3C7',
          goldGradientFrom: '#F59E0B',
          goldGradientTo: '#B45309',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        'premium': '0 10px 30px -10px rgba(229, 25, 38, 0.25)',
        'gold': '0 10px 25px -5px rgba(245, 158, 11, 0.3)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
