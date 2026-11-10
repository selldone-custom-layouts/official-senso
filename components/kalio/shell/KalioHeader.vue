<!--
  Senso — the header: a brand site's bar. The wordmark on the left; the
  product families in the middle (TV & Display, Audio, Computing… built
  from the live categories, senso-families.ts), each opening a clean mega
  panel on a click (a second click, Esc, a click outside or a page change
  closes it; no scrim); on the right Support, the search icon (a full-width
  search panel with Selldone's suggestions and the categories), Account and
  the cart. The theme switcher lives in the footer (the owner, 10 November
  2026, after talking with the Selldone team).

  On the home page it sits over the dark hero, clear with white words, and
  turns solid white with ink words and a hairline once the page scrolls (or
  a panel opens); on every other page it is solid. It stays at the top.

  On a phone: the wordmark, then search, account, cart and the menu
  button, which opens a full-screen panel with the families as accordions.
  Never a bottom tab bar.

  Every working part is the platform's: the search box and its events (the
  layout's onSearch/onClear), sign-in through the app's need-login event,
  the cart count and lines from the storefront mixin, the language and
  currency pickers. A shop with custom header code keeps Selldone's header
  (the layout decides), and a native app shell shows none.
-->
<template>
  <header
    v-if="!$store.getters.getIsNative"
    ref="root"
    :class="{ '-home': onHome, '-over': over, '-solid': !over }"
    class="k-header sn-header"
  >
    <div class="sn-header__bar">
      <router-link :aria-label="`${shopTitle} home`" :to="homeRoute" class="sn-header__brand"><senso-wordmark :light="over" /></router-link>

      <nav v-if="!compact && families.length" aria-label="Products" class="sn-header__nav">
        <button
          v-for="f in families"
          :key="f.key + f.title"
          :aria-expanded="famKey === keyOf(f)"
          :class="{ '-on': famKey === keyOf(f) }"
          class="sn-header__fam"
          type="button"
          @click.stop="toggleFamily(f)"
        >
          {{ f.title }}
        </button>
      </nav>
      <span class="sn-header__grow"></span>

      <nav aria-label="Your account" class="sn-header__acts">
        <!-- Language and currency (the owner's choice B, 10 November 2026):
             a small pill before Support; the phone gets a row in the menu. -->
        <region-switcher-button v-if="!compact" button-class="sn-header__region" />
        <router-link v-if="!compact" :to="helpRoute" class="sn-header__txt">{{ t("header.support") }}</router-link>
        <button :aria-expanded="searchOpen" aria-label="Search" class="sn-header__ic -search" type="button" @click.stop="toggleSearch">
          <senso-icon :name="searchOpen ? 'close' : 'search'" size="22" />
        </button>

        <router-link v-if="user" :aria-label="`Your account, ${firstName}`" :to="profileRoute" class="sn-header__ic -account">
          <img v-if="user.id && !avatar_failed" :src="getUserAvatar(user.id)" alt="" class="sn-header__avatar" height="26" width="26" @error="avatar_failed = true" />
          <senso-icon v-else name="person" size="22" />
        </router-link>
        <button v-else :disabled="busyUser" aria-label="Sign in" class="sn-header__ic -account" type="button" @click="signIn">
          <senso-icon name="person" size="22" />
        </button>

        <!-- The badge counts units, as the drawer's "3 items" does. -->
        <button :aria-label="`Cart, ${basketUnits} ${basketUnits === 1 ? 'item' : 'items'}`" class="sn-header__ic -cart" type="button" @click="basket = true">
          <senso-icon name="shopping_cart" size="22" />
          <i v-if="basketUnits" class="sn-header__count">{{ basketUnits }}</i>
        </button>

        <button v-if="compact" :aria-expanded="menu" aria-label="Menu" class="sn-header__ic -menu" type="button" @click="menu = true">
          <senso-icon name="menu" size="22" />
        </button>
      </nav>
    </div>

    <!-- ▆▆▆▆▆▆▆▆ A family's mega panel ▆▆▆▆▆▆▆▆ -->
    <transition name="sn-drop">
      <div v-if="openFamily && !compact" class="sn-header__panel" @click.stop>
        <senso-mega-menu :family="openFamily" @close="famKey = null" />
      </div>
    </transition>

    <!-- ▆▆▆▆▆▆▆▆ The search panel ▆▆▆▆▆▆▆▆ -->
    <transition name="sn-drop">
      <div v-if="searchOpen" class="sn-header__panel sn-searchpanel" @click.stop @keydown.esc="searchOpen = false">
        <div class="sn-searchpanel__in">
          <p class="sn-eyebrow">Search</p>
          <div class="sn-searchpanel__box">
            <s-storefront-search-box
              :dark="false"
              :expand-input="true"
              :negative-qr-margin="false"
              :placeholder="`Search ${shopTitle}`"
              :title="`Search ${shopTitle}`"
              color="#0d1b1e"
              flat
              no-qr
              persistent-placeholder
              rounded
              variant="solo"
              @onClear="$emit('clear')"
              @onSearch="onSearch"
            />
          </div>
          <div v-if="aisleList.length" class="sn-searchpanel__quick">
            <p class="sn-searchpanel__label">Popular categories</p>
            <nav aria-label="Popular categories" class="sn-searchpanel__chips">
              <router-link v-for="a in aisleList.slice(0, 10)" :key="a.id" :to="aisleRoute(a)" class="sn-pillchip" @click="searchOpen = false">
                <senso-category-icon :category="a" size="22" />{{ a.title || a.name }}
              </router-link>
            </nav>
          </div>
        </div>
      </div>
    </transition>

    <teleport to="body">
      <!-- ▆▆▆▆▆▆▆▆ Cart drawer ▆▆▆▆▆▆▆▆ -->
      <v-navigation-drawer
        v-model="basket"
        :location="$vuetify.locale.isRtl ? 'left' : 'right'"
        :width="windowWidth < 520 ? windowWidth : 460"
        class="k-drawer -basket"
        temporary
      >
        <div class="k-drawer__head">
          <p class="k-drawer__title">
            Your cart<small v-if="basketUnits">{{ basketUnits }} {{ basketUnits === 1 ? "item" : "items" }}</small>
          </p>
          <button aria-label="Close" class="k-header__icon" type="button" @click="basket = false">
            <senso-icon name="close" size="22" />
          </button>
        </div>
        <!-- Empty: a calm card that leads back to the range. -->
        <div v-if="!itemsCount" class="k-drawer__empty">
          <span aria-hidden="true" class="k-drawer__empty-mark"><senso-icon name="shopping_cart" size="28" /></span>
          <p class="k-drawer__empty-title">Your cart is empty</p>
          <p class="k-drawer__empty-text">Pick something you like and it will wait for you here.</p>
          <div class="k-drawer__empty-ctas">
            <router-link :to="catalogueRoute" class="sn-btn" @click="basket = false">Explore the range</router-link>
            <router-link :to="dealsRoute" class="sn-btn -line" @click="basket = false">See offers</router-link>
          </div>
          <template v-if="aisleList.length">
            <p class="k-eyebrow k-drawer__empty-label">Or start with a category</p>
            <nav aria-label="Categories" class="k-drawer__empty-aisles">
              <router-link v-for="aisle in aisleList.slice(0, 8)" :key="aisle.id" :to="aisleRoute(aisle)" class="sn-pillchip" @click="basket = false">
                <senso-category-icon :category="aisle" size="22" />{{ aisle.title || aisle.name }}
              </router-link>
            </nav>
          </template>
        </div>
        <kalio-basket-drawer v-else @close="basket = false" />
      </v-navigation-drawer>

      <!-- ▆▆▆▆▆▆▆▆ Phone menu: a full-screen panel, the families as accordions ▆▆▆▆▆▆▆▆ -->
      <v-navigation-drawer
        v-model="menu"
        :location="$vuetify.locale.isRtl ? 'right' : 'left'"
        :width="windowWidth"
        class="k-drawer -menu sn-phonemenu"
        temporary
      >
        <div class="k-drawer__head">
          <router-link :aria-label="shopTitle + ' home'" :to="homeRoute" class="sn-phonemenu__brand" @click="menu = false"><senso-wordmark /></router-link>
          <button aria-label="Close" class="k-header__icon" type="button" @click="menu = false">
            <senso-icon name="close" size="24" />
          </button>
        </div>

        <nav aria-label="Products" class="sn-phonemenu__fams">
          <div v-for="f in families" :key="f.key + f.title" :class="{ '-open': openAcc === keyOf(f) }" class="sn-acc">
            <button :aria-expanded="openAcc === keyOf(f)" class="sn-acc__head" type="button" @click="openAcc = openAcc === keyOf(f) ? null : keyOf(f)">
              <span>{{ f.title }}</span><senso-icon :name="openAcc === keyOf(f) ? 'remove' : 'add'" size="20" />
            </button>
            <!-- The owner's option A (10 November 2026): a family of more than
                 8 categories shows its first 6 (the shop's order), then
                 "Show N more"; the rest open inline above the button, which
                 then reads "Show fewer". 8 or fewer: all, no button. -->
            <div v-if="openAcc === keyOf(f)" class="sn-acc__body">
              <router-link v-for="c in firstCats(f)" :key="c.id" :to="aisleRoute(c)" class="sn-acc__link" @click="menu = false">
                <senso-category-icon :category="c" size="28" />
                <span><b>{{ c.title || c.name }}</b><small v-if="catLine(c)">{{ catLine(c) }}</small></span>
              </router-link>
              <template v-if="restCats(f).length">
                <div :id="moreId(f)" :class="{ '-open': moreOpen === keyOf(f) }" :inert="moreOpen !== keyOf(f) || null" class="sn-acc__extra">
                  <div class="sn-acc__extra-in">
                    <router-link v-for="(c, i) in restCats(f)" :key="c.id" :style="{ '--i': i }" :to="aisleRoute(c)" class="sn-acc__link" @click="menu = false">
                      <senso-category-icon :category="c" size="28" />
                      <span><b>{{ c.title || c.name }}</b><small v-if="catLine(c)">{{ catLine(c) }}</small></span>
                    </router-link>
                  </div>
                </div>
                <button
                  :aria-controls="moreId(f)"
                  :aria-expanded="moreOpen === keyOf(f) ? 'true' : 'false'"
                  class="sn-acc__more"
                  type="button"
                  @click="moreOpen = moreOpen === keyOf(f) ? null : keyOf(f)"
                >
                  <span aria-hidden="true" class="sn-acc__morechip"><senso-icon :name="moreOpen === keyOf(f) ? 'expand_less' : 'expand_more'" size="20" /></span>
                  <b>{{ moreOpen === keyOf(f) ? t("menu.showFewer") : t("menu.showMore", { n: restCats(f).length }) }}</b>
                </button>
              </template>
            </div>
          </div>
          <router-link :to="dealsRoute" class="sn-acc__head -link" @click="menu = false"><span>Offers</span><senso-icon name="arrow_forward" size="20" /></router-link>
          <router-link :to="newRoute" class="sn-acc__head -link" @click="menu = false"><span>New arrivals</span><senso-icon name="arrow_forward" size="20" /></router-link>
        </nav>

        <div class="sn-phonemenu__more">
          <p class="sn-eyebrow">Support</p>
          <router-link :to="helpRoute" class="k-drawer__link" @click="menu = false"><senso-icon name="help" size="20" />Help &amp; FAQ</router-link>
          <router-link :to="contactRoute" class="k-drawer__link" @click="menu = false"><senso-icon name="mail" size="20" />Contact us</router-link>
          <router-link :to="ordersRoute" class="k-drawer__link" @click="menu = false"><senso-icon name="local_shipping" size="20" />Track an order</router-link>
          <router-link :to="blogRoute" class="k-drawer__link" @click="menu = false"><senso-icon name="receipt_long" size="20" />Journal</router-link>
          <region-sheet row-class="k-drawer__link sn-menu__region" />
          <template v-if="user">
            <router-link :to="profileRoute" class="k-drawer__link" @click="menu = false"><senso-icon name="person" size="20" />My account</router-link>
            <router-link :to="savedRoute" class="k-drawer__link" @click="menu = false"><senso-icon name="favorite" size="20" />Saved</router-link>
          </template>
          <button v-else class="sn-btn -block" type="button" @click="menu = false; signIn()">Sign in</button>
        </div>

      </v-navigation-drawer>
    </teleport>
  </header>
</template>

<script>
import { BRAND } from "../kalio-brand";
import SStorefrontSearchBox from "@selldone/components-vue/storefront/search/SStorefrontSearchBox.vue";
import RegionSwitcherButton from "../../region-switcher/RegionSwitcherButton.vue";
import RegionSheet from "../../region-switcher/RegionSheet.vue";
import { t } from "../../region-switcher/region";
import KalioBasketDrawer from "./KalioBasketDrawer.vue";
import SensoWordmark from "../../senso/SensoWordmark.vue";
import SensoIcon from "../../senso/SensoIcon.vue";
import SensoCategoryIcon from "../../senso/SensoCategoryIcon.vue";
import SensoMegaMenu from "../../senso/SensoMegaMenu.vue";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import { aisleRoute, aisles, catalogueRoute, dealsRoute } from "../kalio-catalog";
import { allProducts, categoryLine, heroState, money } from "../../senso/senso-home";
import { familiesOf } from "../../senso/senso-families";
import { basketView } from "../kalio-basket";

export default {
  name: "KalioHeader",
  components: { SStorefrontSearchBox, RegionSwitcherButton, RegionSheet, KalioBasketDrawer, SensoWordmark, SensoIcon, SensoCategoryIcon, SensoMegaMenu },
  inject: ["$shop"],

  props: {
    /** The current route asks for the search box (route meta "search"). */
    showSearch: { type: Boolean, default: true },
  },

  emits: ["search", "clear"],

  data() {
    return {
      BRAND,
      hero: heroState,
      aisleList: [],
      all: [],
      /* The open family, by key (a computed family is a new object each time). */
      famKey: null,
      openAcc: null,
      /* The family whose extra categories are shown (phone menu); reset on every open. */
      moreOpen: null,
      searchOpen: false,
      basket: false,
      menu: false,
      windowWidth: window.innerWidth,
      scrolled: window.scrollY > 24,
      avatar_failed: false,
    };
  },

  computed: {
    shopTitle() {
      return this.$shop?.title || BRAND.name || "";
    },
    user() {
      return this.$store.getters.getUser;
    },
    firstName() {
      const name = String(this.user?.name || "").trim().split(/\s+/)[0];
      return name || "you";
    },
    busyUser() {
      return this.$store.getters.getBusyUser;
    },
    compact() {
      return this.$vuetify.display.smAndDown;
    },
    families() {
      return familiesOf(this.aisleList);
    },
    openFamily() {
      return this.famKey ? this.families.find((f) => this.keyOf(f) === this.famKey) || null : null;
    },
    /** The bare shop page: the home, whose hero the header sits over. */
    onHome() {
      return (
        this.hero.shown &&
        String(this.$route.name || "").startsWith(window.$storefront.routes.SHOP_PAGE) &&
        !this.$route.params?.vendor_id &&
        !this.$route.params?.category_name &&
        !Object.keys(this.$route.query || {}).length
      );
    },
    /** Clear over the hero: on the home, at the top, with no panel open. */
    over() {
      return this.onHome && !this.scrolled && !this.openFamily && !this.searchOpen;
    },
    itemsCount() {
      return this.getTotalItemInBaskets() || 0;
    },
    basketUnits() {
      return this.getBaskets().reduce((sum, basket) => sum + (basket?.items || []).reduce((n, item) => n + (item.count || 0), 0), 0);
    },
    homeRoute() {
      return { path: "/" };
    },
    dealsRoute() {
      return dealsRoute();
    },
    catalogueRoute() {
      return catalogueRoute();
    },
    newRoute() {
      return catalogueRoute({ sort: "newest" });
    },
    ordersRoute() {
      return { name: window.$storefront.routes.HISTORY_ORDERS_PHYSICAL };
    },
    savedRoute() {
      return { name: window.$storefront.routes.USER_FAVORITES_PAGE };
    },
    blogRoute() {
      return { name: window.$storefront.routes.BLOGS_PAGE };
    },
    helpRoute() {
      return { name: "ShopFAQ" };
    },
    contactRoute() {
      return { name: window.$storefront.routes.SHOP_CONTACT_US };
    },
    profileRoute() {
      return { name: "KalioAccountHome" };
    },
    drawerOpen() {
      return this.basket || this.menu;
    },
  },

  watch: {
    drawerOpen(open) {
      this.$store.commit("setForceHideNavigation", open);
    },
    menu(open) {
      if (open) this.moreOpen = null;
    },
    basket(open) {
      basketView.drawerOpen = open;
    },
    compact() {
      this.famKey = null;
    },
    $route() {
      this.menu = false;
      this.basket = false;
      this.famKey = null;
      this.searchOpen = false;
      this.$nextTick(() => this.onScroll && this.onScroll());
    },
  },

  mounted() {
    aisles().then((list) => (this.aisleList = list));
    allProducts().then((list) => (this.all = list));
    this.onResize = () => (this.windowWidth = window.innerWidth);
    this.onScroll = () => (this.scrolled = window.scrollY > 24);
    this.onDoc = (e) => {
      if (!this.$refs.root || this.$refs.root.contains(e.target)) return;
      this.famKey = null;
      this.searchOpen = false;
    };
    this.onKey = (e) => {
      if (e.key !== "Escape") return;
      this.famKey = null;
      this.searchOpen = false;
      this.menu = false;
      this.basket = false;
    };
    window.addEventListener("resize", this.onResize, { passive: true });
    window.addEventListener("scroll", this.onScroll, { passive: true });
    document.addEventListener("click", this.onDoc);
    document.addEventListener("keydown", this.onKey);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("scroll", this.onScroll);
    document.removeEventListener("click", this.onDoc);
    document.removeEventListener("keydown", this.onKey);
  },

  methods: {
    aisleRoute,
    catLine(aisle) {
      return categoryLine(aisle, this.all, (n) => money(n, null, true));
    },
    t,
    keyOf(f) {
      return f.key + ":" + f.title;
    },
    /** A family of more than 8 categories shows 6, then "Show N more". */
    firstCats(f) {
      return f.categories.length > 8 ? f.categories.slice(0, 6) : f.categories;
    },
    restCats(f) {
      return f.categories.length > 8 ? f.categories.slice(6) : [];
    },
    moreId(f) {
      return "sn-acc-more-" + String(this.keyOf(f)).replace(/[^a-z0-9]+/gi, "-");
    },
    toggleFamily(f) {
      this.searchOpen = false;
      this.famKey = this.famKey === this.keyOf(f) ? null : this.keyOf(f);
    },
    toggleSearch() {
      this.famKey = null;
      this.searchOpen = !this.searchOpen;
    },
    onSearch(event) {
      this.searchOpen = false;
      this.$emit("search", event);
    },
    signIn() {
      EventBus.$emit("need-login", true);
    },
  },
};
</script>
