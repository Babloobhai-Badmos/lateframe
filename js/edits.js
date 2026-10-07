/* ==========================================================================
   Your reels — edit this one array.

   Every reel appears in three places: on the camera's flip-out monitor
   (hero), as a floating card in "Selected Edits", and in the modal.

     title / tag : shown on screen
     ar          : "h" (16:9) or "v" (9:16 — pillarboxed on the monitor)
     image       : (optional) your own cover still — a file in assets/reels/ (540×960 WebP, ~25 KB)
                   or any URL. Left out, a poster frame is cut from the clip by Cloudinary.
     link        : the reel's Instagram / YouTube / Vimeo URL, e.g.
                   "https://www.instagram.com/reel/AbC123xyz/" — the pop-up embeds it
                   when you press play, so NO video file has to be hosted on the site
     clip        : Cloudinary public ID of the 3-second loop that autoplays on the camera
                   monitor (see LF.CLOUDINARY below). Downloaded once, then kept on the device.
     start       : (optional) second of the original where the 3-second clip begins (default 0)
     video       : (optional) a full mp4 URL instead of `clip` — must be hosted off-site;
                   never commit mp4s to this repo
     hue         : colour of the placeholder art (0–360)
     dy/dur/delay: float offset + animation timing of the floating card
   ========================================================================== */
(function () {
  window.LF = window.LF || {};

  /* Your Cloudinary cloud name (Dashboard → top-left). While it still says
     "your-cloud-name" no clips are requested and the posters are shown.
     The transformations trim to 3 s, drop audio, resize and compress — Cloudinary
     does it from your original upload, so upload the full-quality file. */
  window.LF.CLOUDINARY = {
    cloud: "mdoueimq",
    preload: 3,   // the opening animation waits for this many clips (reels 1, 2, 3) before it lets the page in
    horizontal: "f_mp4,vc_h264,q_auto:eco,so_0,du_3,ac_none,w_1280,h_720,c_fill",
    vertical: "f_mp4,vc_h264,q_auto:eco,so_0,du_3,ac_none,w_720,h_1280,c_fill",
  };

  window.LF.EDITS = [
    { title: "Neon Nights", clip: "reel-01", tag: "Cinematic edit", link: "https://www.instagram.com/reel/DeBhNUKRQ1a/?stkn=MWdqN2dsamlqcWowNQ==", ar: "h", hue: 15, dy: -10, dur: 6.4, delay: 0 },
    { title: "Beat Drop", clip: "reel-02", tag: "Beat-synced cuts", link: "https://www.instagram.com/reel/Db-tF7eBTr5/?stkn=b2p2bWFpYmJ6MWN5", ar: "v", hue: 200, dy: 12, dur: 7.5, delay: -1.3 },
    { title: "Whip & Warp", clip: "reel-03", tag: "Transitions", link: "https://www.instagram.com/reel/Dd-J854zabU/?stkn=MXhjbHk4cWlzdHo1eA==", ar: "h", hue: 330, dy: -15, dur: 8.6, delay: -2.5 },
    { title: "Golden Hour", clip: "reel-04", tag: "Color grade", link: "https://www.instagram.com/reel/DcK9_CWx6ec/?stkn=YmpwZ2FocW5sdGJ4", ar: "v", hue: 40, dy: 8, dur: 6.4, delay: -3.8 },
    { title: "Hyperdrive", clip: "reel-05", tag: "Speed ramps", link: "https://www.instagram.com/reel/DWXCmrnkgU4/?stkn=MXgwOXA5cGl6cWZhNw==", ar: "h", hue: 265, dy: -5, dur: 7.5, delay: -5 },
  ];

  /* posters: unless a reel has its own `image`, use a frame cut from its Cloudinary clip (1 s in) */
  const C = window.LF.CLOUDINARY;
  if (C.cloud && C.cloud !== "your-cloud-name") {
    window.LF.EDITS.forEach((r) => {
      if (r.image || !r.clip) return;
      const size = r.ar === "v" ? "w_540,h_960" : "w_960,h_540";
      r.image = `https://res.cloudinary.com/${C.cloud}/video/upload/so_${(r.start || 0) + 1},${size},c_fill,q_auto/${r.clip}.jpg`;
    });
  }
})();
