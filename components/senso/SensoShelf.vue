<!--
  Senso — CATEGORY "Shop the latest": a sideways line of white rounded
  tiles, one per category, each a thin line icon (picked by the category's
  own name, senso-icons.ts) and the category's name. Round prev / next
  buttons at the top right, both always shown. Every category of the shop,
  read live. With `grid` the tiles wrap into even rows instead (the 404,
  About): an odd count gets an "All products" tile so no row is half full.
-->
<template>
  <section v-if="cats.length" :class="{ '-grid': grid }" aria-labelledby="sn-shelf-h" class="sn-sec sn-shelf">
    <header class="sn-head">
      <div>
        <p class="sn-eyebrow">{{ eyebrowText }}</p>
        <h2 id="sn-shelf-h">{{ titleText }}</h2>
      </div>
      <div v-if="!grid" class="sn-head__end">
        <button :aria-label="t('rail.scrollBack', 'Scroll back')" :disabled="at_start" class="sn-arrowbtn" type="button" @click="scrollBy(-1)"><senso-icon name="chevron_left" size="22" /></button>
        <button :aria-label="t('rail.scrollForward', 'Scroll forward')" :disabled="at_end" class="sn-arrowbtn" type="button" @click="scrollBy(1)"><senso-icon name="chevron_right" size="22" /></button>
      </div>
    </header>
    <nav ref="track" :aria-label="titleText" :style="grid ? { '--cols': tiles.cols } : null" class="sn-shelf__track" @scroll.passive="measure">
      <router-link v-for="c in tiles.shown" :key="c.id" :to="route(c)" class="sn-shelf__tile">
        <senso-category-icon :category="c" class="sn-shelf__ic" size="52" />
        <span>{{ c.title || c.name }}</span>
      </router-link>
      <router-link v-if="tiles.all" :to="allRoute" class="sn-shelf__tile -all">
        <senso-icon class="sn-shelf__ic" name="apps" size="44" />
        <span>{{ t("listing.allProducts", "All products") }}</span>
      </router-link>
    </nav>
  </section>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import SensoCategoryIcon from "./SensoCategoryIcon.vue";
import { aisleRoute, aisles, catalogueRoute } from "../kalio/kalio-catalog";
import { categoryTiles } from "./senso-home";
import { t } from "../kalio/i18n/kalio-i18n";

export default {
  name: "SensoShelf",
  components: { SensoIcon, SensoCategoryIcon },
  props: {
    /* Empty: Senso's own words, in the visitor's language. */
    eyebrow: { type: String, default: "" },
    title: { type: String, default: "" },
    /** Even rows instead of a sideways line. */
    grid: Boolean,
  },
  data: () => ({ cats: [], at_start: true, at_end: false }),
  computed: {
    eyebrowText() {
      return this.eyebrow || t("senso.home.category", "Category");
    },
    titleText() {
      return this.title || t("senso.home.shopLatest", "Shop the latest");
    },
    tiles() {
      return this.grid ? categoryTiles(this.cats) : { shown: this.cats, all: false, cols: 0 };
    },
    allRoute() {
      return catalogueRoute();
    },
  },
  mounted() {
    aisles().then((list) => {
      this.cats = list;
      this.$nextTick(this.measure);
    });
    this.onResize = () => this.measure();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    route: aisleRoute,
    scrollBy(dir) {
      const track = this.$refs.track;
      if (!track) return;
      const rtl = getComputedStyle(track).direction === "rtl";
      track.scrollBy({ left: (rtl ? -dir : dir) * Math.round(track.clientWidth * 0.8), behavior: "smooth" });
    },
    measure() {
      const track = this.$refs.track;
      if (!track) return;
      const travelled = Math.abs(track.scrollLeft);
      this.at_start = travelled < 4;
      this.at_end = travelled + track.clientWidth >= track.scrollWidth - 4;
    },
  },
};
</script>
