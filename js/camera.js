/* ==========================================================================
   Hero: the camera.
   A cinema camera sits on the pebbled-leather background; its flip-out
   monitor plays your reels (cut every 3 s). As you scroll the camera swings
   toward you, then the view pushes in until the monitor fills the viewport —
   the screen *becomes* the main screen.

   Geometry comes from the design prototype: a 1920×1080 stage, scaled to the
   viewport, with the monitor laid over the camera's flip-out LCD.
   ========================================================================== */
(function () {
  "use strict";
  const host = document.querySelector("[data-cam]");
  if (!host) return;
  const $ = (s, r = host) => r.querySelector(s);

  const W = 1920, H = 1080;
  const K = 0.83, IMG_W = 1600 * K, IMG_H = 1408 * K, IMG_X = 298, IMG_Y = -31;
  const CAM_C = { x: 960, y: 560 };
  const MON = { x: IMG_X + 740 * K, y: IMG_Y + 258 * K, w: 242, h: 226, skew: 8 };
  const SCR = { l: 8, t: 12, w: 226, h: 127 };
  const CUT = 3;                               // seconds per reel
  const SWING_END = 0.5, ZOOM_A = 0.46, ZOOM_B = 0.88;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (v, a, b) => clamp((v - a) / (b - a));
  const sine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;       // easeInOutSine
  const outCubic = (t) => 1 - Math.pow(1 - t, 3);
  const p2 = (n) => String(n).padStart(2, "0");
  const tc = (sec) => { const f = Math.max(0, Math.floor(sec * 24)); return `${p2(Math.floor(f / 86400))}:${p2(Math.floor(f / 1440) % 60)}:${p2(Math.floor(f / 24) % 60)}:${p2(f % 24)}`; };

  const EDITS = window.LF.EDITS || [];
  const N = EDITS.length || 1;
  const LOOP = N * CUT;

  if (window.LF.preload) { LF.preload("assets/camera/fx6.webp", "image"); LF.preload("assets/textures/leather.jpg", "image"); }

  /* ---------- build the reels that play on the monitor ---------- */
  const reelsEl = $("[data-reels]");
  const art = (e, cls) => {
    const style = e.image ? `background-image:url('${e.image}')` : `--h:${e.hue}`;
    const body = e.video ? `<video src="${e.video}" muted playsinline loop preload="auto"></video>` : e.image ? "" : `<span class="cam__art-no">REEL ${p2(EDITS.indexOf(e) + 1)}</span><span class="cam__art-h">${e.ar === "v" ? "9:16" : "16:9"} · drop video</span>`;
    return `<div class="cam__art ${cls}" style="${style}">${body}</div>`;
  };
  reelsEl.innerHTML = EDITS.map((e) => `<div class="cam__reel cam__reel--${e.ar === "v" ? "v" : "h"}"><div class="cam__reel-in">${e.ar === "v" ? art(e, "cam__art--blur") : ""}${art(e, "cam__art--main")}</div></div>`).join("");
  const reels = [...reelsEl.children];
  const vids = reels.map((r) => r.querySelector("video.cam__vid, video"));

  const el = {
    stage: $("[data-stage-el]"), zoom: $("[data-zoom]"), rig: $("[data-rig]"), mon: $("[data-mon]"), shadow: $("[data-shadow]"),
    tc: $("[data-tc]"), tcPage: $("[data-tc-page]"), now: $("[data-now]"), title: $("[data-title]"), idx: $("[data-idx]"), flash: $("[data-flash]"), pin: $("[data-pin]"), big: $("[data-big]"), bigTag: $("[data-bigtag]"),
  };
  let ZOOM = 9, S = 1;

  function layout() {
    const vw = innerWidth, vh = innerHeight;
    // landscape: contain the 1920×1080 stage; portrait: crop in so the camera is a sensible size
    S = vw >= vh * 0.9 ? Math.min(vw / W, vh / H) : (vw * 1.3) / 1328;
    el.stage.style.setProperty("--s", S.toFixed(4));
    ZOOM = Math.max(vw / (SCR.w * S), vh / (SCR.h * S)) * 1.06;
  }

  /* ---------- per-frame ---------- */
  let cur = 0, last = performance.now(), t0 = last, visible = true, lastReel = -1, lastTcSec = -1;
  const SMOOTH = 0.7;

  function target() {
    const r = host.getBoundingClientRect();
    const total = r.height - innerHeight;
    return total > 0 ? clamp(-r.top / total) : 0;
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const tgt = target();
    cur += (tgt - cur) * (1 - Math.exp(-dt * (9 - SMOOTH * 7)));
    if (Math.abs(tgt - cur) < 0.00005) cur = tgt;
    window.LF.camProgress = cur;
    if (visible) render(cur, (Math.max(0, now - t0) / 1000) % LOOP);
    requestAnimationFrame(frame);
  }

  function render(sp, T) {
    // swing toward the viewer
    const swing = Math.sin(sine(seg(sp, 0, SWING_END)) * Math.PI);
    const ry = -34 * swing, rz = -5 * swing, lift = -36 * swing;
    // push into the monitor
    const z = sine(seg(sp, ZOOM_A, ZOOM_B));
    const scale = Math.pow(ZOOM, z);
    const zt = (scale - 1) / (ZOOM - 1);
    const breathe = reduce ? 1 : 1 + ((0.02 * (1 - Math.cos((T / LOOP) * Math.PI * 2))) / 2) * (1 - zt);
    const cx = MON.x + SCR.l + SCR.w / 2;
    const cy = MON.y + SCR.t + SCR.h / 2 + Math.tan((MON.skew * Math.PI) / 180) * (SCR.l + SCR.w / 2) * (1 - zt);
    el.zoom.style.transformOrigin = `${cx}px ${cy}px`;
    el.zoom.style.transform = `translate(${(W / 2 - cx) * zt}px, ${(H / 2 - cy) * zt}px) scale(${scale})`;
    // plain 2D transform whenever the camera isn't mid-swing, so text on the monitor re-rasterises sharply as it zooms
    el.rig.style.transform = swing > 1e-4
      ? `perspective(2200px) translateY(${lift}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${breathe})`
      : `scale(${breathe})`;
    el.mon.style.transform = `skewY(${MON.skew * (1 - zt)}deg)`;
    el.shadow.style.transform = `translateX(${swing * 40}px) scaleX(${1 - swing * 0.15})`;
    el.pin.style.setProperty("--fade", (1 - seg(sp, 0.30, 0.58)).toFixed(3));
    el.pin.style.setProperty("--hint", (1 - seg(sp, 0.02, 0.10)).toFixed(3));
    el.pin.style.setProperty("--zt", zt.toFixed(3));

    // reels on the monitor
    const idx = Math.min(N - 1, Math.floor(T / CUT)), local = Math.max(0, T - idx * CUT);
    if (idx !== lastReel) {
      lastReel = idx;
      reels.forEach((r, i) => { r.classList.toggle("is-on", i === idx); const v = vids[i]; if (v) { if (i === idx) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause(); } });
      const e = EDITS[idx] || {};
      el.title.textContent = (e.title || "").toUpperCase();
      el.idx.textContent = `${p2(idx + 1)}/${p2(N)}`;
      el.big.textContent = e.title || "";
      el.now.textContent = `Now playing — Reel ${p2(idx + 1)} · ${(e.title || "").toUpperCase()}`;
      el.bigTag.textContent = e.tag || "";
    }
    reels[idx].style.setProperty("--kb", (1.08 - 0.08 * sine(seg(local, 0, CUT))).toFixed(4));
    el.flash.style.opacity = ((1 - outCubic(seg(local, 0, 0.35))) * 0.85).toFixed(3);
    const sec = Math.floor(T * 24);
    if (sec !== lastTcSec) { lastTcSec = sec; el.tc.textContent = "REC " + tc(T); el.tcPage.textContent = tc(T); }
    host.classList.toggle("is-zoomed", zt > 0.985);

    // nav colour: dark logo on the white background, light once the screen takes over
    const tone = zt > 0.6 ? "dark" : "light";
    if (tone !== window.LF.camTone) { window.LF.camTone = tone; if (window.LF.updateTone) window.LF.updateTone(); }
  }

  layout();
  addEventListener("resize", layout);
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" }).observe(host);
  requestAnimationFrame(frame);
})();
