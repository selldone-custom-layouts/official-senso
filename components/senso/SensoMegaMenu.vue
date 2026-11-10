<!--
  Senso — a family's mega panel (TV & Display, Audio…): the family's
  categories as a clean list (line icon, name, "Up to $X off" or "From $Y"),
  "Shop all", and one featured product on a pale tile (its packshot, name
  and price). Opened by a click on the family in the header and closed by a
  second click, Esc, a click outside or a page change; no scrim.
-->
<template>
  <div class="sn-mega" @keydown.esc="$emit('close')">
    <div :class="{ '-few': family.categories.length <= 3 }" class="sn-mega__in">
      <div class="sn-mega__col">
        <p class="sn-eyebrow">{{ family.title }}</p>
        <nav :aria-label="family.title" class="sn-mega__list">
          <router-link
            v-for="c in family.categories"
            :key="c.id"
            :class="{ '-on': active && active.id === c.id }"
            :to="route(c)"
            class="sn-mega__cat"
            @click="$emit('close')"
            @focus="active = c"
            @mouseenter="active = c"
          >
            <senso-category-icon :category="c" class="sn-mega__ic" size="34" />
            <span class="sn-mega__name"><b>{{ c.title || c.name }}</b><small>{{ line(c) }}</small></span>
            <senso-icon class="sn-mega__go" name="chevron_right" size="18" />
          </router-link>
        </nav>
        <router-link :to="dealsTo" class="sn-mega__all" @click="$emit('close')">{{ family.categories.length === 1 ? `Offers in ${family.title}` : "See every offer" }}<senso-icon name="arrow_forward" size="18" /></router-link>
      </div>
      <router-link v-if="pick" :to="productRoute(pick)" class="sn-mega__feature" @click="$emit('close')">
        <span class="sn-mega__well sn-tile"><img :alt="pick.title" :src="pimage(pick)" loading="lazy" /></span>
        <span class="sn-mega__ftxt">
          <small>{{ active ? active.title || active.name : "" }}</small>
          <b>{{ pick.title }}</b>
          <span class="sn-mega__price">{{ m(finalOf(pick), false) }}<em v-if="savingOf(pick) > 0">Save {{ m(savingOf(pick)) }}</em></span>
          <span class="sn-mega__more">Learn more<senso-icon name="arrow_forward" size="16" /></span>
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import SensoCategoryIcon from "./SensoCategoryIcon.vue";
import { aisleRoute, dealsRoute, productImage } from "../kalio/kalio-catalog";
import { allProducts, bestOf, categoryLine, finalOf, money, savingOf } from "./senso-home";

export default {
  name: "SensoMegaMenu",
  components: { SensoIcon, SensoCategoryIcon },
  inject: { $shop: { default: null } },
  props: { family: { type: Object, required: true } },
  emits: ["close"],
  data: () => ({ all: [], active: null }),
  computed: {
    pick() {
      return this.active ? bestOf(this.all, this.active) : null;
    },
    dealsTo() {
      const c = this.family.categories[0];
      return this.family.categories.length === 1 && c
        ? { ...aisleRoute(c), query: { filter: JSON.stringify({ only_has_discount: true }) } }
        : dealsRoute();
    },
  },
  watch: {
    family: {
      handler(f) {
        this.active = f?.categories?.[0] || null;
      },
      immediate: true,
    },
  },
  mounted() {
    allProducts().then((list) => (this.all = list));
  },
  methods: {
    finalOf,
    savingOf,
    route: aisleRoute,
    pimage: (p) => productImage(p, false),
    m(n, short = true) {
      return money(n, null, short);
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
