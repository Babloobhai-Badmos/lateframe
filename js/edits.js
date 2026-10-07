/* ==========================================================================
   Your reels — edit this one array.

   Every reel appears in three places: on the camera's flip-out monitor
   (hero), as a floating card in "Selected Edits", and in the modal.

     title / tag : shown on screen
     ar          : "h" (16:9) or "v" (9:16 — pillarboxed on the monitor)
     image       : poster still, e.g. assets/reels/01.webp (540×960, ~25 KB)
     link        : the reel's Instagram / YouTube / Vimeo URL — the modal embeds it
                   when you press play, so NO video file has to be hosted on the site
     video       : (optional, avoid) a direct mp4 URL — only if hosted off-site (CDN / Vercel Blob);
                   never commit mp4s to this repo
     hue         : colour of the placeholder art (0–360)
     dy/dur/delay: float offset + animation timing of the floating card
   ========================================================================== */
(function () {
  window.LF = window.LF || {};
  window.LF.EDITS = [
    { title: "Neon Nights", tag: "Cinematic edit", ar: "h", hue: 15, dy: -10, dur: 6.4, delay: 0 },
    { title: "Beat Drop", tag: "Beat-synced cuts", ar: "v", hue: 200, dy: 12, dur: 7.5, delay: -1.3 },
    { title: "Whip & Warp", tag: "Transitions", ar: "h", hue: 330, dy: -15, dur: 8.6, delay: -2.5 },
    { title: "Golden Hour", tag: "Color grade", ar: "v", hue: 40, dy: 8, dur: 6.4, delay: -3.8 },
    { title: "Hyperdrive", tag: "Speed ramps", ar: "h", hue: 265, dy: -5, dur: 7.5, delay: -5 },
  ];
})();
