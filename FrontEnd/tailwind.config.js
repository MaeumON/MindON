/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    center: true,
    screens: {
      sm: "360px", // sm(360px) 이상
      md: "412px", // md(412px) 이상
    },
    fontFamily: {
      jamsilRegular: ["Jamsil-Regular", "sans-serif"],
      jamsilMedium: ["Jamsil-Medium", "sans-serif"],
      jamsilBold: ["Jamsil-Bold", "sans-serif"],
      suite: ["Suite", "sans-serif"],
    },
    extend: {
      colors: {
        white: "#FFFFFF",
        offWhite: "#FAF9F6",
        yellow100: "#FFECA1",
        green100: "#6BB07C",
        orange100: "#DA8600",
        skyBlue100: "#DDE9EC",
        red100: "#BA1A1A",
        cardTitle: "#202020",
        cardLongContent: "#3C3C3C",
        cardContent: "#828282",
        cardContent2: "#9D9D9D",
        cardSubcontent: "#DDDDDD",
      },

      fontSize: {
        "14px": "0.875rem",
        "16px": "1rem",
        "18px": "1.125rem",
        "20px": "1.25rem",
        "24px": "1.5rem",
        "28px": "1.75rem",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
