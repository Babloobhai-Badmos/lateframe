/* ==========================================================================
   Shared chrome: nav, full-screen menu, footer, cursor label, sound toggle.
   All site-wide copy lives in SITE below — edit it once, every page updates.
   ========================================================================== */
(function () {
  "use strict";

  const SITE = {
    brand: "lateframe",
    name: "lateframe",
    legalName: "lateframe",
    role: "Video editor",
    email: "hello@example.com", // ← your contact email
    nav: [
      { label: "Home", href: "index.html" },
      { label: "Edits", href: "edits.html" },
      { label: "Instagram", href: "instagram.html" },
      { label: "Capabilities", href: "capabilities.html" },
      { label: "About", href: "about.html" },
      { label: "Contact", href: "contact.html" },
    ],
    socials: [
      { id: "instagram", label: "Instagram", url: "https://instagram.com/" }, // ← set to your profile URL
      { id: "youtube", label: "YouTube", url: "https://youtube.com/" },
      { id: "x", label: "X", url: "https://x.com/" },
    ],
    legal: [
      { label: "Privacy", href: "privacy.html" },
      { label: "Terms", href: "terms.html" },
    ],
    credit: { label: "lateframe.", href: "index.html" },
    projectBy: { label: "Frames that stay.", href: "index.html" },
    /* Words that drift through the footer / capabilities marquee */
    skills: ["Reels", "Color grade", "Motion graphics", "Sound design", "Beat sync", "Pacing", "Transitions", "Captions", "VFX cleanup", "Storytelling"],
    /* Footer call-to-action per page (data-footer on <body>) */
    footerCtas: {
      home: { headline: ["Let's cut", "something together"], cta: { label: "Get in touch", href: "contact.html" } },
      edits: { headline: ["Like what", "you see?"], cta: { label: "Get in touch", href: "contact.html" } },
      instagram: { headline: ["See the full", "cut on the feed"], cta: { label: "Edits", href: "edits.html" } },
      capabilities: { headline: ["Have a project", "in mind?"], cta: { label: "Get in touch", href: "contact.html" } },
      about: { headline: ["Let's cut", "something together"], cta: { label: "Get in touch", href: "contact.html" } },
      contact: { headline: ["Every frame", "is a decision"], cta: { label: "See the edits", href: "edits.html" } },
    },
  };
  window.SITE = SITE;

  const ICONS = {
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M16.5 3c.31 2.12 1.5 3.52 3.5 3.81v2.74c-1.2.1-2.41-.2-3.5-.83v5.9c0 3.4-2.62 5.89-5.9 5.4-2.6-.39-4.39-2.62-4.3-5.22.1-2.71 2.42-4.8 5.13-4.6.27.02.53.06.78.13v2.94a2.35 2.35 0 0 0-.93-.22 2.16 2.16 0 1 0 2.32 2.15V3h2.9Z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.656l-5.214-6.817-5.966 6.817H1.683l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.78 2 12 2 12s0 3.22.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.22 22 12 22 12s0-3.22-.4-4.8ZM10 15V9l5.2 3L10 15Z"/></svg>',
    twitch: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M4.3 3 3 6.2v12.3h4.2V21h2.4l2.3-2.5h3.5L21 13.9V3H4.3Zm14.8 10.3-2.4 2.4h-3.5l-2.3 2.3v-2.3H7.6V4.6h11.5v8.7ZM15.5 7.3h-1.6v4.8h1.6V7.3Zm-4.3 0H9.6v4.8h1.6V7.3Z"/></svg>',
  };

  /* Original placeholder mark (swap for your own SVG) */
  const MARK_PATHS = '<path d="M3 3h9v28h22v9H3z"/><path d="M21 3h13v13H21z"/>';
  const markSvg = (cls = "", extra = "") =>
    `<svg viewBox="0 0 37 43" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${SITE.brand}" class="${cls}" ${extra}><g fill="currentColor">${MARK_PATHS}</g></svg>`;
  window.LF = Object.assign(window.LF || {}, { markSvg, MARK_PATHS, ICONS });

  const page = document.body.dataset.footer || "home";
  const current = location.pathname.split("/").pop() || "index.html";
  const link = (l, cls, inner) =>
    `<a class="${cls}" href="${l.href}"${(l.href === current || (current === "" && l.href === "index.html")) ? ' aria-current="page"' : ""}>${inner}</a>`;

  /* ---------- Nav + menu ---------- */
  const navHost = document.querySelector('[data-chrome="nav"]');
  if (navHost) {
    const rows = [SITE.nav.slice(0, 4), SITE.nav.slice(4)];
    navHost.outerHTML = `
      <a class="skip-link" href="#main">Skip to content</a>
      <header class="nav" data-nav>
        <a class="nav__logo" href="index.html" aria-label="${SITE.brand} — home">${window.LF.logoSvg()}</a>
        <button class="nav__burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-navigation">
          <svg viewBox="0 0 30 13" aria-hidden="true"><path class="bar-top" fill="currentColor" d="M8.541 0H29.896L27.01 4.04H5.655Z"/><path class="bar-bot" fill="currentColor" d="M2.886 8.888H24.241L21.355 12.928H0Z"/></svg>
        </button>
      </header>
      <div id="site-navigation" class="menu" aria-hidden="true" inert data-lenis-prevent>
        <div class="menu__layout">
          <nav class="menu__links" aria-label="Main navigation">
            ${rows.map((r) => `<div class="menu__row">${r.map((l) => link(l, "menu__link", `<span class="lift"><span class="base">${l.label}</span><span class="fill" aria-hidden="true">${l.label}</span></span>`)).join("")}</div>`).join("")}
            <ul class="menu__socials">${SITE.socials.map((s) => `<li><a href="${s.url}" target="_blank" rel="noreferrer" aria-label="${s.label}">${ICONS[s.id]}</a></li>`).join("")}</ul>
          </nav>
        </div>
        <div class="menu__credits"><span>© ${SITE.legalName}</span><span>${SITE.legal.map((l) => `<a href="${l.href}" style="margin-right:16px">${l.label}</a>`).join("")}</span><a href="${SITE.credit.href}">${SITE.credit.label}</a></div>
      </div>`;
  }

  const nav = document.querySelector("[data-nav]");
  const burger = document.querySelector(".nav__burger");
  const menu = document.getElementById("site-navigation");
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle("is-open", open);
    menu.toggleAttribute("inert", !open);
    menu.setAttribute("aria-hidden", String(!open));
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
    document.body.classList.toggle("is-locked", open);
    menu.querySelectorAll(".menu__link").forEach((a, i) => (a.style.transitionDelay = open ? 80 + i * 55 + "ms" : "0ms"));
  }
  burger && burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  document.addEventListener("keydown", (e) => e.key === "Escape" && menu && menu.classList.contains("is-open") && (setMenu(false), burger.focus()));
  menu && menu.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));

  /* ---------- Footer ---------- */
  const footHost = document.querySelector('[data-chrome="footer"]');
  if (footHost) {
    const cta = SITE.footerCtas[page] || SITE.footerCtas.home;
    const marqSet = SITE.skills.map((p) => `<span>${p}</span>`).join("");
    footHost.outerHTML = `
      <footer class="footer" data-footer data-tone="dark">
        <div class="footer__marq" aria-hidden="true"><div class="partner-marq__row">${marqSet}${marqSet}${marqSet}${marqSet}</div></div>
        <div class="footer__center">
          <div class="footer__invite" data-invite>
            <div class="footer__sig" aria-hidden="true">${SITE.brand}</div>
            <h2 class="display footer__headline">${cta.headline.map((l) => `<span>${l}</span>`).join("")}</h2>
            <a class="btn btn--yellow" href="${cta.cta.href}"><span>${cta.cta.label}</span></a>
          </div>
        </div>
        <div class="footer__cutout" aria-hidden="true"><img src="assets/camera/fx6-lf.webp" alt="" width="1039" height="607" loading="lazy" decoding="async"></div>
        <div class="footer__panel">
          <div class="footer__panel-in">
            <a class="footer__logo" href="index.html" aria-label="Home">${window.LF.logoSvg()}</a>
            <nav class="footer__nav" aria-label="Footer">${SITE.nav.map((l) => `<a href="${l.href}"><span>${l.label}</span><span class="fill" aria-hidden="true">${l.label}</span></a>`).join("")}</nav>
            <div>
              <ul class="footer__socials">${SITE.socials.map((s) => `<li><a href="${s.url}" target="_blank" rel="noreferrer" aria-label="${s.label}">${ICONS[s.id]}</a></li>`).join("")}</ul>
              <div class="footer__legal">
                <div><a href="${SITE.projectBy.href}">${SITE.projectBy.label}</a><span>${SITE.legal.map((l) => `<a href="${l.href}">${l.label}</a>`).join("")}</span></div>
                <div><span>© ${new Date().getFullYear()} ${SITE.legalName}</span><a href="${SITE.credit.href}">${SITE.credit.label}</a></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <button type="button" class="sound" data-sound aria-pressed="false" aria-label="Turn sound on" title="Sound off"><span class="sound__bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span></button>
      <div class="cursor" data-cursor-label aria-hidden="true"><span></span></div>`;
  }

  /* Footer invitation reveal */
  const invite = document.querySelector("[data-invite]");
  if (invite && "IntersectionObserver" in window) {
    new IntersectionObserver((es) => es.forEach((e) => invite.classList.toggle("is-on", e.isIntersecting && e.intersectionRatio > 0.2)), { threshold: [0, 0.2, 0.5] })
      .observe(document.querySelector("footer.footer"));
  } else if (invite) invite.classList.add("is-on");

  /* Sound toggle (UI only — wire to your own audio) */
  const sound = document.querySelector("[data-sound]");
  sound && sound.addEventListener("click", () => {
    const on = sound.getAttribute("aria-pressed") !== "true";
    sound.setAttribute("aria-pressed", String(on));
    sound.setAttribute("aria-label", on ? "Turn sound off" : "Turn sound on");
    sound.title = on ? "Sound on" : "Sound off";
    document.dispatchEvent(new CustomEvent("lf:sound", { detail: on }));
  });

  /* Cursor label over [data-cursor] */
  const cur = document.querySelector("[data-cursor-label]");
  if (cur && matchMedia("(hover:hover)").matches) {
    const txt = cur.firstElementChild;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const tick = () => { x += (tx - x) * 0.25; y += (ty - y) * 0.25; cur.style.transform = `translate3d(${x + 18}px, ${y + 18}px, 0)`; raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0; };
    document.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      const t = e.target.closest && e.target.closest("[data-cursor]");
      if (t) { txt.textContent = t.dataset.cursor; cur.classList.add("is-on"); } else cur.classList.remove("is-on");
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  /* data-src → background image (drop real photos in without touching CSS) */
  document.querySelectorAll(".ph[data-src]").forEach((el) => (el.style.backgroundImage = `url("${el.dataset.src}")`));

  /* ---- cached section geometry: no layout reads while scrolling ---- */
  const tracked = new Map();
  const measure = () => { const sy = scrollY; tracked.forEach((g, el) => { const r = el.getBoundingClientRect(); g.top = r.top + sy; g.h = r.height; }); };
  const track = (el) => { let g = tracked.get(el); if (!g) { g = { top: 0, h: 0 }; tracked.set(el, g); const r = el.getBoundingClientRect(); g.top = r.top + scrollY; g.h = r.height; } return g; };
  let mRaf = 0; const remeasure = () => { cancelAnimationFrame(mRaf); mRaf = requestAnimationFrame(measure); };
  addEventListener("resize", remeasure); addEventListener("load", remeasure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
  if ("ResizeObserver" in window) new ResizeObserver(remeasure).observe(document.body);
  window.LF.track = track;
  /** 0 to 1 progress of a tall section that holds a sticky child */
  window.LF.pin = (el) => { const g = track(el), total = g.h - innerHeight; return total > 0 ? Math.min(1, Math.max(0, (scrollY - g.top) / total)) : 0; };
  /** true when the section is within `pad` px of the viewport */
  window.LF.near = (el, pad = 200) => { const g = track(el); return scrollY + innerHeight > g.top - pad && scrollY < g.top + g.h + pad; };

  /* ---- pause looping CSS animations on sections that are off-screen ---- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("is-off", !e.isIntersecting)), { rootMargin: "120px" });
    document.querySelectorAll("[data-cam], .stage, .tail, .play, footer.footer").forEach((n) => io.observe(n));
  }

  /* Nav colour follows the section beneath it */
  const root = document.documentElement;
  let toneEls = [];
  const collect = () => (toneEls = [...document.querySelectorAll("[data-tone]")]);
  window.LF.setTone = (t) => root.style.setProperty("--logo-color", t === "light" ? "var(--ink)" : "var(--bone)");
  window.LF.updateTone = () => {
    const o = window.LF.toneOverride && window.LF.toneOverride();
    if (o) return window.LF.setTone(o);
    if (!toneEls.length) collect();
    const y = 40;
    const py = scrollY + y;
    for (const el of toneEls) { const g = track(el); if (g.top <= py && g.top + g.h >= py) return window.LF.setTone(el.dataset.tone); }
  };
  addEventListener("scroll", () => window.LF.updateTone(), { passive: true });
  addEventListener("load", () => { collect(); window.LF.updateTone(); });
})();
