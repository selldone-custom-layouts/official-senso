<!--
  Senso — the filter panel of a listing (category, catalogue, search, deals).

  A white card beside the grid on a computer; the same panel inside a sheet
  on a phone or tablet (SensoShopTop opens it). It reads the category's
  own Selldone filter record (tario-filters.ts groupsOf): the price range,
  the variant values (Colour as swatches, Capacity), every spec key the shop
  saved for the category, and the brands. "On sale" sits on top. Every
  change goes straight to the listing, which fetches and writes the address.
  The first three groups are open with five values and "Show more".
-->
<template>
  <div class="sn-filter">
    <div class="sn-filter__top">
      <h2>Filters</h2>
      <button v-if="on" class="sn-link" type="button" @click="clearAll">Clear all</button>
    </div>

    <label class="sn-check sn-filter__sale">
      <input :checked="!!modelValue?.only_has_discount" type="checkbox" @change="toggleDeals($event.target.checked)" />
      <i><senso-icon name="check" size="15" /></i>
      <span>On sale</span>
    </label>

    <div v-if="range" class="sn-fgroup -open">
      <button class="sn-fgroup__h" type="button" @click="openPrice = !openPrice">
        Price<senso-icon :name="openPrice ? 'expand_less' : 'expand_more'" size="20" />
      </button>
      <div v-show="openPrice" class="sn-price-range">
        <div class="sn-price-range__track" :style="trackStyle">
          <input
            :max="range.max"
            :min="range.min"
            :step="step"
            :value="lo"
            aria-label="Lowest price"
            type="range"
            @change="commitPrice"
            @input="setLo(+$event.target.value)"
          />
          <input
            :max="range.max"
            :min="range.min"
            :step="step"
            :value="hi"
            aria-label="Highest price"
            type="range"
            @change="commitPrice"
            @input="setHi(+$event.target.value)"
          />
        </div>
        <div class="sn-price-range__boxes">
          <label><span>{{ symbol }}</span><input :value="lo" aria-label="Min" inputmode="numeric" @change="setLo(+$event.target.value, true)" /></label>
          <em>to</em>
          <label><span>{{ symbol }}</span><input :value="hi" aria-label="Max" inputmode="numeric" @change="setHi(+$event.target.value, true)" /></label>
        </div>
      </div>
    </div>

    <div v-for="(g, gi) in groups" :key="g.kind + g.key" class="sn-fgroup">
      <button :aria-expanded="isOpen(g, gi)" class="sn-fgroup__h" type="button" @click="toggleOpen(g, gi)">
        {{ g.label }}<small v-if="picked(g).length">{{ picked(g).length }}</small>
        <senso-icon :name="isOpen(g, gi) ? 'expand_less' : 'expand_more'" size="20" />
      </button>
      <div v-show="isOpen(g, gi)" :class="{ '-swatches': g.key === 'colors' }" class="sn-fgroup__body">
        <template v-if="g.key === 'colors'">
          <button
            v-for="v in g.values"
            :key="v"
            :aria-label="v"
            :aria-pressed="picked(g).includes(v)"
            :class="{ '-on': picked(g).includes(v) }"
            :style="{ '--sw': swatch(v) }"
            class="sn-fsw"
            type="button"
            @click="toggle(g, v)"
          ></button>
        </template>
        <template v-else>
          <label v-for="v in visible(g)" :key="v" class="sn-check">
            <input :checked="picked(g).includes(v)" type="checkbox" @change="toggle(g, v)" />
            <i><senso-icon name="check" size="15" /></i>
            <span>{{ label(v) }}</span>
          </label>
          <button v-if="g.values.length > 5" class="sn-link" type="button" @click="toggleMore(g)">
            {{ more[g.key] ? "Show fewer" : `Show ${g.values.length - 5} more` }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import { currentCurrency, rateOf, signOf } from "../region-switcher/region";
import { clone, countOn, groupsOf, picked, valueLabel, withGroup } from "../tario/shop/tario-filters";

const LABELS = { volumes: "Capacity", colors: "Colour", types: "Type", styles: "Style" };

export default {
  name: "SensoFilterPanel",
  components: { SensoIcon },
  inject: { $shop: { default: null } },

  props: {
    /** Selldone's filter record of the category (or the shop). */
    filters: { type: Object, default: null },
    modelValue: { type: Object, default: null },
  },
  emits: ["update:modelValue"],

  data: () => ({ opened: {}, more: {}, openPrice: true, lo: 0, hi: 0 }),

  computed: {
    groups() {
      return groupsOf(this.filters).map((g) => ({ ...g, label: LABELS[g.key] || g.label }));
    },
    /* Selldone keeps a category's price range per product currency
       (filters.prices: [{ currency, min, max }], one row per currency) and
       filters by it (prices: { USD: [lo, hi], DKK: [...] }). As Selldone's
       SCategoryFilter and Digito's panel: the range shows in the shopper's
       currency (every row converted with the shop's rates) and goes back
       keyed by each row's own currency. */
    shown() {
      return currentCurrency();
    },
    rows() {
      return (this.filters?.prices || []).filter((row) => rateOf(row.currency, this.shown) != null);
    },
    symbol() {
      return signOf(this.shown);
    },
    range() {
      const rows = this.rows;
      if (!rows.length) return null;
      const min = Math.floor(Math.min(...rows.map((r) => r.min * rateOf(r.currency, this.shown))));
      const max = Math.ceil(Math.max(...rows.map((r) => r.max * rateOf(r.currency, this.shown))));
      return max > min ? { min, max } : null;
    },
    step() {
      if (!this.range) return 1;
      const span = this.range.max - this.range.min;
      return span > 2000 ? 10 : span > 200 ? 5 : 1;
    },
    trackStyle() {
      if (!this.range) return null;
      const span = this.range.max - this.range.min || 1;
      return { "--a": (this.lo - this.range.min) / span, "--b": (this.hi - this.range.min) / span };
    },
    on() {
      return countOn(this.modelValue);
    },
  },

  watch: {
    range: { handler: "readPrice", immediate: true, deep: true },
    modelValue: { handler: "readPrice", deep: true },
  },

  methods: {
    picked(g) {
      return picked(this.modelValue, g);
    },
    label: valueLabel,
    swatch(v) {
      const parts = valueLabel(v)
        .split("/")
        .map((x) => (x.length === 9 ? x.slice(0, 7) : x));
      return parts.length > 1 ? `linear-gradient(135deg, ${parts[0]} 50%, ${parts[1]} 50%)` : parts[0];
    },
    visible(g) {
      return this.more[g.key] ? g.values : g.values.slice(0, 5);
    },
    isOpen(g, i) {
      const k = g.kind + g.key;
      return k in this.opened ? this.opened[k] : i < 3 || this.picked(g).length > 0;
    },
    toggleOpen(g, i) {
      this.opened = { ...this.opened, [g.kind + g.key]: !this.isOpen(g, i) };
    },
    toggleMore(g) {
      this.more = { ...this.more, [g.key]: !this.more[g.key] };
    },
    toggle(g, v) {
      const now = this.picked(g);
      this.$emit("update:modelValue", withGroup(this.modelValue, g, now.includes(v) ? now.filter((x) => x !== v) : [...now, v]));
    },
    toggleDeals(on) {
      const next = clone(this.modelValue);
      next.only_has_discount = on;
      this.$emit("update:modelValue", next);
    },
    clearAll() {
      this.$emit("update:modelValue", clone(null));
    },
    readPrice() {
      if (!this.range) return;
      const row = this.rows.find((r) => this.modelValue?.prices?.[r.currency]);
      const p = row ? this.modelValue.prices[row.currency] : null;
      const rate = row ? rateOf(row.currency, this.shown) : 1;
      this.lo = p ? Math.max(this.range.min, Math.floor(p[0] * rate)) : this.range.min;
      this.hi = p ? Math.min(this.range.max, Math.ceil(p[1] * rate)) : this.range.max;
    },
    setLo(v, commit = false) {
      if (!Number.isFinite(v)) return;
      this.lo = Math.min(Math.max(this.range.min, v), this.hi);
      if (commit) this.commitPrice();
    },
    setHi(v, commit = false) {
      if (!Number.isFinite(v)) return;
      this.hi = Math.max(Math.min(this.range.max, v), this.lo);
      if (commit) this.commitPrice();
    },
    commitPrice() {
      const next = clone(this.modelValue);
      const whole = this.lo <= this.range.min && this.hi >= this.range.max;
      // Back to each row's own currency, widened to whole cents so the ends stay in.
      const prices = {};
      for (const row of this.rows) {
        const r = rateOf(this.shown, row.currency) || 1 / rateOf(row.currency, this.shown);
        prices[row.currency] = [Math.floor(this.lo * r * 100) / 100, Math.ceil(this.hi * r * 100) / 100];
      }
      next.prices = whole ? null : prices;
      this.$emit("update:modelValue", next);
    },
  },
};
</script>
