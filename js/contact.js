/* Contact page — builds the cards from SITE.contact (js/chrome.js). */
(function () {
  "use strict";
  const host = document.querySelector("[data-contact]");
  if (!host || !window.SITE) return;
  const c = SITE.contact || {};
  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  const I = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.38A9.9 9.9 0 1 0 12.04 2Zm0 18.1c-1.5 0-2.97-.4-4.25-1.17l-.3-.18-3.1.82.83-3.02-.2-.31a8.2 8.2 0 1 1 7.02 3.86Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.1-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.42h-.47c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.73 2.64 4.2 3.7.59.26 1.05.41 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.23-.16-.48-.29Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 5.3 5.3l1.4-2.2L19 14.5V18a2 2 0 0 1-2 2A13 13 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>',
    form: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
  };
  const digits = String(c.whatsapp || "").replace(/\D/g, "");
  const cards = [
    digits && { cls: "ccard--wa", href: `https://wa.me/${digits}${c.whatsappText ? "?text=" + encodeURIComponent(c.whatsappText) : ""}`, ext: true, icon: I.wa, k: "WhatsApp", v: "Message us" },
    c.email && { href: `mailto:${c.email}`, icon: I.mail, k: "Email", v: c.email },
    c.phone && { href: `tel:${String(c.phone).replace(/[^\d+]/g, "")}`, icon: I.phone, k: "Phone", v: c.phone },
    c.form && { href: c.form, ext: true, icon: I.form, k: "Project form", v: "Fill the form" },
  ].filter(Boolean);
  host.innerHTML =
    `<div class="ccards">${cards.map((k) => `<a class="ccard ${k.cls || ""}" href="${esc(k.href)}"${k.ext ? ' target="_blank" rel="noreferrer"' : ""}>${k.icon}<span class="ccard__go" aria-hidden="true">↗</span><span><span class="ccard__k">${k.k}</span><span class="ccard__v" style="display:block">${esc(k.v)}</span></span></a>`).join("")}</div>` +
    (c.embedForm && c.form ? `<div class="cform" data-reveal><iframe src="${esc(c.form)}${c.form.includes("?") ? "&" : "?"}embedded=true" title="Project form" loading="lazy">Loading…</iframe></div>` : "");
  window.LF && LF.reveal && LF.reveal(host);
})();
