# What to put where

Everything below is a placeholder today. Nothing needs a code change except the config files named in each row.

## Links & contact details — `js/chrome.js` → `SITE`

| Field | What goes there | Shows up on |
|---|---|---|
| `contact.whatsapp` | WhatsApp number, digits only, with country code (e.g. `919876543210`) | Contact page (green-hover card, opens a pre-filled chat) |
| `contact.whatsappText` | The pre-filled first message | WhatsApp card |
| `contact.email` | Your email | Contact page, Privacy and Terms (auto), footer |
| `contact.phone` | Phone number as you want it displayed | Contact page (tap-to-call) |
| `contact.form` | Google Form share link (`https://forms.gle/…`) | Contact page card |
| `contact.embedForm` | `true` to also show the form inline | Contact page |
| `socials[].url` | Instagram, YouTube and X profile URLs | Menu, footer |

## Photos — drop files in the listed folder, then reference them

| Image | File / field | Size | Where it appears |
|---|---|---|---|
| Devansh portrait | `assets/guild/devansh.jpg` (already referenced in `js/guild.js`) | 1200×1500 (4:5), face in the upper half | Guild page (large), home Guild card (small circle) |
| Other members | `assets/guild/<name>.jpg` + a `photo:` path in `LF.GUILD` | 1200×1500 | Guild page grid, home card |
| Reel poster stills | `image:` on each reel in `js/edits.js` | 1080×1920 (9:16) or 1920×1080 | Floating cards in "Selected Edits", reel modal, monitor before the video loads |
| Instagram grid tiles | `data-src="assets/feed/01.jpg"` on each `.ph` in `instagram.html` and the "Straight from the feed" tiles in `index.html` | 1080×1350 | Instagram page, home "Straight from the feed" |
| Frame stills | `data-src` on the three `.polaroid .ph` in `index.html` | 1200×1500 | The "Every cut has a reason" statement |
| Capability visuals | `data-src` on the `.pslide__pol .ph` in `index.html` | 1000×1250 | Capabilities wipe on the home page and Capabilities page |
| Social preview | `assets/brand/logo-lf.jpg` | 1200×630 | Link previews (WhatsApp / Instagram / X) |

## Reels — 3-second clips from Cloudinary, downloaded once

Never commit `.mp4` files. Each reel in `js/edits.js` has:

| Field | What | Weight |
|---|---|---|
| `clip` | The Cloudinary **public ID** of the reel (`reel-01` … `reel-05`) | 0 in the repo |
| `image` | Poster still, 540×960 WebP (`assets/reels/01.webp`) — shown until the clip is ready, and for visitors on Data Saver / reduced-motion | ~25 KB each |
| `link` | The reel's Instagram / YouTube Shorts / Vimeo URL — the pop-up embeds it when you press play | 0 |

**One-time Cloudinary setup**
1. Create a free Cloudinary account and copy the **cloud name** (top-left of the dashboard) into `LF.CLOUDINARY.cloud` in `js/edits.js`.
2. Upload the five full-quality originals to the Media Library and set their public IDs to `reel-01` … `reel-05` (Cloudinary then makes a 3-second, silent, compressed copy on the fly — your original is never touched). To use a different 3 seconds, change `so_0` (start offset in seconds) in the transformation.
3. Open each of the five URLs once in a browser to warm them (the first request makes Cloudinary transcode the file):
   `https://res.cloudinary.com/<cloud>/video/upload/f_mp4,vc_h264,q_auto:eco,so_0,du_3,ac_none,w_720,h_1280,c_fill/reel-02.mp4`

**What the visitor's device does**
- Each clip is downloaded **once**, saved in the browser's Cache Storage, and played from a local `blob:` URL — so every loop, and every later visit, costs **zero** network and zero Cloudinary bandwidth.
- The intro waits only for the first clip (about 0.3–0.6 MB); the other four load right after.
- Expected weight: about 0.3–0.7 MB per clip, so about 2–3 MB **once per device**. On Cloudinary's free plan (25 credits ≈ 25 GB of video bandwidth a month) that is roughly 8,000+ new devices a month.
- Swapping a clip: change its public ID or transformation → the URL changes → the device fetches the new one and drops the old.
