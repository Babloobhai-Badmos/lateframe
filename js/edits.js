/* ==========================================================================
   Your reels — edit this one array.

   Every reel appears in three places: on the camera's flip-out monitor
   (hero), as a floating card in "Selected Edits", and in the modal.

     title / tag : shown on screen
     ar          : "h" (16:9) or "v" (9:16 — pillarboxed on the monitor)
     video       : mp4 that plays on the monitor + modal   (optional)
     image       : poster still                              (optional)
     link        : the reel's Instagram URL                  (optional)
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
