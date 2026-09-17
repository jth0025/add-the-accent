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

## Contact form setup

The envelope icon in the header (`components/ContactButton.jsx`) posts to
Formspree, which relays submissions to info@addtheaccent.com. One-time
setup:

1. Create a free account at [formspree.io](https://formspree.io) and add
   a new form with info@addtheaccent.com as the recipient.
2. Formspree emails that address a confirmation link the first time —
   click it, or submissions won't be delivered.
3. Copy the form's endpoint (looks like `https://formspree.io/f/xxxxxxxx`).
4. Set it as an environment variable named `NEXT_PUBLIC_FORMSPREE_ENDPOINT`:
   - Locally: copy `.env.example` to `.env.local` and paste it in.
   - In production: add the same variable in the Vercel project's
     Settings → Environment Variables, then redeploy (env var changes
     don't apply to a deployment already running).

Until that variable is set, the form falls back to opening a `mailto:`
draft in the visitor's own mail app instead of sending directly.
