<!--
  Senso — a lifestyle photo, or the category's own products in its place.

  The hero, the tall cards and the photo tiles each have a photo slot. When
  the Layout carries the category's photo (assets/senso/, senso-home.ts)
  it fills the slot, cropped to it. Without one, the slot shows a collage of
  up to four of that category's products on a soft blue ground: the slot is
  never an empty box or a stock picture of something the shop does not sell.
-->
<template>
  <div :class="['sn-photo', '-' + shape, { '-still': !src }]">
    <img v-if="src" :alt="alt" :src="src" :loading="eager ? 'eager' : 'lazy'" class="sn-photo__img" />
    <div v-else class="sn-photo__still" aria-hidden="true">
      <img
        v-for="(product, i) in shown"
        :key="product.id"
        :class="'-p' + (i + 1)"
        :src="picture(product)"
        :srcset="srcset(product)"
        alt=""
        loading="lazy"
        sizes="(max-width: 760px) 50vw, 320px"
        @error="dropSrcset"
      />
    </div>
  </div>
</template>

<script>
import { dropSrcset, productImage, productSrcset } from "../kalio/kalio-catalog";

export default {
  name: "SensoPhoto",
  props: {
    src: { type: String, default: null },
    alt: { type: String, default: "" },
    products: { type: Array, default: () => [] },
    /** wide (the hero), portrait (tall cards) or square (tiles). */
    shape: { type: String, default: "square" },
    eager: Boolean,
  },
  computed: {
    shown() {
      return this.products.filter((p) => p?.icon).slice(0, this.shape === "wide" ? 4 : 3);
    },
  },
  methods: {
    dropSrcset,
    picture: (p) => productImage(p),
    srcset: (p) => productSrcset(p),
  },
};
</script>
