/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F7F4',
          100: '#D8F3DC',
          200: '#B7E4C7',
          300: '#95D5B2',
          400: '#74C69D',
          500: '#52B788',
          600: '#40916C',
          700: '#2D6A4F',
          800: '#1B4332',
          900: '#081C15',
        },
        earth: {
          50: '#FAF8F5',
          100: '#F4EFE6',
          200: '#E6DCB8',
          300: '#D4C39B',
          400: '#BFA87D',
          500: '#8C7355',
          600: '#6B543E',
          700: '#4E3A2A',
        },
        cream: {
          DEFAULT: '#FAF9F6',
          surface: '#F5F3ED',
          card: '#FFFFFF',
          border: '#E8E5DC',
        },
        charcoal: {
          DEFAULT: '#1E293B',
          muted: '#64748B',
          dark: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
