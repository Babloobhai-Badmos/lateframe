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

## Photos — all hosted on Cloudinary, matched by name

Upload each image to Cloudinary (root folder) and set its **Public ID** to the name below. Nothing else to edit — it appears on the site by itself, loads lazily, and Cloudinary resizes and compresses it. Until a name exists, that spot keeps its placeholder.

| Public ID | Where | Shown at | Upload size |
|---|---|---|---|
| `frame-1` … `frame-3` | The 3 polaroids in "Every cut has a reason" (portrait stills from your edits) | ~300 px wide | 1000×1250 |
| `feed-1` … `feed-8` | Instagram page tiles; `feed-1`…`feed-5` also form the home "Straight from the feed" strip | ~300–500 px wide | 1080×1920 for reels, 1080×1350 for posts |
| `cap-1` … `cap-12` | Capabilities section, 2 per service in this order: Reels (hook, loop), Color (before, after), Motion (type, overlay), Sound (beat, waveform), Pacing (raw, cut), Brand (9:16, 16:9) | ~350 px wide | 1000×1250 |
| `play-1` … `play-16` | The sliding photo cards in "Every frame is a decision" | ~300×400 px | 900×1200 |
| `reel-01` … `reel-05` (**video**) | The 3-second loops on the camera monitor (see Reels) | | original |

Other pictures that stay in the repo: Devansh's portrait (`assets/guild/devansh.webp`) and the social preview image (`assets/brand/logo-lf.jpg`).

### A photo doesn't show up?
Add `?photos` to the page address (e.g. `https://your-site.com/?photos`). A panel lists every picture that failed and Cloudinary's answer:
- **HTTP 404** → no image has that Public ID. In Cloudinary open the asset: the **Public ID** shown there must be exactly `frame-1` (no folder, no `_xxxxx` suffix, no `.jpg`). Either rename it, or map it without renaming in `js/photos.js`: `LF.PHOTO_IDS = { "frame-1": "frame-1_x7k2q" }`.
- **HTTP 401 / 403** → Cloudinary is refusing the request: Settings → Security → turn off **Strict transformations**, and make sure the image is public (upload type "upload", not "private"/"authenticated"). The site already retries without resizing.

### Instagram tiles: link + thumbnail
Instagram doesn't let other sites fetch a reel's thumbnail from its link, so each tile needs its own picture. Edit the list `LF.FEED` at the top of `js/photos.js`:

```js
{ type: "Reel", link: "https://www.instagram.com/reel/AbC123xyz/", img: "feed-1" },
{ type: "Reel", link: "https://www.instagram.com/reel/DeF456uvw/", clip: "reel-02" },  // frame cut from a Cloudinary video
{ type: "Post", link: "https://www.instagram.com/p/GhI789rst/",    img: "feed-4" },
```
- `link` — the reel or post URL (empty = your profile).
- `img` — Public ID of an uploaded thumbnail (screenshot of the reel cover, or any image).
- `clip` — instead of `img`, the Public ID of a video already on Cloudinary (e.g. `"reel-02"`). The tile shows a frame, then **plays the 3-second loop** on the Instagram page. It's the same file the camera monitor downloads, so there's no extra download.
- `type` — `"Reel"` (tall) or `"Post"` (4:5).

## Reels — 3-second clips from Cloudinary, downloaded once

Never commit `.mp4` files. Each reel in `js/edits.js` has:

| Field | What | Weight |
|---|---|---|
| `clip` | The Cloudinary **public ID** of the reel (`reel-01` … `reel-05`) | 0 in the repo |
| `image` | *Optional.* Your own cover (`assets/reels/01.webp`, 540×960 WebP). Left out, a frame 1 s into the clip is cut by Cloudinary automatically — shown until the clip is ready, and for visitors on Data Saver / reduced-motion | ~20 KB each |
| `link` | The reel's Instagram / YouTube Shorts / Vimeo URL — the pop-up embeds it when you press play | 0 |

**One-time Cloudinary setup**
1. Create a free Cloudinary account and copy the **cloud name** (top-left of the dashboard) into `LF.CLOUDINARY.cloud` in `js/edits.js`.
2. Upload the five full-quality originals to the Media Library and set their public IDs to `reel-01` … `reel-05` (Cloudinary then makes a 3-second, silent, compressed copy on the fly — your original is never touched). To use a different 3 seconds, change `so_0` (start offset in seconds) in the transformation.
3. Open each of the five URLs once in a browser to warm them (the first request makes Cloudinary transcode the file):
   `https://res.cloudinary.com/<cloud>/video/upload/f_mp4,vc_h264,q_auto:eco,so_0,du_3,ac_none,w_720,h_1280,c_fill/reel-02.mp4`

**What the visitor's device does**
- Each clip is downloaded **once**, saved in the browser's Cache Storage, and played from a local `blob:` URL — so every loop, and every later visit, costs **zero** network and zero Cloudinary bandwidth.
- The opening animation waits for the first **three** clips (`preload: 3` in `js/edits.js`), downloaded side by side; reels 4 and 5 load right after.
- Expected weight: about 0.3–0.7 MB per clip, so about 2–3 MB **once per device**. On Cloudinary's free plan (25 credits ≈ 25 GB of video bandwidth a month) that is roughly 8,000+ new devices a month.
- Swapping a clip: change its public ID or transformation → the URL changes → the device fetches the new one and drops the old.
