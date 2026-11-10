<!-- Senso — a category's thin line icon (48 grid), picked by the category's
     own name and title (senso-icons.ts kindOf). -->
<template>
  <svg :style="size ? { width: size + 'px', height: size + 'px' } : null" aria-hidden="true" class="sn-ci" viewBox="0 0 48 48" v-html="svg"></svg>
</template>

<script>
import { categoryIcon } from "./senso-icons";

export default {
  name: "SensoCategoryIcon",
  props: {
    category: { type: Object, required: true },
    size: { type: [Number, String], default: null },
  },
  computed: {
    svg() {
      return categoryIcon(this.category);
    },
  },
};
</script>
