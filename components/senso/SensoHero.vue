<!--
  Senso — the hero: a full-bleed carousel, about 85% of the screen's height,
  under the clear header. One slide per product family (senso-families.ts)
  that has a photo: the family's own hero photo (senso-photos.ts,
  hero-<family>) or, until it arrives, the owner's wide photo of one of its
  categories. The words sit on the photo's calm left side over a soft dark
  gradient: a huge white headline ("TVs. Made to be seen."), the category's
  own description, and an outlined white "Shop now" pill to the category.
  Round white arrows on both sides, always shown, and a thin progress bar
  at the bottom centre (one segment per slide, the current one filling).

  It turns every 7 seconds, and stops on hover or focus, when it is off the
  screen, when the tab is hidden and with reduced motion. Image and words of
  a slide change together (one element per slide, crossfaded), and the next
  slide's photo is loaded ahead. Swipes on a phone. A shop with no photo at
  all gets the families' placeholders with their best product.
-->
<template>
  <section
    v-if="busy || slides.length"
    ref="root"
    :class="{ '-busy': busy }"
    :aria-label="t('senso.hero.label', 'Featured')"
    :aria-roledescription="t('senso.hero.carousel', 'carousel')"
    class="sn-hero"
    @focusin="hover = true"
    @focusout="hover = false"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @touchend.passive="onTouchEnd"
    @touchstart.passive="onTouchStart"
  >
    <article
      v-for="(s, i) in slides"
      :key="s.key"
      :aria-hidden="i !== at"
      :aria-label="t('senso.hero.slideOf', '{n} of {total}', { n: i + 1, total: slides.length })"
      :class="{ '-on': i === at }"
      :aria-roledescription="t('senso.hero.slide', 'slide')"
      class="sn-hero__slide"
    >
      <sn-slot :alt="s.title" :eager="i === 0 || i === next" :name="s.slot" :src="s.photo" class="sn-hero__photo" fill>
        <img v-if="s.product" :alt="s.product.title" :src="s.packshot" class="sn-hero__pack" loading="lazy" />
      </sn-slot>
      <div class="sn-hero__shade"></div>
      <div class="sn-hero__txt">
        <p class="sn-hero__fam">{{ famTitle(s) }}</p>
        <h2 class="sn-hero__h">
          <bdi>{{ s.title }}.</bdi><br />{{ famLine(s) }}
        </h2>
        <p v-if="s.sub" class="sn-hero__sub">{{ s.sub }}</p>
        <router-link :tabindex="i === at ? null : -1" :to="s.to" class="sn-btn -glass -lg">{{ t("senso.hero.shopNow", "Shop now") }}</router-link>
      </div>
    </article>

    <template v-if="slides.length > 1">
      <button :aria-label="t('senso.hero.previous', 'Previous slide')" class="sn-hero__nav -l" type="button" @click="go(at - 1, true)"><senso-icon name="chevron_left" size="24" /></button>
      <button :aria-label="t('senso.hero.next', 'Next slide')" class="sn-hero__nav -r" type="button" @click="go(at + 1, true)"><senso-icon name="chevron_right" size="24" /></button>
      <div class="sn-hero__bar">
        <button
          v-for="(s, i) in slides"
          :key="s.key"
          :aria-current="i === at"
          :aria-label="t('senso.hero.slideNamed', 'Slide {n}: {title}', { n: i + 1, title: s.title })"
          :class="{ '-on': i === at, '-done': i < at, '-run': i === at && running }"
          class="sn-hero__seg"
          type="button"
          @click="go(i, true)"
        >
          <i :key="at + '-' + runKey" :style="{ animationDuration: TURN + 'ms' }"></i>
        </button>
      </div>
    </template>
  </section>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import SnSlot from "./SensoSlot.vue";
import { aisleRoute, aisles, productImage } from "../kalio/kalio-catalog";
import { allProducts, bestOf, heroState, photoOf, savingOf } from "./senso-home";
import { familiesOf, familyRule } from "./senso-families";
import { slotPhoto } from "./senso-photos";

const TURN = 7000;

