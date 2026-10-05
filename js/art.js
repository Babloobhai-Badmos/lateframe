/* Placeholder illustrations. Replace window.LF.portrait() output with an <img>
   of your cut-out photo (transparent PNG/WebP) when you have one. */
(function () {
  window.LF = window.LF || {};
  window.LF.portrait = function (id) {
    return `<svg viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Portrait placeholder" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="pj-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6c4aa2"/><stop offset="1" stop-color="#1d0f3c"/></linearGradient>
        <linearGradient id="ps-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9a77c"/><stop offset="1" stop-color="#a8704a"/></linearGradient>
      </defs>
      <path d="M30 600C30 468 118 408 250 392c132 16 220 76 220 208Z" fill="url(#pj-${id})"/>
      <rect x="212" y="300" width="76" height="110" rx="30" fill="url(#ps-${id})"/>
      <ellipse cx="250" cy="228" rx="86" ry="104" fill="url(#ps-${id})"/>
      <path d="M160 214c-6-86 38-132 92-132s98 46 90 132c-26-34-52-48-92-48s-66 14-90 48Z" fill="#14091f"/>
      <text x="250" y="548" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="120" fill="#f6f3ef" opacity=".92">18</text>
    </svg>`;
  };
})();
