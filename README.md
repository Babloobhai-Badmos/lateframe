# lateframe

Portfolio site for **lateframe** — video edits, Instagram reels and editing capabilities. Plain HTML + CSS + vanilla JS: no build step, no dependencies,
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
| Intro | The "late frame" logo sequence (below) — doubles as a real preloader |
| Nav + menu | Fixed logo/hamburger that recolours per section; full-screen menu with a wipe-fill hover |
| Hero | A cinema camera that **stays perfectly still** on pebbled white leather, with a huge pale **LATEFRAME** behind it. Its flip-out monitor plays your reels; scroll and **only the screen comes closer** until it becomes the main screen. The camera is **playable** (below) |
| Selected Edits | Dark **timeline** with a timecode ruler and a red playhead; a horizontal reel of floating 9:16 cards. Click a card → modal with the video (or poster) and a "Watch on Instagram" button |
| Statement | REC chip + "Every cut has a reason." with frame-grab polaroids that fan out |
| Straight from the feed | Accordion reel tiles (snap carousel on phones) linking to the Instagram page |
| Capabilities | Diagonal wipe into a pinned showcase that steps through each service (dots, panel, marquee) |
| Every frame is a decision | Auto-drifting, draggable rail of stills |
| Footer | Glass nav panel, headline reveal, CTA, skills marquee, sound toggle, and a **second camera** (`assets/camera/fx6-lf.webp`) with the lf. mark on the lens |

Other pages: **Guild**, **Instagram**, **Capabilities**, **About**, **Contact**, Privacy, Terms.

## Motto

**Frames that stay.** It sits on the left of the hero (with a short blurb and tags), in the footer panel, the page
title and meta description. Change it in `index.html` (`.cam__motto`) and the `SITE.projectBy` label in `js/chrome.js`.
The right of the hero is a full-bleed neon **Guild card** (smoked liquid glass by default; other looks via `LF.GUILD_CARD` in `js/guild.js`, or preview with `?card=a`–`f`, `?size=compact|slim`) (members from `js/guild.js`) linking to the Guild page; on phones it becomes a one-row pill under the camera. Click the monitor to cut to the next reel.

## Playable camera

Hover (or tap) the real controls on the camera photo:

| Control | Does |
| --- | --- |
| Lens | **Rack focus** — the monitor racks from blurry to sharp |
| **REC** button | Toggles record ↔ standby (timecode freezes at `STBY`) |
| **MENU** | Opens a reel list on the monitor — pick any reel |
| **ISO / WB / SHUTTER** | Cycle ISO, white balance (tints the image) and shutter angle |
| **ND dial** | Cycles the ND filter (darkens/brightens the image) |
| Audio knobs | Toggle live audio meters |
| The monitor itself | Cut to the next reel (click or Enter) |

Hotspots are positioned in the photo's own pixel space (`HOT` in `js/camera.js`), so if you swap the camera
photo, re-measure them. They switch off once you start scrolling into the screen.

## The intro (logo animation + preloader)

`js/intro.js` + `css/intro.css`, using the real **lf.** logo (traced from `assets/brand/logo-lf.jpg` into
`js/brand.js` as three vector paths: **l**, **f** and the period).

1. Black → grain and a warm amber / orange / crimson light bloom, with a blinking **REC** timecode.
2. The **l** and **f** rise in. A dashed outline waits where the period goes.
3. The timecode counts **00:00:00 → 00:00:23** as the site *actually* loads — fonts, images, and the reel
   posters / previews are all tracked.
4. When everything is ready (never before 3.3 s), frame **24** lands: the period slams in with a flash,
   shockwave rings and screen shake. The hero then reveals as the screen splits open like a shutter.

- Slow connection? It keeps waiting (12 s hard cap). There's deliberately no loading bar or skip button —
  the timecode *is* the progress.
- Plays on first open and on reload; navigating between pages inside the site skips it.
  Force it with `?intro`, disable it with `?nointro`. `prefers-reduced-motion` gets a calm fade version.
- Add your own assets to the wait: `LF.preload("assets/video/clip.mp4", "video")` or `"image"`.
  Reel `image` / `video` entries in `EDITS` are registered automatically.

