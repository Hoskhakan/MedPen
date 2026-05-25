import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef2ff',
          100: '#e0e8f9',
          200: '#c2d0f4',
          300: '#8fa9e8',
          400: '#5478d5',
          500: '#2d54be',
          600: '#1e3fa0',
          700: '#1a3282',
          800: '#162a6b',
          900: '#0a1628',
          950: '#060d1a',
        },
        gold: {
          300: '#f5d78e',
          400: '#edc25a',
          500: '#d4a853',
          600: '#b8872f',
          700: '#96691a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'counter': 'counter 2s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
