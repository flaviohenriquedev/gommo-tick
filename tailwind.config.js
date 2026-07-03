/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6d28d9",
        primaryDark: "#5b21b6",
        primarySoft: "#f3edff",
        page: "#f7f5fb",
        ink: "#171321",
        muted: "#6b6478"
      },
      borderRadius: {
        button: "20px",
        card: "24px",
        sheet: "28px"
      },
      fontFamily: {
        inter: ["Inter_400Regular"]
      }
    }
  },
  plugins: []
};
