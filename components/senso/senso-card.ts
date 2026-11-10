/*
 * Senso — every listing draws Senso's card (with "Learn more").
 *
 * SProductsListing (a category, the catalogue, a search, the deals) draws
 * Selldone's SShopProductCard for each product. Its render is replaced here,
 * once, before the first card mounts, by SensoCard with the same product:
 * the swatches, Save chip, "Add to cart" that turns into − n + in place,
 * "Choose capacity", Compare and Save look and behave as on the home page.
 * The listing's own attributes (its column classes, its click for
 * analytics) fall through to the card. Imported by the shop page.
 */
import { h } from "vue";
import SShopProductCard from "@selldone/components-vue/storefront/product/card/SShopProductCard.vue";
import SensoCard from "./SensoCard.vue";

const card: any = SShopProductCard;

if (!card.__senso) {
  card.__senso = true;
  card.render = function (this: any) {
    return h(SensoCard, { product: this.product, learn: true, class: "-listed" });
  };
}
