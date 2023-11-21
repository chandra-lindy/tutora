/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-blue-10": "#e8f4f8",
        "brand-blue-100": "#00b8ff",
        "brand-blue-200": "#009bd6",
        "brand-blue-300": "#00719c",
        "brand-blue-400": "#00415a",
        "brand-blue-500": "#001f2b",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
