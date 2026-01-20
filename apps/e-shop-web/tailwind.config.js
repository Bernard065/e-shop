/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3489FF',
        surface: '#f5f5f5',
      },
      fontFamily: {
        Roboto: ['var(--font-roboto)'],
        Poppins: ['var(--font-poppins)'],
      },
    },
  },
  plugins: [],
};
