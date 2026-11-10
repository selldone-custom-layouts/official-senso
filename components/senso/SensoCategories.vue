<!--
  Senso — "Shop by category": every category as a big circle with its
  picture, in two even rows. The owner's rule (9 November 2026): both rows
  hold the same number of tiles and no slot is left empty — an "All
  categories" tile (a blue circle) makes an odd count even, and past 16 the
  first 15 show with it (categoryTiles in senso-home.ts). On a phone the
  two rows swipe sideways.
-->
<template>
  <section v-if="tiles.shown.length" aria-labelledby="sn-cats-h" class="sn-sec">
    <header class="sn-head">
      <h2 id="sn-cats-h">{{ title }}</h2>
      <router-link v-if="!tiles.all" :to="allRoute" class="sn-more">All products<senso-icon name="chevron_right" size="20" /></router-link>
    </header>
    <div :style="{ '--cols': tiles.cols }" class="sn-cats">
      <router-link v-for="c in tiles.shown" :key="c.id" :to="route(c)" class="sn-cat">
        <span class="sn-cat__ring"><img v-if="c.icon" :src="image(c)" alt="" loading="lazy" /></span>
        <b>{{ c.title || c.name }}</b>
      </router-link>
      <router-link v-if="tiles.all" :to="allRoute" class="sn-cat -all">
        <span class="sn-cat__ring"><senso-icon name="apps" size="40" /></span>
        <b>All categories</b>
      </router-link>
    </div>
  </section>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import { aisleImage, aisleRoute, aisles, catalogueRoute } from "../kalio/kalio-catalog";
import { categoryTiles } from "./senso-home";

export default {
  name: "SensoCategories",
  components: { SensoIcon },
  props: {
    title: { type: String, default: "Shop by category" },
    /** Categories to show; when null, the shop's own. */
    list: { type: Array, default: null },
  },
  data: () => ({ cats: [] }),
  computed: {
    tiles() {
      return categoryTiles(this.list || this.cats);
    },
    allRoute() {
      return catalogueRoute();
    },
  },
  mounted() {
    if (!this.list) aisles().then((list) => (this.cats = list));
  },
  methods: {
    route: aisleRoute,
    image: (c) => aisleImage(c, 256),
  },
};
</script>
