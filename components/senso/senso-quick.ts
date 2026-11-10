/*
 * Senso — one quick-buy sheet for the whole site.
 *
 * A card anywhere (home, a category, the product page's rows, the cart's
 * "Often added") opens the same sheet for a product that comes in
 * capacities: each capacity has its own price, so it is picked there
 * (KalioQuickBuy, with its X). The sheet is mounted once by SensoQuickHost
 * in the layout; the catalogue's own "+" is routed to it too
 * (kalio-listing-quick-buy.ts).
 */
import { reactive } from "vue";

export const quickSheet = reactive<{ open: boolean; product: any }>({ open: false, product: null });

export function openQuickBuy(product: any): void {
  quickSheet.product = product;
  quickSheet.open = true;
}

/* Saved (wishlist) state the cards learned this visit: the list sends no
   "saved" flag, so a heart shows what this visit did. */
export const savedIds = reactive<Record<number, boolean>>({});
