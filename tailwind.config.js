/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nvidia: {
          DEFAULT: '#76B900',
          light: '#88D600',
          dark: '#5B9000',
          dim: '#233800'
        },
        cyber: {
          cyan: '#00E5FF',
          blue: '#00A3FF',
          amber: '#FFB300',
          red: '#FF3B30',
          purple: '#9D00FF'
        },
        dark: {
          950: '#070A0F',
          900: '#0B0F17',
          850: '#0F1622',
          800: '#141E2E',
          750: '#1B2638',
          700: '#233248',
          600: '#324765'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace']
      },
      boxShadow: {
        'glow-green': '0 0 25px -5px rgba(118, 185, 0, 0.45)',
        'glow-cyan': '0 0 25px -5px rgba(0, 229, 255, 0.45)',
        'glow-red': '0 0 25px -5px rgba(255, 59, 48, 0.55)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 4s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
