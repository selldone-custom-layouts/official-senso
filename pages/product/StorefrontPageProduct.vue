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

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <!--
    Kalio — product page.

    Selldone's product sections and commerce components, arranged and dressed
    as Kalio's own page: a plain breadcrumb, the Kalio overview (packshot on
    its aisle tint beside one buy column), then the product's story —
    highlights, description, spec, reviews — and more from the same aisle.
    Merchant section ordering (theme.order) still decides the order below
    the overview.
  -->
  <div class="s--product k-product">
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Product info ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
    <div style="order: 0">
      <div class="s--product-section-info">
        <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Top Shop Menu ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
        <slot name="header" :center="true"></slot>

        <!-- ⬬⬬⬬⬬ Breadcrumb: the category's path, then the product ⬬⬬⬬⬬ -->
        <nav aria-label="Breadcrumb" class="sn-crumbs sn-page">
          <router-link :to="{ path: '/' }">Home</router-link>
          <template v-if="product && product.category">
            <span aria-hidden="true" class="sn-ms">chevron_right</span>
            <router-link
              :to="{
                name: window.$storefront.routes.SHOP_CATEGORY_PAGE,
                params: { category_name: product.category.name },
              }"
              >{{ product.category.title || product.category.name }}</router-link
            >
          </template>
          <template v-if="product">
            <span aria-hidden="true" class="sn-ms">chevron_right</span>
            <span aria-current="page">{{ product.title }}</span>
          </template>
          <span class="sn-crumbs__tools">
            <s-product-admin-button v-if="$vuetify.display.mdAndUp"></s-product-admin-button>
          </span>
        </nav>

        <div class="sn-page">
          <senso-product-overview v-if="product" can-buy show-cover />
          <s-product-overview-loading v-else />
        </div>
        <u-loading-progress v-if="busy"></u-loading-progress>
      </div>
    </div>

    <template v-if="product">
      <div class="sn-page sn-pdp-more">
        <!-- The merchant's own cross-sells and offers, as Selldone keeps them. -->
        <s-product-cross-sells class="s--product-section k-pdp-block"></s-product-cross-sells>
        <s-product-offers class="s--product-section k-pdp-block"></s-product-offers>

        <section v-if="has_spec" id="sn-specs" aria-labelledby="sn-spec-h" class="sn-sec sn-specs">
          <header class="sn-head"><h2 id="sn-spec-h">Specifications</h2></header>
          <div class="sn-specs__groups">
            <div v-for="g in spec_groups" :key="g.title" class="sn-specs__g">
              <h3>{{ g.title }}</h3>
              <dl>
                <template v-for="row in g.rows" :key="row.key">
                  <dt>{{ row.key }}</dt>
                  <dd>{{ row.value }}</dd>
                </template>
              </dl>
            </div>
          </div>
        </section>

        <section v-if="article" aria-label="About this product" class="sn-sec sn-about">
          <header class="sn-head"><h2>About this product</h2></header>
          <s-product-article hide-title></s-product-article>
        </section>

        <section id="k-reviews" aria-labelledby="sn-rev-h" class="sn-sec sn-reviews">
          <header class="sn-head"><h2 id="sn-rev-h">Reviews</h2></header>
          <kalio-reviews></kalio-reviews>
        </section>

        <senso-fbt :product="product" />

        <section v-if="has_extra" aria-label="Delivery and care" class="sn-sec sn-care">
          <s-product-includes class="k-pdp-block"></s-product-includes>
          <s-product-shipping class="k-pdp-block"></s-product-shipping>
          <s-product-warranty class="k-pdp-block"></s-product-warranty>
          <s-product-guide class="k-pdp-block"></s-product-guide>
          <s-product-files-list class="k-pdp-block"></s-product-files-list>
          <s-product-subscription-membership class="k-pdp-block"></s-product-subscription-membership>
        </section>

        <s-product-landing></s-product-landing>

        <senso-rail
          v-if="product.category"
          :key="'more-' + product.category.id"
          :dir="product.category.name"
          :exclude="[product.id]"
          :photo-category="product.category"
          :more-to="{
            name: window.$storefront.routes.SHOP_CATEGORY_PAGE,
            params: { category_name: product.category.name },
          }"
          :title="'More in ' + (product.category.title || product.category.name)"
          lazy
          sort="bestselling"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import NotificationService from "@selldone/components-vue/plugins/notification/NotificationService.ts";

