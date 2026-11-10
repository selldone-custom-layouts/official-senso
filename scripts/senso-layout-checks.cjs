#!/usr/bin/env node
/*
 * Senso — two layout checks the owner asked for (10 November 2026), on every
 * page given, at 390 and 1440 (light, or dark with STORAGE):
 *
 *  1. IMAGES: every product or photo image sits inside its own box. For each
 *     visible <img>: it needs a clipping ancestor (overflow hidden/clip)
 *     within four levels, it must not reach past that box, and no text
 *     outside the box may overlap the box. Photo slots with words laid over
 *     them on purpose (.sn-slot, the stories) are skipped.
 *  2. ICON LISTS: in every vertical list of icon + text rows, the icons share
 *     one left edge and one width (±1px), and the words share one left edge
 *     (so wrapped text sits under the text, not under the icon).
 *  3. CARD PADDING (the owner's rule, 10 November 2026: content never touches
 *     its card's edge): every visible product card (.sn-card) keeps a computed
 *     padding-left/right of 10px or more, and every visible part of it (the
 *     image well, swatches, title, price, clock, buttons, Compare) sits 8px or
 *     more inside the card's left and right edges. Selldone's utility classes
 *     (pa-0, v-col-*) must never reach a card root.
 *
 * usage:
 *   PAGES="home=/,category=/laptop-category,product=/product/709977" \
 *   [STORAGE='{"senso-theme":"{\"palette\":\"teal\",\"mode\":\"dark\"}"}'] [WIDTHS=390,1440] \
 *   [OPEN="drawer:.sn-header__ic.-cart"]  (a click before checking, per page) \
 *   [FILLCART=<xapi shop name>]  (three products in the local cart store only; /buy/ is blocked) \
 *   node scripts/senso-layout-checks.cjs <base url> "<selector the home always shows>"
 * Pages after the first are opened in-app (router push), so a live
 * /product/ link is not answered with Selldone's SEO page. Prints each
 * problem and TOTAL n.
 */
const PW = process.env.PLAYWRIGHT || "D:/Kalio Sample Shop Claude/kalio-marketplace/node_modules/playwright";
const { chromium } = require(PW);
const [base, homeSel = "#app"] = process.argv.slice(2);
const PAGES = (process.env.PAGES || "home=/").split(",").map((p) => p.split("="));
const WIDTHS = (process.env.WIDTHS || "390,1440").split(",").map(Number);
const OPEN = Object.fromEntries((process.env.OPEN || "").split(";").filter(Boolean).map((p) => [p.split(":")[0], p.slice(p.indexOf(":") + 1)]));