export default {
  name: "SensoHero",
  components: { SensoIcon, SnSlot },
  data: () => ({ TURN, slides: [], busy: true, at: 0, hover: false, seen: true, reduced: false, runKey: 0 }),

  computed: {
    running() {
      return !this.hover && this.seen && !this.reduced && this.slides.length > 1;
    },
    next() {
      return this.slides.length ? (this.at + 1) % this.slides.length : 0;
    },
    shown() {
      return this.busy || this.slides.length > 0;
    },
  },

  watch: {
    shown: {
      immediate: true,
      handler(now) {
        heroState.shown = now;
      },
    },
    running(now) {
      clearTimeout(this.timer);
      if (now) this.schedule();
    },
  },

  mounted() {
    this.reduced = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || !!navigator.webdriver;
    Promise.all([aisles(), allProducts()]).then(([cats, list]) => {
      this.build(cats, list);
      this.busy = false;
      this.$nextTick(() => this.running && this.schedule());
    });
    if ("IntersectionObserver" in window) {
      this.io = new IntersectionObserver((e) => (this.seen = e.some((x) => x.isIntersecting)), { threshold: 0.35 });
      this.$nextTick(() => this.$refs.root && this.io.observe(this.$refs.root));
    }
    this.onVis = () => (this.seen = !document.hidden);
    document.addEventListener("visibilitychange", this.onVis);
  },

  beforeUnmount() {
    heroState.shown = false;
    clearTimeout(this.timer);
    this.io?.disconnect();
    document.removeEventListener("visibilitychange", this.onVis);
  },

  methods: {
    build(cats, list) {
      const families = familiesOf(cats);
      const count = (c) => list.filter((p) => p.category_id === c.id).length;
      const deals = (c) => list.filter((p) => p.category_id === c.id && savingOf(p) > 0).length;
      const make = (f, withPhotoOnly) => {
        const own = slotPhoto(`hero-${f.key}`);
        const withOwner = f.categories.filter((c) => photoOf("wide", c) && count(c)).sort((a, b) => count(b) - count(a))[0];
        const lead = withOwner || [...f.categories].filter(count).sort((a, b) => deals(b) - deals(a) || count(b) - count(a))[0];
        if (!lead) return null;
        const photo = own || (withOwner ? photoOf("wide", withOwner) : null);
        if (withPhotoOnly && !photo) return null;
        const product = photo ? null : bestOf(list, lead);
        const desc = String(lead.description || "").trim();
        return {
          key: `${f.key}-${lead.id}`,
          slot: `hero-${f.key}`,
          photo,
          fam: f.key,
          /* A shop whose categories fit no family names its "More" families after a category: that title is data. */
          famOwn: f.named ? f.title : null,
          title: lead.title || lead.name,
          sub: desc && !/[.!?]$/.test(desc) ? desc + "." : desc,
          to: aisleRoute(lead),
          product,
          packshot: product ? productImage(product) : null,
        };
      };
      let slides = families.map((f) => make(f, true)).filter(Boolean);
      if (!slides.length) slides = families.map((f) => make(f, false)).filter(Boolean).slice(0, 4);
      this.slides = slides;
    },
    /* The family's words when drawn, so they follow a language change. */
    famTitle(s) {
      return s.famOwn || familyRule(s.fam)?.title || "";
    },
    famLine(s) {
      return familyRule(s.fam)?.line || "";
    },
    schedule() {
      clearTimeout(this.timer);
      this.runKey++;
      this.timer = setTimeout(() => {
        if (this.running) this.go(this.at + 1);
      }, TURN);
    },
    go(i, byHand = false) {
      const n = this.slides.length;
      if (!n) return;
      this.at = ((i % n) + n) % n;
      if (this.running) this.schedule();
      else if (byHand) this.runKey++;
    },
    onTouchStart(e) {
      this.touchX = e.changedTouches?.[0]?.clientX ?? null;
    },
    onTouchEnd(e) {
      if (this.touchX == null) return;
      const dx = (e.changedTouches?.[0]?.clientX ?? this.touchX) - this.touchX;
      this.touchX = null;
      if (Math.abs(dx) < 40) return;
      const rtl = getComputedStyle(this.$el).direction === "rtl";
      this.go(this.at + ((dx < 0) !== rtl ? 1 : -1), true);
    },
  },
};
</script>
