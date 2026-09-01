/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral base — the grey JT builds against, so the accent color
        // actually announces itself. Tweak these two lines to change the
        // whole site's mood.
        ink: "#1b1c1e",
        paper: "#cbcfce",
        stone: "#474b4d",
        accent: "#c2703d", // warm terracotta — swap for the jungle green if you want that instead
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      typography: () => ({
        accent: {
          css: {
            "--tw-prose-body": "#474b4d",
            "--tw-prose-headings": "#1b1c1e",
            "--tw-prose-links": "#c2703d",
            "--tw-prose-bold": "#1b1c1e",
            maxWidth: "none",
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
