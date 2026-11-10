/* ━━━━━━━━━━━━ The Layout's own name and logo ━━━━━━━━━━━━
   Senso is the storefront name of the Selldone shop Digini, shown on its
   own address (senso.selldone.shop). The shop's own title would put
   "Digini" in the header, footer, page titles and every line that names the
   shop, so the title is replaced here as soon as the shop is read, for this
   Layout only. The shop record on Selldone (its emails, dashboard, the SEO
   page Selldone serves to crawlers) keeps its own name.

   To rename the Layout, change BRAND.name: the wordmark (SensoWordmark,
   every "i" with a yellow square dot), the tab title and every line that
   names the shop follow. Set it to null to show the shop's own title.

   The mark (assets/brand/senso-mark.svg, 64x64) is the browser tab's icon,
   the chat avatar on the order page and the compare page's badge. */

import mark from "../../assets/brand/senso-mark.svg?url";

export const BRAND: { name: string | null; mark: string } = {
  name: "Senso",
  mark,
};

/** Put the Layout's name on the shop record the storefront reads. */
export function applyBrand(shop: any): void {
  if (shop && BRAND.name && shop.title && shop.title !== BRAND.name) {
    renameTab(shop.title);
    shop.title = BRAND.name;
  }
  brandIcon();
  cartWords();
}

/* One word for it: Senso says "cart" everywhere, Selldone's own wording
   included ("In your basket", "others have this in their basket!", "Basket
   is empty"). English only: other languages keep Selldone's. Every English
   message that says basket is merged back saying cart, so a Selldone string
   added later follows too. */
let cartSwept = false;
function cartWords(): void {
  if (cartSwept) return;
  const i18n = (window as any).$i18n_global;
  const locale = i18n?.locale?.value ?? i18n?.locale;
  if (!i18n?.mergeLocaleMessage || !i18n.getLocaleMessage || !String(locale).startsWith("en")) return;
  cartSwept = true;
  const swap = (s: string) =>
    s
      .replace(/\bBASKETS\b/g, "CARTS")
      .replace(/\bBASKET\b/g, "CART")
      .replace(/\bBaskets\b/g, "Carts")
      .replace(/\bBasket\b/g, "Cart")
      .replace(/\bbaskets\b/g, "carts")
      .replace(/\bbasket\b/g, "cart")
      .replace(/\btheir bag\b/g, "their cart");
  const walk = (node: any): any => {
    if (typeof node === "string") return /basket|their bag/i.test(node) ? swap(node) : undefined;
    if (!node || typeof node !== "object") return undefined;
    let out: any;
    for (const key of Object.keys(node)) {
      const next = walk(node[key]);
      if (next !== undefined) (out ||= {})[key] = next;
    }
    return out;
  };
  try {
    const patch = walk(i18n.getLocaleMessage(locale)) || {};
    /* An electronics shop's "volume" variant is a capacity (64GB, 1TB), as
       Senso's cards say ("Choose capacity"). A shop that names its
       variants itself (Selldone's custom variant names) keeps its names. */
    patch.global = { ...(patch.global || {}), variants: { ...(patch.global?.variants || {}), volume: "Capacity" } };
    i18n.mergeLocaleMessage(locale, patch);
  } catch {
    cartSwept = false;
  }
}

/** The first page keeps the head the server wrote ("… | Digini"); later pages
    build their titles from the renamed shop. Put the Layout's name in the tab. */
function renameTab(original: string): void {
  if (typeof document === "undefined" || !document.title.includes(original)) return;
  document.title = document.title.split(original).join(BRAND.name as string);
}

/** The tab's icon (and the home-screen icon) is the Layout's mark. */
export function brandIcon(): void {
  if (typeof document === "undefined") return;
  for (const rel of ["icon", "apple-touch-icon"]) {
    let link = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      document.head.appendChild(link);
    }
    if (link.href !== BRAND.mark) {
      link.href = BRAND.mark;
      if (rel === "icon") link.type = "image/svg+xml";
    }
  }
}
