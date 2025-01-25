/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jamsilRegular: ["Jamsil-Regular", "sans-serif"],
        jamsilMedium: ["Jamsil-Medium", "sans-serif"],
        jamsilBold: ["Jamsil-Bold", "sans-serif"],
        suite: ["Suite", "sans-serif"],
      },
    },
  },
  plugins: [],
};
