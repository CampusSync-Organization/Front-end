/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#14213D",
        secondary: "#FCA311",
        "neutral-light": "#E5E5E5",
      },
    },
  },
  plugins: [],
};
