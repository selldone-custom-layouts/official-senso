<!--
  Senso — the head of every listing page (a category, the catalogue, a
  search, the offers).

  A dark full-width banner: the breadcrumb, the family as a teal eyebrow,
  a bold headline ("Laptop. Made to keep up."), the category's own line,
  and on the right the family's banner photo (listing-<family>,
  senso-photos.ts) — until it arrives, a placeholder holding the
  category's showcase product on a white card. A search gets a short light
  head instead. On the offers page the banner carries the "Deals end in"
  clock to the soonest deal's own end date.

  Under it, a line of chips as white rounded cards (a small packshot and a
  name): the category's kinds from its own filter record (a spec key such
  as Screen Size or Form Factor; else its brands) — a click filters the
  list — or, on the catalogue, the offers and a search, the categories.
  Then the toolbar: "N RESULTS" on the left and a rounded "Sort:
  Recommended ▾" pill on the right; on a phone and tablet a "Filters" pill
  opens the filter sheet.
-->
<template>
  <div class="sn-shoptop">
    <header v-if="mode !== 'search'" :class="`-${mode}`" class="sn-band">
      <div class="sn-band__in">
        <div class="sn-band__txt">
          <nav :aria-label="t('listing.breadcrumb', 'Breadcrumb')" class="sn-crumbs">
            <router-link :to="{ path: '/' }">{{ t("pages.home", "Home") }}</router-link>
            <span aria-hidden="true">/</span>
            <template v-if="mode === 'aisle' && aisle">
              <span v-if="family">{{ family.title }}</span>
              <span v-if="family" aria-hidden="true">/</span>
              <span aria-current="page">{{ aisle.title || aisle.name }}</span>
            </template>
            <span v-else aria-current="page">{{ crumb }}</span>
          </nav>
          <p class="sn-eyebrow">{{ eyebrow }}</p>
          <h1 class="sn-band__h">
            <template v-if="mode === 'aisle' && aisle"><bdi>{{ aisle.title || aisle.name }}.</bdi><br />{{ family ? family.line : "" }}</template>
            <template v-else>{{ title }}</template>
          </h1>
          <p v-if="line" class="sn-band__p">{{ line }}</p>
          <span v-if="mode === 'deals' && dealsEnd" class="sn-band__clock"><senso-icon name="schedule" size="16" />{{ dealsLeftLabel }} <b>{{ dealsLeft }}</b></span>
        </div>
        <div class="sn-band__media">
          <sn-slot :alt="aisle ? aisle.title || aisle.name : ''" :name="slotName" class="sn-band__photo" fill>
            <router-link v-if="hero" :to="productRoute(hero)" class="sn-pedestal">
              <span class="sn-pedestal__img"><img :alt="hero.title" :src="heroImage" loading="eager" /></span>
              <span class="sn-pedestal__txt">
                <small>{{ heroSave > 0 ? t("senso.listing.biggestSaving", "Biggest saving") : t("senso.listing.topPick", "Top pick") }}</small>
                <b>{{ hero.title }}</b>
                <span>{{ m(heroNow, false) }}<em v-if="heroSave > 0">{{ t("senso.price.save", "Save {amount}", { amount: m(heroSave) }) }}</em></span>
              </span>
            </router-link>
          </sn-slot>
        </div>
      </div>
    </header>
    <header v-else class="sn-shoptop__search">
      <nav :aria-label="t('listing.breadcrumb', 'Breadcrumb')" class="sn-crumbs">
        <router-link :to="{ path: '/' }">{{ t("pages.home", "Home") }}</router-link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ t("common.search", "Search") }}</span>
      </nav>
      <p class="sn-eyebrow">{{ t("common.search", "Search") }}</p>
      <h1>{{ t("senso.listing.resultsFor", "Results for “{search}”", { search }) }}</h1>
    </header>

    <div v-if="chips.length" class="sn-kinds">
      <button :aria-label="t('rail.scrollBack', 'Scroll back')" :disabled="at_start" class="sn-arrowbtn" type="button" @click="scrollBy(-1)"><senso-icon name="chevron_left" size="22" /></button>
      <div ref="track" class="sn-kinds__track" @scroll.passive="measure">
        <component
          :is="c.to ? 'router-link' : 'button'"
          v-for="c in chips"
          :key="c.key"
          :aria-pressed="c.to ? null : c.on"
          :class="{ '-on': c.on }"
          :to="c.to"
          class="sn-kind"
          type="button"
          @click="c.click && c.click()"
        >
          <span class="sn-kind__img sn-tile"><img v-if="c.image" :src="c.image" alt="" loading="lazy" /><senso-category-icon v-else-if="c.category" :category="c.category" size="30" /></span>
          <span class="sn-kind__name">{{ c.label }}</span>
        </component>
      </div>
      <button :aria-label="t('rail.scrollForward', 'Scroll forward')" :disabled="at_end" class="sn-arrowbtn" type="button" @click="scrollBy(1)"><senso-icon name="chevron_right" size="22" /></button>
    </div>

    <div class="sn-toolbar">
      <p class="sn-toolbar__count"><template v-if="total != null">{{ t("senso.listing.results", { one: "{n} result", other: "{n} results" }, { n: total }) }}</template></p>
      <button class="sn-toolbar__filter" type="button" @click="sheet = true">
        <senso-icon name="tune" size="18" />{{ t("senso.listing.filters", "Filters") }}<b v-if="onCount">{{ onCount }}</b>
      </button>
      <label class="sn-sort">
        <span>{{ t("senso.sort.label", "Sort:") }}</span>
        <select :aria-label="t('senso.sort.by', 'Sort by')" :value="sort || ''" @change="$emit('update:sort', $event.target.value || null)">
          <option value="">{{ fallbackSort }}</option>
          <option v-for="s in sorts" :key="s.val" :value="s.val">{{ s.name }}</option>
        </select>
        <senso-icon name="expand_more" size="18" />
      </label>
    </div>

    <teleport to="body">
      <transition name="sn-fade">
        <div v-if="sheet" class="sn-sheet-scrim" @click="sheet = false"></div>
      </transition>
      <transition name="sn-slide">
        <aside v-if="sheet" :aria-label="t('senso.listing.filters', 'Filters')" aria-modal="true" class="sn-sheet -filter" role="dialog">
          <div class="sn-sheet__head">
            <b>{{ t("senso.listing.filters", "Filters") }}</b>
            <button :aria-label="t('common.close', 'Close')" class="sn-x" type="button" @click="sheet = false"><senso-icon name="close" size="22" /></button>
          </div>
          <div class="sn-sheet__body">
            <slot name="panel" />
          </div>
          <div class="sn-sheet__foot">
            <button class="sn-btn -block" type="button" @click="sheet = false">{{ t("senso.listing.showResults", "Show results") }}</button>
          </div>
        </aside>
      </transition>
    </teleport>
  </div>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import SensoCategoryIcon from "./SensoCategoryIcon.vue";
