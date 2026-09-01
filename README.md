# Add the Accent

The site for addtheaccent.com — portfolio pieces from the Homebody series,
plus a journal/field-notes section.

## Adding a new piece

No code needed. Every entry is a markdown file:

- Portfolio pieces go in `content/portfolio/`
- Journal entries go in `content/journal/`

To add one: copy an existing `.md` file in that folder, rename it (the
filename becomes the page's URL — `day-one.md` becomes `/portfolio/day-one`),
edit the frontmatter at the top (`title`, `date`, `excerpt`), replace the
body with your writing, and make sure `draft: false` (or remove that line
entirely — only `draft: true` hides something from the site).

## Running it locally

```
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploying

Push to GitHub, then import the repo into Vercel. Every push to the main
branch redeploys automatically — no build steps to run by hand.
