/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        dark: {
          800: '#1e1e2e',
          850: '#181825',
          900: '#11111b',
          950: '#0d0d14',
        },
        surface: {
          DEFAULT: '#1e1e2e',
          raised: '#2a2a3e',
          border: '#313145',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(99, 102, 241, 0.15)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

