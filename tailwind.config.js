/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#14213D",
        secondary: "#FCA311",
        "neutral-light": "#E5E5E5",
        background: "#f5f5f5",
        foreground: "#14213d",
        card: "#ffffff",
        "card-foreground": "#14213d",
        muted: "#d9d9d9",
        "muted-foreground": "#6b7280",
        border: "#d9d9d9",
        input: "#ffffff",
        ring: "#FCA311",
      },
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(20, 33, 61, 0.06), 0 10px 20px -2px rgba(20, 33, 61, 0.04)",
        "soft-lg": "0 10px 40px -10px rgba(20, 33, 61, 0.1), 0 4px 12px -2px rgba(20, 33, 61, 0.05)",
        "accent": "0 4px 14px 0 rgba(252, 163, 17, 0.25)",
      },
    },
  },
  plugins: [],
};
