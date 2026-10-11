/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: '#059669',
          primary: '#059669',
          deep: '#047857',
          soft: '#D1FAE5',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        forest: {
          DEFAULT: '#064E3B',
          900: '#064E3B',
          950: '#032D22',
        },
        mint: {
          50: '#F4FCF7',
          100: '#E7F8EF',
          200: '#C8F1DC',
          500: '#34D399',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          warm: '#FAFCFA',
          subtle: '#F4F7F5',
        },
        charcoal: {
          DEFAULT: '#17211D',
          800: '#23302B',
          900: '#17211D',
        },
        border: {
          DEFAULT: '#E5EDE7',
          light: '#EEF3F0',
          subtle: '#E2EBE5',
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(23, 33, 29, 0.04), 0 1px 2px -1px rgba(23, 33, 29, 0.04)',
        'card': '0 4px 20px -2px rgba(23, 33, 29, 0.05), 0 2px 6px -2px rgba(23, 33, 29, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(23, 33, 29, 0.08), 0 4px 12px -2px rgba(23, 33, 29, 0.04)',
        'modal': '0 24px 48px -12px rgba(23, 33, 29, 0.18)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
