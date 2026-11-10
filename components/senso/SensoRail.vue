<!--
  Senso — a section of product cards on one line: the home's offers and
  new arrivals, a collection's tab, "You may also like".

  A teal eyebrow over the title, and round prev / next buttons at the top
  right (both always shown; the one at an end is disabled). Four cards to a
  screen on a computer, three on a tablet, one and a bit on a phone; the
  line scrolls sideways and never breaks into a second row. Either the caller passes the products (`items`), or the rail
  reads them itself (category, sort, filter, tags). A rail with nothing to
  show renders nothing; `lazy` rails wait until they are near the screen.
-->
<template>
  <section v-if="busy || shown.length" ref="root" :aria-labelledby="headingId" :class="{ '-ground': ground }" class="sn-sec sn-railsec">
    <header class="sn-head">
      <div>
        <p v-if="eyebrow" class="sn-eyebrow">{{ eyebrow }}</p>
        <h2 :id="headingId">{{ title }}</h2>
      </div>
      <div class="sn-head__end">
        <router-link v-if="moreTo" :to="moreTo" class="sn-more">{{ moreLabel }}<senso-icon name="arrow_forward" size="18" /></router-link>
        <button :disabled="at_start" aria-label="Scroll back" class="sn-arrowbtn" type="button" @click="scrollBy(-1)">
          <senso-icon name="chevron_left" size="22" />
        </button>
        <button :disabled="at_end" aria-label="Scroll forward" class="sn-arrowbtn" type="button" @click="scrollBy(1)">
          <senso-icon name="chevron_right" size="22" />
        </button>
      </div>
    </header>
    <div class="sn-rail">
      <div ref="track" class="sn-rail__track" @scroll.passive="measure">
        <template v-if="busy">
          <div v-for="n in 6" :key="'s' + n" aria-hidden="true" class="sn-skel"><i></i><b></b><b class="-short"></b></div>
        </template>
        <template v-else>
          <senso-card v-for="product in shown" :key="product.id" :product="product" />
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import SensoCard from "./SensoCard.vue";
import SensoIcon from "./SensoIcon.vue";
import { allProducts, categoryLine, mix, money, photoOf } from "./senso-home";
import { aisleRoute } from "../kalio/kalio-catalog";

let railCount = 0;

export default {
  name: "SensoRail",
  components: { SensoCard, SensoIcon },
  inject: { $shop: { default: null } },

  props: {
    title: { type: String, required: true },
    /** The small caps label over the title (DEALS, NEW…). */
    eyebrow: { type: String, default: "" },
    /** On the light grey ground (the deals band). */
    ground: Boolean,
    /** The products to show; when null the rail reads them itself. */
    items: { type: Array, default: null },
    sort: { type: String, default: "bestselling" },
    filter: { type: Object, default: null },
    dir: { type: String, default: null },
    tags: { type: Array, default: null },
    limit: { type: Number, default: 12 },
    moreTo: { type: Object, default: null },
    moreLabel: { type: String, default: "See all" },
    lazy: Boolean,
    /** Deal the products out category by category. */
    spread: Boolean,
    /** Product ids to leave out (shown elsewhere, or the page's own). */
    exclude: { type: Array, default: () => [] },
    /** The caller is still reading the products it will pass: skeletons, no fetch. */
    pending: Boolean,
    /** A category whose photo tile fills a short row (fewer than six). */
    photoCategory: { type: Object, default: null },
  },

  emits: ["loaded"],

  data() {
    return {
      headingId: `sn-rail-${++railCount}`,
      fetched: [],
      busy: this.items === null || this.pending,
      all: [],
      at_start: true,
      at_end: false,
    };
  },

  computed: {
    source() {
      return this.items !== null ? this.items : this.fetched;
    },
    /** The photo tile of a short row: as wide as the cards missing. */
    tile() {
      const c = this.photoCategory;
      const n = this.shown.length;
      if (!c || this.busy || !n || n >= 6) return null;
      const photo = photoOf("square", c) || photoOf("portrait", c) || photoOf("wide", c);
      const span = Math.min(3, 6 - n);
      return {
        span,
        photo: span > 2 ? photoOf("wide", c) || photo : photo,
        title: c.title || c.name,
        line: categoryLine(c, this.all, (v) => money(v, null, true)),
        to: aisleRoute(c),
      };
    },
    shown() {
      const skip = new Set(this.exclude.map(String));
      const list = this.source.filter((p) => p && !skip.has(String(p.id)));
      return (this.spread ? mix(list, this.limit) : list).slice(0, this.limit);
    },
  },

  watch: {
    photoCategory: {
      handler(c) {
        if (c) allProducts().then((list) => (this.all = list));
      },
      immediate: true,
    },
    /* A new list starts at its first card. (A browser keeps a snapped
       card in view when the list under it changes, so a rail whose cards
       were replaced could open scrolled to its end.) */
    shown() {
      this.$nextTick(() => {
        if (this.$refs.track) this.$refs.track.scrollLeft = 0;
        this.measure();
      });
    },
    pending(now) {
      if (!now && this.items !== null) this.busy = false;
    },
  },

  mounted() {
    if (this.items !== null || this.pending) {
      if (!this.pending) this.busy = false;
      this.$nextTick(this.measure);
      return;
    }
    if (this.lazy && "IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            this.observer.disconnect();
            this.fetch();
          }
        },
        { rootMargin: "600px 0px" },
      );
      this.observer.observe(this.$refs.root);
    } else this.fetch();
    this.onResize = () => this.measure();
    window.addEventListener("resize", this.onResize, { passive: true });
  },

  beforeUnmount() {
    this.observer?.disconnect();
    if (this.onResize) window.removeEventListener("resize", this.onResize);
  },

  methods: {
    fetch() {
      this.busy = true;
      const options = { products_only: true, sort: this.sort };
      if (this.filter) options.filter = JSON.stringify(this.filter);
      if (this.tags?.length) options.tags = this.tags;
      window.$storefront.products
        .list(this.dir, 0, this.limit + this.exclude.length + (this.spread ? 24 : 0), options)
        .then(({ products }) => (this.fetched = products || []))
        .catch(() => (this.fetched = []))
        .finally(() => {
          this.busy = false;
          this.$emit("loaded", this.shown);
        });
    },
    scrollBy(dir) {
      const track = this.$refs.track;
      if (!track) return;
      const rtl = getComputedStyle(track).direction === "rtl";
      track.scrollBy({ left: (rtl ? -dir : dir) * Math.round(track.clientWidth * 0.92), behavior: "smooth" });
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
