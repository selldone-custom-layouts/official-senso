<!--
  - Copyright (c) 2023. Selldone® Business OS™
  -
  - Author: M.Pajuhaan
  - Web: https://selldone.com
  - ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -
  - All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
  - From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
  - Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
  - Our journey is not just about reaching a destination, but about creating a masterpiece.
  - Tread carefully, for you're treading on dreams.
  -->
<!--
  🍉 This view will be shown in the StorefrontLayout.vue ▶ <router-view> component.

  Header
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ Top Shop Menu                      ┃
  ┃  + <s-storefront-primary-header>   ┃
  ┃  + <s-storefront-top-menu>         ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Primary Footer
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ Show Vendor Info                   ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Products Listing
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ ⬜⬜⬜ ┃ 🟨   🟨   🟨   🟨   🟨  ┃
  ┃ ⬜⬜⬜ ┃ 🟨   ⬛   ⬛   ⬛   ⬛  ┃
  ┃ ⬜⬜⬜ ┃ ⬛   ⬛   ⬛   ⬛   ⬛  ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  -->
<template>
  <div>
    <v-card
      :flat="isMobile"
      class="s--shop-card s--shadow-no-padding -hide1720 pb-16"
    >
      <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Top Shop Menu ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
      <div
        :class="{
          'add-marginal-side-menu-open':
            show_filter_menu && $vuetify.display.smAndUp,
        }"
        style="transition: all 400ms ease"
      >
        <slot name="header" :center="true"></slot>
      </div>

      <!--
        One page, four Kalio states. Selldone routes the shop page, every
        aisle and every seller to this same component, so the home page, the
        aisle sign and the seller storefront are chosen here by route. The
        home page stands on its own; the other three hand over to the live
        listing below, and so does the shop page once a query (search,
        filter, sort, "All products") asks for the catalogue itself.
      -->

      <!-- ▆▆▆▆▆▆▆▆ The home (SensoHome) ▆▆▆▆▆▆▆▆ -->
      <!-- On the bare shop page only: any query (a search, a filter, a sort,
           "All products") shows the listing instead. -->
      <senso-home v-if="show_home" />

      <!-- ▆▆▆▆▆▆▆▆ A category, the catalogue, a search, the deals ▆▆▆▆▆▆▆▆ -->
      <!-- Senso: a dark banner, the kinds as chips, "N results" and the sort
           pill; the filter card beside a three-a-row grid on a computer (a
           sheet on a phone); Selldone's listing does the fetching and draws
           Senso's card with "Learn more" (senso-card.ts). -->
      <div v-else class="sn-shop">
        <senso-shop-top
          :aisle="listing_parent"
          :filter="t_filter"
          :filters="filters_def"
          :mode="shop_mode"
          :products="listing_products"
          :search="search_query"
          :sort="t_sort"
          :total="catalogue_total"
          @brand="toggleBrand"
          @kind="pickType"
          @update:sort="setSort"
        >
          <template #panel>
            <senso-filter-panel :filters="filters_def" :model-value="t_filter" @update:model-value="setFilter" />
          </template>
        </senso-shop-top>

        <div class="sn-page sn-shop__body">
          <aside aria-label="Filters" class="sn-shop__side">
            <senso-filter-panel :filters="filters_def" :model-value="t_filter" @update:model-value="setFilter" />
          </aside>
          <!-- Loading, Senso's way: the first read shows skeleton cards in
               the card's shape; a new filter, sort or search keeps the cards,
               dims them and floats an "Updating results…" pill; the new cards
               fade up; "load more" appends skeletons. Selldone's thin progress
               line is hidden. -->
          <div :class="{ '-busy': loading === 'refresh', '-arrived': arrived }" class="sn-shop__main">
            <transition name="sn-fade">
              <div v-if="loading === 'refresh'" aria-live="polite" class="sn-updating" role="status">
                <span class="sn-updating__pill"><i aria-hidden="true" class="sn-spin"></i>Updating results…</span>
              </div>
            </transition>
            <div v-if="loading === 'first'" aria-hidden="true" class="sn-skelgrid">
              <div v-for="n in 6" :key="'f' + n" class="sn-skelcard"><i></i><b></b><b class="-mid"></b><b class="-short"></b><em></em></div>
            </div>
            <s-products-listing
              ref="listing"
              :key="$route.path"
              :class="{ '-catalogue': catalogue }"
              :has-breadcrumb="false"
              :has-filter="false"
              :vendor-id="vendor_id"
              class="sn-listing"
              load-more
              route-mode
              update-route
              @fetch-products="updateProductsSeo"
              @sn-fetch="onFetchStart"
            ></s-products-listing>
            <div v-if="loading === 'more'" aria-hidden="true" class="sn-skelgrid -more">
              <div v-for="n in 3" :key="'m' + n" class="sn-skelcard"><i></i><b></b><b class="-mid"></b><b class="-short"></b><em></em></div>
            </div>
          </div>
        </div>

        <div class="sn-page">
          <senso-rail v-if="catalogue && search_query" :limit="12" eyebrow="Popular" lazy sort="bestselling" title="Popular right now" />
          <section v-if="more_aisles.length" class="sn-sec sn-keep">
            <p class="sn-eyebrow">Keep exploring</p>
            <h2>More categories</h2>
            <div class="sn-keep__list">
              <router-link v-for="a in more_aisles" :key="a.id" :to="aisleTo(a)" class="sn-pillchip">
                <senso-category-icon :category="a" size="22" />{{ a.title || a.name }}
              </router-link>
            </div>
          </section>
        </div>
      </div>
    </v-card>

  </div>
