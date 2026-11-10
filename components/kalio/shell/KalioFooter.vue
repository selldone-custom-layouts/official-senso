<!--
  Senso — the footer (Home A "Deals hub", 8 November 2026): white, under
  the page. A service row first (Track your order, Shipping & delivery,
  Returns & exchanges, Help center, Contact us); then link columns — Shop
  (the shop's categories and All products), Orders, the shop (the
  merchant's own footer menu as set in Selldone, or the standard pages),
  Policies — beside a newsletter card (Selldone's own subscribe call) with
  the shop's social links; then a legal row with the copyright, Terms,
  Privacy, the cookie settings and a small "made with selldone".

  Everything is read live. A shop with custom footer code keeps Selldone's
  footer (the layout decides).
-->
<template>
  <footer class="k-footer sn-footer">
    <nav aria-label="Customer service" class="sn-footer__svc">
      <router-link :to="ordersRoute"><senso-icon name="local_shipping" size="30" /><span>Track your order</span></router-link>
      <router-link :to="termsRoute"><senso-icon name="package_2" size="30" /><span>Shipping &amp; delivery</span></router-link>
      <router-link :to="termsRoute"><senso-icon name="assignment_return" size="30" /><span>Returns &amp; exchanges</span></router-link>
      <router-link :to="faqRoute"><senso-icon name="support_agent" size="30" /><span>Help center</span></router-link>
      <router-link :to="contactRoute"><senso-icon name="mail" size="30" /><span>Contact us</span></router-link>
    </nav>

    <div class="sn-footer__grid">
      <nav aria-labelledby="sn-f-shop" class="sn-footer__col">
        <h3 id="sn-f-shop">Shop</h3>
        <router-link :to="dealsRoute">Today’s deals</router-link>
        <router-link v-for="aisle in aisleList.slice(0, 6)" :key="aisle.id" :to="aisleRoute(aisle)">{{ aisle.title || aisle.name }}</router-link>
        <router-link :to="catalogueRoute">All products</router-link>
      </nav>
      <nav aria-labelledby="sn-f-orders" class="sn-footer__col">
        <h3 id="sn-f-orders">Orders</h3>
        <router-link :to="ordersRoute">Track an order</router-link>
        <router-link :to="cartRoute">Your cart</router-link>
        <router-link v-if="user" :to="{ name: 'KalioAccountHome' }">Your account</router-link>
        <button v-else class="sn-footer__textbtn" type="button" @click="signIn">Sign in</button>
        <router-link v-if="user" :to="{ name: window.$storefront.routes.USER_FAVORITES_PAGE }">Saved items</router-link>
      </nav>
      <nav aria-labelledby="sn-f-shopname" class="sn-footer__col">
        <h3 id="sn-f-shopname">{{ shopTitle }}</h3>
        <router-link v-for="(item, i) in shopLinks" :key="'l' + i" :to="item.to">{{ item.name }}</router-link>
      </nav>
      <nav aria-labelledby="sn-f-policies" class="sn-footer__col">
        <h3 id="sn-f-policies">Policies</h3>
        <router-link :to="termsRoute">Terms of service</router-link>
        <router-link :to="privacyRoute">Privacy policy</router-link>
        <router-link :to="faqRoute">FAQ</router-link>
      </nav>

      <div class="sn-footer__news">
        <h3>Get the latest deals</h3>
        <p>New arrivals and price drops, about once a week.</p>
        <form v-if="!subscribed" class="sn-footer__form" @submit.prevent="subscribe">
          <input v-model="email" aria-label="Email address" autocomplete="email" placeholder="Email address" required type="email" />
          <button :disabled="busy" class="sn-btn" type="submit">Sign up</button>
        </form>
        <p v-else class="sn-footer__ok"><senso-icon name="check_circle" size="20" />You’re on the list. Watch your inbox.</p>
        <p v-if="error" class="sn-footer__err">{{ error }}</p>
        <s-storefront-social-buttons class="sn-footer__social"></s-storefront-social-buttons>
        <div v-if="hasPickers" class="sn-footer__pickers">
          <s-language-selector v-if="hasLanguages" hide-details variant="outlined"></s-language-selector>
          <u-currency-selector
            v-if="$shop.currencies && $shop.currencies.length > 1"
            :shop="$shop"
            hide-details
            @change="onChangeUserSelectedCurrency"
          />
        </div>
      </div>
    </div>

    <div class="sn-footer__legal">
      <span class="sn-footer__copy">© {{ year }} {{ shopTitle }}. Prices and offers can change.</span>
      <router-link :to="termsRoute">Terms</router-link>
      <router-link :to="privacyRoute">Privacy</router-link>
      <s-footer-section-gdpr></s-footer-section-gdpr>
      <s-footer-section-selldone class="sn-footer__made"></s-footer-section-selldone>
    </div>
  </footer>
</template>

<script>
import SStorefrontSocialButtons from "@selldone/components-vue/storefront/social/SStorefrontSocialButtons.vue";
import SLanguageSelector from "@selldone/components-vue/storefront/language/selector/SLanguageSelector.vue";
import UCurrencySelector from "@selldone/components-vue/ui/currency/selector/UCurrencySelector.vue";
import SFooterSectionGdpr from "@selldone/components-vue/storefront/footer/section/gdpr/SFooterSectionGdpr.vue";
import SFooterSectionSelldone from "@selldone/components-vue/storefront/footer/section/selldone/SFooterSectionSelldone.vue";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import SensoIcon from "../../senso/SensoIcon.vue";
import { aisleRoute, aisles, catalogueRoute, dealsRoute } from "../kalio-catalog";

export default {
  name: "KalioFooter",
  components: { SStorefrontSocialButtons, SLanguageSelector, UCurrencySelector, SFooterSectionGdpr, SFooterSectionSelldone, SensoIcon },
  inject: ["$shop"],

  data() {
    return { window, aisleList: [], year: new Date().getFullYear(), email: "", busy: false, subscribed: false, error: null };
  },

  computed: {
    shopTitle() {
      return this.$shop?.title || "";
    },
    user() {
      return this.$store.getters.getUser;
    },
    hasLanguages() {
      return (this.$shop?.languages || []).length > 1;
    },
    hasPickers() {
      return this.hasLanguages || (this.$shop?.currencies || []).length > 1;
    },
    catalogueRoute() {
      return catalogueRoute();
    },
    dealsRoute() {
      return dealsRoute();
    },
    r() {
      return window.$storefront.routes;
    },
    ordersRoute() {
      return { name: this.r.HISTORY_ORDERS_PHYSICAL };
    },
    cartRoute() {
      return { name: this.r.BASKET_PAGE, params: { type: "PHYSICAL" } };
    },
    termsRoute() {
      return { name: this.r.SHOP_PROFILE_PAGE_TERMS };
    },
    privacyRoute() {
      return { name: this.r.SHOP_PROFILE_PAGE_PRIVACY };
    },
    contactRoute() {
      return { name: this.r.SHOP_CONTACT_US };
    },
    faqRoute() {
      return { name: "ShopFAQ" };
    },
    /* The merchant's footer menu (Selldone menus, type FOOTER), flattened,
       or the standard pages when the shop has none. A link to a route this
       storefront does not have is left out; a "Shop" link opens the
       catalogue (the shop page is the home here). */
    shopLinks() {
      const menu = this.$shop?.menus?.find((it) => it.type === "FOOTER" && it.enable !== false);
      const shopPage = this.r.SHOP_PAGE;
      const items = (menu?.menu || [])
        .flat()
        .filter((item) => item && item.name && item.to)
        .filter((item) => !item.to.name || this.$router.hasRoute(item.to.name))
        .map((item) => (item.to.name === shopPage && !item.to.query ? { ...item, to: this.catalogueRoute } : item));
      if (items.length) return items;
      return [
        { name: "About us", to: { name: this.r.SHOP_PROFILE_PAGE_ABOUT_US } },
        { name: "Blog", to: { name: this.r.BLOGS_PAGE } },
        { name: "Contact us", to: this.contactRoute },
        { name: "FAQ", to: this.faqRoute },
      ];
    },
  },

  mounted() {
    aisles().then((list) => (this.aisleList = list));
  },

  methods: {
    aisleRoute,
    signIn() {
      EventBus.$emit("need-login", true);
    },
    /* Selldone's own newsletter subscription for the shop. It belongs to a
       customer account, so a guest is asked to sign in first. */
    subscribe() {
      if (!this.email) return;
      if (!this.user) {
        this.signIn();
        return;
      }
      this.busy = true;
      this.error = null;
      window.axios
        .post(window.XAPI.POST_SUBSCRIBE(window.$storefront.name), { email: this.email })
        .then(({ data }) => {
          if (data?.error) this.error = data.error_msg || "That didn’t work. Try again.";
          else this.subscribed = true;
        })
        .catch(() => (this.error = "That didn’t work. Try again in a minute."))
        .finally(() => (this.busy = false));
    },
  },
};
</script>
