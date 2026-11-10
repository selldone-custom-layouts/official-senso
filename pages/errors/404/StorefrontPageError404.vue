<!--
  Senso — the 404 page. The route sits outside the storefront layout, so
  the page brings the Layout's own header and footer with it. A big
  headline, a search, the way home and to the offers, and every category as
  a line-icon tile in even rows.
-->
<template>
  <div class="sn-404-page">
    <kalio-header v-if="shop" @search="onSearch" />
    <main class="sn-page sn-404">
      <section class="sn-sec sn-404__top">
        <p class="sn-eyebrow sn-404__code">Error 404</p>
        <h1>This page took a different turn.</h1>
        <p class="sn-404__lede">It may have moved, or the link has a typo. Search the range, or start from a category below.</p>
        <form class="sn-404__search" role="search" @submit.prevent="search">
          <input v-model.trim="q" :placeholder="`Search ${shop?.title || ''}`" aria-label="Search the shop" type="search" />
          <button aria-label="Search" class="sn-btn" type="submit"><senso-icon name="search" size="20" /></button>
        </form>
        <div class="sn-404__acts">
          <router-link :to="{ path: '/' }" class="sn-btn">Go to the home page</router-link>
          <router-link :to="deals" class="sn-btn -line">See offers</router-link>
        </div>
      </section>
      <senso-shelf v-if="shop" eyebrow="Category" grid title="Find your way back" />
    </main>
    <kalio-footer v-if="shop" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KalioHeader from "../../../components/kalio/shell/KalioHeader.vue";
import KalioFooter from "../../../components/kalio/shell/KalioFooter.vue";
import SensoIcon from "../../../components/senso/SensoIcon.vue";
import SensoShelf from "../../../components/senso/SensoShelf.vue";
import { dealsRoute } from "../../../components/kalio/kalio-catalog";

export default defineComponent({
  name: "StorefrontPageError404",
  components: { KalioHeader, KalioFooter, SensoIcon, SensoShelf },
  data: () => ({ q: "" }),
  computed: {
    shop() {
      return this.getShop();
    },
    deals() {
      return dealsRoute();
    },
  },
  methods: {
    search() {
      if (!this.q) return;
      this.$router.push({ name: window.$storefront.routes.SHOP_PAGE, query: { search: this.q } });
    },
    onSearch(event: any) {
      const text = typeof event === "string" ? event : event?.search || "";
      if (text) this.$router.push({ name: window.$storefront.routes.SHOP_PAGE, query: { search: text } });
    },
  },
});
</script>
