/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
      },
    },
    extend: {
      colors: {
        dark_primary: "#06223F",
        light_bg: "#F8FAFC",
        accent: "#0ea5e9",
        accent_hover: "#0284c7",
        subtle_text: "#64748b",
      },
    },
  },
  plugins: [],
};
