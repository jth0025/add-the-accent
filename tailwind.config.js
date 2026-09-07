/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Grey is the canvas, not the subject — "grey isn't fighting for
        // attention, so it becomes a kind of visual silence around the
        // note you actually want people to hear." Everything else is
        // built to pop against these three greys.
        ink: "#1a1a1a",
        paper: "#96958d", // page background — the concrete/canvas grey
        card: "#c9c7bd", // section boxes sit a shade lighter, like raw canvas
        stone: "#33322d",
        accent: "#af691e", // amber-gold sampled from the logo
        moss: "#9aa83c", // olive pop, lifted from the pitch deck
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-archivo-black)", "Impact", "Arial Black", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
        logo: ["var(--font-poppins)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        oldenglish: ["var(--font-oldenglish)", "\"Old English Text MT\"", "Georgia", "serif"],
        hand: ["var(--font-hand)", "\"Bradley Hand\"", "\"Comic Sans MS\"", "cursive"],
        cinema: ["var(--font-cinema)", "\"Oswald\"", "\"Arial Narrow\"", "sans-serif"],
      },
      typography: () => ({
        accent: {
          css: {
            "--tw-prose-body": "#33322d",
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
