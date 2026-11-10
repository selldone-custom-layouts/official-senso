/*
 * Kalio — the basket from a card or the product page.
 *
 * Small helpers over the storefront's own basket methods (StorefrontMixin:
 * getBasket, AddToBasket, RemoveFromBasket), which every Kalio component
 * has through the app's global mixin. A count sent to AddToBasket is the
 * line's new total, not an increment.
 *
 * quickAdd() is what a card's "+" does: a product with sizes opens the
 * quick-buy sheet so a size is chosen; any other goes straight into the
 * basket, from the cheapest offer that has stock (the offer the card's price
 * is). A guest is asked to sign in first unless the shop takes guest
 * orders, as Selldone's own buy button does.
 *
 * Taps never wait for the server. The count a stepper shows is the last one
 * tapped (wanted), and the requests for one basket line go out one at a
 * time (inTurn), each carrying the latest count wanted. So two quick taps
 * on "+" make two, and a slow answer cannot undo a later tap or a change of
 * seller. A server answer takes about a second, sometimes three.
 */

import { reactive } from "vue";
import { ShopOptionsHelper } from "@selldone/core-js/helper/shop/ShopOptionsHelper";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";

/** Whether the header's basket drawer is open. It shows a new line itself,
 *  so the "Added to basket" notice (KalioBasketToast) stays quiet then. */
export const basketView = reactive({ drawerOpen: false });

/** A basket line's key: product and size. */
export function lineKey(product: any, variantId: any = null): string {
  return `${product?.id}:${variantId || 0}`;
}

/** Counts tapped but not yet confirmed by the server, by line key. */
const wanted: Record<string, number> = reactive({});
/** The last request queued for each line; the next one waits for it. */
const tails = new Map<string, Promise<void>>();
/** Lines whose count request is queued but not yet sent: a tap only
 *  updates `wanted`, since that request will read it when it goes. */
const queued = new Set<string>();

function inTurn<T>(key: string, task: () => T | Promise<T>): Promise<T> {
  const mine = (tails.get(key) || Promise.resolve()).then(task);
  const tail = mine.then(
    () => undefined,
    () => undefined,
  );
  tails.set(key, tail);
  tail.then(() => {
    if (tails.get(key) === tail) tails.delete(key);
  });
  return mine;
}

/** The basket line for a product (and size), or null. */
export function basketLine(vm: any, product: any, variant: any = null): any {
  if (!product) return null;
  const basket = vm.getBasket(product.type || "PHYSICAL");
  return (
    basket?.items?.find(
      (item: any) => item.product_id === product.id && (variant ? item.variant_id === variant.id : true),
    ) || null
  );
}

/** A card's line while its first "+" is still on its way: shown at once. */
export function pendingLine(product: any): any {
  const key = lineKey(product);
  return key in wanted ? { product_id: product.id, variant_id: null, count: 0, pending: true } : null;
}

/** How many to show for a line: the last count tapped, else the basket's. */
export function shownCount(product: any, line: any): number {
  if (!line) return 0;
  const key = line.pkey || lineKey(product, line.variant_id);
  return key in wanted ? wanted[key] : line.count || 0;
}

/** True while a line has taps the server has not confirmed yet. */
export function settling(product: any, line: any): boolean {
  return !!line && (line.pkey || lineKey(product, line.variant_id)) in wanted;
}

export function hasSizes(product: any): boolean {
  return !!(product?.variants && product.variants.length);
}

/** The guest gate of Selldone's buy button; false when sign-in was asked for
 *  (through the app's "need-login" event, which opens KalioSignIn). */
export function mayBuy(vm: any): boolean {
  if (vm.USER() || ShopOptionsHelper.HasGuestCheckout(vm.getShop())) return true;
  EventBus.$emit("need-login", true);
  return false;
}

/** The cheapest enabled offer with stock, for a product sold without sizes. */
export function cheapestOffer(product: any): any {
  const offers = (product?.vendor_products || []).filter(
    (offer: any) => !offer.variant_id && offer.enable !== false && offer.quantity > 0,
  );
  if (!offers.length) return null;
  return offers.reduce((best: any, offer: any) =>
    offer.price - (offer.discount || 0) < best.price - (best.discount || 0) ? offer : best,
  );
}

