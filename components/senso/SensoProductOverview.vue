<!--
  Senso — the top of a product page, in three columns like a big
  electronics store: the gallery (thumbnails beside a big white well; a
  colour or capacity with its own picture shows it), the product (name,
  brand · category · model, the rating line, Colour / Capacity as Selldone's
  own variant picker, key specs, highlights), and a sticky buy card (price,
  Save $X, Was $Y, stock, delivery and pickup lines from the shop's own
  methods, "Add to cart" that becomes − n + in place, Compare and Save).
  On a phone it is one column and the buy button floats at the foot
  (Selldone's sticky buy button).

  Every behaviour is Selldone's SProductOverview, inherited through
  `extends`: variant selection and deep links, preferences, valuation,
  subscriptions, coupons, extra pricing, the buy button, the cart line
  note. This file only supplies the markup; every commerce control in it is
  the platform's own component wired as SProductOverview wires it. One shop
  sells everything here, so there is no seller choice.
-->
<template>
  <div class="sn-pdp">
    <div class="sn-pdp__grid">
      <!-- ▆▆▆▆ Gallery ▆▆▆▆ -->
      <section v-if="showCover" aria-label="Product images" class="sn-pdp__gallery">
        <s-shop-product-slide-show :current-variant="current_variant" :vertical="false" />
      </section>

      <!-- ▆▆▆▆ The product ▆▆▆▆ -->
      <section class="sn-pdp__info">
        <h1 class="sn-pdp__title">{{ $product.title }}</h1>
        <p class="sn-pdp__meta">
          <router-link v-if="$product.brand" :to="brandRoute">{{ $product.brand }}</router-link>
          <template v-if="aisle"><i aria-hidden="true">•</i><router-link :to="aisleTo">{{ aisle.title || aisle.name }}</router-link></template>
          <template v-if="model"><i aria-hidden="true">•</i><span>Model {{ model }}</span></template>
        </p>

        <div class="sn-pdp__rating">
          <template v-if="$product.rate_count && $product.rate">
            <span :style="{ '--k-rate': $product.rate }" class="k-stars"></span>
            <b>{{ numeralFormat($product.rate, "0.0") }}</b>
            <a href="#k-reviews" @click.prevent="toReviews">{{ numeralFormat($product.rate_count, "0,0") }} {{ $product.rate_count === 1 ? "review" : "reviews" }}</a>
          </template>
          <template v-else>
            <span :style="{ '--k-rate': 0 }" class="k-stars"></span>
            <span>No reviews yet</span>
            <a href="#k-reviews" @click.prevent="toReviews">Be the first</a>
          </template>
        </div>

        <p v-if="!has_original_warranty" class="sn-pdp__warn">
          <v-icon size="16">error_outline</v-icon>
          {{ $t("product_info.fake") }}
        </p>

        <div class="sn-pdp__options">
          <s-product-section-variants
            v-model:current-variant="current_variant"
            v-model:filter="filter"
            v-model:selection-values="selection_values"
          ></s-product-section-variants>
          <s-product-section-service v-model:preferences="preferences"></s-product-section-service>
          <s-product-section-valuation
            v-if="preferences && preferences.valuation"
            :correspondingBasketItem="corresponding_basket_item"
            :current-variant="current_variant"
            :preferences="preferences"
          ></s-product-section-valuation>
        </div>

        <div v-if="keySpecs.length" class="sn-pdp__specs">
          <h2>Key specs</h2>
          <dl>
            <template v-for="row in keySpecs" :key="row.key">
              <dt>{{ row.key }}</dt>
              <dd>{{ row.value }}</dd>
            </template>
          </dl>
          <a class="sn-more" href="#sn-specs" @click.prevent="toSpecs">All specifications<senso-icon name="expand_more" size="18" /></a>
        </div>

        <div v-if="highlights.length" class="sn-pdp__hl">
          <h2>Highlights</h2>
          <ul>
            <li v-for="h in highlights" :key="h.key">
              <span class="sn-pdp__tick"><senso-icon name="check" size="15" /></span>
              <span><b>{{ h.key }}</b><small v-if="h.value">{{ h.value }}</small></span>
            </li>
          </ul>
        </div>
      </section>

      <!-- ▆▆▆▆ Buy card ▆▆▆▆ -->
      <aside class="sn-pdp__buy">
        <div class="sn-pdp__price">
          <s-subscription-price-select
            v-if="isSubscription"
            v-model="selected_subscription_price"
            :class="{ pen: !!corresponding_basket_item?.subscription_price_id || !!membership_subscribed_plan }"
            :disabled="!$product.quantity"
            :subscription-prices="subscription_prices"
            return-object
          ></s-subscription-price-select>
          <template v-else>
            <div class="sn-pdp__now">
              <b>{{ fmt(price.now) }}</b>
              <span v-if="price.save > 0" class="sn-save">Save {{ fmt(price.save, true) }}</span>
            </div>
            <p v-if="price.was" class="sn-pdp__was">Was <s>{{ fmt(price.was) }}</s></p>
            <p v-if="endsAt" class="sn-pdp__ends"><senso-icon name="schedule" size="18" />Deal ends in <b>{{ endsLeft }}</b></p>
          </template>
          <s-product-section-tax></s-product-section-tax>
          <s-product-section-cashback :amount="0" :currency="GetUserSelectedCurrency()?.code"></s-product-section-cashback>
        </div>

        <ul class="sn-pdp__lines">
          <li :class="{ '-out': !stock }">
            <senso-icon :name="stock ? 'check_circle' : 'close'" size="20" />
            <span><b>{{ stock ? "In stock" : "Out of stock" }}</b><small v-if="stock && stock <= 5">Only {{ stock }} left</small><small v-else-if="stock">Ready to ship</small><small v-else>Check back soon</small></span>
          </li>
          <li v-for="w in ways" :key="w.key">
            <senso-icon :name="w.key === 'Pickup' ? 'storefront' : 'local_shipping'" size="20" />
            <span
              ><b>{{ w.key === "Pickup" ? "Pickup" : w.word }}</b
              ><small>{{ w.free ? "Free" : w.freeOver ? "Free over " + fmt(w.freeOver, true) : "Cost and day shown at checkout" }}</small></span
            >
          </li>
          <li>
            <senso-icon name="assignment_return" size="20" />
            <span><b>Easy returns</b><small>Ask from your order page</small></span>
          </li>
        </ul>

        <s-product-section-extra-pricings
          :current-variant="current_variant"
          :preferences="preferences"
          :quantity="corresponding_basket_item?.count"
          :selected-vendor-product="selected_vendor_product"
          @select="(val) => $refs.buy_section?.triggerBuyButton(val.min)"
        ></s-product-section-extra-pricings>

        <s-storefront-coupons-list :product-id="$product.id" :variant-id="current_variant ? current_variant.id : undefined"></s-storefront-coupons-list>

        <kalio-basket-line
          v-if="canBuy && corresponding_basket_item"
          :line="corresponding_basket_item"
          :product="$product"
          :stock="current_variant ? current_variant.quantity : $product.quantity"
          :vendor-product="selected_vendor_product"
          class="sn-pdp__basket"
        />
        <s-product-section-buy-button
          v-else
          ref="buy_section"
          :can-buy="canBuy"
          :current-variant="current_variant"
          :hss-sticky-but-button="hssStickyButButton"
          :preferences="preferences"
          :quick-buy-mode="quickBuyMode"
          :selected-subscription-price="selected_subscription_price"
          :selected-vendor-product="selected_vendor_product"
          class="sn-pdp__basket"
        ></s-product-section-buy-button>

        <u-payment-stripe-split
          :basket="corresponding_basket_item ? basket : null"
          :country-code="basket?.receiver_info?.country"
          :preferences="preferences"
          :selected-subscription-price="selected_subscription_price"
          :selected-vendor-product="selected_vendor_product"
          :variant="current_variant"
          :vendor-product="selected_vendor_product"
        ></u-payment-stripe-split>

        <div class="sn-pdp__acts">
          <s-product-section-extra-buttons :current-variant="current_variant"></s-product-section-extra-buttons>
          <v-menu :close-on-content-click="false" location="bottom end" max-width="360">
            <template v-slot:activator="{ props }">
              <button class="sn-pdp__share" type="button" v-bind="props">
                <senso-icon name="share" size="18" />Share
              </button>
            </template>
            <div class="k-pdp__share-sheet">
              <p class="k-eyebrow">Share</p>
              <u-button-share-group
                :description="$product.title_en"
                :media="getShopImagePath($product.icon)"
                :title="$product.title"
                :url="ShopURLs.GetProductLink(shop, $product.id, $product.slug)"
                small
              ></u-button-share-group>
            </div>
          </v-menu>
        </div>
      </aside>
    </div>

    <basket-item-user-message-form
      v-if="basket"
      :basket="basket"
      :product="$product"
      :variant-id="current_variant ? current_variant.id : null"
      class="sn-pdp__note"
    ></basket-item-user-message-form>

    <!-- Selldone's rotated countdown badge (ProductDiscountCountdown) is
         replaced by the "Deal ends in" line in the buy card, on the same
         dates (senso-clock.ts). -->
  </div>
</template>

<script>
import SProductOverview from "@selldone/components-vue/storefront/product/overview/SProductOverview.vue";
import KalioBasketLine from "../kalio/product/KalioBasketLine.vue";
import SensoIcon from "./SensoIcon.vue";
import { aisleIndex, aisleRoute, catalogueRoute, priceOf } from "../kalio/kalio-catalog";
import { specGroups, specValue } from "../kalio/compare/kalio-compare";
import { money, waysOf } from "./senso-home";
import { clock, dealEnd, leftText, releaseClock, useClock } from "./senso-clock";
import "../kalio/kalio-offer-price";

export default {
  name: "SensoProductOverview",
  extends: SProductOverview,
  components: { KalioBasketLine, SensoIcon },

  data() {
    return { window, aisle: null };
  },

  computed: {
    aisleTo() {
      return this.aisle ? aisleRoute(this.aisle) : catalogueRoute();
    },
    brandRoute() {
      return catalogueRoute({ search: this.$product.brand });
    },
    model() {
      return this.$product.mpn || this.$product.sku || specValue(this.$product, "Model") || null;
    },
    currency() {
      return this.GetUserSelectedCurrency()?.code || this.shop?.currency || "USD";
    },
    /** The price of the colour or capacity chosen, by Selldone's own rule. */
    price() {
      const v = this.current_variant && this.current_variant.pricing ? this.current_variant : null;
      const p = priceOf(this.shop, v ? { ...this.$product, ...v, price: v.price, discount: v.discount, dis_start: v.dis_start, dis_end: v.dis_end, currency: v.currency || this.$product.currency } : this.$product, this.currency);
      return { now: p.now, was: p.was, save: p.was ? Math.round((p.was - p.now) * 100) / 100 : 0 };
    },
    /** The deal's end, the chosen variant's when it has its own price. */
    endsAt() {
      return this.price.was ? dealEnd(this.$product, this.current_variant) : null;
    },
    endsLeft() {
      return leftText(this.endsAt, clock.now);
    },
    stock() {
      const q = this.current_variant ? this.current_variant.quantity : this.$product.quantity;
      return Number(q) > 0 ? Number(q) : 0;
    },
    ways() {
      return waysOf(this.shop);
    },
    /** The first rows of the shop's own spec, in its order. */
    keySpecs() {
      const out = [];
      for (const g of specGroups([this.$product])) {
        for (const key of g.keys) {
          const value = specValue(this.$product, key);
          if (value && !/^(product name|color options?)$/i.test(key)) out.push({ key, value });
          if (out.length >= 5) return out;
        }
      }
      return out;
    },
    /** The product's pros, as Highlights. */
    highlights() {
      const pros = this.$product?.pros;
      if (!pros) return [];
      const list = Array.isArray(pros) ? pros : Object.entries(pros).map(([key, value]) => ({ key, value }));
      return list
        .map((p) => (Array.isArray(p) ? { key: p[0], value: p[1] } : { key: p.key || p.title || "", value: p.value || p.text || "" }))
        .filter((p) => p.key)
        .slice(0, 4);
    },
  },

  mounted() {
    useClock();
  },

  beforeUnmount() {
    releaseClock();
  },

  watch: {
    "$product.category_id": {
      handler() {
        this.findAisle();
      },
      immediate: true,
    },
  },

  methods: {
    fmt(n, short = false) {
      return money(n, this.currency, short && Math.abs(n - Math.round(n)) < 0.005);
    },
    toReviews() {
      document.getElementById("k-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    toSpecs() {
      document.getElementById("sn-specs")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    buy(variant = null) {
      if (variant) this.current_variant = variant;
      this.$nextTick(() => this.$refs.buy_section?.triggerBuyButton(1));
    },
    findAisle() {
      const category = this.$product?.category;
      if (category && category.id) {
        this.aisle = category;
        return;
      }
      const id = this.$product?.category_id;
      if (!id) {
        this.aisle = null;
        return;
      }
      aisleIndex().then((index) => {
        if (this.$product?.category_id === id) this.aisle = index.get(id) || null;
      });
    },
  },
};
</script>
