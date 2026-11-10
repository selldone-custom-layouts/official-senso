<!--
  Senso — the "Shop" mega menu: every category on the left (its picture,
  name, and "Up to $X off" or "From $Y"); on the right the pointed
  category's top deals as four small cards and its photo tile. Opened by a
  click on "Shop" and closed by a second one (KalioHeader); no dark scrim.
-->
<template>
  <div class="sn-mega" @keydown.esc="$emit('close')">
    <nav aria-label="Categories" class="sn-mega__list">
      <router-link
        v-for="c in cats"
        :key="c.id"
        :class="{ '-on': active && active.id === c.id }"
        :to="route(c)"
        class="sn-mega__cat"
        @click="$emit('close')"
        @focus="active = c"
        @mouseenter="active = c"
      >
        <span class="sn-mega__ring"><img v-if="c.icon" :src="image(c)" alt="" loading="lazy" /></span>
        <span class="sn-mega__name"><b>{{ c.title || c.name }}</b><small>{{ line(c) }}</small></span>
        <senso-icon name="chevron_right" size="18" />
      </router-link>
      <router-link :to="allRoute" class="sn-mega__all" @click="$emit('close')">All products<senso-icon name="arrow_forward" size="18" /></router-link>
    </nav>

    <div v-if="active" class="sn-mega__side">
      <div class="sn-mega__head">
        <h3>{{ active.title || active.name }}</h3>
        <router-link :to="route(active)" class="sn-more" @click="$emit('close')">Shop all<senso-icon name="chevron_right" size="18" /></router-link>
      </div>
      <div class="sn-mega__deals">
        <router-link v-for="p in picks" :key="p.id" :to="productRoute(p)" class="sn-mega__p" @click="$emit('close')">
          <span class="sn-mega__pimg"><img :src="pimage(p)" alt="" loading="lazy" /></span>
          <span class="sn-mega__pt">{{ p.title }}</span>
          <span class="sn-mega__pp"><b>{{ m(finalOf(p), false) }}</b><em v-if="savingOf(p) > 0">Save {{ m(savingOf(p)) }}</em></span>
        </router-link>
      </div>
      <router-link :to="route(active)" class="sn-mega__photo" @click="$emit('close')">
        <senso-photo :products="inCat(active)" :src="photo(active)" shape="square" />
        <span><small>{{ line(active) }}</small><b>{{ active.title || active.name }}</b></span>
      </router-link>
    </div>
  </div>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import SensoPhoto from "./SensoPhoto.vue";
import { aisleImage, aisleRoute, aisles, catalogueRoute, productImage } from "../kalio/kalio-catalog";
import { allProducts, categoryLine, finalOf, money, photoOf, savingOf } from "./senso-home";

export default {
  name: "SensoMegaMenu",
  components: { SensoIcon, SensoPhoto },
  inject: { $shop: { default: null } },
  emits: ["close"],
  data: () => ({ cats: [], all: [], active: null }),
  computed: {
    allRoute() {
      return catalogueRoute();
    },
    picks() {
      if (!this.active) return [];
      return [...this.inCat(this.active)].sort((a, b) => savingOf(b) - savingOf(a)).slice(0, 4);
    },
  },
  mounted() {
    aisles().then((list) => {
      this.cats = list;
      if (!this.active) this.active = list[0] || null;
    });
    allProducts().then((list) => (this.all = list));
  },
  methods: {
    finalOf,
    savingOf,
    route: aisleRoute,
    image: (c) => aisleImage(c, 64),
    pimage: (p) => productImage(p, true),
    photo(c) {
      return photoOf("square", c) || photoOf("portrait", c) || photoOf("wide", c);
    },
    inCat(c) {
      return this.all.filter((p) => p.category_id === c.id);
    },
    m(n, short = true) {
      return money(n, this.$shop?.currency || "USD", short);
    },
    line(c) {
      return categoryLine(c, this.all, (n) => this.m(n));
    },
    productRoute(p) {
      return { name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: p.id } };
    },
  },
};
</script>
