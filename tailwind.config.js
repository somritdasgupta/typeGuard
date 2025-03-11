/** @type {import('tailwindcss').Config} */
export default {
  content: ['./demo/index.html', './demo/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        '9xl': '1600px',
      },
    },
  },
  plugins: [],
};