import SensoProductOverview from "../../components/senso/SensoProductOverview.vue";
import SensoRail from "../../components/senso/SensoRail.vue";
import SensoFbt from "../../components/senso/SensoFbt.vue";
import { waysOf } from "../../components/senso/senso-home";
import { specGroups, specValue } from "../../components/kalio/compare/kalio-compare";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import SProductOverviewLoading from "@selldone/components-vue/storefront/product/overview/loading/SProductOverviewLoading.vue";

import { GtagEcommerce } from "@selldone/components-vue/plugins/gtag/GtagEcommerce";

import SProductIncludes from "@selldone/components-vue/storefront/product/includes/SProductIncludes.vue";
import SProductShipping from "@selldone/components-vue/storefront/product/shipping/SProductShipping.vue";
import SProductWarranty from "@selldone/components-vue/storefront/product/warranty/SProductWarranty.vue";
import SProductGuide from "@selldone/components-vue/storefront/product/guide/SProductGuide.vue";
import SProductFilesList from "@selldone/components-vue/storefront/product/file/list/SProductFilesList.vue";
import KalioReviews from "../../components/kalio/product/KalioReviews.vue";
import SProductSubscriptionMembership from "@selldone/components-vue/storefront/product/subscription/membership/SProductSubscriptionMembership.vue";
import SProductOffers from "@selldone/components-vue/storefront/product/offers/SProductOffers.vue";
import SProductCrossSells from "@selldone/components-vue/storefront/product/cross-sells/SProductCrossSells.vue";
import ProductSection from "@selldone/core-js/enums/product/ProductSection";
import { Article } from "@selldone/core-js";
import { computed } from "vue";
import SProductAdminButton from "@selldone/components-vue/storefront/product/admin/button/SProductAdminButton.vue";
import SProductQr from "@selldone/components-vue/storefront/product/qr/SProductQr.vue";
import SProductSpec from "@selldone/components-vue/storefront/product/spec/SProductSpec.vue";
import SProductArticle from "@selldone/components-vue/storefront/product/article/SProductArticle.vue";
import { XapiProductGetTypes } from "@selldone/sdk-storefront/product";
import SProductLanding from "@selldone/components-vue/storefront/product/landing/SProductLanding.vue";
import CurrencyMixin from "@selldone/components-vue/mixin/currency/CurrencyMixin.ts";
import {StorefrontSeo} from "../../helpers/StorefrontSeo";

