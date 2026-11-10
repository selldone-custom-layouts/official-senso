<!--
  Senso — the head of every listing page (a category, the catalogue, a
  search, the deals), kept short so the products show at first sight.

  A breadcrumb, the title (the category's name, "Results for “…”",
  "Today's deals" or "All products") with one line under it, and chips:
  the category's brands, a search's categories, or the categories that have
  deals. On the deals page the head is a blue band with the "Deals end in"
  clock to the soonest deal's own end date. Under it a toolbar: the sort menu on a computer; on a phone and
  tablet a sticky "Filter | Sort" bar that opens the filter sheet. No product
  counts: the shop is the point, not its size.
-->
<template>
  <div class="sn-shoptop">
    <nav aria-label="Breadcrumb" class="sn-crumbs">
      <router-link :to="{ path: '/' }">Home</router-link>
      <senso-icon name="chevron_right" size="16" />
      <template v-if="mode === 'aisle' && aisle">
        <router-link :to="allRoute">All products</router-link>
        <senso-icon name="chevron_right" size="16" />
        <span aria-current="page">{{ aisle.title || aisle.name }}</span>
      </template>
      <span v-else aria-current="page">{{ crumb }}</span>
    </nav>

    <header :class="{ '-deals': mode === 'deals' }" class="sn-shoptop__head">
      <div class="sn-shoptop__txt">
        <span v-if="mode === 'deals' && dealsEnd" class="sn-clock"><senso-icon name="schedule" size="16" />{{ dealsLeftLabel }} <b>{{ dealsLeft }}</b></span>
        <h1>{{ title }}</h1>
        <p v-if="line">{{ line }}</p>
      </div>
      <div v-if="chips.length" class="sn-shoptop__chips">
        <component
          :is="c.to ? 'router-link' : 'button'"
          v-for="c in chips"
          :key="c.key"
          :class="{ '-on': c.on }"
          :to="c.to"
          class="sn-chip"
          type="button"
          @click="c.click && c.click()"
        >
          <img v-if="c.icon" :src="c.icon" alt="" />{{ c.label }}<small v-if="c.note">{{ c.note }}</small>
        </component>
      </div>
    </header>

    <div class="sn-toolbar">
      <button class="sn-toolbar__filter" type="button" @click="sheet = true">
        <senso-icon name="tune" size="20" />Filter<b v-if="onCount">{{ onCount }}</b>
      </button>
      <label class="sn-sort">
        <span>Sort by</span>
        <select :value="sort || ''" aria-label="Sort by" @change="$emit('update:sort', $event.target.value || null)">
          <option value="">{{ fallbackSort }}</option>
          <option v-for="s in sorts" :key="s.val" :value="s.val">{{ s.name }}</option>
        </select>
        <senso-icon name="expand_more" size="20" />
      </label>
    </div>

    <teleport to="body">
      <transition name="sn-fade">
        <div v-if="sheet" class="sn-sheet-scrim" @click="sheet = false"></div>
      </transition>
      <transition name="sn-slide">
        <aside v-if="sheet" aria-label="Filters" aria-modal="true" class="sn-sheet -filter" role="dialog">
          <div class="sn-sheet__head">
            <b>Filter</b>
            <button aria-label="Close" class="sn-x" type="button" @click="sheet = false"><senso-icon name="close" size="22" /></button>
          </div>
          <div class="sn-sheet__body">
            <slot name="panel" />
          </div>
          <div class="sn-sheet__foot">
            <button class="sn-btn -block" type="button" @click="sheet = false">Show results</button>
          </div>
        </aside>
      </transition>
    </teleport>
  </div>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import { SORTS, countOn } from "../tario/shop/tario-filters";
import { aisleImage, aisleRoute, aisles, catalogueRoute } from "../kalio/kalio-catalog";
import { allProducts, money, savingOf } from "./senso-home";
import { clock, dealEnd, leftText, releaseClock, soonestEnd, useClock } from "./senso-clock";