function check(debug) {
  const out = [];
  const vis = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.display === "none" || s.visibility === "hidden" || +s.opacity === 0) return false;
    }
    const r = el.getBoundingClientRect();
    return r.width > 3 && r.height > 3;
  };
  const name = (el) => (el.tagName.toLowerCase() + "." + [...el.classList].slice(0, 2).join(".")).slice(0, 60);
  const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

  /* 1. Images */
  for (const img of document.images) {
    if (!vis(img)) continue;
    if (img.closest(".sn-slot, .sn-story__img, .k-prose, .v-avatar, .sn-header__avatar, .ts-panel, .s--footer-section-selldone")) continue;
    const r = img.getBoundingClientRect();
    // product and photo images; a small mark or icon drawn as an <img> is not one
    if ((r.width < 60 && r.height < 60) || /^data:image\/svg|\.svg(\?|$)/.test(img.src)) continue;
    let clip = null;
    let el = img.parentElement;
    for (let d = 0; el && d < 4; d++, el = el.parentElement) {
      const s = getComputedStyle(el);
      if (/(hidden|clip)/.test(s.overflow + " " + s.overflowX + " " + s.overflowY)) {
        clip = el;
        break;
      }
    }
    if (!clip) {
      out.push(`image without its own box: ${name(img.parentElement)} > img ${img.alt || img.src.slice(-40)}`);
      continue;
    }
    const c = clip.getBoundingClientRect();
    if (r.left < c.left - 1.5 || r.top < c.top - 1.5 || r.right > c.right + 1.5 || r.bottom > c.bottom + 1.5) {
      // A sideways rail clips cards at its edge: only a box smaller than the image counts.
      if (r.width <= c.width + 2 && r.height <= c.height + 2) out.push(`image reaches past its box: ${name(clip)} (${Math.round(r.width)}x${Math.round(r.height)} in ${Math.round(c.width)}x${Math.round(c.height)})`);
    }
    const box = { left: Math.max(r.left, c.left), top: Math.max(r.top, c.top), right: Math.min(r.right, c.right), bottom: Math.min(r.bottom, c.bottom) };
    const card = clip.parentElement;
    if (!card) continue;
    for (const t of card.querySelectorAll("*")) {
      if (clip.contains(t) || t.contains(clip) || !ownText(t) || !vis(t)) continue;
      // A small badge laid on the photo on purpose (a "% off" flag) is absolute; text in the flow is what must not overlap.
      if (["absolute", "fixed"].includes(getComputedStyle(t).position) || t.closest("[class*='flag'], [class*='badge']")) continue;
      const tr = t.getBoundingClientRect();
      if (inter(box, tr) > 16) out.push(`text over an image box: "${t.textContent.trim().slice(0, 30)}" on ${name(clip)}`);
    }
  }

  /* 2. Icon lists */
  const ICON = "svg, i.v-icon, .v-icon, .sn-ms, .material-icons, img";
  const seen = new Set();
  for (const list of document.querySelectorAll("ul, ol, nav, [role=list], dl, div, aside, section")) {
    const rows = [...list.children].filter((c) => vis(c));
    if (rows.length < 2) continue;
    const items = [];
    for (const row of rows) {
      const rowR = row.getBoundingClientRect();
      // a row: not taller than a few lines, its icon leading it
      const icon = rowR.height <= 140 && [...row.querySelectorAll(ICON)].find((i) => vis(i) && i.getBoundingClientRect().width <= 40 && i.getBoundingClientRect().height <= 40);
      if (!icon || icon.getBoundingClientRect().left - rowR.left > 40) {
        items.push(null);
        continue;
      }
      // a plain row: no box (a border, a fill or an edge) between the row and its icon — a button or a tile is not a list row
      let boxed = false;
      for (let e = icon.parentElement; e && e !== list; e = e.parentElement) {
        const st = getComputedStyle(e);
        const fill = st.backgroundColor !== "rgba(0, 0, 0, 0)" && st.backgroundColor !== "transparent";
        const box = fill || parseFloat(st.borderTopWidth) > 0 || parseFloat(st.borderLeftWidth) > 0 || st.boxShadow !== "none";
        // a box that holds words too (a button, a tile); a circle around the icon alone is fine
        if (box && (e.textContent || "").trim().length > 0 && !(e.textContent.trim() === (icon.textContent || "").trim())) {
          boxed = true;
          break;
        }
      }
      if (boxed) {
        items.push(null);
        continue;
      }
      // the first text after the icon; a row whose words start before its icon is not an icon row
      const walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT);
      let textLeft = null;
      const ir = icon.getBoundingClientRect();
      let leadingText = false;
      while (walker.nextNode()) {
        const n = walker.currentNode;
        if (!n.textContent.trim() || icon.contains(n) || !vis(n.parentElement)) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        const rr = [...range.getClientRects()].filter((x) => x.width > 0);
        if (!rr.length) continue;
        if (icon.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_PRECEDING) {
          leadingText = true;
          break;
        }
        const mid = rr[0].top + rr[0].height / 2;
        if (rr[0].left >= ir.right - 1 && Math.abs(mid - (ir.top + ir.height / 2)) <= Math.max(ir.height, rr[0].height)) {
          textLeft = Math.min(...rr.map((x) => x.left));
          break;
        }
      }
      if (textLeft == null || leadingText) {
        items.push(null);
        continue;
      }
      items.push({ row, icon: ir, textLeft });
    }
    const withIcon = items.filter(Boolean);
    // a list: at least two rows with an icon, most rows have one, rows stacked vertically
    if (withIcon.length < 2 || withIcon.length < rows.length * 0.6) continue;
    const tops = withIcon.map((x) => x.row.getBoundingClientRect().top);
    const lefts = withIcon.map((x) => x.row.getBoundingClientRect().left);
    if (Math.max(...lefts) - Math.min(...lefts) > 2) continue;
    if (tops.some((t, i) => i && t <= tops[i - 1] + 2)) continue;
    const key = withIcon.map((x) => Math.round(x.icon.left) + ":" + Math.round(x.icon.top)).join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    const il = withIcon.map((x) => x.icon.left);
    const iw = withIcon.map((x) => x.icon.width);
    const tl = withIcon.map((x) => x.textLeft).filter((v) => v != null);
    const where = name(list);
    if (debug) out.push(`(list checked: ${where}, ${withIcon.length} rows)`);
    if (Math.max(...il) - Math.min(...il) > 1) out.push(`icon lefts differ by ${Math.round(Math.max(...il) - Math.min(...il))}px in ${where}`);
    else if (Math.max(...iw) - Math.min(...iw) > 1) out.push(`icon widths differ (${iw.map(Math.round).join("/")}) in ${where}`);
    else if (tl.length >= 2 && Math.max(...tl) - Math.min(...tl) > 1) out.push(`text lefts differ by ${Math.round(Math.max(...tl) - Math.min(...tl))}px in ${where}`);
  }

  /* 3. Card padding */
  const PARTS = ".sn-card__well, .sn-swrow, .sn-caps, .sn-card__t, .sn-price, .sn-was, .sn-ends, .sn-card__buy, .sn-card__foot";
  for (const card of document.querySelectorAll(".sn-card")) {
    if (!vis(card)) continue;
    const cr = card.getBoundingClientRect();
    if (cr.width < 80) continue;
    const st = getComputedStyle(card);
    const pl = parseFloat(st.paddingLeft), pr = parseFloat(st.paddingRight);
    const title = (card.querySelector(".sn-card__t")?.textContent || "").trim().slice(0, 28);
    const label = `card "${title}"${card.classList.contains("-listed") ? " (listing)" : ""}`;
    if (pl < 10 || pr < 10) {
      out.push(`${label}: padding ${pl}/${pr}px (classes: ${[...card.classList].filter((c) => !c.startsWith("sn-")).join(" ").slice(0, 60)})`);
      continue;
    }
    for (const part of card.querySelectorAll(PARTS)) {
      if (!vis(part)) continue;
      const r = part.getBoundingClientRect();
      if (r.left < cr.left + 8 - 0.5 || r.right > cr.right - 8 + 0.5) {
        out.push(`${label}: ${[...part.classList][0]} is ${Math.round(r.left - cr.left)}px / ${Math.round(cr.right - r.right)}px from the card's edges`);
        break;
      }
    }
  }
  return out;
}

