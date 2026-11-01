# anushkabhandari.in

Personal portfolio for Anushka Bhandari. Vite + React + Tailwind CSS v4, with Framer Motion for small animations.

## Run it

```sh
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run lint
```

## Updating content

All copy (bio, experience, projects, skills, education, achievements, links) lives in
[`src/content.js`](src/content.js). Edit that file; the components in `src/App.jsx` render whatever is there.

The resume served by the "Resume" buttons is [`public/resume.pdf`](public/resume.pdf). Replace the file to update it.

## Features

- Light and dark themes (follows the system setting until toggled; the choice is remembered)
- Command menu: press ⌘K / Ctrl+K to jump to a section, copy the email, or open links
- Scroll progress bar, back-to-top button, active-section highlighting in the nav
- Respects reduced-motion settings; skip-to-content link and keyboard focus styles
- SEO and link-preview tags plus structured data (`index.html`)
