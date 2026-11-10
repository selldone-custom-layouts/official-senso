<!--
  Senso — "Shop by brand": one row of brand tiles (the brand's name and
  its best-selling product), "See all brands" opens the other rows. Each
  tile searches the shop for the brand. Rows are always full.
-->
<template>
  <section v-if="brands.length" aria-labelledby="sn-brands-h" class="sn-sec">
    <header class="sn-head">
      <h2 id="sn-brands-h">{{ title }}</h2>
      <button v-if="brands.length > perRow" class="sn-more" type="button" @click="open = !open">
        {{ open ? "Show fewer" : "See all brands" }}<senso-icon :name="open ? 'expand_less' : 'expand_more'" size="20" />
      </button>
    </header>
    <div :style="{ '--cols': cols }" class="sn-brands">
      <router-link v-for="b in shown" :key="b.name" :to="route(b)" class="sn-brand">
        <b>{{ b.name }}</b>
        <img v-if="b.top" :src="image(b.top)" alt="" loading="lazy" />
      </router-link>
    </div>
  </section>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import { catalogueRoute, productImage } from "../kalio/kalio-catalog";
import { allProducts } from "./senso-home";

export default {
  name: "SensoBrands",
  components: { SensoIcon },
  props: { title: { type: String, default: "Shop by brand" } },
  data: () => ({ brands: [], open: false, perRow: 8 }),
  computed: {
    shown() {
      return this.open ? this.brands : this.brands.slice(0, this.perRow);
    },
    /* Open, the rows stay full: the widest column count that divides the
       brands evenly (down to half a row), else a full first row. */
    cols() {
      if (!this.open) return this.perRow;
      const n = this.brands.length;
      for (let c = this.perRow; c >= Math.ceil(this.perRow / 2); c--) if (n % c === 0) return c;
      return this.perRow;
    },
  },
  mounted() {
    this.fit();
    this.onResize = () => this.fit();
    window.addEventListener("resize", this.onResize, { passive: true });
    allProducts().then((list) => {
      const map = new Map();
      for (const p of list) {
        if (!p.brand) continue;
        if (!map.has(p.brand)) map.set(p.brand, { name: p.brand, top: p, n: 0 });
        map.get(p.brand).n++;
      }
      this.brands = [...map.values()].sort((a, b) => b.n - a.n);
    });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    fit() {
      const w = window.innerWidth;
      this.perRow = w < 900 ? 4 : w < 1280 ? 4 : 8;
    },
    image: (p) => productImage(p, true),
    route(b) {
      return catalogueRoute({ search: b.name });
    },
  },
};
</script>