(async () => {
  const browser = await chromium.launch();
  let total = 0;
  for (const w of WIDTHS) {
    const mob = w < 600;
    const ctx = await browser.newContext({ viewport: { width: w, height: mob ? 844 : 900 }, isMobile: mob, hasTouch: mob });
    if (process.env.STORAGE) {
      const st = JSON.parse(process.env.STORAGE);
      await ctx.addInitScript((st) => {
        for (const [k, v] of Object.entries(st)) try { localStorage.setItem(k, v); } catch (e) {}
      }, st);
    }
    await ctx.route((u) => u.href.includes("/buy/"), (r) => r.abort());
    const pg = await ctx.newPage();
    await pg.goto(base.replace(/\/$/, "") + PAGES[0][1], { waitUntil: "domcontentloaded", timeout: 90000 });
    await pg.waitForSelector(homeSel, { timeout: 60000 }).catch(() => {});
    if (process.env.FILLCART) {
      await pg.waitForTimeout(3000);
      await pg.evaluate(async (shop) => {
        const list = await fetch(`https://xapi.selldone.com/shops/@${shop}/products/list?limit=250`).then((r) => r.json());
        const ps = list.products || [];
        const now = Date.now();
        const live = (p) => p.discount > 0 && (!p.dis_end || Date.parse(p.dis_end) > now);
        const pick = [ps.find((p) => live(p)), ps.find((p) => (p.product_variants || []).some((v) => v.volume)), ps.find((p) => !live(p))].filter(Boolean);
        const items = pick.map((p, i) => {
          const v = (p.product_variants || [])[0] || null;
          const dis = live(p) ? p.discount : 0;
          const price = (v && v.pricing ? v.price : p.price) - dis;
          return { id: 900 + i, product_id: p.id, variant_id: v ? v.id : null, variant: v, count: i === 1 ? 2 : 1, price, dis, currency: p.currency || "USD", product: { id: p.id, title: p.title, icon: p.icon, type: "PHYSICAL", quantity: p.quantity, category_id: p.category_id } };
        });
        const total = items.reduce((t, it) => t + it.price * it.count, 0);
        const el = [...document.querySelectorAll("*")].find((e) => e.__vue_app__);
        el.__vue_app__.config.globalProperties.$store.commit("setBasketPhysical", { id: 1, type: "PHYSICAL", items, price: total, currency: items[0]?.currency || "USD", status: "Open", receiver_info: null, bill: null });
      }, process.env.FILLCART);
      await pg.waitForTimeout(1500);
    }
    for (const [label, path] of PAGES) {
      if (path !== PAGES[0][1]) {
        await pg.evaluate((to) => {
          const app = document.querySelector("#app").__vue_app__;
          app.config.globalProperties.$router.push(to).catch(() => {});
        }, path);
      }
      await pg.waitForTimeout(5000);
      if (OPEN[label]) {
        await pg.click(OPEN[label], { timeout: 5000 }).catch(() => {});
        await pg.waitForTimeout(1500);
      }
      await pg.evaluate(async () => {
        document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        window.scrollTo(0, 0);
      });
      await pg.waitForTimeout(1500);
      const found = await pg.evaluate(check, !!process.env.DEBUG);
      const uniq = [...new Set(found)];
      total += uniq.length;
      console.log(`${w} ${label}: ${uniq.length}${uniq.length ? "\n  " + uniq.slice(0, 25).join("\n  ") : ""}`);
      if (OPEN[label]) await pg.keyboard.press("Escape").catch(() => {});
    }
    await ctx.close();
  }
  await browser.close();
  console.log("TOTAL", total);
})();
