# Venkat Kommi — 3D Portfolio

A responsive, dark-theme portfolio built with semantic HTML, custom CSS, and Three.js. The hero contains a live 3D particle sculpture with orbital paths, pointer-responsive motion, and a rotating role headline.

## Run locally

Because the site uses JavaScript modules, run it through a local web server rather than opening `index.html` directly.

```bash
cd venkat-portfolio
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Upload the folder to GitHub Pages, Netlify, or Vercel as a static site. No build step is required. Three.js and Google Fonts are loaded from CDNs, so an internet connection is needed for those assets.

## Personalise before publishing

- Confirm the wording and details of the freelance Nike experience are accurate and that you are comfortable publishing them.
- Add direct GitHub repository URLs to each project card when the repositories are public. Current project links point to your GitHub profile, not invented repositories.
- Add a headshot or custom project screenshots if desired.
- Check the résumé PDF for any private information you do not want public before deploying.

## Included

- `index.html` — portfolio content and structure
- `style.css` — responsive layout, visual design and animations
- `script.js` — Three.js scene and interactions
- `assets/Venkat-Kommi-Resume.pdf` — supplied résumé download
