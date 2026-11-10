<!--
  Senso — "Frequently bought together" on the product page: this product
  and two partners, a "+" between them, the price for all three and "Add
  all three". Selldone gives a storefront no bought-together data, so the
  partners are the best sellers of the neighbouring categories (in the
  shop's own category order), each one that a single tap can add (it comes
  in colours, not capacities). A box per item takes it out of the bundle.
-->
<template>
  <section v-if="items.length > 1" aria-labelledby="sn-fbt-h" class="sn-sec sn-fbt">
    <header class="sn-head"><div><p class="sn-eyebrow">Complete the setup</p><h2 id="sn-fbt-h">Frequently bought together</h2></div></header>
    <div class="sn-fbt__row">
      <template v-for="(it, i) in items" :key="it.p.id">
        <span v-if="i" aria-hidden="true" class="sn-fbt__plus"><senso-icon name="add" size="20" /></span>
        <div :class="{ '-off': !it.on }" class="sn-fbt__item">
          <router-link :to="route(it.p)" class="sn-fbt__img"><img :src="image(it.p)" alt="" loading="lazy" /></router-link>
          <div class="sn-fbt__txt">
            <small>{{ i === 0 ? "This item" : catName(it.p) }}</small>
            <router-link :to="route(it.p)" class="sn-fbt__t">{{ it.p.title }}</router-link>
            <span class="sn-fbt__p"><b>{{ fmt(finalOf(it.p)) }}</b><em v-if="savingOf(it.p) > 0" class="sn-save">Save {{ fmt(savingOf(it.p), true) }}</em></span>
            <label class="sn-check">
              <input v-model="it.on" type="checkbox" />
              <i><senso-icon name="check" size="15" /></i>
              <span>Include</span>
            </label>
          </div>
        </div>
      </template>
      <div class="sn-fbt__sum">
        <small>Price for {{ picked.length === items.length ? "all " + words[items.length] : picked.length + " selected" }}</small>
        <b>{{ fmt(total) }}</b>
        <span v-if="saved > 0" class="sn-save">Save {{ fmt(saved, true) }}</span>
        <button :disabled="!picked.length || busy" class="sn-btn -block" type="button" @click="addAll">
          <senso-icon name="add_shopping_cart" size="19" />{{ done ? "Added — see your cart" : picked.length === items.length ? "Add all " + words[items.length] : "Add selected" }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import { aisleIndex, aisles, productImage } from "../kalio/kalio-catalog";
import { addColour, quickAdd } from "../kalio/kalio-basket";
import { allProducts, finalOf, money, savingOf } from "./senso-home";
import { openQuickBuy } from "./senso-quick";

const hasCapacity = (p) => (p.variants || p.product_variants || []).some((v) => v.volume);
const firstColour = (p) => (p.variants || p.product_variants || []).find((v) => v.color)?.color || null;

export default {
  name: "SensoFbt",
  components: { SensoIcon },
  inject: { $shop: { default: null } },
  props: { product: { type: Object, required: true } },
  data: () => ({ items: [], cats: new Map(), busy: false, done: false, words: ["", "one", "two", "three"] }),
  computed: {
    picked() {
      return this.items.filter((it) => it.on);
    },
    total() {
      return this.picked.reduce((s, it) => s + finalOf(it.p), 0);
    },
    saved() {
      return this.picked.reduce((s, it) => s + savingOf(it.p), 0);
    },
  },
  watch: {
    "product.id": { handler: "build", immediate: true },
  },
  methods: {
    finalOf,
    savingOf,
    fmt(n, short = false) {
      return money(n, this.$shop?.currency || "USD", short && Math.abs(n - Math.round(n)) < 0.005);
    },
    image: (p) => productImage(p, true),
    route: (p) => ({ name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: p.id } }),
    catName(p) {
      const c = this.cats.get(p.category_id);
      return c ? c.title || c.name : "";
    },
    build() {
      this.done = false;
      Promise.all([aisles(), allProducts(), aisleIndex()]).then(([cats, list, index]) => {
        this.cats = index;
        const me = list.find((p) => p.id === this.product.id) || this.product;
        const at = cats.findIndex((c) => c.id === me.category_id);
        const order = [];
        for (let d = 1; d < cats.length; d++) {
          if (cats[at + d]) order.push(cats[at + d]);
          if (cats[at - d]) order.push(cats[at - d]);
        }
        const partners = [];
        for (const c of order) {
          if (partners.length >= 2) break;
          const best = list
            .filter((p) => p.category_id === c.id && Number(p.quantity) > 0 && !hasCapacity(p))
            .sort((a, b) => (b.sells || 0) - (a.sells || 0) || savingOf(b) - savingOf(a))[0];
          if (best) partners.push(best);
        }
        this.items = [me, ...partners].map((p) => ({ p, on: true }));
      });
    },
    async addAll() {
      this.busy = true;
      try {
        for (const it of this.picked) {
          const colour = firstColour(it.p);
          if (hasCapacity(it.p)) openQuickBuy(it.p);
          else if (colour) await addColour(this, it.p, colour);
          else await quickAdd(this, it.p, openQuickBuy);
        }
        this.done = true;
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>
