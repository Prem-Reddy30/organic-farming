/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f2fbf4',
          100: '#e1f7e7',
          200: '#c5eed0',
          300: '#97deb0',
          400: '#62c68c',
          500: '#2ea86b',
          600: '#228955',
          700: '#1b6d45',
          800: '#195638',
          900: '#164730',
          950: '#0a271a',
        },
        forest: {
          light: '#2d6a4f',
          DEFAULT: '#1b4332',
          dark: '#081c15',
        },
        cream: {
          50: '#fffdf5',
          100: '#fefae0',
          200: '#f8f4c4',
          300: '#f0e89c',
        },
        earth: {
          light: '#b08968',
          DEFAULT: '#7f5539',
          dark: '#582f0e',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans Telugu', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
