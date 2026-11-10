<!--
  Senso — the hero: a photo carousel beside the Deal of the Day.

  One slide per category that has a wide photo (assets/senso/wide-<name>),
  the deepest saving first; the words sit on the photo's dark left third
  ("Up to $589 off TVs", the category's own description and brands, "Shop
  TVs deals"). On a phone the words go under the photo. Without any wide
  photo, the three categories with the deepest savings get a collage of
  their own products. It turns every 7 seconds, stops on hover or focus,
  swipes on a phone, and never moves with reduced motion.

  The Deal of the Day is one of the shop's deals, a different one each
  day. "Ends in" counts down to that deal's own end date in Selldone (the
  owner, 9 November 2026: "a real timer from Selldone"); a deal with no end
  date shows no clock.
-->
<template>
  <section v-if="busy || slides.length || dotd" class="sn-hero">
    <div
      v-if="busy || slides.length"
      :class="{ '-busy': busy }"
      aria-roledescription="carousel"
      class="sn-bill"
      @focusin="paused = true"
      @focusout="paused = false"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
    >
      <div ref="track" class="sn-bill__track" @scroll.passive="onScroll">
        <article v-for="(s, i) in slides" :key="s.category.id" :aria-label="`${i + 1} of ${slides.length}`" aria-roledescription="slide" class="sn-bill__slide">
          <senso-photo :alt="s.title" :eager="i === 0" :products="s.products" :src="s.photo" class="sn-bill__photo" shape="wide" />
          <div class="sn-bill__txt">
            <span class="sn-eyebrow"><senso-icon fill name="bolt" size="16" />{{ s.saving ? "Deals of the week" : "Top picks" }}</span>
            <h2 class="sn-bill__h">
              <template v-if="s.saving">Up to <mark>{{ money(s.saving) }} off</mark> {{ s.title }}</template>
              <template v-else>{{ s.title }} from <mark>{{ money(s.from) }}</mark></template>
            </h2>
            <p>{{ s.line }}</p>
            <router-link :to="s.to" class="sn-btn -lg">Shop {{ s.title }}{{ s.saving ? " deals" : "" }}</router-link>
          </div>
        </article>
      </div>
      <template v-if="slides.length > 1">
        <div class="sn-bill__dots">
          <button
            v-for="(s, i) in slides"
            :key="s.category.id"
            :aria-current="i === at"
            :aria-label="s.title"
            :class="{ '-on': i === at }"
            type="button"
            @click="go(i)"
          ></button>
        </div>
        <button aria-label="Previous slide" class="sn-bill__nav -l" type="button" @click="go(at - 1)"><senso-icon name="chevron_left" size="22" /></button>
        <button aria-label="Next slide" class="sn-bill__nav -r" type="button" @click="go(at + 1)"><senso-icon name="chevron_right" size="22" /></button>
      </template>
    </div>

    <article v-if="dotd" class="sn-dotd">
      <div class="sn-dotd__head">
        <h2>Deal of the Day</h2>
        <span v-if="dotdEnd" class="sn-clock"><senso-icon name="schedule" size="16" />Ends in <b>{{ dotdLeft }}</b></span>
      </div>
      <senso-card :max-swatches="6" :product="dotd" big class="-dotd" no-foot no-timer />
    </article>
  </section>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import SensoCard from "./SensoCard.vue";
import SensoPhoto from "./SensoPhoto.vue";
import { aisleRoute, aisles } from "../kalio/kalio-catalog";
import { allProducts, dealsOf, finalOf, money, photoOf, savingOf } from "./senso-home";
import { clock, dealEnd, leftText, releaseClock, useClock } from "./senso-clock";

export default {
  name: "SensoHero",
  components: { SensoIcon, SensoCard, SensoPhoto },
  inject: ["$shop"],

  emits: ["dotd"],

  data: () => ({ slides: [], dotd: null, busy: true, at: 0, paused: false, reduced: false }),

  computed: {
    /** The Deal of the Day's own end, by Selldone's dates. */
    dotdEnd() {
      return this.dotd ? dealEnd(this.dotd) : null;
    },
    dotdLeft() {
      return leftText(this.dotdEnd, clock.now);
    },
  },

  mounted() {
    this.reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    Promise.all([aisles(), allProducts()]).then(([cats, list]) => {
      this.build(cats, list);
      this.busy = false;
    });
    useClock();
    this.turnTimer = setInterval(() => {
      if (!this.paused && !this.reduced && !document.hidden && this.slides.length > 1) this.go(this.at + 1);
    }, 7000);
  },

  beforeUnmount() {
    releaseClock();
    clearInterval(this.turnTimer);
  },

  methods: {
    money(n) {
      return money(n, this.$shop?.currency || "USD", true);
    },
    build(cats, list) {
      const brandsOf = (id) => [...new Set(list.filter((p) => p.category_id === id).map((p) => p.brand).filter(Boolean))];
      const make = (c) => {
        const ps = list.filter((p) => p.category_id === c.id);
        if (!ps.length) return null;
        const saving = Math.max(0, ...ps.map(savingOf));
        const brands = brandsOf(c.id).slice(0, 3);
        const title = c.title || c.name;
        const desc = (c.description || "").trim();
        const by = brands.length ? `From ${brands.length > 1 ? brands.slice(0, -1).join(", ") + " and " + brands[brands.length - 1] : brands[0]}.` : "";
        return {
          category: c,
          title,
          saving,
          from: Math.min(...ps.map(finalOf)),
          line: [desc && !/[.!?]$/.test(desc) ? desc + "." : desc, by].filter(Boolean).join(" "),
          photo: photoOf("wide", c),
          products: [...ps].sort((a, b) => savingOf(b) - savingOf(a)),
          to: saving ? { ...aisleRoute(c), query: { filter: JSON.stringify({ only_has_discount: true }) } } : aisleRoute(c),
        };
      };
      let slides = cats.filter((c) => photoOf("wide", c)).map(make).filter(Boolean);
      if (!slides.length) slides = cats.map(make).filter(Boolean).sort((a, b) => b.saving - a.saving).slice(0, 3);
      this.slides = slides.sort((a, b) => b.saving - a.saving);

      /* The deal of the day: a different deal each day, from the twelve
         deepest savings by percent. */
      const deals = dealsOf(list)
        .filter((p) => Number(p.quantity) !== 0)
        .sort((a, b) => savingOf(b) / b.price - savingOf(a) / a.price)
        .slice(0, 12);
      if (deals.length) {
        const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
        this.dotd = deals[day % deals.length];
        this.$emit("dotd", this.dotd);
      }
    },
    go(i) {
      const n = this.slides.length;
      if (!n) return;
      this.at = ((i % n) + n) % n;
      const track = this.$refs.track;
      const slide = track?.children[this.at];
      if (track && slide) track.scrollTo({ left: slide.offsetLeft, behavior: this.reduced ? "auto" : "smooth" });
    },
    onScroll() {
      const track = this.$refs.track;
      if (!track || !track.clientWidth) return;
      this.at = Math.round(Math.abs(track.scrollLeft) / track.clientWidth);
    },
  },
};
</script>
