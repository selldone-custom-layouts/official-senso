/*
 * Senso — every listing draws Senso's card (with "Learn more").
 *
 * SProductsListing (a category, the catalogue, a search, the deals) draws
 * Selldone's SShopProductCard for each product. Its render is replaced here,
 * once, before the first card mounts, by SensoCard with the same product:
 * the swatches, Save chip, "Add to cart" that turns into − n + in place,
 * "Choose options", Compare and Save look and behave as on the home page.
 *
 * Only the listing's listeners reach the card (its click for analytics,
 * hover). Its classes do not: the listing hands each card Vuetify's column
 * and utility classes (v-col-12 … pa-0), and `.pa-0 { padding: 0 !important }`
 * wiped the card's own padding, so every listing card's content touched its
 * edge (owner's report, 1.0.3). Senso's grid sizes the columns itself.
 * Imported by the shop page.
 */
import { h } from "vue";
import SShopProductCard from "@selldone/components-vue/storefront/product/card/SShopProductCard.vue";
import SensoCard from "./SensoCard.vue";

const card: any = SShopProductCard;

if (!card.__senso) {
  card.__senso = true;
  card.inheritAttrs = false;
  card.render = function (this: any) {
    const a = this.$attrs || {};
    const listeners: Record<string, any> = {};
    for (const key of Object.keys(a)) if (/^on[A-Z]/.test(key)) listeners[key] = a[key];
    return h(SensoCard, { product: this.product, learn: true, class: "-listed", ...listeners });
  };
}
