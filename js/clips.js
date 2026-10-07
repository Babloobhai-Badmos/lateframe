/* ==========================================================================
   Reel clips — short looping videos hosted on Cloudinary (or any CDN).

   Each clip is downloaded ONCE, then kept on the visitor's device:
     1. the response goes into the browser's Cache Storage ("lf-clips-v1"), so
        later visits read it from disk with zero network;
     2. it's played from a local blob: URL, so every loop of the video reads
        from memory — never from the network.
   Clips are skipped for visitors on Data Saver or with reduced-motion on; they
   just see the poster image instead.

   LF.clipUrl(edit) → the CDN URL for a reel (from  edit.clip  or  edit.video)
   LF.clip(url)     → Promise<blob: URL | null>   (memoised, safe to call twice)
   ========================================================================== */
(function () {
  "use strict";
  const LF = (window.LF = window.LF || {});
  const CACHE = "lf-clips-v1";

  LF.clipUrl = (e) => {
    if (e.video) return e.video;                         // a full URL always wins
    const c = LF.CLOUDINARY || {};
    if (!e.clip || !c.cloud || c.cloud === "your-cloud-name") return null;
    const t = (e.ar === "v" ? c.vertical : c.horizontal).replace("so_0", "so_" + (e.start || 0));   // e.start = which second the 3 s begins at
    return `https://res.cloudinary.com/${c.cloud}/video/upload/${t}/${e.clip}.mp4`;
  };

  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const allowed = !saveData && !reduce;
  const memo = new Map();

  async function load(url) {
    try {
      const cache = "caches" in window ? await caches.open(CACHE).catch(() => null) : null;
      let res = cache ? await cache.match(url) : null;
      if (!res) {
        res = await fetch(url, { mode: "cors", credentials: "omit" });
        if (!res.ok) throw new Error(res.status);
        if (cache) cache.put(url, res.clone()).catch(() => {});
      }
      return URL.createObjectURL(await res.blob());
    } catch (err) {
      return null;                                       // poster stays; nothing breaks
    }
  }

  LF.clip = (url) => {
    if (!url || !allowed) return Promise.resolve(null);
    if (!memo.has(url)) memo.set(url, load(url));
    return memo.get(url);
  };

  /* drop cached clips that no reel uses any more (after you swap a clip) */
  LF.clipsPrune = async (keep) => {
    try {
      const cache = await caches.open(CACHE);
      for (const req of await cache.keys()) if (!keep.includes(req.url)) cache.delete(req);
    } catch (err) {}
  };
})();
