/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: "#5B8C5A",
        apricot: "#F2A65A",
        cream: "#F8F5F0",
        ink: "#2E2E2E",
        stone: "#6E6E6E",
        mist: "#E9E5DE",
        card: "#FFFFFF"
      },
      fontFamily: {
        serif: ["NotoSerifSC", "Noto Serif SC", "System"],
        sans: ["NotoSansSC", "Noto Sans SC", "System"]
      }
    }
  },
  plugins: []
};
