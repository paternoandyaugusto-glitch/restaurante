import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171411",
        espresso: "#241b16",
        cream: "#f5f0e7",
        copper: "#b77843",
        sand: "#d8c7ad",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(30, 22, 16, .08)",
        glow: "0 20px 80px rgba(183, 120, 67, .18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
