# lateframe

Portfolio site for **Devansh Sharma**, video editor — his edits, Instagram reels and
editing capabilities. Plain HTML + CSS + vanilla JS: no build step, no dependencies,
deploys anywhere static files do.

> Everything visual is **placeholder** (generated gradients, a silhouette portrait, sample
> reel titles). Swap in the real reels, stills and portrait — see below.

## Run it

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## What's on the home page

| Section | What it does |
| --- | --- |
| Loader | The lateframe mark (an **L** plus a trailing frame) fills up with a % counter |
| Nav + menu | Fixed logo/hamburger that recolours per section; full-screen menu with a wipe-fill hover |
| Hero | Pinned scene: giant scrolling name, portrait, a tilting "latest reel" card; wipes away diagonally |
| Selected Edits | Dark **timeline** with a timecode ruler and a red playhead; a horizontal reel of floating 9:16 cards. Click a card → modal with the video (or poster) and a "Watch on Instagram" button |
| Statement | REC chip + "Every cut has a reason." with frame-grab polaroids that fan out |
| Straight from the feed | Accordion reel tiles (snap carousel on phones) linking to the Instagram page |
| Capabilities | Diagonal wipe into a pinned showcase that steps through each service (dots, panel, marquee) |
| Every frame is a decision | Auto-drifting, draggable rail of stills |
| Footer | Glass nav panel, headline reveal, CTA, skills marquee, sound toggle |

Other pages: **Edits**, **Instagram**, **Capabilities**, **About**, **Contact**, Privacy, Terms.

## Make it yours

1. **Instagram, email, socials** — edit the `SITE` object at the top of `js/chrome.js`
   (set the real Instagram profile URL and contact email). Nav, menu and footer update everywhere.
2. **Reels** — the reel cards, hero card and modal all come from the `EDITS` array at the top of
   `js/home.js`:
   ```js
   { title: "Neon Nights", tag: "Cinematic edit", hue: 15,
     image: "assets/img/neon-nights.webp",   // poster still (optional)
     video: "assets/video/neon-nights.mp4",   // preview that plays in the modal (optional)
     link:  "https://instagram.com/reel/XXXX" // the original reel (optional)
     dy: -10, dur: 6.4, delay: 0 }            // float offset / animation timing
   ```
3. **Photos elsewhere** — any `.ph` placeholder takes a real image without CSS changes:
   `<div class="ph" data-src="assets/img/photo.webp"></div>`
4. **Portrait** — `js/art.js` draws a placeholder silhouette (hero + footer). Replace its output
   with an `<img>` of a transparent PNG/WebP cut-out.
5. **Capabilities** — the six services are in `BRANDS` in `js/home.js` and in `capabilities.html`.
6. **Copy** — About and legal pages are placeholder text. Colours/type: tokens in `:root` of
   `css/styles.css`. Fonts (Big Shoulders Display, Inter, JetBrains Mono — SIL OFL) are self-hosted.
7. **Contact form** — opens the visitor's email client; point `action` at a form service when you deploy.

Scroll choreography is one `requestAnimationFrame` loop in `js/home.js` that reads each pinned
section's progress and writes CSS variables. `prefers-reduced-motion` is respected.
