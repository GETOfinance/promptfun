import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#000000",
        foreground: "#FFFFFF",
        primary: "#00D4FF",
        secondary: "#7C3AED",
        accent: "#06FFA5",
        muted: "#1A1A1A",
        card: "#0F0F0F",
        destructive: {
          DEFAULT: "#FF3B30",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#0F0F0F",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "data-flow": "data-flow 4s linear infinite",
        "holo-sweep": "holo-sweep 3s infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%": {
            boxShadow: "0 0 20px rgba(0, 212, 255, 0.2), 0 0 40px rgba(0, 212, 255, 0.1)",
          },
          "100%": {
            boxShadow:
              "0 0 30px rgba(0, 212, 255, 0.4), 0 0 60px rgba(0, 212, 255, 0.2), 0 0 80px rgba(124, 58, 237, 0.1)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "data-flow": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100vw)" },
        },
        "holo-sweep": {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
