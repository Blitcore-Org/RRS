/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A1FE34",
        secondary: "#0B2349",
        black: '#000000',
        white: '#FFFFFF',
      },
      spacing: {
        36: "9rem",
        20: "5rem",
      },
      fontFamily: {
        chillax: ["var(--font-chillax)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
