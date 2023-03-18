const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Lobster", ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}
