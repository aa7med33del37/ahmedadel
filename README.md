# Ahmed Adel — Portfolio (Static HTML)

Pure HTML + CSS + JS. No build step, no libraries, no dependencies.
Opens directly in the browser and works on any hosting (Vercel, Netlify, cPanel...).

## Files
- `index.html`: English (main page)
- `ar/index.html`: Arabic
- `assets/css/style.css`: the full design
- `assets/js/main.js`: interactions (animations, cursor, stacking cards, counters)
- `assets/img/ahmed-adel.webp`: your photo (background removed)
- `assets/img/iijad-logo.webp`: Iijad logo
- `assets/fonts/`: Cairo font (hosted locally)
- `sitemap.xml`, `robots.txt`, `assets/og-image.png`: SEO and sharing

## Adding a project
In the Work section, copy any `<article class="wcard" style="--i:N">` block, edit it,
and increase `--i` by one (it controls the stacking order). Update both pages.

## Project screenshot
Inside `<div class="browser__body">`, replace the `browser__mono` div with:
`<img src="assets/img/projects/name.webp" alt="" loading="lazy">`  (Arabic page: `../assets/...`)
Best size: 1440×900 or similar.

## CV
Put the file at: `assets/cv/Ahmed-Adel-CV.pdf`

## Domain
If the domain changes from ahmedadel.vercel.app, search and replace it in
`index.html`, `ar/index.html`, `sitemap.xml`, `robots.txt`.
