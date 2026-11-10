<!--
  Senso — a showcase section (the home's FEATURED and LIFESTYLE): a teal
  eyebrow and a title, a wide rounded image card telling one family's story
  (its photo slot — feature-wide, lifestyle-wide — with an overlay
  headline, a short line and an outlined white pill to the family), and
  under it a row of pale tiles, one per category: the name in bold at the
  top, its price line, and the category's showcase product as a large
  cut-out (a white packshot that melts into the tile). Every tile opens its
  category. Three tiles or four; on a phone they sit two to a row (or
  scroll sideways when odd), never leaving a hole.
-->
<template>
  <section v-if="family || tiles.length" :aria-labelledby="hid" class="sn-sec sn-show">
    <header class="sn-head">
      <div>
        <p class="sn-eyebrow">{{ eyebrow }}</p>
        <h2 :id="hid">{{ title }}</h2>
      </div>
    </header>

    <router-link v-if="family" :to="familyTo" class="sn-show__card">
      <sn-slot :alt="family.story.heading" :name="photo" class="sn-show__photo" fill />
      <span class="sn-show__shade"></span>
      <span class="sn-show__txt">
        <b class="sn-show__h">{{ family.story.heading }}</b>
        <span class="sn-show__p">{{ family.story.text }}</span>
        <span class="sn-btn -glass">Explore {{ family.title }}</span>
      </span>
    </router-link>

    <div v-if="tiles.length" :class="`-n${tiles.length}`" :style="{ '--n': tiles.length }" class="sn-show__tiles">
      <router-link v-for="t in tiles" :key="t.category.id" :to="t.to" class="sn-tile sn-show__tile">
        <span class="sn-tile__name">{{ t.category.title || t.category.name }}</span>
        <span v-if="t.line" class="sn-tile__line">{{ t.line }}</span>
        <span class="sn-tile__pack">
          <img v-if="t.image" :alt="t.product.title" :src="t.image" :srcset="t.srcset" loading="lazy" sizes="(max-width: 760px) 44vw, 300px" />
          <senso-category-icon v-else :category="t.category" size="72" />
        </span>
      </router-link>
    </div>
  </section>
</template>

<script>
import SnSlot from "./SensoSlot.vue";
import SensoCategoryIcon from "./SensoCategoryIcon.vue";
import { aisleRoute, productImage, productSrcset } from "../kalio/kalio-catalog";
import { bestOf, categoryLine, money, savingOf } from "./senso-home";

let n = 0;

export default {
  name: "SensoShowcase",
  components: { SnSlot, SensoCategoryIcon },
  inject: { $shop: { default: null } },
  props: {
    eyebrow: { type: String, required: true },
    title: { type: String, required: true },
    /** The photo slot of the wide card (senso-photos.ts). */
    photo: { type: String, required: true },
    family: { type: Object, default: null },
    categories: { type: Array, default: () => [] },
    products: { type: Array, default: () => [] },
  },
  data: () => ({ hid: `sn-show-${++n}` }),
  computed: {
    /** The family's lead category: the one with the most deals, then the most products. */
    familyTo() {
      const cats = this.family?.categories || [];
      if (!cats.length) return { path: "/" };
      const n = (c, deals) => this.products.filter((p) => p.category_id === c.id && (!deals || savingOf(p) > 0)).length;
      const lead = [...cats].sort((a, b) => n(b, true) - n(a, true) || n(b) - n(a))[0];
      return aisleRoute(lead);
    },
    tiles() {
      const cur = this.$shop?.currency || "USD";
      return this.categories.map((c) => {
        const product = bestOf(this.products, c);
        return {
          category: c,
          product,
          image: product ? productImage(product) : null,
          srcset: product ? productSrcset(product) : null,
          line: categoryLine(c, this.products, (v) => money(v, cur, true)),
          to: aisleRoute(c),
        };
      });
    },
  },
};
</script>
