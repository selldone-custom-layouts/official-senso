<!--
  Senso — the filter panel of a listing (category, catalogue, search, deals).

  A white card beside the grid on a computer; the same panel inside a sheet
  on a phone or tablet (SensoShopTop opens it). It reads the category's
  own Selldone filter record (tario-filters.ts groupsOf): the price range,
  the variant values (Colour as swatches, Capacity), every spec key the shop
  saved for the category, and the brands. "Only deals" sits on top. Every
  change goes straight to the listing, which fetches and writes the address.
  The first three groups are open with five values and "Show more".
-->
<template>
  <div class="sn-filter">
    <div class="sn-filter__top">
      <h2>Filters</h2>
      <button v-if="on" class="sn-link" type="button" @click="clearAll">Clear all</button>
    </div>

    <label class="sn-switch">
      <span><b>Only deals</b><small>Products with a saving</small></span>
      <input :checked="!!modelValue?.only_has_discount" type="checkbox" @change="toggleDeals($event.target.checked)" />
      <i aria-hidden="true"></i>
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
    currency() {
      return this.$shop?.currency || "USD";
    },
    symbol() {
      try {
        return (0).toLocaleString("en-US", { style: "currency", currency: this.currency, maximumFractionDigits: 0 }).replace(/[\d\s.,]/g, "") || "$";
      } catch {
        return "$";
      }
    },
    range() {
      const p = (this.filters?.prices || []).find((x) => x.currency === this.currency) || (this.filters?.prices || [])[0];
      if (!p || !(p.max > p.min)) return null;
      return { min: Math.floor(p.min), max: Math.ceil(p.max) };
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
    range: { handler: "readPrice", immediate: true },
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
      const p = this.modelValue?.prices?.[this.currency];
      this.lo = p ? Math.max(this.range.min, Math.round(p[0])) : this.range.min;
      this.hi = p ? Math.min(this.range.max, Math.round(p[1])) : this.range.max;
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
      next.prices = whole ? null : { [this.currency]: [this.lo, this.hi] };
      this.$emit("update:modelValue", next);
    },
  },
};
</script>