function add(
  vm: any,
  product: any,
  variant: any,
  count: number,
  offer: any,
  preferences: any = null,
  subscription: any = null,
): Promise<any> {
  return new Promise((resolve, reject) => {
    vm.AddToBasket(vm.getShop().name, product, variant, count, reject, resolve, preferences, offer, subscription);
  });
}

/** Set a basket line to `count` now; 0 removes it. */
function setCount(vm: any, product: any, line: any, count: number): Promise<any> {
  if (count <= 0) {
    return new Promise((resolve, reject) => {
      vm.RemoveFromBasket(product.id, line.variant_id || null, reject, resolve);
    });
  }
  const variant = line.variant_id ? { id: line.variant_id } : null;
  const offer = line.vendor_product_id ? { id: line.vendor_product_id } : null;
  return add(vm, { id: product.id, type: product.type }, variant, count, offer);
}

/** Ask for `count` of a line (0 takes it out). The stepper shows it at once;
 *  the basket follows, one request at a time, with the latest count asked
 *  for. Each request reads the line as it is then, so it keeps the seller
 *  chosen meanwhile. */
export function stepTo(vm: any, product: any, line: any, count: number): Promise<any> {
  const key = lineKey(product, line.variant_id);
  wanted[key] = Math.max(count, 0);
  if (queued.has(key)) return tails.get(key) || Promise.resolve();
  queued.add(key);
  return inTurn(key, () => {
    queued.delete(key);
    if (!(key in wanted)) return null;
    const target = wanted[key];
    const current = basketLine(vm, product, line.variant_id ? { id: line.variant_id } : null);
    // Nothing to change, or a first "+" that never made it into the basket.
    if ((current ? current.count : 0) === target || (!current && line.pending)) {
      delete wanted[key];
      return null;
    }
    return setCount(vm, product, current || line, target).finally(() => {
      if (wanted[key] === target) delete wanted[key];
    });
  }).catch(() => null);
}

/** Move a line to another seller, keeping its count, after any count
 *  requests for it have gone. */
export function switchOffer(
  vm: any,
  product: any,
  variant: any,
  offer: any,
  preferences: any = null,
  subscription: any = null,
): Promise<any> {
  const key = lineKey(product, variant?.id);
  return inTurn(key, () => {
    const line = basketLine(vm, product, variant);
    if (!line) return null;
    const count = key in wanted ? wanted[key] : line.count;
    if (count <= 0) return null;
    return add(vm, product, variant, count, offer, preferences, subscription);
  }).catch(() => null);
}

const fullProducts = new Map<number, Promise<any>>();

function full(product: any): Promise<any> {
  if (!fullProducts.has(product.id)) {
    fullProducts.set(
      product.id,
      window.$storefront.products
        .optimize(60)
        .get(product.id, { no_article: true })
        .then(({ product: loaded }: any) => loaded)
        .catch((error: any) => {
          fullProducts.delete(product.id);
          throw error;
        }),
    );
  }
  return fullProducts.get(product.id)!;
}

/** A card's "+": straight into the basket, or the sheet for a sized product.
 *  The card shows "1 in basket" at once; taps on it meanwhile add up and
 *  go with the first request or right after it. */
export function quickAdd(vm: any, product: any, openSheet: (product: any) => void): Promise<any> {
  if (hasSizes(product)) {
    openSheet(product);
    return Promise.resolve(null);
  }
  if (!mayBuy(vm)) return Promise.resolve(null);

  const line = basketLine(vm, product) || pendingLine(product);
  if (line) return stepTo(vm, product, line, shownCount(product, line) + 1);

  const key = lineKey(product);
  wanted[key] = 1;
  queued.add(key);
  return inTurn(key, () =>
    full(product).then(
      (loaded) => {
        queued.delete(key);
        if (hasSizes(loaded)) {
          delete wanted[key];
          openSheet(product);
          return null;
        }
        const target = wanted[key] ?? 0;
        if (target <= 0) {
          delete wanted[key];
          return null;
        }
        const existing = basketLine(vm, loaded);
        const request = existing
          ? setCount(vm, loaded, existing, target)
          : add(vm, loaded, null, target, cheapestOffer(loaded));
        return request.finally(() => {
          if (wanted[key] === target) delete wanted[key];
        });
      },
      (error) => {
        queued.delete(key);
        delete wanted[key];
        throw error;
      },
    ),
  ).catch(() => null);
}

/** "Buy again": put an order's lines back in the basket, each with the size
 *  and seller it had, adding to what the basket already holds. One line at
 *  a time; a line the shop no longer sells is skipped and counted. */
