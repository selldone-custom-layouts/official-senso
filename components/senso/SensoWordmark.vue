<!--
  Senso — the wordmark: a rounded square with a soft wave (the mark, in the
  palette's decoration colour) and the Layout's name (kalio-brand.ts) in
  bold rounded lower case. The name changes in one place and the mark
  follows. `light` draws it white (over the dark hero).
-->
<template>
  <span :aria-label="name" :class="{ '-light': light }" class="sn-logo" role="img">
    <svg aria-hidden="true" class="sn-logo__mark" viewBox="0 0 32 32">
      <rect fill="currentColor" height="32" rx="10" width="32" />
      <path class="sn-logo__wave" d="M7 16.7c3-5 6-5 9 0s6 5 9 0" fill="none" stroke-linecap="round" stroke-width="2.7" />
    </svg>
    <b aria-hidden="true">{{ word }}</b>
  </span>
</template>

<script>
import { BRAND } from "../kalio/kalio-brand";
import { t } from "../kalio/i18n/kalio-i18n";

export default {
  name: "SensoWordmark",
  inject: { $shop: { default: null } },
  props: { light: Boolean },
  computed: {
    name() {
      return BRAND.name || this.$shop?.title || t("senso.brand.fallback", "Shop");
    },
    word() {
      return String(this.name).toLowerCase();
    },
  },
};
</script>
