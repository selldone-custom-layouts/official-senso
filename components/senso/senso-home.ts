/*
 * Senso — the shared reads and rules of the home page and its sections
 * (SensoHome: the hero, FEATURED, COLLECTIONS, LIFESTYLE, DEALS, the
 * category shelf, NEW, STORIES), the listing head and the mega panels.
 * Everything is read live; nothing here names a product, a price or a
 * category.
 *
 *  - The owner's lifestyle photos are bundled in assets/senso/ as
 *    wide-<category name>.webp (16:9 with a quiet left third); the hero uses
 *    them until a family's own photo arrives (senso-photos.ts). A category is
 *    matched by its `name` (the slug in its address).
 *  - Tags: Selldone's storefront has no list of a shop's tags, but products
 *    can be asked for by tag, and an answer carries every tag of each
 *    product. One request with a vocabulary of common merchandising tags
 *    finds the tags in use (and any other tag those products also carry).
 *    A tag with no products shows nothing; the best-seller tag is the first
 *    COLLECTIONS tab, the new-arrival tag fills NEW, and every other tag
 *    gets a tab of its own.
 */
import { reactive } from "vue";
import { baseCurrency, money as regionMoney } from "../region-switcher/region";
import { t } from "../kalio/i18n/kalio-i18n";


declare const window: any;

/* ━━━━━━━━━━━━ Photos ━━━━━━━━━━━━ */
const FILES = import.meta.glob("../../assets/senso/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const BY_NAME = new Map<string, string>(
  Object.entries(FILES).map(([path, url]) => [path.split("/").pop()!.replace(/\.\w+$/, ""), url]),
);

export type Shape = "wide" | "portrait" | "square";

/** The bundled photo of a category in this shape, or null. */
export function photoOf(shape: Shape, category: any): string | null {
  const slug = category?.name ? String(category.name).toLowerCase() : "";
  return (slug && BY_NAME.get(`${shape}-${slug}`)) || null;
}

/** The categories that have a photo in this shape. */
export function withPhoto(shape: Shape, categories: any[]): any[] {
  return categories.filter((c) => !!photoOf(shape, c));
}

/* ━━━━━━━━━━━━ Products ━━━━━━━━━━━━ */

/** Products of a category (by name) or of the whole shop. */
export function listProducts(dir: string | null, limit: number, options: Record<string, any> = {}): Promise<any[]> {
  return window.$storefront.products
    .list(dir, 0, limit, { products_only: true, ...options })
    .then(({ products }: any) => products || [])
    .catch(() => []);
}

/** One read of the whole catalogue, shared by every section that computes
 *  from it (deals ranked by saving, savings per category, price bands,
 *  brands) and by the cards (brand, colours with their variant ids).
 *  Selldone's full product list (products/list) carries brand, spec and
 *  variants that the sorted list (products/all) leaves out; about 40 KB
 *  compressed for Digini, read once per visit. */
/** Ask again when Selldone is busy: a 429 or a dropped answer on the first
 *  load must not leave the header without its families (or the home without
 *  its rails) for the whole visit. `ask` resolves to the answer, or null when
 *  it was an error; up to 4 tries, 1.2s, 2.4s and 4.8s apart. */
export function askWithRetry<T>(ask: () => Promise<T | null>, tries = 4): Promise<T | null> {
  const run = (n: number): Promise<T | null> =>
    ask()
      .catch(() => null)
      .then((v) => (v !== null || n >= tries - 1 ? v : new Promise<void>((r) => setTimeout(r, 1200 * 2 ** n)).then(() => run(n + 1))));
  return run(0);
}

/** Whether the home's hero is on screen (loading or with slides). The header
 *  sits clear over it, with white words, only while it is: before the home
 *  has mounted, and on a home whose hero has nothing to show (every read
 *  failed), the header is solid, never white words on the white page (the
 *  contrast audit caught that moment on a slow first load). */
export const heroState = reactive({ shown: false });

