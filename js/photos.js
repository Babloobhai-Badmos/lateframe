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
   tile below needs its own picture — either an uploaded image, or `clip:` = the
   Public ID of the reel's video on Cloudinary (a frame is cut from it).
   ========================================================================== */
(function () {
  "use strict";
  const LF = (window.LF = window.LF || {});

  /* ---- the Instagram page + the home-page strip: one list, 8 tiles ---- */
  LF.FEED = [
    { type: "Reel", link: "https://www.instagram.com/reel/DeBhNUKRQ1a/?stkn=MWdqN2dsamlqcWowNQ==", clip: "reel-01" },     // link: the reel's Instagram URL, e.g. https://www.instagram.com/reel/AbC123/
    { type: "Reel", link: "https://www.instagram.com/reel/Db-tF7eBTr5/?stkn=b2p2bWFpYmJ6MWN5", clip: "reel-02" },     // clip: the Cloudinary VIDEO Public ID (e.g. "reel-02")
    { type: "Reel", link: "https://www.instagram.com/reel/Dd-J854zabU/?stkn=MXhjbHk4cWlzdHo1eA==", clip: "reel-03" },     // clip: instead of img, a Cloudinary VIDEO Public ID (e.g. "reel-03")
    { type: "Post", link: "", img: "feed-4" },     // type: "Reel" (9:16) or "Post" (4:5)
    { type: "Reel", link: "", img: "feed-5" },
    { type: "Reel", link: "", img: "feed-6" },
    { type: "Reel", link: "", img: "feed-7" },
    { type: "Post", link: "", img: "feed-8" },
  ];

  const cloud = () => (LF.CLOUDINARY && LF.CLOUDINARY.cloud) || "";
  const live = () => cloud() && cloud() !== "your-cloud-name";
  const social = (id) => ((window.SITE && SITE.socials.find((s) => s.id === id)) || {}).url || "https://instagram.com/";

  /* slot name → image URL (or null) */
  function urlFor(slot, w) {
    if (!live()) return null;
    let img = slot, clip = null;
    const m = slot.match(/^feed-(\d+)$/);
    if (m && LF.FEED[m[1] - 1]) { const f = LF.FEED[m[1] - 1]; img = f.img || slot; clip = f.clip; }
    const base = `https://res.cloudinary.com/${cloud()}`;
    return clip
      ? `${base}/video/upload/so_1,w_${w},c_limit,q_auto/${clip}.jpg`
      : `${base}/image/upload/f_auto,q_auto,w_${w},c_limit/${img}`;
  }

  /* fill one placeholder; if the image doesn't exist (yet) the gradient stays */
  function fill(el) {
    const url = urlFor(el.dataset.photo, +el.dataset.w || 700);
    if (!url) return;
    const im = new Image();
    im.decoding = "async";
    im.onload = () => { el.style.backgroundImage = `url("${url}")`; el.setAttribute("data-src", url); el.classList.add("is-photo"); };
    im.src = url;
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
