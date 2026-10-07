/* ==========================================================================
   Photos — every picture on the site comes from Cloudinary, by NAME.

   Upload an image to Cloudinary with the Public ID below (root folder) and it
   appears; until it exists the gradient placeholder stays, nothing breaks.
   Images load lazily (only when they're about to scroll into view) and are
   resized + compressed by Cloudinary (f_auto = WebP/AVIF, q_auto).

     frame-1 … frame-3   the three polaroids in "Every cut has a reason"
     feed-1  … feed-8    the Instagram thumbnails (home strip uses feed-1 … feed-5)
     cap-1   … cap-12    the before/after stills in "Capabilities" (2 per service)
     play-1  … play-16   the photo cards in "Every frame is a decision"

   Instagram can't be asked for a reel's thumbnail by another website, so each
   tile below needs its own picture — either an uploaded image (`img:`), or
   `clip:` = the Public ID of the reel's video on Cloudinary. With `clip:` the tile
   shows a frame at first, then PLAYS the 3-second loop on the Instagram page
   (the same clip the camera monitor already downloaded — no extra download).
   ========================================================================== */
(function () {
  "use strict";
  const LF = (window.LF = window.LF || {});

  /* ---- the Instagram page + the home-page strip: one list, 8 tiles ---- */
  LF.FEED = [
    { type: "Reel", link: "https://www.instagram.com/reel/DbYIIF-A1HH/?stkn=MXJmdGVhZmNsbml1cQ==", clip: "reel-06" },     // type: "Reel" (9:16) or "Post" (4:5)
    { type: "Reel", link: "https://www.instagram.com/reel/DXO-CZGgJzR/?stkn=bWNobXJwNGpkazVn", clip: "reel-07" },
    { type: "Reel", link: "https://www.instagram.com/reel/DXMaplPEkFz/?stkn=MTRjdWR6d3VtZDI4NA==", clip: "reel-08" },
    { type: "Reel", link: "https://www.instagram.com/reel/DeBhNUKRQ1a/?stkn=MWdqN2dsamlqcWowNQ==", clip: "reel-01" },     // link: the reel's Instagram URL, e.g. https://www.instagram.com/reel/AbC123/
    { type: "Reel", link: "https://www.instagram.com/reel/Db-tF7eBTr5/?stkn=b2p2bWFpYmJ6MWN5", clip: "reel-02" },     // clip: the Cloudinary VIDEO Public ID (e.g. "reel-02")
    { type: "Reel", link: "https://www.instagram.com/reel/Dd-J854zabU/?stkn=MXhjbHk4cWlzdHo1eA==", clip: "reel-03" },     // clip: instead of img, a Cloudinary VIDEO Public ID (e.g. "reel-03")
    { type: "Reel", link: "https://www.instagram.com/reel/DcK9_CWx6ec/?stkn=YmpwZ2FocW5sdGJ4", clip: "reel-04" },
    { type: "Reel", link: "https://www.instagram.com/reel/DcdNChzRpWI/?stkn=empvcG42Y2Q4dmxr", clip: "reel-09" },
  ];

  /* If Cloudinary gave an upload a different Public ID than its name (e.g. "frame-1_x7k2q" — it adds a
     random suffix when "unique filename" is on), map it here instead of renaming:  { "frame-1": "frame-1_x7k2q" } */
  LF.PHOTO_IDS = LF.PHOTO_IDS || {};

  const cloud = () => (LF.CLOUDINARY && LF.CLOUDINARY.cloud) || "";
  const live = () => cloud() && cloud() !== "your-cloud-name";
  const social = (id) => ((window.SITE && SITE.socials.find((s) => s.id === id)) || {}).url || "https://instagram.com/";

  /* slot name → image URL (or null) */
  function urlFor(slot, w) {
    if (!live()) return null;
    let img = slot, clip = null;
    const m = slot.match(/^feed-(\d+)$/);
    if (m && LF.FEED[m[1] - 1]) { const f = LF.FEED[m[1] - 1]; img = f.img || slot; clip = f.clip; }
    img = LF.PHOTO_IDS[img] || img;
    const base = `https://res.cloudinary.com/${cloud()}`;
    return clip
      ? `${base}/video/upload/so_1,w_${w},c_limit,q_auto/${clip}.jpg`
      : `${base}/image/upload/f_auto,q_auto,w_${w},c_limit/${img}`;
  }
  /* the same picture with no transformation — works even if "Strict transformations" is on */
  const plainUrl = (url) => url.replace(/\/upload\/[^/]*,[^/]*\//, "/upload/");

  /* clip tiles play only while they're on screen */
  const vio = "IntersectionObserver" in window
    ? new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause())), { threshold: 0.2 })
    : null;
  function attachClip(el, clip) {
    // same URL as the camera monitor uses for this reel → same cached download
    const edit = (LF.EDITS || []).find((e) => e.clip === clip) || { clip, ar: "v" };
    const url = LF.clipUrl && LF.clipUrl(edit);
    if (!url || !LF.clip) return;
    LF.clip(url).then((src) => {
      if (!src) return;
      const v = document.createElement("video");
      v.className = "ph__vid"; v.muted = true; v.loop = true; v.playsInline = true; v.preload = "auto";
      v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
      v.addEventListener("playing", () => v.classList.add("is-ready"), { once: true });
      v.src = src;
      el.appendChild(v);
      vio ? vio.observe(v) : v.play().catch(() => {});
    });
  }
  const playsClips = document.body.dataset.page === "instagram";   // the home strip keeps stills (lighter scroll)

  /* fill one placeholder; if the image doesn't exist (yet) the gradient stays */
  function fill(el) {
    const url = urlFor(el.dataset.photo, +el.dataset.w || 700);
    if (!url) return;
    const m = el.dataset.photo.match(/^feed-(\d+)$/), f = m && LF.FEED[m[1] - 1];
    if (playsClips && f && f.clip) attachClip(el, f.clip);
    const show = (u) => { el.style.backgroundImage = `url("${u}")`; el.setAttribute("data-src", u); el.classList.add("is-photo"); };
    const im = new Image();
    im.decoding = "async";
    im.onload = () => show(im.src);
    im.onerror = () => {
      const plain = plainUrl(url);
      if (plain === url || el.classList.contains("is-photo")) return report(el.dataset.photo, url);
      const im2 = new Image();                       // retry without resizing
      im2.onload = () => show(plain);
      im2.onerror = () => report(el.dataset.photo, url);
      im2.src = plain;
    };
    im.src = url;
  }

  /* ---- ?photos in the address bar → a panel that says what Cloudinary answered for each picture ---- */
  const debug = /[?&]photos\b/.test(location.search);
  const seen = new Set();
  let panel = null;
  function report(slot, url) {
    if (!debug || seen.has(slot)) return;
    seen.add(slot);
    if (!panel) {
      panel = document.createElement("div");
      panel.style.cssText = "position:fixed;left:12px;bottom:12px;z-index:99999;max-width:min(560px,92vw);max-height:60vh;overflow:auto;background:#111;color:#eee;font:12px/1.5 ui-monospace,monospace;padding:12px 14px;border-radius:10px;box-shadow:0 8px 30px #000a";
      panel.innerHTML = "<b>Photos that did not load</b> <small>(Cloudinary's answer)</small>";
      document.body.appendChild(panel);
    }
    const row = document.createElement("div");
    row.style.cssText = "margin-top:8px;word-break:break-all";
    row.textContent = `✗ ${slot} — checking…`;
    panel.appendChild(row);
    fetch(url, { method: "HEAD", mode: "cors" }).then((r) => {
      const why = r.headers.get("x-cld-error") || "";
      row.textContent = `✗ ${slot} — HTTP ${r.status}${why ? " · " + why : ""}\n${url}`;
      row.style.whiteSpace = "pre-wrap";
    }).catch(() => { row.textContent = `✗ ${slot} — blocked or offline\n${url}`; });
  }

  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); fill(e.target); } }), { rootMargin: "900px" })
    : null;
  LF.photos = (root = document) =>
    root.querySelectorAll(".ph[data-photo]:not([data-seen])").forEach((el) => { el.dataset.seen = "1"; io ? io.observe(el) : fill(el); });

  /* ---- Instagram page: build the grid from LF.FEED ---- */
  const grid = document.querySelector("[data-feed-grid]");
  if (grid) {
    const play = '<span class="gcard__play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>';
    const tiles = LF.FEED.map((f, i) => {
      const n = String(i + 1).padStart(2, "0");
      const post = /post/i.test(f.type);
      return `<a class="gcard ${post ? "gcard--post" : "gcard--reel"}" href="${f.link || social("instagram")}" target="_blank" rel="noreferrer" aria-label="${f.type} ${n} on Instagram"><div class="gcard__meta"><span>${f.type}</span></div>${post ? "" : play}<div class="ph" style="--h:${(i * 47 + 15) % 360}" data-label="${f.type} ${n}" data-photo="feed-${i + 1}" data-w="600"></div></a>`;
    });
    grid.innerHTML = tiles.join("");
  }
  document.querySelectorAll("[data-ig-follow]").forEach((a) => (a.href = social("instagram")));
  document.querySelectorAll("[data-ig-handle]").forEach((n) => {
    const h = (social("instagram").match(/instagram\.com\/([\w.]+)/i) || [])[1];
    if (h) n.textContent = "@" + h;
  });

  LF.photos();
})();
