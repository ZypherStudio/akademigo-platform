/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['ui-rounded', '"SF Pro Rounded"', '"Nunito"', 'system-ui', 'sans-serif'],
        sans: ['ui-rounded', '"SF Pro Rounded"', '"Nunito"', 'system-ui', 'sans-serif']
      },
      colors: {
        wood: {
          light: '#b87635',
          DEFAULT: '#7a4518',
          dark: '#4a260a',
          deep: '#2f1605'
        },
        parchment: {
          light: '#fff9eb',
          DEFAULT: '#fcecc8',
          dark: '#ecd2a2'
        },
        goldbtn: {
          top: '#ffe45e',
          mid: '#ffbe1a',
          bot: '#e38a00',
          edge: '#a85900'
        }
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        popIn: {
          '0%': { transform: 'scale(0.65)', opacity: '0' },
          '70%': { transform: 'scale(1.06)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        cubeBlast: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '40%': { transform: 'scale(1.22)', opacity: '0.9' },
          '100%': { transform: 'scale(0.1)', opacity: '0' }
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        comboFloat: {
          '0%': { transform: 'translateY(10px) scale(0.75)', opacity: '0' },
          '25%': { transform: 'translateY(-6px) scale(1.1)', opacity: '1' },
          '80%': { transform: 'translateY(-24px) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-40px) scale(0.9)', opacity: '0' }
        }
      },
      animation: {
        'float-slow': 'floatSlow 3.2s ease-in-out infinite',
        'pop-in': 'popIn 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'cube-blast': 'cubeBlast 0.25s ease-out forwards',
        'pulse-soft': 'pulseSoft 1.8s ease-in-out infinite',
        'combo-float': 'comboFloat 1.05s cubic-bezier(0.22, 1, 0.36, 1) forwards'
      }
    }
  },
  plugins: []
};