let allRead: Promise<any[]> | null = null;
export function allProducts(): Promise<any[]> {
  if (!allRead) {
    allRead = askWithRetry<any[]>(() =>
      window.axios
        .get(window.XAPI.GET_PRODUCTS_LIST(window.$storefront.name), { params: { limit: 250, offset: 0 } })
        .then(({ data }: any) => (data?.error || !Array.isArray(data?.products) ? null : data.products)),
    )
      .then((list) => list || [])
      .then((list: any[]) => {
        if (!list.length) allRead = null;
        return list;
      });
  }
  return allRead!;
}

/** Product id → its full record from allProducts(). */
let indexRead: Promise<Map<number, any>> | null = null;
export function productIndex(): Promise<Map<number, any>> {
  if (!indexRead) indexRead = allProducts().then((list) => new Map(list.map((p) => [p.id, p])));
  return indexRead;
}

/** What a list product costs now (Selldone's own final price when sent). */
export function finalOf(p: any): number {
  return Number(p?.price || 0) - savingOf(p);
}

/** The saving in the shop's currency, by Selldone's own rule: a discount
 *  counts only between its start and end dates (PriceHelper), so a deal
 *  whose dates have passed is not shown as one, as the cart would not
 *  charge it either. */
export function savingOf(p: any): number {
  const d = Number(p?.discount || 0);
  if (!(d > 0)) return 0;
  const now = Date.now();
  if (p.dis_start && Date.parse(p.dis_start) > now) return 0;
  if (p.dis_end && Date.parse(p.dis_end) < now) return 0;
  return d;
}

export function pctOf(p: any): number {
  const s = savingOf(p);
  return s > 0 && p.price > 0 ? Math.round((s / p.price) * 100) : 0;
}

/** Round-robin across categories, so no section is all one kind. */
export function mix(list: any[], n: number): any[] {
  const groups = new Map<any, any[]>();
  for (const p of list) {
    if (!groups.has(p.category_id)) groups.set(p.category_id, []);
    groups.get(p.category_id)!.push(p);
  }
  const out: any[] = [];
  const queues = [...groups.values()];
  while (out.length < n && queues.some((q) => q.length)) for (const q of queues) if (q.length && out.length < n) out.push(q.shift());
  return out;
}

/** Deals, deepest saving (in money) first. */
export function dealsOf(list: any[]): any[] {
  return list.filter((p) => savingOf(p) > 0).sort((a, b) => savingOf(b) - savingOf(a));
}

/** "Up to $X off" when the category has deals, otherwise "From $Y". */
export function categoryLine(category: any, list: any[], money: (n: number) => string): string {
  const ps = list.filter((p) => p.category_id === category?.id);
  if (!ps.length) return "";
  const best = Math.max(0, ...ps.map(savingOf));
  return best
    ? t("senso.home.categoryUpTo", "Up to {amount} off", { amount: money(best) })
    : t("senso.home.categoryFrom", "From {amount}", { amount: money(Math.min(...ps.map(finalOf))) });
}

/* ━━━━━━━━━━━━ Price bands: "Shop by budget" ━━━━━━━━━━━━
   Cut where the shop's own prices fall (quintiles), rounded to friendly
   numbers, so a shop of $5 cables and a shop of $5,000 TVs both get sensible
   bands. Each band is a min/max for the listing's price filter. */
export function priceBands(list: any[]): { min: number | null; max: number | null }[] {
  const s = list.map(finalOf).filter((v) => v > 0).sort((a, b) => a - b);
  if (s.length < 5) return [];
  const nice = (v: number) => {
    const e = Math.pow(10, Math.floor(Math.log10(Math.max(v, 1))));
    return Math.max(1, Math.round(v / e) * e);
  };
  const cuts = [...new Set([0.2, 0.4, 0.6, 0.8].map((q) => nice(s[Math.floor(q * (s.length - 1))])))].sort((a, b) => a - b);
  if (!cuts.length) return [];
  const out: { min: number | null; max: number | null }[] = [{ min: null, max: cuts[0] }];
  for (let i = 1; i < cuts.length; i++) out.push({ min: cuts[i - 1], max: cuts[i] });
  out.push({ min: cuts[cuts.length - 1], max: null });
  return out;
}

