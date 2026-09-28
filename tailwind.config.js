/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Menambahkan dukungan mode gelap
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./article/**/*.{md,markdown}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
        "6xl": "4rem",
      },
      height: {
        448: "22rem",
        768: "50rem",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-textshadow"),
    require("@tailwindcss/typography"),
  ],
};
