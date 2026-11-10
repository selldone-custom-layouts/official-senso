<!--
  Senso — the product card (Home A "Deals hub", approved 8 November 2026).

  A white square photo well (a small red "% off" flag on offer), the
  product's colours as swatches — a click picks the colour the cart button
  adds — or its capacities as chips, the name in two lines, brand ·
  category, the price with a red "Save $X" and "Was $Y", then a full-width
  blue button: "Add to cart" adds the picked colour at once and becomes
  "− n in cart +" in place; a product that comes in capacities says
  "Choose capacity" and opens the quick-buy sheet (each capacity has its
  own price). Under it, Compare and Save. Nothing pops up.

  Prices follow Selldone's own rule (kalio-catalog priceOf: discount
  dates, the shopper's currency). The same card is drawn on the home, in
  every listing (senso-card.ts puts it in place of Selldone's card) and on
  the product page.
-->
<template>
  <article :class="{ '-sale': save > 0, '-big': big }" class="sn-card" @click="$emit('click', $event)">
    <router-link :aria-label="product.title" :to="to" class="sn-card__img">
      <img
        v-if="picture"
        :alt="product.title"
        :sizes="big ? '(max-width: 760px) 90vw, 420px' : '(max-width: 760px) 46vw, 240px'"
        :src="picture"
        :srcset="srcset"
        loading="lazy"
        @error="dropSrcset"
      />
      <span v-if="off > 0 && !noFlag" class="sn-flag">{{ off }}% off</span>
    </router-link>

    <div v-if="capacities.length" class="sn-caps" aria-label="Capacities">
      <span v-for="c in capacities.slice(0, 4)" :key="c">{{ c }}</span>
      <em v-if="capacities.length > 4">+{{ capacities.length - 4 }}</em>
    </div>
    <div v-else class="sn-swrow" :aria-label="colours.length ? 'Colours' : null" :role="colours.length ? 'radiogroup' : null">
      <button
        v-for="(c, i) in colours.slice(0, maxSwatches)"
        :key="c"
        :aria-checked="i === picked"
        :aria-label="`Colour ${i + 1}`"
        :class="{ '-on': i === picked }"
        :style="{ '--sw': swatchBg(c) }"
        class="sn-sw"
        role="radio"
        type="button"
        @click.prevent.stop="picked = i"
      ></button>
      <em v-if="colours.length > maxSwatches">+{{ colours.length - maxSwatches }}</em>
    </div>

    <router-link :to="to" class="sn-card__t">{{ product.title }}</router-link>
    <div class="sn-card__meta">{{ meta }}</div>

    <div class="sn-price">
      <b class="sn-price__now">{{ fmt(now) }}</b>
      <span v-if="save > 0" class="sn-save">Save {{ fmt(save, true) }}</span>
    </div>
    <div :class="{ '-none': !was }" class="sn-was">
      <template v-if="was">Was <s>{{ fmt(was) }}</s></template>
    </div>
    <div v-if="!noTimer" :class="{ '-none': !endsAt }" class="sn-ends">
      <template v-if="endsAt"><senso-icon name="schedule" size="14" />Ends in <b>{{ endsLeft }}</b></template>
    </div>

    <div class="sn-card__buy" @click.prevent.stop>
      <div v-if="shown > 0" :class="{ '-busy': busy }" aria-label="Quantity in cart" class="sn-step" role="group">
        <button :aria-label="shown > 1 ? 'One fewer' : 'Remove from cart'" :disabled="!!line?.pending" type="button" @click="step(-1)">
          <senso-icon :name="shown > 1 ? 'remove' : 'delete'" size="20" />
        </button>
        <output aria-live="polite"><b>{{ shown }}</b><span> in cart</span></output>
        <button :disabled="!!line?.pending" aria-label="One more" type="button" @click="step(1)">
          <senso-icon name="add" size="20" />
        </button>
      </div>
      <button v-else-if="soldOut" class="sn-btn -block -off" disabled type="button">Out of stock</button>
      <button v-else-if="capacities.length" class="sn-btn -block" type="button" @click="choose">
        <senso-icon name="tune" size="19" /><span class="-long">Choose capacity</span><span class="-short">Choose</span>
      </button>
      <button v-else class="sn-btn -block" type="button" @click="add">
        <senso-icon name="add_shopping_cart" size="19" /><span class="-long">Add to cart</span><span class="-short">Add</span>
      </button>
    </div>

    <div v-if="!noFoot" class="sn-card__foot">
      <label :class="{ '-on': comparing }" class="sn-cmp" @click.stop>
        <input :checked="comparing" type="checkbox" @change="toggleCompare" />
        <i><senso-icon name="check" size="15" /></i>{{ comparing ? "Comparing" : "Compare" }}
      </label>
      <button :aria-pressed="saved" :class="{ '-on': saved }" class="sn-heart" type="button" @click.prevent.stop="toggleSave">
        <senso-icon :fill="saved" name="favorite" size="18" /><span>{{ saved ? "Saved" : "Save" }}</span>
      </button>
    </div>
  </article>
</template>

<script>
import CurrencyMixin from "@selldone/components-vue/mixin/currency/CurrencyMixin.ts";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import SensoIcon from "./SensoIcon.vue";
import { aisleIndex, dropSrcset, percentOff, priceOf, productImage, productSrcset } from "../kalio/kalio-catalog";
import {
  addColour,
  basketLine,
  colourLine,
  normColour,
  pendingLine,
  productLines,
  quickAdd,
  settling,
  shownCount,
  stepTo,
} from "../kalio/kalio-basket";
import { openQuickBuy, savedIds } from "./senso-quick";
import { money, productIndex } from "./senso-home";
import { clock, dealEnd, leftText, releaseClock, useClock } from "./senso-clock";

let categories = null;

export default {
  name: "SensoCard",
  components: { SensoIcon },
  mixins: [CurrencyMixin],

  props: {
    product: { type: Object, required: true },
    /** The bento's #1: a bigger picture and title. */
    big: Boolean,
    /** No Compare / Save line (small cards). */
    noFoot: Boolean,
    noFlag: Boolean,
    /** No "Ends in" line (a place that shows the deal's clock itself). */
    noTimer: Boolean,
    maxSwatches: { type: Number, default: 4 },
  },

  emits: ["click"],

  data: () => ({ picked: 0, category: null, full: null }),

  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    currency() {
      return this.GetUserSelectedCurrency()?.code || this.shop?.currency || "USD";
    },
    price() {
      return priceOf(this.shop, this.product, this.currency);
    },
    now() {
      return this.price.now;
    },
    was() {
      return this.price.was;
    },
    save() {
      return this.was ? Math.round((this.was - this.now) * 100) / 100 : 0;
    },
    off() {
      return percentOff(this.shop, this.product);
    },
    picture() {
      return productImage(this.product);
    },
    /** When the deal ends, by Selldone's own dates (senso-clock.ts). */
    endsAt() {
      return this.was ? dealEnd(this.product) : null;
    },
    endsLeft() {
      return leftText(this.endsAt, clock.now);
    },
    srcset() {
      return productSrcset(this.product);
    },
    to() {
      return { name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: this.product.id } };
    },
    meta() {
      return [this.product.brand || this.full?.brand, this.category?.title || this.category?.name].filter(Boolean).join(" · ");
    },
    variants() {
      return this.product.variants || this.product.product_variants || [];
    },
    colours() {
      const seen = new Set();
      const out = [];
      for (const v of this.variants) {
        if (!v.color) continue;
        const key = normColour(v.color);
        if (!seen.has(key)) {
          seen.add(key);
          out.push(v.color);
        }
      }
      return out;
    },
    capacities() {
      return [...new Set(this.variants.map((v) => v.volume).filter(Boolean))];
    },
    colour() {
      return this.colours[this.picked] || null;
    },
    soldOut() {
      return this.product.quantity != null && Number(this.product.quantity) <= 0;
    },
    line() {
      if (this.capacities.length) return productLines(this, this.product)[0] || null;
      if (this.colours.length) return colourLine(this, this.product, this.colour);
      return basketLine(this, this.product) || pendingLine(this.product);
    },
    shown() {
      return shownCount(this.product, this.line);
    },
    busy() {
      return settling(this.product, this.line);
    },
    comparing() {
      return (this.$store.getters.getProductsComparison || []).some((p) => p.id === this.product.id);
    },
    saved() {
      return !!(savedIds[this.product.id] ?? this.product.wishlist);
    },
  },

  beforeUnmount() {
    if (this.ticking) releaseClock();
  },

  mounted() {
    if (this.endsAt != null) {
      this.ticking = true;
      useClock();
    }
    if (!categories) categories = aisleIndex();
    categories.then((index) => (this.category = index.get(this.product.category_id) || null));
    if (!this.product.brand) productIndex().then((index) => (this.full = index.get(this.product.id) || null));
  },

  methods: {
    dropSrcset,
    /** "$378.90"; a whole saving reads "$60". */
    fmt(n, short = false) {
      return money(n, this.currency, short && Math.abs(n - Math.round(n)) < 0.005);
    },
    swatchBg(c) {
      const parts = String(c)
        .split("/")
        .map((x) => (x.length === 9 ? x.slice(0, 7) : x));
      return parts.length > 1 ? `linear-gradient(135deg, ${parts[0]} 50%, ${parts[1]} 50%)` : parts[0];
    },
    add() {
      if (this.colours.length) addColour(this, this.product, this.colour);
      else quickAdd(this, this.product, (p) => openQuickBuy(p));
    },
    choose() {
      openQuickBuy(this.product);
    },
    step(delta) {
      if (!this.line || this.line.pending) return;
      stepTo(this, this.product, this.line, this.shown + delta);
    },
    toggleCompare() {
      if (this.comparing) this.removeFromProductComparison(this.product, null);
      else this.addToProductComparison(this.product, null, true);
    },
    toggleSave() {
      if (!this.USER()) {
        // The app's sign-in sheet (KalioSignIn). The card has no AuthMixin, so
        // this.NeedLogin() threw "is not a function" and a guest's heart did nothing.
        EventBus.$emit("need-login", true);
        return;
      }
      const id = this.product.id;
      const on = !this.saved;
      savedIds[id] = on;
      const url = on ? window.XAPI.PUT_WISHLIST_PRODUCT(this.shop.name, id) : window.XAPI.DELETE_WISHLIST_PRODUCT(this.shop.name, id);
      window.axios[on ? "put" : "delete"](url)
        .then(({ data }) => {
          if (data?.error) savedIds[id] = !on;
        })
        .catch(() => (savedIds[id] = !on));
    },
  },
};
</script>
