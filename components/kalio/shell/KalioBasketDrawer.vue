<!--
  Senso — the cart drawer (design C, the owner's pick in Molino, in
  Senso's dress).

  A receipt first: Subtotal, what the shopper saves (red), delivery
  "calculated at checkout", the total, and a blue Checkout (not stretched
  across the drawer) beside "View cart". Then the cart in compact rows
  (picture, name, the colour as a swatch or the capacity, price, − n +, a
  remove button), and three products often added (KalioOftenAdded). One
  shop, one list: no seller headings.

  The cart, its bill and the steppers are the storefront's own (getBaskets,
  kalio-basket.ts); the stepper changes the count as it is tapped and the
  bill follows. A cart of another type (a file or a service) gets its own
  receipt.
-->
<template>
  <div class="k-bdrawer sn-cdrawer">
    <section v-for="group in groups" :key="group.type" class="sn-cdrawer__group">
      <p v-if="groups.length > 1" class="sn-cdrawer__type">{{ typeName(group.type) }}</p>

      <div :class="{ '-settling': group.settling }" class="sn-receipt">
        <p class="sn-receipt__row"><span>Subtotal ({{ group.units }} {{ group.units === 1 ? "item" : "items" }})</span><span class="u--price">{{ money(group.total + group.saved, group.currency) }}</span></p>
        <p v-if="group.saved >= 0.01" class="sn-receipt__row -save"><span>You save</span><span>−<span class="u--price">{{ money(group.saved, group.currency) }}</span></span></p>
        <p class="sn-receipt__row -muted"><span>Delivery</span><span>Calculated at checkout</span></p>
        <p class="sn-receipt__row -tot"><span>Total</span><span class="u--price">{{ money(group.total, group.currency) }}</span></p>
        <div class="sn-receipt__btns">
          <router-link :to="checkoutRoute(group.type)" class="sn-btn" @click="$emit('close')">
            <v-icon size="18">lock_outline</v-icon>Checkout
          </router-link>
          <router-link :to="checkoutRoute(group.type)" class="sn-btn -line" @click="$emit('close')">View cart</router-link>
        </div>
      </div>

      <ul class="sn-cdrawer__rows">
        <li v-for="item in group.items" :key="item.id" class="sn-crow">
          <router-link :to="productRoute(item.product_id)" class="sn-crow__pic" @click="$emit('close')">
            <img v-if="image(item)" :src="image(item)" alt="" height="56" loading="lazy" width="56" />
          </router-link>
          <div class="sn-crow__mid">
            <router-link :to="productRoute(item.product_id)" class="sn-crow__name" @click="$emit('close')">{{ item.product?.title }}</router-link>
            <span v-if="item.variant" class="sn-crow__var">
              <i v-if="item.variant.color" :style="{ background: swatch(item.variant.color) }" class="sn-sw -xs"></i>
              {{ size(item) }}
            </span>
            <span class="sn-crow__price">
              <span :class="{ '-sale': item.dis > 0 }" class="u--price">{{ money(item.price * shown(item), item.currency || group.currency) }}</span>
              <s v-if="item.dis > 0"><span class="u--price">{{ money((item.price + item.dis) * shown(item), item.currency || group.currency) }}</span></s>
            </span>
          </div>
          <div class="sn-crow__side">
            <div :aria-label="`Quantity of ${item.product?.title || 'this item'}`" :class="{ '-busy': settling(item.product, item) }" class="sn-qty" role="group">
              <button :disabled="shown(item) <= 1" aria-label="One fewer" type="button" @click="step(item, -1)">
                <v-icon size="16">remove</v-icon>
              </button>
              <output aria-live="polite">{{ shown(item) }}</output>
              <button :disabled="shown(item) >= max(item)" aria-label="One more" type="button" @click="step(item, 1)">
                <v-icon size="16">add</v-icon>
              </button>
            </div>
            <button :aria-label="`Remove ${item.product?.title || 'this item'}`" class="sn-crow__rm" type="button" @click="remove(item)">
              <v-icon size="18">delete_outline</v-icon>
            </button>
          </div>
        </li>
      </ul>
    </section>
    <kalio-often-added :count="3" class="k-bdrawer__often" @navigate="$emit('close')" />
  </div>
</template>

<script>
import { ProductType } from "@selldone/core-js/enums/product/ProductType";
import { settling, shownCount, stepTo } from "../kalio-basket";
import { productImage } from "../kalio-catalog";
import KalioOftenAdded from "../KalioOftenAdded.vue";
import { money } from "../../region-switcher/region";

/* The variant in words: its capacity, weight, pack, type or style. A
   colour is drawn as a swatch beside it. */
function sizeOf(variant) {
  if (!variant) return null;
  return variant.volume || variant.weight || variant.pack || variant.type || variant.style || null;
}

export default {
  name: "KalioBasketDrawer",
  components: { KalioOftenAdded },

  emits: ["close"],

  computed: {
    groups() {
      return this.getBaskets()
        .filter((basket) => basket?.items?.length)
        .map((basket) => {
          const bill = basket.bill || {};
          const items = basket.items.filter((item) => shownCount(item.product || { id: item.product_id }, item) > 0);
          return {
            type: basket.type,
            items,
            units: basket.items.reduce((sum, item) => sum + (item.count || 0), 0),
            total: typeof bill.price === "number" ? bill.price : basket.price,
            /* From the lines, not the bill: a cart read on page load comes
               without one. */
            saved: basket.items.reduce((sum, item) => sum + (item.dis || 0) * (item.count || 0) + (item.offer_amount || 0), 0),
            currency: bill.currency || basket.currency,
            settling: basket.items.some((item) => settling(item.product || { id: item.product_id }, item)),
          };
        })
        .filter((group) => group.items.length);
    },
  },

  methods: {
    /* The cart's amounts come in the basket's currency (the server converts it
       after a currency change); money() shows them in the visitor's, so they
       are right even before the cart comes back. */
    money,
    settling,
    image(item) {
      const own = item.variant?.image;
      return own ? window.CDN.GET_SHOP_IMAGE_PATH(own, 128) : productImage(item.product, true);
    },
    size(item) {
      return sizeOf(item.variant);
    },
    swatch(c) {
      const parts = String(c)
        .split("/")
        .map((x) => (x.length === 9 ? x.slice(0, 7) : x));
      return parts.length > 1 ? `linear-gradient(135deg, ${parts[0]} 50%, ${parts[1]} 50%)` : parts[0];
    },
    typeName(type) {
      return this.$t(ProductType[type]?.name || type);
    },
    shown(item) {
      return shownCount(item.product || { id: item.product_id }, item);
    },
    max(item) {
      return item.vendor_product?.quantity ?? item.variant?.quantity ?? item.product?.quantity ?? 99;
    },
    step(item, delta) {
      const product = { id: item.product_id, type: item.product?.type };
      stepTo(this, product, item, this.shown(item) + delta);
    },
    remove(item) {
      const product = { id: item.product_id, type: item.product?.type };
      stepTo(this, product, item, 0);
    },
    productRoute(id) {
      return { name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: id } };
    },
    checkoutRoute(type) {
      return { name: window.$storefront.routes.BASKET_PAGE, params: { type } };
    },
  },
};
</script>
