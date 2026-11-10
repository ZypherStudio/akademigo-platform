/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        duo: {
          green: '#58cc02',
          'green-dark': '#46a302',
          'green-light': '#89e219',
          blue: '#1cb0f6',
          'blue-dark': '#1899d6',
          purple: '#af72ff',
          'purple-dark': '#9047ff',
          orange: '#ff9600',
          'orange-dark': '#e08300',
          red: '#ff4b4b',
          'red-dark': '#d33131',
          yellow: '#ffc800',
          'yellow-dark': '#e5b300',
          gray: '#e5e5e5',
          'gray-dark': '#afafaf',
          dark: '#131f24',
          'card-dark': '#202f36'
        }
      },
      fontFamily: {
        sans: ['"Feather"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        dance: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg) scale(1)' },
          '25%': { transform: 'translateY(-8px) rotate(-7deg) scale(1.08)' },
          '50%': { transform: 'translateY(0) rotate(5deg) scale(0.96)' },
          '75%': { transform: 'translateY(-6px) rotate(8deg) scale(1.06)' },
        }
      },
      animation: {
        bounceSubtle: 'bounceSubtle 2s infinite ease-in-out',
        wiggle: 'wiggle 0.5s ease-in-out infinite',
        pop: 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        dance: 'dance 0.75s infinite ease-in-out',
      }
    },
  },
  plugins: [],
}
