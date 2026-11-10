<!--
  Senso — "Compare with similar" on the product page: this product and up
  to three others from its category (the nearest in price, in stock first),
  side by side: picture, name, price with its saving, and the rows of spec
  they share (the shop's own keys, six at most). Each column has its
  button; "Compare in detail" opens the compare page with all four. With no
  other product in the category, the section is not drawn.
-->
<template>
  <section v-if="others.length" id="sn-similar" aria-labelledby="sn-sim-h" class="sn-sec sn-sim">
    <header class="sn-head">
      <div>
        <p class="sn-eyebrow">Compare</p>
        <h2 id="sn-sim-h">Compare with similar</h2>
      </div>
      <div class="sn-head__end">
        <router-link :to="compareTo" class="sn-more">Compare in detail<senso-icon name="arrow_forward" size="18" /></router-link>
      </div>
    </header>
    <div class="sn-sim__scroll">
      <table :style="{ '--n': cols.length }" class="sn-sim__table">
        <thead>
          <tr>
            <th aria-hidden="true" class="sn-sim__corner"></th>
            <th v-for="(p, i) in cols" :key="p.id" :class="{ '-this': i === 0 }" scope="col">
              <p class="sn-sim__tag">{{ i === 0 ? "This product" : " " }}</p>
              <router-link :to="route(p)" class="sn-sim__img sn-tile"><img :alt="p.title" :src="image(p)" loading="lazy" /></router-link>
              <router-link :to="route(p)" class="sn-sim__t">{{ p.title }}</router-link>
              <span class="sn-sim__p"><b>{{ fmt(finalOf(p)) }}</b><em v-if="savingOf(p) > 0" class="sn-save">Save {{ fmt(savingOf(p), true) }}</em></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="key in keys" :key="key">
            <th scope="row">{{ key }}</th>
            <td v-for="(p, i) in cols" :key="p.id" :class="{ '-this': i === 0 }">{{ value(p, key) || "—" }}</td>
          </tr>
          <tr class="sn-sim__acts">
            <th aria-hidden="true"></th>
            <td v-for="(p, i) in cols" :key="p.id" :class="{ '-this': i === 0 }">
              <span v-if="i === 0" class="sn-sim__here"><senso-icon name="check" size="16" />You’re viewing</span>
              <router-link v-else :to="route(p)" class="sn-btn -line -sm">Learn more</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import CurrencyMixin from "@selldone/components-vue/mixin/currency/CurrencyMixin.ts";
import SensoIcon from "./SensoIcon.vue";
import { productImage } from "../kalio/kalio-catalog";
import { compareListParam, specValue } from "../kalio/compare/kalio-compare";
import { allProducts, finalOf, money, savingOf } from "./senso-home";
import { currentCurrency } from "../region-switcher/region";

export default {
  name: "SensoSimilar",
  components: { SensoIcon },
  mixins: [CurrencyMixin],
  props: { product: { type: Object, required: true } },
  data: () => ({ all: [] }),
  computed: {
    currency() {
      return currentCurrency();
    },
    /** The product as the full list has it (spec and variants), else as given. */
    self() {
      return this.all.find((p) => p.id === this.product.id) || this.product;
    },
    others() {
      const price = finalOf(this.self);
      const inStock = (p) => (p.quantity == null || Number(p.quantity) > 0 ? 1 : 0);
      return this.all
        .filter((p) => p.category_id === this.product.category_id && p.id !== this.product.id)
        .sort((a, b) => inStock(b) - inStock(a) || Math.abs(finalOf(a) - price) - Math.abs(finalOf(b) - price))
        .slice(0, 3);
    },
    cols() {
      return [this.self, ...this.others];
    },
    /** The spec keys most of the columns have, in this product's order. */
    keys() {
      const spec = this.self?.spec || {};
      const order = Array.isArray(spec.spec_order) && spec.spec_order.length ? spec.spec_order : Object.keys(spec);
      return order
        .filter((k) => k !== "spec_order" && spec[k] !== "group" && !/^(product name|colou?r options?)$/i.test(k))
        .filter((k) => this.cols.filter((p) => specValue(p, k)).length >= Math.min(2, this.cols.length))
        .slice(0, 6);
    },
    compareTo() {
      return { name: window.$storefront.routes.COMPARISON_PAGE, query: { list: compareListParam(this.cols.map((p) => ({ p: p.id, v: null }))) } };
    },
  },
  mounted() {
    allProducts().then((list) => (this.all = list));
  },
  methods: {
    finalOf,
    savingOf,
    value: specValue,
    image: (p) => productImage(p),
    fmt(n, short = false) {
      // finalOf/savingOf are raw list amounts in the shop's base currency: converted, never relabelled.
      return money(n, null, short && Math.abs(n - Math.round(n)) < 0.005);
    },
    route(p) {
      return { name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: p.id } };
    },
  },
};
</script>