## Make it yours

1. **Instagram, email, socials** — edit the `SITE` object at the top of `js/chrome.js`
   (set the real Instagram profile URL and contact email). Nav, menu and footer update everywhere.
2. **Reels** — the camera's monitor, the floating reel cards and the modal all read the `EDITS` array in
   `js/edits.js`:
   ```js
   { title: "Neon Nights", tag: "Cinematic edit", hue: 15,
     ar: "h",                                   // "h" = 16:9, "v" = 9:16 (pillarboxed on the monitor)
     image: "assets/img/neon-nights.webp",   // poster still (optional)
     video: "assets/video/neon-nights.mp4",   // preview that plays in the modal (optional)
     link:  "https://instagram.com/reel/XXXX" // the original reel (optional)
     dy: -10, dur: 6.4, delay: 0 }            // float offset / animation timing
   ```
3. **Photos elsewhere** — any `.ph` placeholder takes a real image without CSS changes:
   `<div class="ph" data-src="assets/img/photo.webp"></div>`
4. **Hero camera** — `assets/camera/fx6.webp` (a transparent cut-out). To use a different camera, swap the image
   and re-measure where its flip-out monitor sits (`MON` / `SCR` constants at the top of `js/camera.js`).
   The white pebbled-leather background is `assets/textures/leather.webp` (tiles seamlessly).
5. **Capabilities** — the six services are in `BRANDS` in `js/home.js` and in `capabilities.html`.
6. **Copy** — About and legal pages are placeholder text. Colours/type: tokens in `:root` of
   `css/styles.css`. The logo artwork is `assets/brand/logo-lf.jpg` (also the social-share image —
   set an absolute URL in the `og:image` tag once deployed). Fonts (Big Shoulders Display, Inter, JetBrains Mono — SIL OFL) are self-hosted.
7. **Contact page** — WhatsApp, email, phone and Google Form cards come from `SITE.contact` in `js/chrome.js` (set `embedForm: true` to also show the form inline).
8. **Guild** — members live in `js/guild.js` (`LF.GUILD`); portraits go in `assets/guild/`. Privacy and Terms are written in the name of `SITE.owner`.

Scroll choreography is one `requestAnimationFrame` loop in `js/home.js` that reads each pinned
section's progress and writes CSS variables. `prefers-reduced-motion` is respected.

## Performance notes

Scroll animation is deliberately cheap — keep it that way when adding to it:

- No layout reads while scrolling: section geometry is cached (`LF.pin(el)`, `LF.near(el)` in `js/chrome.js`).
- Per-frame values are written straight onto the elements that use them, never as a CSS variable on a big
  container (that re-styles the whole subtree).
- No always-on `mix-blend-mode`, `backdrop-filter` or big `filter: blur()` layers; the leather texture is baked
  (`assets/textures/leather-sand.jpg`) instead of blended.
- Looping CSS animations pause when their section is off-screen (`.is-off`, set by an IntersectionObserver).
- Scroll easing is short (≈60 ms) so motion never feels like it is trailing your scroll.

## Footer camera asset

`assets/camera/fx6-lf.webp` was cut out of the supplied render (GrabCut), the original "L.F" text was inpainted away
and the traced lf. logo composited onto the lens; the cropped left edge is faded out.

## Deploying on Vercel (static, no build step)

1. Push the repo, then **Add New → Project → import it**. Framework preset: **Other**; leave build command and output directory empty.
2. `vercel.json` sets long caching for fonts, week-long caching for images and short caching for JS/CSS, plus basic security headers. `.vercelignore` keeps the docs out of the deployment.
3. Total weight today: about **0.97 MB** on disk; the home page transfers about **0.8 MB** uncompressed when fully scrolled (Vercel serves Brotli, so roughly 0.45 MB on the wire).
4. Keep it small:
   - no video files — use `link` + a poster (see `CONTENT.md`);
   - images as WebP, sized for how they're shown (a portrait that's displayed 550px wide doesn't need to be 5000px);
   - set the `og:image` / `twitter:image` in `index.html` to an **absolute** URL once you have your domain (`https://your-domain.com/assets/brand/logo-lf.jpg`) — social previews ignore relative paths.