/* ━━━━━━━━━━━━ Category tiles: never a hole ━━━━━━━━━━━━
   The owner's rule (9 November 2026): a two-row grid of categories holds the
   same number on both rows and never leaves an empty slot. 16 or more: the
   first 15 and an "All categories" tile; an odd number: all of them and the
   tile; an even number up to 16: all of them. Columns = tiles / 2. */
export function categoryTiles(categories: any[], max = 16): { shown: any[]; all: boolean; cols: number } {
  const n = categories.length;
  const shown = categories.slice(0, n >= max ? max - 1 : n);
  const all = shown.length < n || shown.length % 2 === 1;
  return { shown, all, cols: Math.max(1, (shown.length + (all ? 1 : 0)) / 2) };
}

/* ━━━━━━━━━━━━ Tags ━━━━━━━━━━━━ */
const VOCABULARY = [
  "best-seller", "best-sellers", "bestseller", "bestsellers", "best seller", "top-seller", "top-rated",
  "new-arrival", "new-arrivals", "new", "new arrival", "just-in",
  "featured", "trending", "popular", "staff-pick", "editors-choice", "limited", "exclusive", "clearance", "sale",
  "gift", "gifts", "gift-ideas", "bundle", "premium", "pro", "eco", "refurbished", "open-box",
  "wireless", "bluetooth", "portable", "4k", "8k", "hdr", "oled", "gaming", "smart", "usb-c", "fast-charging",
  "noise-cancelling", "waterproof", "creator", "streaming", "office", "travel", "home-office", "student",
];

export const isBestSellerTag = (tag: string) => /^(best|top)[\s_-]?sell(er|ers|ing)?$/i.test(tag);
export const isNewTag = (tag: string) => /^(new|new[\s_-]?arrivals?|just[\s_-]?in)$/i.test(tag);

