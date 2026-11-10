<!-- Senso — an icon: Senso's own thin line icon (senso-icons.ts) when there
     is one by that name, else Material Symbols Rounded (kalio-fonts.ts loads
     only the icons listed there). `fill` fills the line icon (a saved heart). -->
<template>
  <svg
    v-if="line"
    :class="{ '-fill': fill }"
    :style="size ? { width: size + 'px', height: size + 'px' } : null"
    aria-hidden="true"
    class="sn-i"
    viewBox="0 0 24 24"
    v-html="line"
  ></svg>
  <span v-else :class="{ '-fill': fill }" :style="size ? { fontSize: size + 'px' } : null" aria-hidden="true" class="sn-ms">{{ name }}</span>
</template>

<script>
import { lineIcon } from "./senso-icons";

export default {
  name: "SensoIcon",
  props: {
    name: { type: String, required: true },
    size: { type: [Number, String], default: null },
    fill: Boolean,
  },
  computed: {
    line() {
      return lineIcon(this.name);
    },
  },
};
</script>