export async function reorder(vm: any, items: any[]): Promise<{ added: number; failed: number }> {
  if (!mayBuy(vm)) return { added: 0, failed: 0 };
  let added = 0;
  let failed = 0;
  for (const item of items || []) {
    const product = { id: item.product_id, type: item.product?.type || "PHYSICAL" };
    const variant = item.variant_id ? { id: item.variant_id } : null;
    try {
      await inTurn(lineKey(product, item.variant_id), () => {
        const line = basketLine(vm, product, variant);
        const offer = item.vendor_product_id ? { id: item.vendor_product_id } : line?.vendor_product_id ? { id: line.vendor_product_id } : null;
        return add(vm, product, variant, (line?.count || 0) + (item.count || 1), offer, item.preferences || null);
      });
      added++;
    } catch {
      failed++;
    }
  }
  return { added, failed };
}

/* ━━━━━━━━━━━━ Senso: a colour picked on the card ━━━━━━━━━━━━
   Every Digini product comes in colours or capacities. A card shows its
   colours as swatches; the one picked goes straight into the cart with
   "Add to cart" (a capacity still opens the quick-buy sheet, since each
   capacity has its own price). The list does not carry variant ids, so the
   first tap is counted under the colour (pendingColourKey) and the product
   is read once to find that colour's variant; later taps step that line. */

/** "#303F9Fff" and "#303f9f" are one colour; two-tone stays two-tone. */
export function normColour(colour: any): string {
  return String(colour || "")
    .toLowerCase()
    .split("/")
    .map((c) => (c.length === 9 && c.endsWith("ff") ? c.slice(0, 7) : c))
    .join("/");
}

/** Learned on the first add: product and colour → the variant's id. */
const colourIds: Record<string, number> = reactive({});
const colourKey = (product: any, colour: any) => `${product?.id}:c:${normColour(colour)}`;

/** The cart line of this product in this colour, or the pending first tap. */
export function colourLine(vm: any, product: any, colour: any): any {
  if (!product) return null;
  const basket = vm.getBasket(product.type || "PHYSICAL");
  const items = (basket?.items || []).filter((item: any) => item.product_id === product.id);
  const id = colourIds[colourKey(product, colour)];
  const item =
    items.find((i: any) => (id ? i.variant_id === id : normColour(i.variant?.color) === normColour(colour))) ||
    (!id && items.length === 1 && !items[0].variant ? items[0] : null);
  if (item) return item;
  const pkey = colourKey(product, colour);
  return pkey in wanted ? { product_id: product.id, variant_id: id || null, count: 0, pending: true, pkey } : null;
}

/** Every cart line of a product (any colour or capacity). */
export function productLines(vm: any, product: any): any[] {
  if (!product) return [];
  const basket = vm.getBasket(product.type || "PHYSICAL");
  return (basket?.items || []).filter((item: any) => item.product_id === product.id);
}

/** "Add to cart" on a card with a colour picked: one more of that colour. */
export function addColour(vm: any, product: any, colour: any): Promise<any> {
  if (!mayBuy(vm)) return Promise.resolve(null);
  const line = colourLine(vm, product, colour);
  if (line && !line.pending) return stepTo(vm, product, line, shownCount(product, line) + 1);
  const pkey = colourKey(product, colour);
  wanted[pkey] = (wanted[pkey] || 0) + 1;
  if (queued.has(pkey)) return tails.get(pkey) || Promise.resolve(null);
  queued.add(pkey);
  return inTurn(pkey, () =>
    full(product).then(
      (loaded) => {
        queued.delete(pkey);
        const variants = (loaded?.product_variants || []).filter((v: any) => v.enable !== false);
        const same = variants.filter((v: any) => normColour(v.color) === normColour(colour));
        const variant = same.find((v: any) => v.quantity > 0) || same[0] || null;
        const target = wanted[pkey] ?? 0;
        if (!variant || target <= 0) {
          delete wanted[pkey];
          return null;
        }
        colourIds[pkey] = variant.id;
        const existing = basketLine(vm, loaded, variant);
        return add(vm, loaded, variant, (existing?.count || 0) + target, null).finally(() => delete wanted[pkey]);
      },
      (error) => {
        queued.delete(pkey);
        delete wanted[pkey];
        throw error;
      },
    ),
  ).catch(() => null);
}