export default {
  name: "SensoShopTop",
  components: { SensoIcon },
  inject: { $shop: { default: null } },

  props: {
    /** aisle | search | deals | catalogue */
    mode: { type: String, default: "catalogue" },
    aisle: { type: Object, default: null },
    search: { type: String, default: "" },
    filter: { type: Object, default: null },
    sort: { type: String, default: null },
    /** The products the listing shows now (a search's categories). */
    products: { type: Array, default: () => [] },
  },
  emits: ["update:sort", "brand"],

  data: () => ({ sheet: false, all: [], cats: [] }),

  computed: {
    sorts() {
      return SORTS;
    },
    fallbackSort() {
      return this.mode === "search" ? "Best match" : "Featured";
    },
    onCount() {
      return countOn(this.filter);
    },
    allRoute() {
      return catalogueRoute();
    },
    crumb() {
      return { search: "Search", deals: "Today’s deals" }[this.mode] || "All products";
    },
    title() {
      if (this.mode === "aisle") return this.aisle?.title || this.aisle?.name || "";
      if (this.mode === "search") return `Results for “${this.search}”`;
      if (this.mode === "deals") return "Today’s deals";
      return "All products";
    },
    line() {
      if (this.mode === "aisle") return this.aisle?.description || "";
      if (this.mode === "deals") return "Real savings on the shop’s own prices. A new Deal of the Day every midnight.";
      if (this.mode === "search") return "";
      return "Everything in the shop, ready to filter.";
    },
    /** The soonest end among the shop's running deals (Selldone's dates). */
    dealsEnd() {
      return this.mode === "deals" ? soonestEnd(this.all.filter((p) => savingOf(p) > 0)) : null;
    },
    /** One end for every deal reads "Deals end in"; different ends, the next. */
    dealsLeftLabel() {
      const ends = new Set(this.all.filter((p) => savingOf(p) > 0).map((p) => dealEnd(p)).filter((e) => e != null));
      return ends.size > 1 ? "Next deal ends in" : "Deals end in";
    },
    dealsLeft() {
      return leftText(this.dealsEnd, clock.now);
    },
    currency() {
      return this.$shop?.currency || "USD";
    },
    chips() {
      if (this.mode === "aisle" && this.aisle) {
        const brands = [...new Set(this.all.filter((p) => p.category_id === this.aisle.id).map((p) => p.brand).filter(Boolean))];
        if (brands.length < 2) return [];
        const on = this.filter?.brands || [];
        return brands.map((b) => ({ key: b, label: b, on: on.includes(b), click: () => this.$emit("brand", b) }));
      }
      if (this.mode === "deals") {
        return this.cats
          .map((c) => {
            const best = Math.max(0, ...this.all.filter((p) => p.category_id === c.id).map(savingOf));
            return best
              ? {
                  key: c.id,
                  label: c.title || c.name,
                  note: `Up to ${money(best, this.currency, true)} off`,
                  icon: c.icon ? aisleImage(c, 64) : null,
                  to: { ...aisleRoute(c), query: { filter: JSON.stringify({ only_has_discount: true }) } },
                  best,
                }
              : null;
          })
          .filter(Boolean)
          .sort((a, b) => b.best - a.best);
      }
      if (this.mode === "search") {
        const ids = new Set(this.products.map((p) => p.category_id));
        return this.cats
          .filter((c) => ids.has(c.id))
          .map((c) => ({ key: c.id, label: c.title || c.name, icon: c.icon ? aisleImage(c, 64) : null, to: aisleRoute(c) }));
      }
      return [];
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
  },

  mounted() {
    allProducts().then((list) => (this.all = list));
    aisles().then((list) => (this.cats = list));
    useClock();
  },

  beforeUnmount() {
    releaseClock();
    document.documentElement.classList.remove("sn-locked");
  },

};
</script>
