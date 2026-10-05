/* ==========================================================================
   Home page choreography. Everything is driven by one rAF loop that reads
   each pinned section's scroll progress (0 → 1) and writes CSS variables /
   transforms. No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = () => innerWidth >= 900;

  /** Scroll progress of a tall section containing a sticky child (0 at pin start, 1 at pin end). */
  const progress = (el) => {
    const r = el.getBoundingClientRect();
    const total = r.height - innerHeight;
    return total > 0 ? clamp(-r.top / total) : 0;
  };

  /* ---------- Loader ---------- */
  (function loader() {
    const el = $("[data-loader]");
    if (!el) return;
    const fill = $("[data-loader-fill]");
    const count = $("[data-loader-count]");
    document.body.classList.add("is-locked");
    const start = performance.now();
    const DURATION = reduce ? 200 : 1500;
    let loaded = document.readyState === "complete";
    addEventListener("load", () => (loaded = true));
    (function tick(now) {
      const t = clamp((now - start) / DURATION);
      const v = loaded ? ease(t) : Math.min(ease(t), 0.92);
      fill.setAttribute("y", String(43 - 43 * v));
      fill.setAttribute("height", String(43 * v));
      count.textContent = Math.round(v * 100) + "%";
      if (v < 1) return requestAnimationFrame(tick);
      setTimeout(() => {
        el.classList.add("is-done");
        document.body.classList.remove("is-locked");
        setTimeout(() => el.remove(), 1200);
      }, 150);
    })(start);
  })();

  /* ---------- Hero portrait ---------- */
  const portraitHost = $("[data-portrait]");
  if (portraitHost && window.LF && LF.portrait) portraitHost.innerHTML = LF.portrait("hero");

  /* ---------- Yard lines (generated) ---------- */
  const yards = $("[data-yards]");
  if (yards) {
    const hash = () => `<div class="yards__hash"><i></i><i></i><i></i></div>`;
    const five = (n) => `<div class="yards__five"><b>${n}</b></div>`;
    const line = `<div class="yards__line"></div>`;
    const nums = [10, 20, 30, 40, 50, 40, 30, 20, 10];
    let html = "";
    nums.forEach((n, i) => { html += hash() + hash() + hash() + hash() + five(n) + (i < nums.length - 1 ? hash() + hash() + hash() + hash() + line : ""); });
    yards.innerHTML = html;
    yards.style.width = "calc(76vw * var(--n, 4))";
  }

  /* ---------- 3D tilt for trading cards ---------- */
  function tilt(host, card, opts = {}) {
    const max = opts.max || 14;
    const set = (k, v) => card.style.setProperty(k, v);
    host.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const r = host.getBoundingClientRect();
      const x = clamp((e.clientX - r.left) / r.width), y = clamp((e.clientY - r.top) / r.height);
      set("--ry", ((x - 0.5) * 2 * max).toFixed(2) + "deg");
      set("--rx", ((0.5 - y) * 2 * max).toFixed(2) + "deg");
      set("--mxf", x.toFixed(3));
      set("--hover", 1);
      set("--scale", 1.06);
      set("--tz", "30px");
      host.style.setProperty("--hover", 1);
    });
    host.addEventListener("pointerleave", () => {
      ["--ry", "--rx", "--tz"].forEach((k) => card.style.removeProperty(k));
      set("--hover", 0); set("--scale", 1); host.style.setProperty("--hover", 0);
    });
  }
  const heroCardHost = $("[data-hero-card]");
  if (heroCardHost) tilt(heroCardHost, $(".tcard", heroCardHost));
  $$("[data-card]").forEach((c) => tilt(c, $(".tcard", c)));

  /* ---------- Card modal ---------- */
  const modal = $("[data-modal]");
  let lastFocus = null;
  function openModal(src) {
    lastFocus = document.activeElement;
    const ph = $("[data-modal-ph]");
    ph.style.setProperty("--h", src.dataset.h || 265);
    ph.dataset.label = src.dataset.title;
    $("[data-modal-num]").textContent = src.dataset.n || "";
    $("[data-modal-title]").textContent = src.dataset.title;
    $("[data-modal-stat]").textContent = src.dataset.stat;
    modal.classList.add("is-open");
    modal.removeAttribute("inert");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    $("[data-modal-close]").focus();
  }
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("inert", "");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  $$("[data-card]").forEach((c) => {
    c.addEventListener("click", () => openModal(c));
    c.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), openModal(c)));
  });
  const heroCard = $("[data-hero-card]");
  heroCard && heroCard.addEventListener("click", () => openModal($("[data-card]")));
  modal.addEventListener("click", (e) => (e.target === modal || e.target.closest("[data-modal-close]")) && closeModal());
  addEventListener("keydown", (e) => e.key === "Escape" && modal.classList.contains("is-open") && closeModal());

  /* ---------- Partner marquee ---------- */
  const partners = (window.SITE && SITE.partners) || [];
  const marq = $("[data-marq]");
  if (marq) {
    const set = partners.map((p) => `<span>${p}</span>`).join("");
    marq.innerHTML = `<div class="partner-marq__row">${set}${set}${set}${set}</div>`;
  }

  /* ---------- Quote ---------- */
  const quote = $("[data-quote]");
  const pols = $$("[data-pol]");
  const qLines = $$("[data-quote-lines] span");
  const qBody = $("[data-quote-body]");
  // Final resting spots for the three polaroids once they fan out of the way of the copy
  const fan = () => {
    const w = innerWidth, d = isDesktop();
    return d
      ? [{ x: -0.34 * w, y: -0.12 * innerHeight, r: -9 }, { x: 0.33 * w, y: 0.1 * innerHeight, r: 7 }, { x: 0.02 * w, y: 0.42 * innerHeight, r: -3 }]
      : [{ x: -0.26 * w, y: -0.3 * innerHeight, r: -9 }, { x: 0.24 * w, y: 0.3 * innerHeight, r: 8 }, { x: 0, y: 0.5 * innerHeight, r: -3 }];
  };
  function updateQuote() {
    if (!quote) return;
    const p = progress(quote);
    const f = fan();
    pols.forEach((el, i) => {
      const a = 0.04 + i * 0.12;               // staggered entrance from below
      const enter = easeOut(seg(p, a, a + 0.22));
      const spread = ease(seg(p, 0.38 + i * 0.06, 0.7 + i * 0.04));
      const x = lerp(0, f[i].x, spread);
      const y = lerp(lerp(innerHeight * 0.9, 0, enter), f[i].y, spread);
      const r = lerp(lerp(0, i % 2 ? 4 : -4, enter), f[i].r, spread);
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${lerp(0.9, 1, enter)})`;
      el.style.opacity = String(clamp(enter * 1.4));
    });
    qLines.forEach((s, i) => s.classList.toggle("on", p > 0.46 + i * 0.1));
    qBody && qBody.classList.toggle("on", p > 0.78);
  }

  /* ---------- Foundation tiles (accordion) ---------- */
  const tiles = $$("[data-tiles] .tile");
  tiles.forEach((t) => {
    const on = () => tiles.forEach((o) => o.classList.toggle("is-active", o === t));
    t.addEventListener("pointerenter", on);
    t.addEventListener("focus", on);
  });

  /* ---------- Partnerships ---------- */
  const BRANDS = [
    { name: "Northwind", copy: "The signature partnership. Jordan is the face of Northwind football — custom game-day cleats, design sessions at HQ, and a say in where the footwear goes next." },
    { name: "Voltade", copy: "Long-running hydration partner, with campaigns, sideline visibility, and a recurring slot in their game-day rotation." },
    { name: "Pulse Cola", copy: "National campaigns — suiting up in the gladiator arena and crashing tailgates with the league's biggest names." },
    { name: "Golden Oats", copy: "Cereal-box royalty — limited-edition boxes, Jordan's own signature mix, and aisle-side spots with a few famous friends." },
    { name: "Aperture", copy: "Lifestyle and performance eyewear collaboration, from training visors to off-field shades." },
    { name: "Studio Sound", copy: "Game-day arrivals run through Studio Sound — headphone campaigns and the custom pairs worn through the tunnel." },
  ];
  const tail = $("[data-tail]");
  const pstage = $("[data-pstage]");
  const slides = $$(".pslide");
  const dotsHost = $("[data-pdots]");
  const panelHost = $("[data-ppanel]");
  let activeBrand = -1;
  let tailTone = null;
  window.LF.toneOverride = () => tailTone;
  if (dotsHost && panelHost) {
    dotsHost.innerHTML = BRANDS.map((b, i) => `<button type="button" aria-label="${b.name}" data-i="${i}"><span></span></button>`).join("");
    panelHost.innerHTML = BRANDS.map((b) => `<div><h3 class="heading">${b.name}</h3><p>${b.copy}</p></div>`).join("");
  }
  function setBrand(i) {
    if (i === activeBrand) return;
    activeBrand = i;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === i));
    $$("button", dotsHost).forEach((b, k) => b.setAttribute("aria-current", String(k === i)));
    $$(":scope > div", panelHost).forEach((d, k) => d.classList.toggle("is-active", k === i));
  }
  dotsHost && dotsHost.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || !tail) return;
    const i = +b.dataset.i;
    const r = tail.getBoundingClientRect();
    const total = r.height - innerHeight;
    const p = 0.34 + ((i + 0.5) / BRANDS.length) * 0.62;
    scrollTo({ top: scrollY + r.top + p * total, behavior: reduce ? "auto" : "smooth" });
  });
  function updateTail() {
    if (!tail) return;
    const p = progress(tail);
    const wipe = ease(seg(p, 0.1, 0.3));
    pstage.style.setProperty("--p-wipe", (1 - wipe).toFixed(4)); // 1 = hidden below, 0 = fully covering
    const settle = seg(p, 0.3, 0.42);
    pstage.style.setProperty("--p-settle", ((1 - easeOut(settle)) * 6).toFixed(2) + "vh");
    pstage.style.setProperty("--p-scale", lerp(1.06, 1, easeOut(settle)).toFixed(4));
    const tr = tail.getBoundingClientRect();
    tailTone = tr.top <= 40 && tr.bottom >= 40 ? (wipe > 0.55 ? "dark" : "light") : null;
    const bp = seg(p, 0.34, 0.97);
    setBrand(clamp(Math.floor(bp * BRANDS.length), 0, BRANDS.length - 1));
  }

  /* ---------- Make a play rail ---------- */
  const PLAY = [
    ["All-hands at HQ", "partnerships.html", 44], ["White on white, road game", "on-field.html", 54], ["City lights, all white", "off-field.html", 48],
    ["Sparkly suit", "off-field.html", 56], ["Camp days", "foundation.html", 46], ["Suited for the honors", "on-field.html", 48],
    ["Big in Shanghai", "off-field.html", 42], ["On set", "partnerships.html", 50], ["Park, off duty", "off-field.html", 44],
    ["Touchdown", "on-field.html", 54], ["Tailoring", "off-field.html", 48], ["Streets", "off-field.html", 56],
    ["Rain check", "off-field.html", 46], ["The big stage", "off-field.html", 48], ["Friday nights", "on-field.html", 42], ["Tokyo drip", "off-field.html", 50],
  ];
  const YS = [6, -4, 7, 1, 8, 3, -5, 6], RS = [-3, 2, -2, 3, -3, 2, -2, 3];
  const playRow = $("[data-play-row]");
  if (playRow) {
    const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>';
    const set = (hidden) => `<div class="play__set" aria-hidden="${hidden}">${PLAY.map(([cap, href, h], i) =>
      `<a class="pcard" href="${href}" draggable="false" ${hidden ? 'tabindex="-1"' : ""} aria-label="${cap}"><div class="pcard__frame" style="--h:clamp(180px, min(${h}svh, ${(h * 0.625).toFixed(2)}vw), ${h * 14}px);--y:${YS[i % 8]}px;--r:${RS[i % 8]}deg"><div class="pcard__in"><div class="ph" style="--h:${(i * 47 + 250) % 360}"></div><div class="pcard__cap"><span>${cap}</span>${arrow}</div></div></div></a>`).join("")}</div>`;
    playRow.innerHTML = set(false) + set(true);
  }
  const playRail = $("[data-play]");
  let playX = 0, playV = 0, dragging = false, dragMoved = false, lastX = 0, setW = 0;
  const AUTO = 0.35;
  if (playRail) {
    const measure = () => (setW = playRow.firstElementChild.getBoundingClientRect().width);
    addEventListener("load", measure); addEventListener("resize", measure); measure();
    playRail.addEventListener("pointerdown", (e) => { dragging = true; dragMoved = false; lastX = e.clientX; playRail.style.cursor = "grabbing"; });
    addEventListener("pointermove", (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; if (Math.abs(dx) > 1) dragMoved = true; playX += dx; playV = dx; });
    addEventListener("pointerup", () => { dragging = false; playRail.style.cursor = ""; });
    playRail.addEventListener("click", (e) => dragMoved && (e.preventDefault(), e.stopPropagation()), true);
  }
  let playVisible = true;
  if (playRail && "IntersectionObserver" in window) new IntersectionObserver(([e]) => (playVisible = e.isIntersecting)).observe(playRail);
  function updatePlay() {
    if (!playRail || !playVisible) return;
    if (!dragging) { playV *= 0.94; playX += playV - (reduce ? 0 : AUTO); }
    if (setW) playX = ((playX % setW) - setW) % setW;           // wrap into (-setW, 0]
    playRow.style.transform = `translate3d(${playX}px, 0, 0)`;
  }

  /* ---------- Stage: hero wipe → moments reel ---------- */
  const stage = $("[data-stage]");
  const clip = $("[data-hero-clip]");
  const reel = $("[data-reel]");
  function updateStage() {
    if (!stage) return;
    const p = progress(stage);
    const HOLD = 0.1, WIPE = 0.34;
    const wipe = ease(seg(p, HOLD, WIPE));
    stage.style.setProperty("--wipe", wipe.toFixed(4));
    clip.style.visibility = wipe >= 0.999 ? "hidden" : "visible";
    const rp = seg(p, WIPE - 0.04, 1);
    const maxShift = Math.max(0, reel.scrollWidth - innerWidth);
    reel.style.transform = `translate3d(${(-rp * maxShift).toFixed(1)}px, 0, 0)`;
    if (yards) yards.style.transform = `translate3d(${(-rp * Math.max(0, yards.scrollWidth - innerWidth) * 0.55).toFixed(1)}px, 0, 0)`;
    stage.dataset.tone = wipe > 0.55 ? "dark" : "light";
    // Hero: parallax portrait a touch on scroll
    if (portraitHost) portraitHost.style.translate = `0 ${(seg(p, 0, HOLD + 0.1) * 3).toFixed(2)}%`;
  }

  /* ---------- Frame loop ---------- */
  let ticking = false;
  function frame() {
    ticking = false;
    updateStage(); updateQuote(); updateTail();
    window.LF.updateTone && window.LF.updateTone();
  }
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", request);
  addEventListener("load", request);
  frame();
  (function loop() { updatePlay(); requestAnimationFrame(loop); })();
})();
