/* ==========================================================================
   The Guild — everyone who works under lateframe. Edit this one array.

   Every member appears in two places: the card on the home page (hero,
   right-hand side) and the Guild page.

     name   : full name
     role   : one line under the name
     bio    : a short paragraph (Guild page)
     tags   : up to four skills
     photo  : path to a portrait — put the file in assets/guild/ (4:5, 1200×1500)
              until the file exists, a monogram is shown instead
     links  : { instagram, whatsapp, email } — any you leave out are hidden
     lead   : true = featured big at the top of the Guild page

   `OPEN` are the seats shown as dashed cards ("Join the guild"). Delete the
   array's entries if you don't want them.
   ========================================================================== */
(function () {
  "use strict";
  const LF = (window.LF = window.LF || {});

  LF.GUILD = [
    {
      name: "Devansh Sharma",
      role: "Founder · Lead editor",
      bio: "Devansh founded lateframe to turn raw footage into edits people actually finish watching. He leads every project — pacing, color and sound — from the first cut to the final export.",
      tags: ["Reels", "Color", "Motion", "Sound"],
      photo: "assets/guild/devansh.jpg",
      links: { instagram: "https://instagram.com/" },
      lead: true,
    },
    // { name: "Full Name", role: "Colorist", bio: "…", tags: ["Color"], photo: "assets/guild/name.jpg", links: {} },
  ];

  LF.GUILD_OPEN = ["Colorist", "Motion designer", "Sound designer"];

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const initials = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  /* portrait with a monogram underneath — if the photo file isn't there yet, only the monogram shows */
  const portrait = (m, cls = "") =>
    `<span class="av ${cls}"><b aria-hidden="true">${esc(initials(m.name))}</b>${m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy" decoding="async" onerror="this.remove()">` : ""}</span>`;
  LF.guildPortrait = portrait;

  /* ---------- home: the neon card in the hero ----------
     Three looks — set LF.GUILD_CARD, or preview any of them with  index.html?card=a | b | c
       a  Neon tube   — dark glass, glowing orange tube outline, flickering "GUILD" sign
       b  Aurora      — full-colour sunset gradient (the lf. logo palette) with a slow drift
       c  Viewfinder  — cyan + magenta neon brackets, scanline and REC readout            */
  LF.GUILD_CARD = "a";
  const want = new URLSearchParams(location.search).get("card");
  const look = /^[abc]$/.test(want) ? want : LF.GUILD_CARD;
  document.querySelectorAll("[data-guild-card]").forEach((host) => {
    const lead = LF.GUILD.find((m) => m.lead) || LF.GUILD[0];
    const crew = LF.GUILD.filter((m) => m !== lead).slice(0, 4), more = LF.GUILD.length - 1 - crew.length;
    host.innerHTML = `
      <a class="gcrd gcrd--${look}" href="guild.html" aria-label="Meet the Guild">
        <span class="gcrd__fx" aria-hidden="true"><i></i><i></i></span>
        <span class="gcrd__head"><span class="gcrd__eyebrow"><i></i><span class="gcrd__sign">The Guild</span></span><span class="gcrd__count"><b class="gcrd__rec"></b>${String(LF.GUILD.length).padStart(2, "0")}</span></span>
        <span class="gcrd__stage">${portrait(lead, "av--card")}<span class="gcrd__who"><small>${esc(lead.role)}</small><strong>${esc(lead.name).replace(" ", " <br>")}</strong></span></span>
        ${crew.length ? `<span class="gcrd__crew">${crew.map((m) => portrait(m, "av--xs")).join("")}${more > 0 ? `<span class="gcrd__more">+${more}</span>` : ""}</span>` : ""}
        <span class="gcrd__foot"><span>Meet the guild</span><em>→</em></span>
      </a>`;
  });

  /* ---------- Guild page ---------- */
  const page = document.querySelector("[data-guild-page]");
  if (page) {
    const lead = LF.GUILD.find((m) => m.lead) || LF.GUILD[0];
    const rest = LF.GUILD.filter((m) => m !== lead);
    const links = (m) => {
      const l = m.links || [];
      return [
        l.instagram ? `<a class="btn" href="${esc(l.instagram)}" target="_blank" rel="noreferrer"><span>Instagram</span></a>` : "",
        l.whatsapp ? `<a class="btn" href="${esc(l.whatsapp)}" target="_blank" rel="noreferrer"><span>WhatsApp</span></a>` : "",
        l.email ? `<a class="btn" href="mailto:${esc(l.email)}"><span>Email</span></a>` : "",
      ].join("");
    };
    const tags = (m) => (m.tags && m.tags.length ? `<ul class="gm__tags">${m.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "");
    page.innerHTML = `
      <article class="gfeat" data-reveal>
        <div class="gfeat__pic">${portrait(lead, "av--xl")}<span class="gfeat__tag">${esc(lead.role.split("·")[0].trim())}</span></div>
        <div class="gfeat__txt">
          <p class="gfeat__eyebrow"><i></i>01 — ${esc(lead.role)}</p>
          <h2 class="display gfeat__name">${esc(lead.name).replace(" ", "<br>")}</h2>
          <p class="gfeat__bio">${esc(lead.bio || "")}</p>
          ${tags(lead)}
          <div class="cta-row">${links(lead)}<a class="btn btn--ghost" href="contact.html"><span>Work with ${esc(lead.name.split(" ")[0])}</span></a></div>
        </div>
      </article>
      ${rest.length ? `<div class="gmgrid">${rest.map((m, i) => `<article class="gm" data-reveal><div class="gm__pic">${portrait(m, "av--lg")}</div><p class="gm__n">${String(i + 2).padStart(2, "0")}</p><h3 class="display gm__name">${esc(m.name)}</h3><p class="gm__role">${esc(m.role)}</p>${m.bio ? `<p class="gm__bio">${esc(m.bio)}</p>` : ""}${tags(m)}</article>`).join("")}</div>` : ""}
      ${LF.GUILD_OPEN.length ? `<section class="gopen" data-reveal aria-labelledby="gopen-h">
        <div class="gopen__head"><h2 id="gopen-h" class="display">Seats open</h2><p>The guild grows one craft at a time. If one of these is yours, say hello.</p></div>
        <ul class="gopen__list">${LF.GUILD_OPEN.map((r, i) => `<li><a href="contact.html"><span class="gopen__n">${String(LF.GUILD.length + i + 1).padStart(2, "0")}</span><span class="gopen__r">${esc(r)}</span><span class="gopen__a">Apply <em>→</em></span></a></li>`).join("")}</ul>
      </section>` : ""}`;
  }
})();
