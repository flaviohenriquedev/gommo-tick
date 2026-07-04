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
        surface: "#ffffff",
        ink: "#171321",
        muted: "#6b6478",
        border: "rgba(109, 40, 217, 0.16)",
        success: "#16a34a",
        warning: "#d97706",
        error: "#dc2626",
        info: "#2563eb"
      },
      borderRadius: {
        button: "20px",
        card: "24px",
        sheet: "28px"
      },
      fontFamily: {
        inter: ["Inter_400Regular"],
        "inter-semibold": ["Inter_600SemiBold"],
        "inter-bold": ["Inter_700Bold"],
        "inter-extrabold": ["Inter_800ExtraBold"]
      }
    }
  },
  plugins: []
};