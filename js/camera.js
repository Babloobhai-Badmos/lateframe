/* ==========================================================================
   Hero: the camera.
   A cinema camera sits perfectly still on the pebbled-leather background;
   its flip-out monitor plays your reels (cut every 3 s). As you scroll, the
   view pushes in until the monitor fills the viewport — the screen
   *becomes* the main screen. The camera itself never rotates or drifts.

   It is also playable: the lens (rack focus), REC, MENU, ISO / WB / SHUTTER,
   the ND dial and the audio knobs are real buttons laid over the photo, and
   they drive the readouts on the monitor.

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
  const MON = { x: IMG_X + 740 * K, y: IMG_Y + 258 * K, w: 242, h: 226, skew: 8 };
  const SCR = { l: 8, t: 12, w: 226, h: 127 };
  const CUT = 3;                               // seconds per reel
  const ZOOM_A = 0.05, ZOOM_B = 0.9;
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

  if (window.LF.preload) { LF.preload("assets/camera/fx6.webp", "image"); LF.preload("assets/textures/leather.webp", "image"); }

  /* ---------- build the reels that play on the monitor ---------- */
  const reelsEl = $("[data-reels]");
  const art = (e, cls) => {
    const style = e.image ? `background-image:url('${e.image}')` : `--h:${e.hue}`;
    const body = e.image ? "" : `<span class="cam__art-no">REEL ${p2(EDITS.indexOf(e) + 1)}</span><span class="cam__art-h">${e.ar === "v" ? "9:16" : "16:9"} · drop video</span>`;
    return `<div class="cam__art ${cls}" style="${style}">${body}</div>`;
  };
  reelsEl.innerHTML = EDITS.map((e) => `<div class="cam__reel cam__reel--${e.ar === "v" ? "v" : "h"}"><div class="cam__reel-in">${e.ar === "v" ? art(e, "cam__art--blur") : ""}${art(e, "cam__art--main")}</div></div>`).join("");
  const reels = [...reelsEl.children];
  const vids = reels.map(() => null);

  /* clips: each is fetched once (Cloudinary → Cache Storage → blob URL) and loops from memory */
  if (window.LF.clip && LF.clipUrl) {
    const urls = EDITS.map((e) => LF.clipUrl(e));
    const first = urls.findIndex(Boolean);
    if (first >= 0 && LF.waitFor) LF.waitFor(LF.clip(urls[first]));        // the intro waits for the first clip only
    urls.forEach((u, i) => u && LF.clip(u).then((src) => {
      if (!src) return;
      const v = document.createElement("video");
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = "auto";
      v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
      v.addEventListener("playing", () => v.classList.add("is-ready"), { once: true });
      v.src = src;
      reels[i].querySelector(".cam__art--main").appendChild(v);
      vids[i] = v;
      if (reels[i].classList.contains("is-on") && visible) v.play().catch(() => {});
    }));
    Promise.all(urls.filter(Boolean).map((u) => LF.clip(u))).then(() => LF.clipsPrune && LF.clipsPrune(urls.filter(Boolean)));
  }

  const el = {
    stage: $("[data-stage-el]"), zoom: $("[data-zoom]"), rig: $("[data-rig]"), mon: $("[data-mon]"), shadow: $("[data-shadow]"),
    tc: $("[data-tc]"), scrin: $("[data-scrin]"), set: $("[data-set]"), wb: $("[data-wb]"), meters: $("[data-meters]"), menu: $("[data-menu]"), menuList: $("[data-menu-list]"), hot: $("[data-hot]"), lensglow: $("[data-lensglow]"), reelsBox: $("[data-reels]"), tcPage: $("[data-tc-page]"), now: $("[data-now]"), title: $("[data-title]"), idx: $("[data-idx]"), flash: $("[data-flash]"), pin: $("[data-pin]"), big: $("[data-big]"), bigTag: $("[data-bigtag]"),
  };
  let ZOOM = 9, S = 1;
  let fc = 0, lastFlash = "", lastFade = -1, lastHint = -1;
  const fadeEls = [$(".cam__ui-page"), $(".cam__sides"), $(".cam__bgword")].filter(Boolean);
  const hintEls = [...host.querySelectorAll(".cam__hud-bot span:nth-child(-n+2)")];

  function layout() {
    const vw = innerWidth, vh = innerHeight;
    // landscape: contain the 1920×1080 stage; portrait: crop in so the camera is a sensible size
    S = vw >= vh * 0.9 ? Math.min(vw / W, vh / H) : (vw * 1.3) / 1328;
    el.stage.style.setProperty("--s", S.toFixed(4));
    ZOOM = Math.max(vw / (SCR.w * S), vh / (SCR.h * S)) * 1.06;
  }

  /* ---------- per-frame ---------- */
  let cur = 0, last = performance.now(), t0 = last, visible = true, lastReel = -1, lastTcSec = -1;
  let clock = 0, recT = 0, recording = true, menuOpen = false;

  const target = () => LF.pin(host);

  function frame(now) {
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = now;
    const tgt = target();
    cur += (tgt - cur) * (1 - Math.exp(-dt * 18));      // short ease: smooth, but never feels behind your scroll
    if (Math.abs(tgt - cur) < 0.00005) cur = tgt;
    window.LF.camProgress = cur;
    clock += dt; if (recording) recT += dt;
    if (visible) render(cur, clock % LOOP);
    requestAnimationFrame(frame);
  }

  function render(sp, T) {
    // push into the monitor — the ONLY thing that moves with scroll
    const z = sine(seg(sp, ZOOM_A, ZOOM_B));
    const scale = Math.pow(ZOOM, z);
    const zt = (scale - 1) / (ZOOM - 1);
    const cx = MON.x + SCR.l + SCR.w / 2;
    const cy = MON.y + SCR.t + SCR.h / 2 + Math.tan((MON.skew * Math.PI) / 180) * (SCR.l + SCR.w / 2) * (1 - zt);
    el.zoom.style.transformOrigin = `${cx}px ${cy}px`;
    el.zoom.style.transform = zt < 1e-4 ? "none" : `translate(${(W / 2 - cx) * zt}px, ${(H / 2 - cy) * zt}px) scale(${scale})`;
    el.mon.style.transform = `skewY(${MON.skew * (1 - zt)}deg)`;
    // write opacities straight onto the few elements that use them (a custom property on the container would re-style the whole subtree)
    const fq = Math.round((1 - seg(sp, 0.10, 0.34)) * 100) / 100;
    if (fq !== lastFade) { lastFade = fq; for (const n of fadeEls) n.style.opacity = fq; }
    const hq = Math.round((1 - seg(sp, 0.01, 0.07)) * 100) / 100;
    if (hq !== lastHint) { lastHint = hq; for (const n of hintEls) n.style.opacity = hq; }

    // reels on the monitor
    const idx = Math.max(0, Math.min(N - 1, Math.floor(T / CUT))), local = Math.max(0, T - idx * CUT);
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
    if ((fc++ & 3) === 0) reels[idx].style.setProperty("--kb", (1.08 - 0.08 * sine(seg(local, 0, CUT))).toFixed(3));   // slow push: ~15 updates/s is plenty
    const fl = local < 0.4 ? ((1 - outCubic(seg(local, 0, 0.35))) * 0.85).toFixed(3) : "0";
    if (fl !== lastFlash) { lastFlash = fl; el.flash.style.opacity = fl; }
    const sec = Math.floor(recT * 24) * 2 + (recording ? 1 : 0);
    if (sec !== lastTcSec) { lastTcSec = sec; paintTc(); }
    host.classList.toggle("is-zoomed", zt > 0.97);
    host.classList.toggle("is-moving", zt > 0.02);

    // nav colour: dark logo on the white background, light once the screen takes over
    const tone = zt > 0.6 ? "dark" : "light";
    if (tone !== window.LF.camTone) { window.LF.camTone = tone; if (window.LF.updateTone) window.LF.updateTone(); }
  }

  function paintTc() {
    const t = tc(recT);
    el.tc.textContent = (recording ? "REC " : "STBY ") + t;
    el.tcPage.textContent = t;
    host.classList.toggle("is-standby", !recording);
  }

  /* ==================================================================
     Interactivity — hotspots in the photo's own pixel space (1600×1408)
     ================================================================== */
  const ISO = [400, 800, 1600, 3200, 6400], ISO_F = [0.84, 1, 1.12, 1.24, 1.36];
  const WB = [3200, 4300, 5600, 6500], WB_C = ["rgba(255,150,60,.55)", "rgba(255,196,130,.4)", "rgba(255,255,255,0)", "rgba(120,170,255,.4)"];
  const SH = ["180°", "90°", "45°", "360°"];
  const ND = [0.3, 0.6, 0.9, 1.2, 1.5], ND_F = [1.14, 1.06, 1, 0.84, 0.7];
  const st = { iso: 1, wb: 2, sh: 0, nd: 2, meters: false };
  const flashChip = (k) => { const n = el.set.querySelector(`[data-s="${k}"]`); if (!n) return; n.classList.remove("is-hit"); void n.offsetWidth; n.classList.add("is-hit"); };
  function paintSettings() {
    const put = (k, t) => { const n = el.set.querySelector(`[data-s="${k}"]`); if (n) n.textContent = t; };
    put("iso", "ISO " + ISO[st.iso]); put("wb", WB[st.wb] + "K"); put("shut", SH[st.sh]); put("nd", "ND " + ND[st.nd].toFixed(1));
    const exp = ISO_F[st.iso] * ND_F[st.nd];
    el.reelsBox.style.filter = Math.abs(exp - 1) < 0.002 ? "" : `brightness(${exp.toFixed(3)})`;   // no filter layer at neutral exposure
    el.wb.style.display = st.wb === 2 ? "none" : "";                                              // blend layer only when tinted
    el.wb.style.background = WB_C[st.wb];
    el.meters.classList.toggle("is-on", st.meters);
  }
  const cycle = (key, len, chip) => () => { st[key] = (st[key] + 1) % len; paintSettings(); flashChip(chip); };

  function jump(i) { clock = ((i % N) + N) % N * CUT + 0.001; }   // cut straight to reel i
  function buildMenu() {
    el.menuList.innerHTML = EDITS.map((e, i) => `<li><button type="button" data-i="${i}"><span>${p2(i + 1)}</span>${e.title}</button></li>`).join("");
  }
  function toggleMenu(open) {
    menuOpen = open === undefined ? !menuOpen : open;
    el.menu.classList.toggle("is-open", menuOpen);
  }
  el.menuList.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; e.stopPropagation(); jump(+b.dataset.i); toggleMenu(false); });

  function rack() {
    el.scrin.classList.remove("is-rack"); el.lensglow.classList.remove("is-on"); void el.scrin.offsetWidth;
    el.scrin.classList.add("is-rack"); el.lensglow.classList.add("is-on");
    flashChip("af");
  }
  // x, y, w, h in the camera photo's pixel space; r = corner radius (px)
  const HOT = [
    { id: "lens", label: "Rack focus (lens)", cur: "Rack focus", x: 250, y: 770, w: 330, h: 340, r: 170, fn: rack },
    { id: "rec", label: "Record / standby", cur: "REC", x: 1022, y: 722, w: 46, h: 46, r: 23, fn: () => { recording = !recording; paintTc(); } },
    { id: "menu", label: "Menu: choose a reel", cur: "Menu", x: 1126, y: 912, w: 52, h: 52, r: 26, fn: () => toggleMenu() },
    { id: "iso", label: "ISO", cur: "ISO", x: 1058, y: 984, w: 56, h: 26, r: 8, fn: cycle("iso", ISO.length, "iso") },
    { id: "wb", label: "White balance", cur: "White balance", x: 1112, y: 984, w: 38, h: 26, r: 8, fn: cycle("wb", WB.length, "wb") },
    { id: "shut", label: "Shutter angle", cur: "Shutter", x: 1154, y: 984, w: 40, h: 26, r: 8, fn: cycle("sh", SH.length, "shut") },
    { id: "nd", label: "ND filter dial", cur: "ND dial", x: 1122, y: 778, w: 56, h: 66, r: 20, fn: cycle("nd", ND.length, "nd") },
    { id: "ch1", label: "Audio level 1", cur: "Audio meters", x: 1249, y: 769, w: 52, h: 52, r: 26, fn: () => { st.meters = !st.meters; paintSettings(); } },
    { id: "ch2", label: "Audio level 2", cur: "Audio meters", x: 1246, y: 830, w: 52, h: 52, r: 26, fn: () => { st.meters = !st.meters; paintSettings(); } },
  ];
  el.hot.insertAdjacentHTML("beforeend", HOT.map((h) => `<button type="button" class="cam__spot" data-spot="${h.id}" data-cursor="${h.cur}" aria-label="${h.label}" style="left:${h.x}px;top:${h.y}px;width:${h.w}px;height:${h.h}px;border-radius:${h.r}px"></button>`).join(""));
  el.hot.addEventListener("click", (e) => { const b = e.target.closest(".cam__spot"); if (!b) return; const h = HOT.find((x) => x.id === b.dataset.spot); h && h.fn(); });
  // the monitor itself: click = next reel
  el.mon.setAttribute("role", "button"); el.mon.setAttribute("tabindex", "0"); el.mon.setAttribute("aria-label", "Next reel"); el.mon.dataset.cursor = "Next reel";
  const nextReel = () => jump(Math.floor((clock % LOOP) / CUT) + 1);
  el.mon.addEventListener("click", (e) => { if (e.target.closest(".cam__menu")) return; nextReel(); });
  el.mon.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); nextReel(); } });
  addEventListener("keydown", (e) => e.key === "Escape" && menuOpen && toggleMenu(false));
  buildMenu(); paintSettings(); paintTc();

  layout();
  addEventListener("resize", layout);
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; const v = vids[lastReel]; if (v) visible ? v.play().catch(() => {}) : v.pause(); }, { rootMargin: "100px" }).observe(host);
  requestAnimationFrame(frame);
})();
