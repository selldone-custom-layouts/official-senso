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
  Senso — Contact us, in the support centre's dress: the calm Support band
  (the support-hero slot), then a form card (name, email, phone, the order
  number when it is about one, the message, a teal Send pill) beside the
  ways to reach the shop: messages on
  any order, the shop's own contact text when it has written one, and
  "Track your order". The form is Selldone's own contact form
  (POST_CONTACT_US_FORM); the shop's contact profile is read quietly — a
  shop that has not written one shows no "Store profile not found" error,
  only the general ways to reach it.
-->
<template>
  <div class="sn-contact sn-support">
    <section class="sn-support__band -short">
      <sn-slot class="sn-support__photo" fill name="support-hero" />
      <div class="sn-support__in">
        <nav aria-label="Breadcrumb" class="sn-crumbs">
          <router-link :to="{ path: '/' }">Home</router-link>
          <span aria-hidden="true">/</span>
          <router-link :to="{ name: 'ShopFAQ' }">Support</router-link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Contact us</span>
        </nav>
        <p class="sn-eyebrow -light">Support</p>
        <h1 class="sn-support__h">Contact us</h1>
        <p class="sn-support__p">Questions about a product, an order or a return? Write to us and we’ll answer by email.</p>
      </div>
    </section>

    <div class="sn-contact__grid sn-page">
      <section aria-labelledby="sn-contact-form" class="sn-sec sn-contact__form">
        <div v-if="submitted" class="sn-contact__done">
          <span class="sn-contact__ok"><senso-icon name="check_circle" size="34" /></span>
          <h2>Thanks — your message is on its way</h2>
          <p>We’ll answer by email. Check your inbox (and the spam folder) for our reply.</p>
          <button class="sn-btn -line" type="button" @click="submitted = false">Send another message</button>
        </div>
        <form v-else @submit.prevent="sendForm">
          <h2 id="sn-contact-form">Send us a message</h2>
          <div v-if="USER()" class="sn-contact__me">
            <img v-if="USER().id" :src="getUserAvatar(USER().id)" alt="" height="40" width="40" />
            <span><b>{{ USER().name }}</b><small>{{ USER().email }}</small></span>
          </div>
          <div v-else class="sn-contact__row">
            <label class="sn-field"><span>Name</span><input v-model="name" autocomplete="name" placeholder="Your name" /></label>
            <label class="sn-field"><span>Email</span><input v-model="email" autocomplete="email" placeholder="you@example.com" required type="email" /></label>
          </div>
          <div class="sn-contact__row">
            <label class="sn-field"><span>Phone <small>(optional)</small></span><input v-model="phone" autocomplete="tel" placeholder="(305) 555-0100" type="tel" /></label>
            <label class="sn-field"><span>Order number <small>(optional)</small></span><input v-model="order" placeholder="e.g. 1024" /></label>
          </div>
          <label class="sn-field"><span>Message</span><textarea v-model="message" placeholder="How can we help?" required rows="6"></textarea></label>
          <p v-if="error" class="sn-contact__err">{{ error }}</p>
          <button :disabled="!canSend || busy_send" class="sn-btn -lg" type="submit">{{ busy_send ? "Sending…" : "Send message" }}</button>
        </form>
      </section>

      <aside class="sn-contact__side">
        <section class="sn-sec">
          <h2>Other ways to reach us</h2>
          <ul class="sn-contact__ways">
            <li><span><senso-icon name="receipt_long" size="22" /></span><div><b>About an order</b><small>Open the order and use its message thread: it reaches the people who packed it.</small><router-link :to="ordersRoute" class="sn-more">Track your order<senso-icon name="chevron_right" size="18" /></router-link></div></li>
            <li><span><senso-icon name="help" size="22" /></span><div><b>Quick answers</b><small>Delivery, returns and payments in a few lines.</small><router-link :to="{ name: 'ShopFAQ' }" class="sn-more">Read the FAQ<senso-icon name="chevron_right" size="18" /></router-link></div></li>
          </ul>
        </section>
        <section v-if="profile && profileText" class="sn-sec">
          <h2>{{ shopTitle }}</h2>
          <div class="k-prose sn-contact__profile" v-html="profile.body"></div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import SensoIcon from "@app-storefront/components/senso/SensoIcon.vue";
import SnSlot from "@app-storefront/components/senso/SensoSlot.vue";
import { plainText } from "@app-storefront/components/kalio/pages/kalio-sample-pages";

export default {
  name: "StorefrontPageOfficialContactUs",
  components: { SensoIcon, SnSlot },
  inject: ["$shop"],
  data: () => ({
    profile: null,
    name: null,
    email: null,
    phone: null,
    order: null,
    message: "",
    busy_send: false,
    submitted: false,
    error: null,
  }),
  computed: {
    shopTitle() {
      return this.$shop?.title || "";
    },
    profileText() {
      return plainText(this.profile?.body);
    },
    canSend() {
      return !!(this.message && this.message.trim() && (this.USER() || this.email));
    },
    ordersRoute() {
      return { name: window.$storefront.routes.HISTORY_ORDERS_PHYSICAL };
    },
  },
  created() {
    this.setPageTitle("Contact us");
    window.axios
      .get(window.XAPI.GET_SHOP_PROFILE(this.$shop.name, "contact-us"))
      .then(({ data }) => (this.profile = data?.error ? null : data?.profile || null))
      .catch(() => (this.profile = null));
    if (this.USER()) {
      this.name = this.USER().name;
      this.email = this.USER().email;
      this.phone = this.USER().phone;
    }
  },
  methods: {
    sendForm() {
      const text = String(this.message || "").replace(/<[^>]*>?/gm, "").trim();
      if (!text) return;
      this.busy_send = true;
      this.error = null;
      window.axios
        .post(window.XAPI.POST_CONTACT_US_FORM(this.$shop.name), {
          name: this.name,
          email: this.email,
          phone: this.phone,
          message: this.order ? `Order: ${this.order}\n\n${text}` : text,
          category: this.order ? "order" : null,
          url: window.location.href,
        })
        .then(({ data }) => {
          if (data?.error) this.error = data.error_msg || "That didn’t go through. Try again.";
          else {
            this.message = "";
            this.order = null;
            this.submitted = true;
          }
        })
        .catch(() => (this.error = "That didn’t go through. Try again in a minute."))
        .finally(() => (this.busy_send = false));
    },
  },
};
</script>
