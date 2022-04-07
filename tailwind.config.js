module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamilty: {
        roboto: ["Roboto"],
        sora: ["Sora"],
      },
      colors: {
        primary: {
          25: "#F3F8F3",
          50: "#EBF8EC",
          100: "#D0EED0",
          200: "#B3E3B3",
          300: "#94D994",
          400: "#7DCF7C",
          500: "#68C664",
          600: "#5DB65A",
          700: "#52A34F",
          800: "#479244",
          900: "#347232",
        },
        error: "#F4511E",
        gray: "#616161",
      },
      screens: {
        sm: "640px",
        lg: "1024px",
        "2lg": "1308px",
        xl: "1440px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
