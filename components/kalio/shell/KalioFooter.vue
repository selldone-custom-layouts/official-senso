<!--
  Senso — the footer, on a pale mint ground: the wordmark and the shop's
  social links on one line; four link columns with bold headings — the
  product families (from the live categories), Support, Company (the
  merchant's own footer menu as set in Selldone, or the standard pages) and
  Policies; then a legal row (copyright, Terms, Privacy, the cookie
  settings, the language and currency) and a small "made with selldone".

  Everything is read live. A social link shows only when the shop has set
  it. A shop with custom footer code keeps Selldone's footer (the layout
  decides).
-->
<template>
  <footer class="k-footer sn-footer">
    <div class="sn-footer__in">
      <div class="sn-footer__top">
        <router-link :aria-label="`${shopTitle} home`" :to="{ path: '/' }" class="sn-footer__brand"><senso-wordmark /></router-link>
        <nav v-if="socials.length" aria-label="Follow us" class="sn-footer__social">
          <a v-for="s in socials" :key="s.network" :aria-label="s.title" :href="s.url" rel="noopener" target="_blank">
            <senso-icon v-if="s.icon" :name="s.icon" size="20" />
            <img v-else :alt="s.title" :src="s.image" height="18" width="18" />
          </a>
        </nav>
      </div>

      <div class="sn-footer__grid">
        <nav aria-labelledby="sn-f-shop" class="sn-footer__col">
          <h3 id="sn-f-shop">Shop</h3>
          <router-link v-for="f in families" :key="f.key + f.title" :to="familyTo(f)">{{ f.title }}</router-link>
          <router-link :to="dealsRoute">Offers</router-link>
          <router-link :to="catalogueRoute">All products</router-link>
        </nav>
        <nav aria-labelledby="sn-f-support" class="sn-footer__col">
          <h3 id="sn-f-support">Support</h3>
          <router-link :to="faqRoute">Help &amp; FAQ</router-link>
          <router-link :to="contactRoute">Contact us</router-link>
          <router-link :to="ordersRoute">Track an order</router-link>
          <router-link :to="cartRoute">Your cart</router-link>
          <router-link v-if="user" :to="{ name: 'KalioAccountHome' }">Your account</router-link>
          <button v-else class="sn-footer__textbtn" type="button" @click="signIn">Sign in</button>
        </nav>
        <nav aria-labelledby="sn-f-company" class="sn-footer__col">
          <h3 id="sn-f-company">Company</h3>
          <router-link v-for="(item, i) in shopLinks" :key="'l' + i" :to="item.to">{{ item.name }}</router-link>
        </nav>
        <nav aria-labelledby="sn-f-policies" class="sn-footer__col">
          <h3 id="sn-f-policies">Policies</h3>
          <router-link :to="termsRoute">Terms of service</router-link>
          <router-link :to="privacyRoute">Privacy policy</router-link>
          <router-link :to="compareRoute">Compare products</router-link>
        </nav>
      </div>

      <div class="sn-footer__legal">
        <span class="sn-footer__copy">© {{ year }} {{ shopTitle }}</span>
        <router-link :to="termsRoute">Terms</router-link>
        <router-link :to="privacyRoute">Privacy</router-link>
        <s-footer-section-gdpr></s-footer-section-gdpr>
        <div v-if="hasPickers" class="sn-footer__pickers">
          <s-language-selector v-if="hasLanguages" hide-details variant="outlined"></s-language-selector>
          <u-currency-selector v-if="$shop.currencies && $shop.currencies.length > 1" :shop="$shop" hide-details @change="onChangeUserSelectedCurrency" />
        </div>
        <span class="sn-footer__grow"></span>
        <s-footer-section-selldone class="sn-footer__made"></s-footer-section-selldone>
      </div>
    </div>
  </footer>
</template>

<script>
import SLanguageSelector from "@selldone/components-vue/storefront/language/selector/SLanguageSelector.vue";
import UCurrencySelector from "@selldone/components-vue/ui/currency/selector/UCurrencySelector.vue";
import SFooterSectionGdpr from "@selldone/components-vue/storefront/footer/section/gdpr/SFooterSectionGdpr.vue";
import SFooterSectionSelldone from "@selldone/components-vue/storefront/footer/section/selldone/SFooterSectionSelldone.vue";
import { CreateSocialConnectLink, SocialNetwork } from "@selldone/core-js/enums/social/SocialNetwork";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import SensoIcon from "../../senso/SensoIcon.vue";
import SensoWordmark from "../../senso/SensoWordmark.vue";
import { aisleRoute, aisles, catalogueRoute, dealsRoute } from "../kalio-catalog";
import { familiesOf } from "../../senso/senso-families";

/* Senso's own line icons for the common networks; others keep Selldone's. */
const SOCIAL_ICONS = { instagram: "instagram", youtube: "youtube", twitter: "x", x: "x", facebook: "facebook", linkedin: "linkedin", tiktok: "tiktok" };

export default {
  name: "KalioFooter",
  components: { SLanguageSelector, UCurrencySelector, SFooterSectionGdpr, SFooterSectionSelldone, SensoIcon, SensoWordmark },
  inject: ["$shop"],

  data() {
    return { aisleList: [], year: new Date().getFullYear() };
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
    families() {
      return familiesOf(this.aisleList);
    },
    socials() {
      return (this.$shop?.socials || [])
        .filter((s) => s && s.network && SocialNetwork[s.network] && s.url)
        .map((s) => {
          const key = String(s.network).toLowerCase();
          return {
            network: s.network,
            title: this.$t ? this.$t(SocialNetwork[s.network].title) : s.network,
            url: CreateSocialConnectLink(s.network, s.url),
            icon: SOCIAL_ICONS[key] || null,
            image: SocialNetwork[s.network].image,
          };
        });
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
    compareRoute() {
      return { name: this.r.COMPARISON_PAGE };
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
        .filter((item) => !/^(privacy|terms( of (use|service))?)$/i.test(String(item.name).trim()))
        .filter((item) => item.to.path !== "/")
        .map((item) => (item.to.name === shopPage && !item.to.query ? { ...item, to: this.catalogueRoute } : item));
      if (items.length) return items;
      return [
        { name: "About us", to: { name: this.r.SHOP_PROFILE_PAGE_ABOUT_US } },
        { name: "Journal", to: { name: this.r.BLOGS_PAGE } },
        { name: "Contact us", to: this.contactRoute },
      ];
    },
  },

  mounted() {
    aisles().then((list) => (this.aisleList = list));
  },

  methods: {
    /** A family opens its first category. */
    familyTo(f) {
      return aisleRoute(f.categories[0]);
    },
    signIn() {
      EventBus.$emit("need-login", true);
    },
  },
};
</script>
