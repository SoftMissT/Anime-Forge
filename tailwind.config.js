/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}" // Fallback para pegar tudo dentro de src
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'fluid-card': 'repeat(auto-fit, minmax(280px, 1fr))',
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
        gangofthree: ['"Yuji Syuku"', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        }
      }
    },
  },
  plugins: [],
};