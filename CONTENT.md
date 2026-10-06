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

## Reels (video) — `js/edits.js`

Each of the five reels takes: `video:` (MP4, H.264, 1080p, under ~8 MB, muted, loops), `image:` (poster), `link:` (the reel's Instagram URL). One entry feeds three places: the camera monitor, the floating cards in "Selected Edits", and the modal ("Watch on Instagram" uses `link`).
