<!--
  Senso — the footer, on a pale mint ground: the wordmark and the shop's
  social links on one line; four link columns with bold headings — the
  product families (from the live categories), Support, Company (the
  merchant's own footer menu as set in Selldone, or the standard pages) and
  Policies; then the theme strip (the palettes, a custom colour and
  Light / Dark: the owner, 10 November 2026, after talking with the Selldone
  team, moved the theme switcher from the header to the footer; on Senso's
  showcase shops only), then a legal row (copyright, Terms, Privacy, the
  cookie settings, the language and currency) and a small "made with
  selldone".

  Everything is read live. A social link shows only when the shop has set
  it. A shop with custom footer code keeps Selldone's footer (the layout
  decides).
-->
<template>
  <footer class="k-footer sn-footer">
    <div class="sn-footer__in">
      <div class="sn-footer__top">
        <router-link :aria-label="t('senso.footer.homeLabel', '{shop} home', { shop: shopTitle })" :to="{ path: '/' }" class="sn-footer__brand"><senso-wordmark /></router-link>
        <nav v-if="socials.length" :aria-label="t('senso.footer.follow', 'Follow us')" class="sn-footer__social">
          <a v-for="s in socials" :key="s.network" :aria-label="s.title" :href="s.url" rel="noopener" target="_blank">
            <senso-icon v-if="s.icon" :name="s.icon" size="20" />
            <img v-else :alt="s.title" :src="s.image" height="18" width="18" />
          </a>
        </nav>
      </div>

      <div class="sn-footer__grid">
        <nav aria-labelledby="sn-f-shop" class="sn-footer__col">
          <h3 id="sn-f-shop">{{ t("senso.footer.shop", "Shop") }}</h3>
          <router-link v-for="f in families" :key="f.key + f.title" :to="familyTo(f)">{{ f.title }}</router-link>
          <router-link :to="dealsRoute">{{ t("senso.listing.offers", "Offers") }}</router-link>
          <router-link :to="catalogueRoute">{{ t("listing.allProducts", "All products") }}</router-link>
        </nav>
        <nav aria-labelledby="sn-f-support" class="sn-footer__col">
          <h3 id="sn-f-support">{{ t("senso.footer.support", "Support") }}</h3>
          <router-link :to="faqRoute">{{ t("senso.footer.help", "Help & FAQ") }}</router-link>
          <router-link :to="contactRoute">{{ t("footer.links.contact", "Contact us") }}</router-link>
          <router-link :to="ordersRoute">{{ t("senso.footer.track", "Track an order") }}</router-link>
          <router-link :to="cartRoute">{{ t("senso.footer.cart", "Your cart") }}</router-link>
          <router-link v-if="user" :to="{ name: 'KalioAccountHome' }">{{ t("header.yourAccount", "Your account") }}</router-link>
          <button v-else class="sn-footer__textbtn" type="button" @click="signIn">{{ t("common.signIn", "Sign in") }}</button>
        </nav>
        <nav aria-labelledby="sn-f-company" class="sn-footer__col">
          <h3 id="sn-f-company">{{ t("senso.footer.company", "Company") }}</h3>
          <router-link v-for="(item, i) in shopLinks" :key="'l' + i" :to="item.to">{{ item.name }}</router-link>
        </nav>
        <nav aria-labelledby="sn-f-policies" class="sn-footer__col">
          <h3 id="sn-f-policies">{{ t("senso.footer.policies", "Policies") }}</h3>
          <router-link :to="termsRoute">{{ t("senso.footer.termsOfService", "Terms of service") }}</router-link>
          <router-link :to="privacyRoute">{{ t("signin.legal.privacy", "Privacy policy") }}</router-link>
          <router-link :to="compareRoute">{{ t("senso.footer.compare", "Compare products") }}</router-link>
        </nav>
      </div>

      <div v-if="themeOn" class="sn-footer__theme">
        <theme-switcher-row />
      </div>

      <div class="sn-footer__legal">
        <span class="sn-footer__copy">{{ t("senso.footer.copy", "© {year} {shop}", { year: String(year), shop: shopTitle }) }}</span>
        <router-link :to="termsRoute">{{ t("footer.terms", "Terms") }}</router-link>
        <router-link :to="privacyRoute">{{ t("footer.privacy", "Privacy") }}</router-link>
        <s-footer-section-gdpr></s-footer-section-gdpr>
        <span class="sn-footer__grow"></span>
        <s-footer-section-selldone class="sn-footer__made"></s-footer-section-selldone>
      </div>
    </div>
  </footer>
</template>

<script>
import SFooterSectionGdpr from "@selldone/components-vue/storefront/footer/section/gdpr/SFooterSectionGdpr.vue";
import SFooterSectionSelldone from "@selldone/components-vue/storefront/footer/section/selldone/SFooterSectionSelldone.vue";
import { CreateSocialConnectLink, SocialNetwork } from "@selldone/core-js/enums/social/SocialNetwork";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import SensoIcon from "../../senso/SensoIcon.vue";
import SensoWordmark from "../../senso/SensoWordmark.vue";
import { aisleRoute, aisles, catalogueRoute, dealsRoute } from "../kalio-catalog";
import { familiesOf } from "../../senso/senso-families";
import ThemeSwitcherRow from "../../theme-switcher/ThemeSwitcherRow.vue";
import { themeState } from "../../theme-switcher/theme-switcher";
import { t } from "../i18n/kalio-i18n";

/* Senso's own line icons for the common networks; others keep Selldone's. */
const SOCIAL_ICONS = { instagram: "instagram", youtube: "youtube", twitter: "x", x: "x", facebook: "facebook", linkedin: "linkedin", tiktok: "tiktok" };

export default {
  name: "KalioFooter",
  components: { SFooterSectionGdpr, SFooterSectionSelldone, SensoIcon, SensoWordmark, ThemeSwitcherRow },
  inject: ["$shop"],

  data() {
    return { aisleList: [], year: new Date().getFullYear(), theme: themeState };
  },

  computed: {
    shopTitle() {
      return this.$shop?.title || "";
    },
    user() {
      return this.$store.getters.getUser;
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
    /** The theme strip shows only where the switcher is on (Senso's showcase shops). */
    themeOn() {
      return this.theme.enabled;
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
        { name: t("footer.links.about", "About us"), to: { name: this.r.SHOP_PROFILE_PAGE_ABOUT_US } },
        { name: t("senso.footer.journal", "Journal"), to: { name: this.r.BLOGS_PAGE } },
        { name: t("footer.links.contact", "Contact us"), to: this.contactRoute },
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