export default {
  name: "StorefrontPageProduct",
  mixins: [CurrencyMixin],

  inject: ["$shop"],
  props: {},
  components: {
    SProductLanding,
    SProductArticle,
    SProductSpec,
    SProductQr,
    SProductAdminButton,
    SProductCrossSells,
    SProductOffers,
    SProductSubscriptionMembership,
    KalioReviews,
    SProductFilesList,
    SProductGuide,
    SProductWarranty,
    SProductShipping,
    SProductIncludes,

    SProductOverviewLoading,
    SensoProductOverview,
    SensoRail,
    SensoFbt,

  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Provide
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  provide() {
    return {
      $product: computed(() => this.product),

      /**
       * Current selected variant by user
       */
      $variant: computed(() => this.current_variant),
    };
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Data
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  data: function () {
    return {
      show_article: true, // For refresh article!

      product: null,

      busy: false,

      article_type: Article.Types.Product,
    };
  },

  computed: {
    theme() {
      return this.$shop.theme && !Array.isArray(this.$shop.theme)
        ? this.$shop.theme
        : {};
    },

    current_variant() {
      return this.$store.getters.getCurrentSelectedVariant;
    },

    article() {
      return (
        this.product &&
        this.product.article_pack &&
        this.product.article_pack.article &&
        this.product.article_pack.article
      );
    },

    // ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃ Admin URLs: ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃

    /* The product's pros and cons, as label → note pairs, for Highlights. */
    pros_list() {
      return this.toPairs(this.product?.pros);
    },
    cons_list() {
      return this.toPairs(this.product?.cons);
    },
    ways() {
      return waysOf(this.$shop);
    },
    has_spec() {
      const spec = this.product?.spec;
      return !!spec && typeof spec === "object" && Object.keys(spec).some((k) => k !== "spec_order" && spec[k] !== "group");
    },
    /* Highlights (the pros, else the spec's first group) for the phone,
       where the picture column's box is not shown. */
    highlight_rows() {
      if (this.pros_list.length) return this.pros_list.slice(0, 6);
      const spec = this.product?.spec;
      if (!spec || typeof spec !== "object") return [];
      const order = Array.isArray(spec.spec_order) && spec.spec_order.length ? spec.spec_order : Object.keys(spec);
      const out = [];
      let groups = 0;
      for (const key of order) {
        if (key === "spec_order") continue;
        const value = spec[key];
        if (value === "group") {
          if (++groups > 1) break;
          continue;
        }
        if (value === null || value === undefined || value === "") continue;
        out.push({ key, value: Array.isArray(value) ? value.join(", ") : String(value) });
        if (out.length >= 6) break;
      }
      return out;
    },
    /* The spec in the shop's own groups, for the Specifications table. */
    spec_groups() {
      return specGroups([this.product])
        .map((g) => ({ title: g.title, rows: g.keys.map((key) => ({ key, value: specValue(this.product, key) })).filter((r) => r.value) }))
        .filter((g) => g.rows.length);
    },
    /* Selldone's own blocks (what is included, shipping, warranty, guide,
       files) only when the product has any of them. */
    has_extra() {
      const p = this.product || {};
      return !!(p.includes?.length || p.shipping_id || p.warranty_id || p.guide_id || p.return_policy_id || p.type === "FILE" || p.type === "SUBSCRIPTION");
    },
    has_pros_cons() {
      return (
        (this.product?.pros && Object.keys(this.product.pros).length > 0) ||
        (this.product?.cons && Object.keys(this.product.cons).length > 0)
      );
    },
  },

  watch: {
    $route() {
      this.getProduct();
      this.$forceUpdate(); // Notice we have to use a $ here
    },
  },
  created() {
    this.getProduct();
  },

  methods: {
    askToSignIn() {
      EventBus.$emit("need-login", true);
    },
    toPairs(value) {
      if (!value || typeof value !== "object") return [];
      return Object.entries(value)
        .filter(([key, note]) => key && note != null)
        .map(([key, note]) => ({ key, value: String(note) }));
    },
    getOrder(code) {
      if (!this.theme?.order || !Array.isArray(this.theme?.order)) {
        this.theme.order = Object.values(ProductSection).map((x) => x.code);
      } else {
        // Add missing sections
        Object.values(ProductSection).forEach((t) => {
          if (!this.theme.order.includes(t)) this.theme.order.push(t);
        });
      }

      return this.theme.order.indexOf(code) + 1;
    },

    getProduct() {
      const seoNavigation = StorefrontSeo.captureNavigation();
      const handleSuccessResponse = ({
        product,
      }: XapiProductGetTypes.IResponse) => {
        this.product = product;

        GtagEcommerce.MeasuringViewsOfProductDetails(
          this.$shop,
          product,
          this.GetUserSelectedCurrency().code,
          "product-page",
        );

        // Reject initial-load and superseded responses, including SDK cache callbacks.
        StorefrontSeo.updateProduct(
          product,
          this.$shop,
          seoNavigation,
          this.GetUserSelectedCurrency().code,
        );
      };

      if (window.PRE_LOADED_DATA?.PRODUCT_PACK) {
        console.log("⚡ Turbo load product.");
        handleSuccessResponse(window.PRE_LOADED_DATA.PRODUCT_PACK);
        window.PRE_LOADED_DATA = null; // Clear!
      } else {
        this.busy = true; // Do not show loading!
      }

      window.$storefront.products
        .optimize(60)
        .get(this.getId(this.$route.params.product_id), {
          "augmented-categories": 3, // Return 3 categories in the parent folder of current category
          "augmented-cross-sells": true, // Return max 3 cross-selling items
        })
        .cache(handleSuccessResponse)
        .then(handleSuccessResponse)
        .catch((e) => {
          NotificationService.showLaravelError(e);
        })
        .finally(() => {
          this.busy = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
