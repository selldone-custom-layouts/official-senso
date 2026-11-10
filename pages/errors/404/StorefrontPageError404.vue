<!--
  Senso — the 404 page (design A of the page mockups, digini-design/404-a.html).

  The route sits outside the storefront layout, so the page brings the
  Layout's own header and footer with it. A friendly heading, a search,
  the way home and to today's deals, the categories as circles (two even
  rows) and a row of deals.
-->
<template>
  <div class="sn-404-page">
    <kalio-header v-if="shop" @search="onSearch" />
    <main class="sn-page sn-404">
      <section class="sn-sec sn-404__top">
        <span aria-hidden="true" class="sn-404__mark"><senso-icon name="search" size="40" /></span>
        <p class="sn-404__code">Page not found · 404</p>
        <h1>We couldn’t find that page</h1>
        <p class="sn-404__lede">It may have moved, or the link has a typo. Try a search, or start from one of these.</p>
        <form class="sn-404__search" role="search" @submit.prevent="search">
          <input v-model.trim="q" :placeholder="`Search ${shop?.title || ''}`" aria-label="Search the shop" type="search" />
          <button aria-label="Search" class="sn-btn" type="submit"><senso-icon name="search" size="20" /></button>
        </form>
        <div class="sn-404__acts">
          <router-link :to="{ path: '/' }" class="sn-btn">Go to the home page</router-link>
          <router-link :to="deals" class="sn-btn -line">Today’s deals</router-link>
        </div>
      </section>
      <senso-categories v-if="shop" title="Shop by category" />
      <senso-rail v-if="shop" :filter="{ only_has_discount: true }" :more-to="deals" lazy more-label="See all deals" title="Top deals" />
    </main>
    <kalio-footer v-if="shop" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KalioHeader from "../../../components/kalio/shell/KalioHeader.vue";
import KalioFooter from "../../../components/kalio/shell/KalioFooter.vue";
import SensoIcon from "../../../components/senso/SensoIcon.vue";
import SensoCategories from "../../../components/senso/SensoCategories.vue";
import SensoRail from "../../../components/senso/SensoRail.vue";
import { dealsRoute } from "../../../components/kalio/kalio-catalog";

export default defineComponent({
  name: "StorefrontPageError404",
  components: { KalioHeader, KalioFooter, SensoIcon, SensoCategories, SensoRail },
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