</template>

<script lang="ts">
import SProductsListing from "@selldone/components-vue/storefront/products/listing/SProductsListing.vue";
import TemplateMixin from "@selldone/components-vue/mixin/template/TemplateMixin.ts";
import SensoHome from "../../components/senso/SensoHome.vue";
import SensoShopTop from "../../components/senso/SensoShopTop.vue";
import SensoFilterPanel from "../../components/senso/SensoFilterPanel.vue";
import SensoRail from "../../components/senso/SensoRail.vue";
import SensoCategoryIcon from "../../components/senso/SensoCategoryIcon.vue";
import { fromRoute, clone } from "../../components/tario/shop/tario-filters";
import { aisleImage, aisleRoute, aisles } from "../../components/kalio/kalio-catalog";
import {StorefrontSeo} from "../../helpers/StorefrontSeo";
import { hostQuickBuy } from "../../components/kalio/kalio-listing-quick-buy";
import { quickAdd } from "../../components/kalio/kalio-basket";
import { openQuickBuy } from "../../components/senso/senso-quick";
import "../../components/senso/senso-card"; // every listing draws Senso's card
import "../../components/senso/senso-listing-loading"; // the listing tells when it starts a read

export default {
  name: "StorefrontPageProducts",
  components: {
    SProductsListing,
    SensoHome,
    SensoShopTop,
    SensoFilterPanel,
    SensoRail,
    SensoCategoryIcon,
  },
  mixins: [TemplateMixin],

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Data
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  data: () => ({
    vendor_id: null /*Show only for this vendor! */,
    seoNavigation: StorefrontSeo.captureNavigation(),
    catalogue_total: null /* The listing's total, for the aisle and catalogue headers. */,
    listing_parent: null /* The aisle's record, as the listing read it. */,
    listing_products: [],
    t_filter: null /* The filter the listing has (the bar shows it). */,
    t_sort: null,
    aisle_list: [],
    /** first | refresh | more | null: how the listing is loading now. */
    loading: null,
    /** The moment new cards arrive (they fade up). */
    arrived: false,
  }),
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Compute Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  computed: {
    shop_theme() {
      return this.getShop()?.theme;
    },
    show_filter_menu() {
      return this.$store.getters.getShowFilterMenu;
    },

    category_name() {
      return this.$route.params?.category_name || null;
    },

    search_query() {
      return String(this.$route.query?.search || "").trim();
    },

    /* Selldone's filter record: the aisle's own, or the shop's on the catalogue. */
    filters_def() {
      if (this.category_name) return this.listing_parent?.filters || null;
      return this.getShop()?.filters || null;
    },

    /* Which head the listing gets. */
    shop_mode() {
      if (this.category_name) return "aisle";
      if (this.search_query) return "search";
      if (this.t_filter?.only_has_discount) return "deals";
      return "catalogue";
    },

    more_aisles() {
      return this.aisle_list.filter((a) => a.name !== this.category_name).slice(0, 12);
    },

    /* The shop page asked for the catalogue itself (no aisle, no seller). */
    catalogue() {
      return (
        String(this.$route.name || "").startsWith(window.$storefront.routes.SHOP_PAGE) &&
        !this.vendor_id &&
        !this.show_home
      );
    },

    show_home() {
      return (
        String(this.$route.name || "").startsWith(window.$storefront.routes.SHOP_PAGE) &&
        !this.vendor_id &&
        !Object.keys(this.$route.query || {}).length
      );
    },
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Watch Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  watch: {
    /* Layout default: on a grocery shelf "add to basket" belongs on the card.
       The listing shows Quick Buy only when the shop theme sets hover_actions.
       A merchant who has set it either way is respected; one who never
       touched it gets the grocery default. A watcher, not a one-shot write in
       created(): the storefront swaps in a fresh shop object when it refreshes
       the shop, and that swap silently discarded the earlier write. */
    shop_theme: {
      handler(theme) {
        if (!theme) return;
        if (theme.hover_actions === undefined) theme.hover_actions = true;
        /* Insta is a photo wall: the name and price only on hover, and no
           "+" below a laptop. As a starting view it hid a grocery card's
           name, so the shelf starts on the normal grid. A shopper who picks
           Insta from the toolbar still gets it, and keeps it: the listing
           reads their saved choice before the theme. */
        for (const device of ["mobile", "tablet", "pc"]) {
          if (theme[device] === "insta") theme[device] = "normal";
        }
      },
      immediate: true,
    },
    "$route.path"() {
      this.seoNavigation = StorefrontSeo.captureNavigation();
      /* A new aisle or seller starts without a count until its listing reads. */
      this.catalogue_total = null;
      this.listing_parent = null;
      this.listing_products = [];
      this.$nextTick(() => this.readRoute());
    },
    "$route.query.filter"() {
      this.t_filter = fromRoute(this.$route.query);
    },
    /* The router reuses this one component for the catalogue root, every
       aisle and every seller, so created() runs only for the first of them:
       a shopper who clicked a seller on the market front kept vendor_id null
       and landed on the whole catalogue under a seller URL. The id is read
       again whenever the route record changes. Within one record it stays as
       upstream intends — sticky while the listing rewrites the query. */
    "$route.name"() {
      this.vendor_id = this.vendorIdFromRoute();
    },
    /* One seller to another is the same record with a new param. */
    "$route.params.vendor_id"() {
      this.vendor_id = this.vendorIdFromRoute();
    },
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Component Lifecycle
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  created() {
    this.releaseQuickBuy = hostQuickBuy((product) => quickAdd(this, product, openQuickBuy));

    // ━━━━━━━ Initialize by query ━━━━━━━

    /*First load keep vendor ID to show products for this vendor.*/
    this.vendor_id = this.vendorIdFromRoute();

    this.setPageTitle(); // Set Page Title!
    this.readRoute();
    aisles().then((list) => (this.aisle_list = list));
  },
  /* "Load more" never skipped: the listing asks for the next page when its
     "Show N more" pill comes into view (Selldone's v-intersect). A fast
     flick or a jump to the page's end can carry the pill past the screen
     between two frames, and the list then stopped at its first page (a
     phone showed 6 of 61 offers). The pill coming near the screen, or
     already above it, now asks too; a read already running is never asked
     twice. */
  mounted() {
    this.onScrollMore = () => {
      if (this.moreFrame) return;
      this.moreFrame = requestAnimationFrame(() => {
        this.moreFrame = null;
        const list = this.$refs.listing;
        const pill = this.$el?.querySelector?.(".k-loadmore__go");
        if (!list || !pill || list.busy_fetch || !list.has_more || !list.loadMore) return;
        const r = pill.getBoundingClientRect();
        if (r.width && r.top < window.innerHeight + 240) list.fetchData(false, true);
      });
    };
    window.addEventListener("scroll", this.onScrollMore, { passive: true });
  },
  beforeUnmount() {
    this.releaseQuickBuy?.();
    window.removeEventListener("scroll", this.onScrollMore);
    if (this.moreFrame) cancelAnimationFrame(this.moreFrame);
  },

  methods: {
    vendorIdFromRoute() {
      return this.$route.params?.vendor_id
        ? this.$route.params?.vendor_id
        : this.$route.query?.vendor_id || null;
    },
    /** The listing starts a read (senso-listing-loading.ts tells it). */
    onFetchStart(more) {
      clearTimeout(this.loadingTimer);
      this.loading = more ? "more" : this.listing_products.length ? "refresh" : "first";
      this.arrived = false;
      // A read that fails never sends its products: stop waiting after a while.
      this.loadingTimer = setTimeout(() => (this.loading = null), 15000);
    },
    updateProductsSeo(data) {
      clearTimeout(this.loadingTimer);
      if (this.loading && this.loading !== "more") {
        this.arrived = true;
        clearTimeout(this.arrivedTimer);
        this.arrivedTimer = setTimeout(() => (this.arrived = false), 900);
      }
      this.loading = null;
      this.catalogue_total = typeof data?.total === "number" ? data.total : null;
      if (data?.parent !== undefined) this.listing_parent = data.parent && data.parent.id ? data.parent : null;
      this.listing_products = data?.products || [];
      StorefrontSeo.updateProducts(data, this.getShop(), this.seoNavigation);
    },

    /* ── Tario's filter bar talks to the listing directly ── */
    readRoute() {
      this.t_filter = fromRoute(this.$route.query);
      this.t_sort = this.$route.query?.sort || null;
    },
    setFilter(filter) {
      this.t_filter = filter;
      this.$refs.listing?.setFilter(filter);
    },
    setSort(sort) {
      this.t_sort = sort;
      if (this.$refs.listing) this.$refs.listing.sort = sort;
    },
    pickType(key, value) {
      if (!key) return;
      const now = this.t_filter?.selected_spec?.[key] || [];
      const next = JSON.parse(JSON.stringify(this.t_filter || {}));
      next.selected_spec = { ...(next.selected_spec || {}), [key]: now.includes(value) ? now.filter((v) => v !== value) : [value] };
      this.setFilter(next);
    },
    toggleBrand(brand) {
      const next = clone(this.t_filter);
      next.brands = next.brands.includes(brand) ? next.brands.filter((b) => b !== brand) : [...next.brands, brand];
      this.setFilter(next);
    },
    aisleIcon(aisle) {
      return aisleImage(aisle, 64);
    },
    aisleTo(aisle) {
      return aisleRoute(aisle);
    },
  },
};
</script>
