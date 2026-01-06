/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
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
    },
  },
  plugins: [],
};
