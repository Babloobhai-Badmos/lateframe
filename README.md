# Lateframe

An editorial, scroll-driven athlete site template — no build step, no dependencies.
Plain HTML + CSS + vanilla JS, so it deploys anywhere static files do.

> The content is **placeholder** (a fictional player, fictional brands, generated
> artwork). It reproduces the *structure and interactions* of a premium
> athlete-brand site, not anyone's photos, logos or copy. Swap in your own.

## Run it

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## What's on the home page

| Section | What it does |
| --- | --- |
| Loader | Logo fills from the bottom with a % counter, then slides away |
| Nav + menu | Fixed logo/hamburger that recolours per section; full-screen menu with staggered links and a wipe-fill hover |
| Hero | Pinned scroll scene: giant marquee name, cut-out portrait, 3D-tilting foil trading card; wipes away diagonally |
| Signature Moments | Dark "field" with scrolling yard lines and a horizontal reel of floating cards; click opens a flip-in card modal |
| Quote | Polaroids rise, fan out, then the quote lines light up |
| Foundation | Accordion photo tiles (snap carousel on phones) |
| Partnerships | Diagonal wipe into a pinned showcase that steps through brands (dots, panel, marquee) |
| Make a play | Auto-drifting, draggable rail of tilted photos |
| Footer | Glass nav panel, headline reveal, CTA, partner marquee, sound toggle |

Inner pages (On-Field, Off-Field, Foundation, Partnerships, Journal, Inquiries, Privacy,
Terms) are simple placeholders on the same shell.

## Make it yours

1. **Site-wide copy** — edit the `SITE` object at the top of `js/chrome.js` (name, nav, socials,
   partner names, footer headline per page). Nav, menu and footer update everywhere.
2. **Photos** — every `.ph` placeholder takes a real image without CSS changes:
   `<div class="ph" data-src="assets/img/photo.webp"></div>`
3. **Portrait / cut-out** — `js/art.js` returns a placeholder SVG. Replace it with an `<img>` of a
   transparent PNG/WebP (hero portrait and footer cut-out).
4. **Cards, brands, rail** — cards are in `index.html`; brands (`BRANDS`) and rail photos (`PLAY`)
   are arrays near the top of `js/home.js`.
5. **Colours / type** — tokens live in `:root` at the top of `css/styles.css`.
   Fonts (Big Shoulders Display, Inter, JetBrains Mono — SIL OFL) are self-hosted in `assets/fonts`.
6. **Inquiries form** — opens the visitor's email client; point `action` at a form service
   when you deploy.

Scroll choreography is one `requestAnimationFrame` loop in `js/home.js` that reads each pinned
section's progress and writes CSS variables. `prefers-reduced-motion` is respected.
