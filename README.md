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
| Footer | Glass nav panel, headline reveal, CTA, skills marquee, sound toggle |

Other pages: **Edits**, **Instagram**, **Capabilities**, **About**, **Contact**, Privacy, Terms.

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
   The white pebbled-leather background is `assets/textures/leather.jpg` (tiles seamlessly).
5. **Capabilities** — the six services are in `BRANDS` in `js/home.js` and in `capabilities.html`.
6. **Copy** — About and legal pages are placeholder text. Colours/type: tokens in `:root` of
   `css/styles.css`. The logo artwork is `assets/brand/logo-lf.jpg` (also the social-share image —
   set an absolute URL in the `og:image` tag once deployed). Fonts (Big Shoulders Display, Inter, JetBrains Mono — SIL OFL) are self-hosted.
7. **Contact form** — opens the visitor's email client; point `action` at a form service when you deploy.

Scroll choreography is one `requestAnimationFrame` loop in `js/home.js` that reads each pinned
section's progress and writes CSS variables. `prefers-reduced-motion` is respected.