import SnSlot from "./SensoSlot.vue";
import { SORTS, countOn, groupsOf } from "../tario/shop/tario-filters";
import { aisleRoute, aisles, productImage } from "../kalio/kalio-catalog";
import { allProducts, bestOf, dealsOf, finalOf, money, savingOf } from "./senso-home";
import { baseCurrency } from "../region-switcher/region";
import { familiesOf, familyOf } from "./senso-families";
import { clock, dealEnd, leftText, releaseClock, soonestEnd, useClock } from "./senso-clock";
import { t } from "../kalio/i18n/kalio-i18n";

/* The kinds a shopper picks first (a size, a form); any other spec key with a few values will do. */
const KIND_KEYS = /screen|display|size|form factor|^type$|kind|style|resolution|capacity|technology/i;

export default {
  name: "SensoShopTop",
  components: { SensoIcon, SensoCategoryIcon, SnSlot },
  inject: { $shop: { default: null } },

  props: {
    /** aisle | search | deals | catalogue */
    mode: { type: String, default: "catalogue" },
    aisle: { type: Object, default: null },
    search: { type: String, default: "" },
    filter: { type: Object, default: null },
    /** Selldone's filter record of the category (or the shop). */
    filters: { type: Object, default: null },
    sort: { type: String, default: null },
    /** The listing's total, once it has read. */
    total: { type: Number, default: null },
    /** The products the listing shows now (a search's categories). */
    products: { type: Array, default: () => [] },
  },
  emits: ["update:sort", "brand", "kind"],

  data: () => ({ sheet: false, all: [], cats: [], at_start: true, at_end: false }),

  computed: {
    sorts() {
      return SORTS;
    },
    fallbackSort() {
      return this.mode === "search" ? t("senso.sort.bestMatch", "Best match") : t("senso.sort.recommended", "Recommended");
    },
    onCount() {
      return countOn(this.filter);
    },
    families() {
      return familiesOf(this.cats);
    },
    family() {
      return this.aisle ? familyOf(this.aisle, this.families) : null;
    },
    slotName() {
      if (this.family) return `listing-${this.family.key}`;
      const fam = this.hero ? familyOf(this.cats.find((c) => c.id === this.hero.category_id), this.families) : null;
      return `listing-${fam ? fam.key : "tv-display"}`;
    },
    crumb() {
      return this.mode === "deals" ? t("senso.listing.offers", "Offers") : t("listing.allProducts", "All products");
    },
    eyebrow() {
      if (this.mode === "aisle") return this.family ? this.family.title : t("senso.listing.category", "Category");
      if (this.mode === "deals") return t("senso.listing.offers", "Offers");
      return t("senso.listing.theRange", "The range");
    },
    title() {
      if (this.mode === "deals") return t("senso.listing.dealsTitle", "Offers worth a closer look.");
      return t("senso.listing.catalogueTitle", "Everything we make room for.");
    },
    line() {
      if (this.mode === "aisle") return this.aisle?.description || "";
      if (this.mode === "deals") return t("senso.listing.dealsLine", "Real savings on the shop’s own prices, each with its end date.");
      return t("senso.listing.catalogueLine", "Every product, ready to filter and compare.");
    },
    /** The product the banner shows until the family's photo arrives. */
    hero() {
      if (this.mode === "aisle") return this.aisle ? bestOf(this.all, this.aisle) : null;
      if (this.mode === "deals") return dealsOf(this.all)[0] || null;
      return dealsOf(this.all)[0] || this.all[0] || null;
    },
    heroImage() {
      return this.hero ? productImage(this.hero) : null;
    },
    heroNow() {
      return this.hero ? finalOf(this.hero) : 0;
    },
    heroSave() {
      return this.hero ? savingOf(this.hero) : 0;
    },
    /** The soonest end among the shop's running deals (Selldone's dates). */
    dealsEnd() {
      return this.mode === "deals" ? soonestEnd(this.all.filter((p) => savingOf(p) > 0)) : null;
    },
    /** One end for every deal reads "Deals end in"; different ends, the next. */
    dealsLeftLabel() {
      const ends = new Set(this.all.filter((p) => savingOf(p) > 0).map((p) => dealEnd(p)).filter((e) => e != null));
      return ends.size > 1 ? t("senso.listing.nextDealEndsIn", "Next deal ends in") : t("senso.listing.dealsEndIn", "Deals end in");
    },
    dealsLeft() {
      return leftText(this.dealsEnd, clock.now);
    },
    currency() {
      return baseCurrency();
    },
    /** A category: its kinds (a spec key with a few values, else its brands). */
    kindGroup() {
      const groups = groupsOf(this.filters).filter((g) => g.values.length >= 2 && g.values.length <= 12);
      const spec = groups.filter((g) => g.kind === "spec");
      return spec.find((g) => KIND_KEYS.test(g.key)) || groups.find((g) => g.kind === "brand") || spec[0] || null;
    },
    chips() {
      if (this.mode === "aisle" && this.aisle) {
        const g = this.kindGroup;
        if (!g) return [];
        const inCat = this.all.filter((p) => p.category_id === this.aisle.id);
        const on = g.kind === "brand" ? this.filter?.brands || [] : this.filter?.selected_spec?.[g.key] || [];
        const imageOf = (v) => {
          const p = inCat.find((x) => (g.kind === "brand" ? x.brand === v : [].concat(x.spec?.[g.key] || []).map(String).includes(v)));
          return p ? productImage(p, true) : null;
        };
        return g.values.map((v) => ({
          key: g.key + v,
          label: v,
          image: imageOf(v),
          on: on.includes(v),
          click: () => (g.kind === "brand" ? this.$emit("brand", v) : this.$emit("kind", g.key, v)),
        }));
      }
      const deals = this.mode === "deals";
      const ids = this.mode === "search" ? new Set(this.products.map((p) => p.category_id)) : null;
      return this.cats
        .filter((c) => (ids ? ids.has(c.id) : true))
        .map((c) => {
          const p = deals ? dealsOf(this.all.filter((x) => x.category_id === c.id))[0] : bestOf(this.all, c);
          if (deals && !p) return null;
          return {
            key: c.id,
            label: c.title || c.name,
            image: p ? productImage(p, true) : null,
            category: c,
            to: deals ? { ...aisleRoute(c), query: { filter: JSON.stringify({ only_has_discount: true }) } } : aisleRoute(c),
          };
        })
        .filter(Boolean);
    },
  },

  watch: {
    /* Close the filter sheet when the shopper goes to another page. Each tick
       in the sheet writes the filter into the query (?filter=…), which closed
       the sheet after every tap on a phone; the path stays the same then. */
    "$route.path"() {
      this.sheet = false;
    },
    sheet(open) {
      document.documentElement.classList.toggle("sn-locked", open);
    },
    chips() {
      this.$nextTick(this.measure);
    },
  },

  mounted() {
    allProducts().then((list) => (this.all = list));
    aisles().then((list) => (this.cats = list));
    useClock();
    this.onResize = () => this.measure();
    window.addEventListener("resize", this.onResize, { passive: true });
  },

  beforeUnmount() {
    releaseClock();
    window.removeEventListener("resize", this.onResize);
    document.documentElement.classList.remove("sn-locked");
  },

  methods: {
    m(n, short = true) {
      return money(n, this.currency, short && Math.abs(n - Math.round(n)) < 0.005);
    },
    productRoute(p) {
      return { name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: p.id } };
    },
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
