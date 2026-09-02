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
        ink: "#1a1a1a",
        paper: "#989898",
        stone: "#333537",
        accent: "#af691e", // amber-gold sampled from the logo
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      typography: () => ({
        accent: {
          css: {
            "--tw-prose-body": "#333537",
            "--tw-prose-headings": "#1a1a1a",
            "--tw-prose-links": "#af691e",
            "--tw-prose-bold": "#1a1a1a",
            maxWidth: "none",
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
