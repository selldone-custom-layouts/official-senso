<!--
  Senso — COLLECTIONS: one tab per tag the shop's products carry, each tab a
  line of cards. The best-seller tag comes first ("Best sellers"); every
  other tag in use gets its own tab named after it ("Wireless", "4K"), so a
  new tag on a product makes a new tab with no code change, and a tag with
  no products shows nothing. The new-arrival tag has its own section (NEW).
  With no tag at all the section is not drawn.
-->
<template>
  <section v-if="tabs.length" aria-labelledby="sn-col-h" class="sn-sec sn-railsec sn-cols">
    <header class="sn-head">
      <div>
        <p class="sn-eyebrow">Collections</p>
        <h2 id="sn-col-h">Picked for how you use it</h2>
      </div>
      <div class="sn-head__end">
        <button :disabled="at_start" aria-label="Scroll back" class="sn-arrowbtn" type="button" @click="scrollBy(-1)"><senso-icon name="chevron_left" size="22" /></button>
        <button :disabled="at_end" aria-label="Scroll forward" class="sn-arrowbtn" type="button" @click="scrollBy(1)"><senso-icon name="chevron_right" size="22" /></button>
      </div>
    </header>
    <div aria-label="Collections" class="sn-tabs" role="tablist" @keydown.left.prevent="move(-1)" @keydown.right.prevent="move(1)">
      <button
        v-for="(t, i) in tabs"
        :key="t.tag"
        :aria-selected="i === at"
        :class="{ '-on': i === at }"
        :tabindex="i === at ? 0 : -1"
        class="sn-tabs__tab"
        role="tab"
        type="button"
        @click="pick(i)"
      >
        {{ t.label }}
      </button>
    </div>
    <div :aria-label="current.title" class="sn-rail" role="tabpanel">
      <div ref="track" class="sn-rail__track" @scroll.passive="measure">
        <senso-card v-for="p in current.products" :key="current.tag + p.id" :product="p" />
      </div>
    </div>
  </section>
</template>

<script>
import SensoCard from "./SensoCard.vue";
import SensoIcon from "./SensoIcon.vue";
import { isBestSellerTag, isNewTag, mix, tagIndex, tagTitle } from "./senso-home";

export default {
  name: "SensoCollections",
  components: { SensoCard, SensoIcon },
  props: {
    /** Product ids shown just above, kept out where a tab has enough without them. */
    exclude: { type: Array, default: () => [] },
  },
  data: () => ({ byTag: new Map(), at: 0, at_start: true, at_end: false }),
  computed: {
    tabs() {
      const out = [];
      for (const [tag, list] of this.byTag) {
        if (isNewTag(tag) || !list.length) continue;
        const best = isBestSellerTag(tag);
        out.push({ tag, best, label: best ? "Best sellers" : tagTitle(tag), title: best ? "Best sellers" : `${tagTitle(tag)} Items`, products: mix(list, 12) });
      }
      return out.sort((a, b) => Number(b.best) - Number(a.best) || b.products.length - a.products.length);
    },
    current() {
      return this.tabs[this.at] || this.tabs[0] || { tag: "", products: [] };
    },
  },
  watch: {
    at() {
      this.$nextTick(() => {
        if (this.$refs.track) this.$refs.track.scrollLeft = 0;
        this.measure();
      });
    },
    tabs() {
      this.$nextTick(this.measure);
    },
  },
  mounted() {
    tagIndex().then(({ byTag }) => (this.byTag = byTag));
    this.onResize = () => this.measure();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    pick(i) {
      this.at = i;
    },
    move(d) {
      const n = this.tabs.length;
      this.at = (this.at + d + n) % n;
      this.$nextTick(() => this.$el.querySelector(".sn-tabs__tab.-on")?.focus());
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
