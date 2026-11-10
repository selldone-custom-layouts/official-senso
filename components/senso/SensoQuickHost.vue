<!-- Senso — the site's one quick-buy sheet (senso-quick.ts). -->
<template>
  <kalio-quick-buy v-model="sheet.open" :product="sheet.product" />
</template>

<script>
import KalioQuickBuy from "../kalio/KalioQuickBuy.vue";
import { quickSheet } from "./senso-quick";

export default {
  name: "SensoQuickHost",
  components: { KalioQuickBuy },
  data: () => ({ sheet: quickSheet }),
  watch: {
    $route() {
      this.sheet.open = false;
    },
  },
};
</script>
