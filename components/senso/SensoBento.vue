<!--
  Senso — Best sellers as a bento: the #1 big on the left, as tall as the
  two rows of four beside it. Built from the shop's best-seller tag
  (senso-home.ts tagIndex); no tagged product, no section. Rows are always
  full: eight small cards, or four, or (with fewer) a plain rail.
-->
<template>
  <section v-if="list.length >= 5" aria-labelledby="sn-best-h" class="sn-sec">
    <header class="sn-head">
      <h2 id="sn-best-h">{{ title }}</h2>
    </header>
    <div :class="'-rows' + rows" class="sn-bento">
      <div class="sn-bento__big">
        <span class="sn-rank">#1</span>
        <senso-card :max-swatches="6" :product="list[0]" big no-foot />
      </div>
      <senso-card v-for="p in small" :key="p.id" :product="p" class="sn-bento__s" no-foot />
    </div>
  </section>
  <senso-rail v-else-if="list.length" :items="list" :title="title" />
</template>

<script>
import SensoCard from "./SensoCard.vue";
import SensoRail from "./SensoRail.vue";

export default {
  name: "SensoBento",
  components: { SensoCard, SensoRail },
  props: {
    products: { type: Array, default: () => [] },
    title: { type: String, default: "Best sellers" },
  },
  computed: {
    list() {
      return this.products;
    },
    rows() {
      const rest = this.list.length - 1;
      return rest >= 8 ? 2 : 1;
    },
    small() {
      return this.list.slice(1, 1 + this.rows * 4);
    },
  },
};
</script>
