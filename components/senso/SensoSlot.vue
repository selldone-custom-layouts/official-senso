<!--
  Senso — a photo slot (senso-photos.ts). When the slot's file is in
  assets/senso/photos/ it shows the photo; else `src` (another photo that
  fits, e.g. the owner's own category photo); else a designed placeholder:
  a calm tinted panel of the slot's exact shape, a small photo icon and the
  file name, so the page looks intentional and the owner can map it. The
  default slot puts content inside the placeholder only (a packshot card
  that stands in for the photo).

  `fill` lets the parent size it (a hero, a banner); otherwise it keeps the
  slot's aspect ratio.
-->
<template>
  <div
    :class="[`-${tone}`, { '-photo': !!photo, '-fill': fill }]"
    :style="fill ? null : { aspectRatio: ratio }"
    class="sn-slot"
  >
    <img v-if="photo" :alt="alt" :fetchpriority="eager ? 'high' : null" :loading="eager ? 'eager' : 'lazy'" :src="photo" class="sn-slot__img" decoding="async" />
    <template v-else>
      <svg aria-hidden="true" class="sn-slot__wave" preserveAspectRatio="none" viewBox="0 0 600 200">
        <path d="M0 140 C 120 90, 220 190, 340 130 S 520 70, 600 110" fill="none" />
        <path d="M0 165 C 140 120, 240 210, 360 155 S 540 100, 600 135" fill="none" />
      </svg>
      <slot />
      <span v-if="meta" class="sn-slot__tag"><senso-icon name="photo" size="15" />{{ meta.file }}<small>{{ meta.width }}×{{ meta.height }}</small></span>
    </template>
  </div>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import { slotOf, slotPhoto } from "./senso-photos";

export default {
  name: "SensoSlot",
  components: { SensoIcon },
  props: {
    /** The slot's name in senso-photos.ts (e.g. "feature-wide", "listing-audio"). */
    name: { type: String, required: true },
    /** A photo that fits the slot until its own arrives. */
    src: { type: String, default: null },
    alt: { type: String, default: "" },
    eager: Boolean,
    fill: Boolean,
  },
  computed: {
    meta() {
      return slotOf(this.name);
    },
    photo() {
      return slotPhoto(this.name) || this.src || null;
    },
    tone() {
      return this.meta?.tone || "dark";
    },
    ratio() {
      return this.meta ? `${this.meta.width} / ${this.meta.height}` : "16 / 9";
    },
  },
};
</script>
