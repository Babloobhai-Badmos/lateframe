/* ==========================================================================
   Placeholder illustration: a DSLR seen head-on, lens pointing at the viewer.
   Used as the hero centrepiece and the footer cut-out. Replace with a real
   photo (transparent PNG/WebP) any time — it is only referenced by
   LF.camera(id) in js/home.js and js/chrome.js.

   The glass glints follow the pointer via --lx / --ly (set on <html>).
   ========================================================================== */
(function () {
  window.LF = window.LF || {};
  window.LF.camera = function (id) {
    const L = window.LF.LOGO;
    const plate = L
      ? `<g transform="translate(58 358) scale(0.05) translate(-165 -134)" fill="#efe7d8" opacity=".92"><path d="${L.l}"/><path d="${L.f}"/><path d="${L.dot}"/></g>`
      : "";
    return `<svg class="cam" viewBox="0 0 640 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="DSLR camera, lens facing you">
  <defs>
    <linearGradient id="cb-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2b30"/><stop offset=".45" stop-color="#17171a"/><stop offset="1" stop-color="#0c0c0e"/></linearGradient>
    <linearGradient id="cp-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34343a"/><stop offset="1" stop-color="#151518"/></linearGradient>
    <linearGradient id="cg-${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b1b1f"/><stop offset=".5" stop-color="#2d2d33"/><stop offset="1" stop-color="#141417"/></linearGradient>
    <radialGradient id="cm-${id}" cx=".5" cy=".5" r=".5"><stop offset=".86" stop-color="#101012"/><stop offset=".95" stop-color="#3c3c43"/><stop offset="1" stop-color="#0a0a0c"/></radialGradient>
    <radialGradient id="cl-${id}" cx=".42" cy=".38" r=".62"><stop offset="0" stop-color="#05060a"/><stop offset=".5" stop-color="#0a1020"/><stop offset=".78" stop-color="#14253f"/><stop offset=".9" stop-color="#2a1a3a"/><stop offset="1" stop-color="#55200f"/></radialGradient>
    <radialGradient id="ci-${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000"/><stop offset=".7" stop-color="#05070d"/><stop offset="1" stop-color="#1a2338"/></radialGradient>
    <linearGradient id="cs-${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff7a2c" stop-opacity="0"/><stop offset=".5" stop-color="#ffb070" stop-opacity=".95"/><stop offset="1" stop-color="#ff7a2c" stop-opacity="0"/></linearGradient>
    <pattern id="cd-${id}" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r=".9" fill="#fff" opacity=".055"/></pattern>
    <filter id="cbl-${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="cbs-${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.6"/></filter>
    <clipPath id="cc-${id}"><circle cx="320" cy="300" r="88"/></clipPath>
    <path id="ct-${id}" d="M320 200 A100 100 0 1 1 319.99 200"/>
  </defs>

  <ellipse cx="320" cy="500" rx="270" ry="13" fill="#000" opacity=".4" filter="url(#cbl-${id})"/>

  <!-- strap lugs -->
  <rect x="8" y="182" width="24" height="46" rx="9" fill="url(#cg-${id})"/><rect x="608" y="182" width="24" height="46" rx="9" fill="url(#cg-${id})"/>

  <!-- pentaprism + hot shoe -->
  <path d="M176 120 L216 46 Q221 36 233 36 H407 Q419 36 424 46 L464 120 Z" fill="url(#cp-${id})"/>
  <path d="M216 47 H424" stroke="#fff" stroke-opacity=".12" stroke-width="2" fill="none"/>
  <rect x="268" y="22" width="104" height="18" rx="4" fill="#0e0e10"/><rect x="278" y="26" width="84" height="5" rx="2" fill="#3a3a41"/>
  <circle cx="220" cy="98" r="4" fill="#ff5a2c" class="cam__rec"/>

  <!-- mode dial + shutter -->
  <rect x="64" y="90" width="96" height="34" rx="7" fill="url(#cp-${id})"/>
  <g stroke="#0a0a0c" stroke-width="2" opacity=".8">${Array.from({ length: 11 }, (_, i) => `<line x1="${72 + i * 8.2}" y1="94" x2="${72 + i * 8.2}" y2="118"/>`).join("")}</g>
  <rect x="486" y="100" width="90" height="24" rx="6" fill="url(#cp-${id})"/>
  <ellipse cx="530" cy="98" rx="27" ry="9" fill="#1a1a1d" stroke="#ff5a2c" stroke-width="2"/>

  <!-- body -->
  <rect x="22" y="118" width="596" height="356" rx="42" fill="url(#cb-${id})"/>
  <rect x="22" y="118" width="596" height="356" rx="42" fill="url(#cd-${id})"/>
  <path d="M60 119 H580" stroke="#fff" stroke-opacity=".16" stroke-width="2" fill="none"/>
  <rect x="23" y="119" width="594" height="354" rx="41" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="2"/>

  <!-- grip -->
  <path d="M492 140 Q560 128 604 160 Q624 220 622 330 Q620 430 596 464 Q548 480 492 462 Z" fill="url(#cb-${id})" opacity=".0"/>
  <rect x="498" y="150" width="108" height="306" rx="34" fill="#0d0d10" opacity=".55"/>
  <rect x="498" y="150" width="108" height="306" rx="34" fill="url(#cd-${id})"/>
  <rect x="508" y="160" width="88" height="286" rx="26" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="1.5" stroke-dasharray="3 5"/>
  <circle cx="552" cy="196" r="17" fill="#1c1c20" stroke="#34343a" stroke-width="2"/><circle cx="552" cy="196" r="9" fill="#101013"/>

  <!-- left details: AF lamp, brand plate -->
  <circle cx="98" cy="176" r="9" fill="#0c0c0f" stroke="#2f2f35" stroke-width="2"/><circle cx="98" cy="176" r="5" fill="#ff7a2c" opacity=".55"/>
  ${plate}

  <!-- lens release -->
  <circle cx="478" cy="226" r="9" fill="#17171a" stroke="#34343a" stroke-width="2"/>

  <!-- LENS -->
  <circle cx="320" cy="300" r="182" fill="#050506"/>
  <circle cx="320" cy="300" r="178" fill="url(#cm-${id})"/>
  ${[0, 120, 240].map((a) => `<rect x="306" y="120" width="28" height="18" rx="3" fill="#8a8a92" transform="rotate(${a} 320 300)"/>`).join("")}
  <circle cx="320" cy="300" r="164" fill="#0d0d10"/>
  <g class="cam__ribs">
    <circle cx="320" cy="300" r="148" fill="none" stroke="#18181c" stroke-width="26"/>
    <circle cx="320" cy="300" r="148" fill="none" stroke="#33333a" stroke-width="26" stroke-dasharray="2.4 5.6"/>
    <circle cx="320" cy="300" r="148" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="26" stroke-dasharray="1 7" stroke-dashoffset="2"/>
  </g>
  <circle cx="320" cy="300" r="126" fill="none" stroke="#ff5a2c" stroke-width="6"/>
  <circle cx="320" cy="300" r="129.5" fill="none" stroke="#ffb08a" stroke-opacity=".5" stroke-width="1"/>
  <circle cx="320" cy="300" r="118" fill="none" stroke="#19191d" stroke-width="12"/>
  <circle cx="320" cy="300" r="111" fill="none" stroke="#3d3d45" stroke-width="2"/>
  <text font-family="'JetBrains Mono', ui-monospace, monospace" font-size="10.5" letter-spacing="2.4" fill="#d6cdbd" opacity=".72"><textPath href="#ct-${id}" startOffset="0">LATEFRAME  ·  24–70mm  1:2.8 L  ·  ∅ 82mm  ·  MADE FOR MOTION  ·</textPath></text>

  <!-- front glass -->
  <circle cx="320" cy="300" r="90" fill="#000"/>
  <circle cx="320" cy="300" r="88" fill="url(#cl-${id})"/>
  <g clip-path="url(#cc-${id})">
    <circle cx="320" cy="300" r="76" fill="none" stroke="#7a46c8" stroke-opacity=".38" stroke-width="7" filter="url(#cbs-${id})"/>
    <circle cx="320" cy="300" r="60" fill="none" stroke="#28a078" stroke-opacity=".32" stroke-width="6" filter="url(#cbs-${id})"/>
    <circle cx="320" cy="300" r="45" fill="none" stroke="#ff7a28" stroke-opacity=".38" stroke-width="5" filter="url(#cbs-${id})"/>
    <circle cx="320" cy="300" r="31" fill="url(#ci-${id})"/>
    <polygon points="${Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2 - Math.PI / 2; return `${(320 + Math.cos(a) * 21).toFixed(1)},${(300 + Math.sin(a) * 21).toFixed(1)}`; }).join(" ")}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.2" class="cam__iris"/>
    <g class="cam__glint">
      <ellipse cx="288" cy="262" rx="36" ry="17" transform="rotate(-36 288 262)" fill="#fff" opacity=".42" filter="url(#cbl-${id})"/>
      <circle cx="350" cy="338" r="6" fill="#fff" opacity=".6"/>
      <ellipse cx="364" cy="350" rx="42" ry="15" transform="rotate(-36 364 350)" fill="#ff7a2c" opacity=".4" filter="url(#cbl-${id})"/>
      <path d="M262 330 A82 82 0 0 1 292 236" fill="none" stroke="#ffb54a" stroke-opacity=".6" stroke-width="3" filter="url(#cbs-${id})"/>
      <rect class="cam__streak" x="200" y="299" width="240" height="2.4" fill="url(#cs-${id})"/>
    </g>
  </g>
  <circle cx="320" cy="300" r="88" fill="none" stroke="#000" stroke-opacity=".7" stroke-width="2"/>
</svg>`;
  };
})();