/** A tag as a heading: "4k" → "4K", "new-arrival" → "New Arrival". */
export function tagTitle(tag: string): string {
  return String(tag)
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => (/\d/.test(w) && w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export interface TagIndex {
  /** Tag → its products, in the order the shop sent them. */
  byTag: Map<string, any[]>;
}

let tagsRead: Promise<TagIndex> | null = null;

/** The tags in use and their products: one request. */
export function tagIndex(): Promise<TagIndex> {
  if (!tagsRead) {
    tagsRead = listProducts(null, 250, { tags: VOCABULARY, sort: "bestselling" }).then((list) => {
      const byTag = new Map<string, any[]>();
      for (const p of list) {
        for (const tag of p.tags || []) {
          if (!tag) continue;
          if (!byTag.has(tag)) byTag.set(tag, []);
          byTag.get(tag)!.push(p);
        }
      }
      return { byTag };
    });
  }
  return tagsRead;
}

/* ━━━━━━━━━━━━ Ways to get it ━━━━━━━━━━━━ */
/* `id` is the way's fixed name (the cards' key, never translated); `word`
   and `line` are getters, so they follow a language change. */
const WAYS: { id: string; types: string[]; word: string; icon: string; line: string }[] = [
  {
    id: "Pickup",
    types: ["Pickup"],
    icon: "storefront",
    get word() {
      return t("senso.way.pickup", "Pickup");
    },
    get line() {
      return t("senso.way.pickup.line", "Order online, collect at the shop");
    },
  },
  {
    id: "Delivery",
    types: ["Motorbike", "Bicycle"],
    icon: "two_wheeler",
    get word() {
      return t("senso.way.delivery", "Delivery");
    },
    get line() {
      return t("senso.way.delivery.line", "A courier brings it to your door");
    },
  },
  {
    id: "Shipping",
    types: ["CargoSmall", "Cargo", "Truck"],
    icon: "local_shipping",
    get word() {
      return t("senso.way.shipping", "Shipping");
    },
    get line() {
      return t("senso.way.shipping.line", "Shipped to your address");
    },
  },
  {
    id: "By post",
    types: ["Post", "PostFast"],
    icon: "local_post_office",
    get word() {
      return t("senso.way.post", "By post");
    },
    get line() {
      return t("senso.way.post.line", "Sent to your address by post");
    },
  },
  {
    id: "Worldwide",
    types: ["Airplane", "Global"],
    icon: "public",
    get word() {
      return t("senso.way.worldwide", "Worldwide");
    },
    get line() {
      return t("senso.way.worldwide.line", "Shipped wherever you are");
    },
  },
];

export interface Way {
  key: string;
  word: string;
  icon: string;
  line: string;
  free: boolean;
  freeOver: number | null;
  currency: string | null;
}

/** The shop's enabled delivery methods, one card per kind. */
export function waysOf(shop: any): Way[] {
  const out: Way[] = [];
  for (const way of (shop?.transportations || []).filter((x: any) => x && x.enable)) {
    const kind = WAYS.find((w) => w.types.includes(way.type));
    const key = kind ? kind.id : way.type;
    const free = !!way.free_shipping && !(Number(way.free_shipping_limit) > 0);
    const freeOver = way.free_shipping && Number(way.free_shipping_limit) > 0 ? Number(way.free_shipping_limit) : null;
    const known = out.find((w) => w.key === key);
    if (known) {
      known.free = known.free || free;
      if (freeOver != null && (known.freeOver == null || freeOver < known.freeOver)) known.freeOver = freeOver;
      continue;
    }
    out.push({
      key,
      word: way.title || (kind ? kind.word : t("senso.way.delivery", "Delivery")),
      icon: kind ? kind.icon : "local_shipping",
      line: kind ? kind.line : t("senso.way.other.line", "Brought to your address"),
      free,
      freeOver,
      currency: way.currency || baseCurrency() || null,
    });
  }
  const rank = (w: Way) => {
    const at = WAYS.findIndex((x) => x.id === w.key);
    return at === -1 ? WAYS.length : at;
  };
  return out.sort((a, b) => rank(a) - rank(b));
}

/** The lowest basket total that ships for free. */
export function freeShippingFrom(shop: any): { amount: number; currency: string } | null {
  const paid = (shop?.transportations || []).filter(
    (x: any) => x && x.enable && x.type !== "Pickup" && x.free_shipping && Number(x.free_shipping_limit) > 0,
  );
  if (!paid.length) return null;
  const best = paid.reduce((a: any, b: any) => (Number(b.free_shipping_limit) < Number(a.free_shipping_limit) ? b : a));
  return { amount: Number(best.free_shipping_limit), currency: best.currency || baseCurrency() };
}

/* ━━━━━━━━━━━━ Money ━━━━━━━━━━━━ */

/** An amount in `currency` (the shop's base currency when not given),
 *  shown in the visitor's currency: "$1,059.90", "DKK 6,359.40" or, short,
 *  "$589". Converted with the shop's rates by the region switcher, so it
 *  redraws the moment the visitor picks another currency. */
export function money(amount: number, currency?: string | null, short: boolean | "auto" = false): string {
  return regionMoney(amount, currency || baseCurrency(), { short });
}

/* ━━━━━━━━━━━━ Senso: a category's showcase product ━━━━━━━━━━━━ */

/** The product a category is shown by (tiles, mega panels, banners): the
 *  deepest saving, then the highest price, in stock first. */
export function bestOf(list: any[], category: any): any | null {
  const ps = list.filter((p) => p.category_id === category?.id);
  const inStock = (p: any) => (p.quantity == null || Number(p.quantity) > 0 ? 1 : 0);
  return [...ps].sort((a, b) => inStock(b) - inStock(a) || savingOf(b) - savingOf(a) || finalOf(b) - finalOf(a))[0] || null;
}
