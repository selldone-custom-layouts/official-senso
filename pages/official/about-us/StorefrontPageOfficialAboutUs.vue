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
  Senso — About us: a wide photo (the about-hero slot, else the owner's
  wide photo) with the story on a white card, four values with line icons,
  a band of service promises from the shop's own settings (no counts: the
  shop is the point, not its size), the categories as line-icon tiles, and
  how to reach the shop. The text is
  the shop's own About profile (Selldone dashboard › Shop › Profile) when it
  has one; until then a general sample under a clear "Sample text" note.
-->
<template>
  <div class="sn-about sn-page">
    <section class="sn-about__hero">
      <sn-slot :src="hero" alt="" class="sn-about__photo" eager fill name="about-hero" />
      <div class="sn-about__card">
        <span class="sn-eyebrow">{{ t("about.title", "About {shop}", { shop: shopTitle }) }}</span>
        <h1>{{ missing || busy ? sample.title : t("about.title", "About {shop}", { shop: shopTitle }) }}</h1>
        <p v-if="missing || busy">{{ sample.lead }}</p>
      </div>
    </section>

    <section class="sn-sec sn-about__story">
      <div v-if="busy" aria-hidden="true" class="k-legal__loading"><span></span><span></span><span></span></div>
      <template v-else-if="missing">
        <kalio-sample-note>{{ t("senso.about.sampleNote", "This is general copy written to show the page; {shop} writes its own story here.", { shop: shopTitle }) }}</kalio-sample-note>
        <p class="sn-about__text">{{ sample.text[0] }}</p>
        <div class="sn-about__vals">
          <div v-for="(value, i) in sample.values" :key="value.title" class="sn-about__val">
            <span class="sn-about__ic"><senso-icon :name="ICONS[i] || 'check'" size="24" /></span>
            <b>{{ value.title }}</b>
            <p>{{ value.text }}</p>
          </div>
        </div>
      </template>
      <div v-else class="k-story__real k-prose sn-about__real" v-html="profile.body"></div>
    </section>

    <section :aria-label="t('senso.about.promises', 'Our promises')" class="sn-about__band">
      <div v-for="p in promises" :key="p.t"><senso-icon :name="p.i" size="28" /><span><b>{{ p.t }}</b><small>{{ p.s }}</small></span></div>
    </section>

    <senso-shelf :eyebrow="t('senso.about.rangeEyebrow', 'The range')" :title="t('senso.about.rangeTitle', 'Everything we carry')" grid />

    <section id="contact" class="sn-sec sn-about__contact">
      <div>
        <span class="sn-eyebrow">{{ t("contact.pageTitle", "Contact us") }}</span>
        <h2>{{ t("senso.about.helpTitle", "We’re here to help") }}</h2>
        <p>{{ t("senso.about.helpText", "For an order, the fastest way is the message thread on the order page: it reaches the people who packed it. For anything else, write to us.") }}</p>
      </div>
      <div class="sn-about__acts">
        <router-link :to="{ name: window.$storefront.routes.SHOP_CONTACT_US }" class="sn-btn">{{ t("senso.about.write", "Write to us") }}</router-link>
        <router-link :to="catalogueRoute" class="sn-btn -line">{{ t("pages.startShopping", "Start shopping") }}</router-link>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import KalioSampleNote from "@app-storefront/components/kalio/pages/KalioSampleNote.vue";
import { aboutSample, plainText } from "@app-storefront/components/kalio/pages/kalio-sample-pages";
import { aisles, catalogueRoute } from "@app-storefront/components/kalio/kalio-catalog";
import { allProducts, photoOf, waysOf } from "@app-storefront/components/senso/senso-home";
import SnSlot from "@app-storefront/components/senso/SensoSlot.vue";
import SensoIcon from "@app-storefront/components/senso/SensoIcon.vue";
import SensoShelf from "@app-storefront/components/senso/SensoShelf.vue";
import { t } from "@app-storefront/components/kalio/i18n/kalio-i18n";

export default {
  name: "StorefrontPageOfficialAboutUs",
  components: { KalioSampleNote, SnSlot, SensoIcon, SensoShelf },
  inject: ["$shop"],

  data: () => ({
    window,
    profile: null,
    missing: false,
    busy: true,
    packs: [],
    hero: null,
    ICONS: ["sell", "local_shipping", "assignment_return", "support_agent"],
  }),

  computed: {
    shopTitle() {
      return this.$shop?.title || t("sample.thisShop", "This shop");
    },
    sample() {
      return aboutSample(this.shopTitle);
    },
    catalogueRoute() {
      return catalogueRoute();
    },
    /* What the shop really offers, from its own settings. */
    promises() {
      const ways = waysOf(this.$shop);
      const out = [];
      if (ways.some((w) => w.key !== "Pickup")) out.push({ i: "local_shipping", t: t("senso.about.promise.door", "Delivered to your door"), s: t("senso.about.promise.doorText", "Cost and day shown before you pay") });
      if (ways.some((w) => w.key === "Pickup")) out.push({ i: "storefront", t: t("senso.about.promise.pickup", "Pickup at the shop"), s: t("senso.about.promise.pickupText", "Order online, collect in person") });
      out.push({ i: "lock", t: t("senso.about.promise.secure", "Secure checkout"), s: t("senso.about.promise.secureText", "Your details stay private") });
      out.push({ i: "support_agent", t: t("senso.about.promise.help", "Real help"), s: t("senso.about.promise.helpText", "Message us from any order") });
      return out.slice(0, 4);
    },
  },

  created() {
    this.setPageTitle?.(t("about.pageTitle", "About us"));
    window.axios
      .get(window.XAPI.GET_SHOP_PROFILE(this.$shop.name, "about-us"))
      .then(({ data }) => {
        this.profile = data?.error ? null : data?.profile || null;
        this.missing = !plainText(this.profile?.body);
      })
      .catch(() => (this.missing = true))
      .finally(() => (this.busy = false));
    Promise.all([aisles(), allProducts()]).then(([cats, list]) => {
      const withWide = cats.find((c) => photoOf("wide", c));
      this.hero = withWide ? photoOf("wide", withWide) : null;
      this.packs = [...list].sort((a, b) => (b.sells || 0) - (a.sells || 0)).filter((p) => p.icon).slice(0, 4);
    });
  },
};
</script>
