<!--
  Senso — the wordmark: the Layout's name (kalio-brand.ts) in heavy lower
  case, the dot of every "i" (and "j") a small yellow square. The letters are
  a dotless ı / ȷ with the square drawn over them, so the name can change in
  one place and the mark follows.
-->
<template>
  <span :aria-label="name" class="sn-logo" role="img">
    <template v-for="(ch, i) in letters" :key="i">
      <span v-if="ch === 'i' || ch === 'j'" aria-hidden="true" class="sn-logo__i">{{ ch === "i" ? "ı" : "ȷ" }}</span>
      <template v-else>{{ ch }}</template>
    </template>
  </span>
</template>

<script>
import { BRAND } from "../kalio/kalio-brand";

export default {
  name: "SensoWordmark",
  inject: { $shop: { default: null } },
  computed: {
    name() {
      return BRAND.name || this.$shop?.title || "Shop";
    },
    letters() {
      return [...String(this.name).toLowerCase()];
    },
  },
};
</script>
