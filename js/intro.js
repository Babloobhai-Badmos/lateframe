/* ==========================================================================
   Intro — the "late frame" logo sequence.

   Plays on first open (and reloads) and doubles as a real preloader: the
   timecode counts frames 00:00:00 → 00:00:23 as fonts, images and reel
   previews actually finish loading, and the period of "lf." — the late
   frame — only lands (frame 24) once everything is ready. Then the screen
   splits open like a shutter.

   Other scripts can add to the wait with  LF.preload(url, "image" | "video").
   Debug: ?intro forces it on in-site navigation, ?nointro skips it.
   ========================================================================== */
(function () {
  "use strict";
  const root = document.documentElement;
  const params = new URLSearchParams(location.search);
  const navEntry = (performance.getEntriesByType && performance.getEntriesByType("navigation")[0]) || {};
  let internal = false;
  try { internal = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
  const skip = params.has("nointro") || (internal && navEntry.type === "navigate" && !params.has("intro"));

  window.LF = window.LF || {};
  if (skip || !window.LF.logoSvg) {
    root.classList.add("intro-done");
    window.LF.preload = function () {};
    return;
  }

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MIN = reduce ? 1.6 : 3.3;      // earliest the late frame can land (s)
  const HARD = 12;                      // never wait longer than this (s)
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const pad = (n) => String(n).padStart(2, "0");

  /* ---------- Real load tracking ---------- */
  const tasks = [];
  const keep = [];
  function task(w) {
    const t = { w, frac: 0 };
    tasks.push(t);
    return { set: (f) => (t.frac = Math.max(t.frac, clamp(f))), done: () => (t.frac = 1) };
  }
  const parse = task(2), discover = task(3), fonts = task(2), win = task(2);

  window.LF.preload = function (url, type) {
    if (!url) return;
    const t = task(1);
    let finished = false;
    const end = () => { if (!finished) { finished = true; t.done(); } };
    if (type === "video") {
      if (navigator.connection && navigator.connection.saveData) return end();
      const v = document.createElement("video");
      v.preload = "auto"; v.muted = true; v.playsInline = true;
      v.addEventListener("loadeddata", end, { once: true });
      v.addEventListener("error", end, { once: true });
      v.addEventListener("progress", () => { try { if (v.duration && v.buffered.length) t.set((v.buffered.end(v.buffered.length - 1) / v.duration) * 0.9); } catch (e) {} });
      v.src = url; v.load(); keep.push(v);
    } else {
      const im = new Image();
      im.onload = im.onerror = end;
      im.src = url; keep.push(im);
    }
    setTimeout(end, 10000);   // one slow file must never trap the visitor
  };

  document.addEventListener("readystatechange", () => document.readyState === "interactive" && parse.set(0.6));
  function discoverAssets() {
    parse.done();
    document.querySelectorAll("img[src]").forEach((img) => { if (img.loading !== "lazy" && !img.complete) { const t = task(1); const e = () => t.done(); img.addEventListener("load", e, { once: true }); img.addEventListener("error", e, { once: true }); setTimeout(e, 10000); } });
    document.querySelectorAll("[data-src]").forEach((el) => window.LF.preload(el.dataset.src, "image"));
    discover.done();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", discoverAssets); else discoverAssets();
  if (document.readyState === "complete") win.done(); else addEventListener("load", () => win.done());

  const fam = ["800 1em 'Big Shoulders Display'", "400 1em Inter", "400 1em 'JetBrains Mono'"];
  if (document.fonts && document.fonts.load) {
    Promise.all(fam.map((f) => document.fonts.load(f).catch(() => {}))).then(() => document.fonts.ready).then(() => fonts.done(), () => fonts.done());
    setTimeout(() => fonts.done(), 6000);
  } else fonts.done();

  const progress = () => { let w = 0, f = 0; for (const t of tasks) { w += t.w; f += t.w * t.frac; } return w ? f / w : 0; };
  const allDone = () => tasks.every((t) => t.frac >= 1);

  /* ---------- DOM (two halves so it can split like a shutter) ---------- */
  const stage = `
    <div class="intro__stage">
      <div class="intro__bg"><i class="orb orb--amber"></i><i class="orb orb--orange"></i><i class="orb orb--red"></i></div>
      <div class="intro__grain"></div>
      <div class="intro__vignette"></div>
      <div class="intro__lockup">
        <div class="intro__tc"><i class="intro__rec"></i><b data-tc>00:00:00</b></div>
        <div class="intro__logo">${LF.logoSvg("", { dot: false }).replace("</svg>", `<path class="lf-ghost" d="${LF.LOGO.dot}"/><path class="lf-dot" d="${LF.LOGO.dot}"/></svg>`)}<i class="intro__ring"></i><i class="intro__ring intro__ring--2"></i></div>
      </div>
    </div>`;
  const el = document.createElement("div");
  el.className = "intro";
  el.setAttribute("role", "status");
  el.setAttribute("aria-label", "Loading lateframe");
  el.innerHTML = `<div class="intro__half intro__half--top">${stage}</div><div class="intro__half intro__half--bot">${stage}</div><div class="intro__seam"></div><div class="intro__flash"></div>`;
  (document.body || root).prepend(el);
  root.classList.add("intro-lock");
  setTimeout(() => { root.classList.remove("intro-lock"); root.classList.add("intro-done"); }, (HARD + 8) * 1000);   // failsafe
  if (reduce) el.classList.add("is-reduced");

  const tcs = () => el.querySelectorAll("[data-tc]");
  let hit = false, target = 0, shown = 0, lastFrames = -1, last = performance.now();
  const t0 = last;
  const cls = (c) => el.classList.add(c);

  function land() {
    hit = true;
    tcs().forEach((n) => (n.textContent = "00:00:24"));
    el.style.setProperty("--p", 1);
    cls("is-hit");                                   // the late frame lands
    const hold = reduce ? 500 : 900;
    setTimeout(() => cls("is-seam"), hold);
    setTimeout(() => {
      cls("is-exit");
      root.classList.remove("intro-lock");
      root.classList.add("intro-done");
    }, hold + 280);
    setTimeout(() => { el.remove(); document.dispatchEvent(new CustomEvent("lf:intro-done")); }, hold + 280 + 1500);
  }

  function frame(now) {
    const elapsed = (now - t0) / 1000;
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (elapsed > 0.30) cls("is-bloom");
    if (elapsed > 0.95) cls("is-l");
    if (elapsed > 1.5) cls("is-f");
    if (elapsed > 2.1) cls("is-wait");

    target = Math.max(target, progress());
    shown += (target - shown) * (1 - Math.exp(-dt * 4.5));
    const timeP = clamp((elapsed - 0.5) / Math.max(0.5, MIN - 0.9));
    const p = Math.min(shown, timeP);
    el.style.setProperty("--p", p.toFixed(3));
    const frames = Math.min(23, Math.floor(p * 24));
    if (frames !== lastFrames) {
      lastFrames = frames;
      tcs().forEach((n) => (n.textContent = "00:00:" + pad(frames)));
    }

    const ready = (allDone() && shown > 0.985) || elapsed > HARD;
    if (ready && elapsed >= MIN) { land(); return; }   // stop updating: the timecode stays on 00:00:24
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
