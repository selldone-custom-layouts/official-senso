<!--
  Kalio — "Often added".

  A few products to add with one tap, under the basket (the drawer and the
  basket page): none already in the basket, none that needs a size chosen,
  in stock; first from the aisles the basket already has, best deal first.
  Each "+" adds straight away (quickAdd in kalio-basket.ts) and turns into a
  spinner until the basket answers; the product then leaves the row and the
  next one takes its place.
-->
<template>
  <div v-if="suggestions.length" class="k-often">
    <p class="k-eyebrow k-often__label">Often added</p>
    <div :style="{ '--k-often-cols': count }" class="k-often__row">
      <div v-for="product in suggestions" :key="product.id" class="k-often__item">
        <div class="k-often__pic">
          <router-link :aria-label="product.title" :to="productRoute(product.id)" @click="$emit('navigate')">
            <img v-if="image(product)" :src="image(product)" :srcset="srcset(product)" alt="" loading="lazy" sizes="(max-width: 600px) 30vw, 160px" @error="dropSrcset" />
          </router-link>
          <button
            :aria-label="`Add ${product.title}`"
            :disabled="adding(product)"
            class="k-often__add"
            type="button"
            @click="add(product)"
          >
            <v-progress-circular v-if="adding(product)" indeterminate size="16" width="2" />
            <v-icon v-else size="18">add</v-icon>
          </button>
        </div>
        <router-link :to="productRoute(product.id)" class="k-often__name" @click="$emit('navigate')">
          {{ product.title }}
        </router-link>
        <u-price :amount="priceOf(product).now" :currency="currency" class="k-often__price" />
      </div>
    </div>
  </div>
</template>

<script>
import CurrencyMixin from "@selldone/components-vue/mixin/currency/CurrencyMixin.ts";
import { addColour, colourLine, pendingLine, quickAdd } from "./kalio-basket";
import { priceOf, productImage, productSrcset, dropSrcset } from "./kalio-catalog";
import { allProducts, savingOf } from "../senso/senso-home";

/* Senso: every product comes in colours or capacities. One with
   capacities needs its capacity picked (each has its own price), so it is
   not offered here; one with colours goes in, in its first colour. */
const capacities = (p) => (p.product_variants || p.variants || []).some((v) => v.volume);
const firstColour = (p) => (p.product_variants || p.variants || []).find((v) => v.color)?.color || null;

export default {
  name: "KalioOftenAdded",
  mixins: [CurrencyMixin],
  inject: ["$shop"],

  props: {
    /** How many to show (and columns on a wide screen). */
    count: { type: Number, default: 3 },
  },

  /* navigate: a product was opened (the drawer closes). */
  emits: ["navigate"],

  data() {
    return {
      catalogue: [],
    };
  },

  computed: {
    currency() {
      return this.GetUserSelectedCurrency()?.code;
    },

    basketItems() {
      return this.getBaskets().flatMap((basket) => basket?.items || []);
    },

    suggestions() {
      if (!this.catalogue.length) return [];
      const inBasket = new Set(this.basketItems.map((item) => item.product_id));
      const aisles = new Set(this.basketItems.map((item) => item.product?.category_id).filter(Boolean));
      return this.catalogue
        .filter((product) => !inBasket.has(product.id) && !capacities(product) && product.quantity > 0)
        .map((product) => ({
          product,
          near: aisles.has(product.category_id) ? 1 : 0,
          off: product.price ? savingOf(product) / product.price : 0,
        }))
        .sort((a, b) => b.near - a.near || b.off - a.off || a.product.id - b.product.id)
        .slice(0, this.count)
        .map(({ product }) => product);
    },
  },

  created() {
    allProducts().then((list) => (this.catalogue = list));
  },

  methods: {
    srcset(product) {
      return productSrcset(product);
    },
    dropSrcset,
    image(product) {
      return productImage(product, true);
    },

    priceOf(product) {
      return priceOf(this.$shop, product, this.currency);
    },

    /* Its "+" was pressed and the basket has not answered yet. */
    adding(product) {
      const colour = firstColour(product);
      return colour ? !!colourLine(this, product, colour)?.pending : !!pendingLine(product);
    },

    add(product) {
      const colour = firstColour(product);
      if (colour) return addColour(this, product, colour);
      quickAdd(this, product, (picked) => {
        this.$emit("navigate");
        this.$router.push(this.productRoute(picked.id));
      });
    },

    productRoute(id) {
      return { name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: id } };
    },
  },
};
</script>
