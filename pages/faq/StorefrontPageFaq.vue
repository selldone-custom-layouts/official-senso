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
  <!-- Senso: a support centre. A calm band with "How can we help?" and a
       search box (Selldone's own FAQ search), quick tiles (track an order,
       contact, delivery and returns, account), the topics as pills and the
       questions as accordions; a calm card when there are none yet. -->
  <div class="k-official k-faq sn-support">
    <slot name="header"></slot>
    <section class="sn-support__band">
      <sn-slot class="sn-support__photo" fill name="support-hero" />
      <div class="sn-support__in">
        <nav aria-label="Breadcrumb" class="sn-crumbs">
          <router-link :to="{ path: '/' }">Home</router-link>
          <span aria-hidden="true">/</span>
          <router-link v-if="current_tag" :to="{ name: 'ShopFAQ' }">Support</router-link>
          <span v-else aria-current="page">Support</span>
          <template v-if="current_tag">
            <span aria-hidden="true">/</span>
            <span aria-current="page">{{ current_tag }}</span>
          </template>
        </nav>
        <p class="sn-eyebrow -light">Support</p>
        <h1 class="sn-support__h">How can we help?</h1>
        <form class="sn-support__search" role="search" @submit.prevent>
          <senso-icon name="search" size="22" />
          <input v-model="search" aria-label="Search the questions" placeholder="Search questions, like returns or delivery" type="search" />
        </form>
      </div>
    </section>

    <div class="sn-page sn-support__body">
      <nav aria-label="Support" class="sn-support__tiles">
        <router-link :to="{ name: window.$storefront.routes.HISTORY_ORDERS_PHYSICAL }" class="sn-support__tile"><senso-icon name="local_shipping" size="30" /><b>Track an order</b><small>Status, delivery and messages</small></router-link>
        <router-link :to="{ name: window.$storefront.routes.SHOP_CONTACT_US }" class="sn-support__tile"><senso-icon name="mail" size="30" /><b>Contact us</b><small>Write to the shop</small></router-link>
        <router-link :to="{ name: window.$storefront.routes.SHOP_PROFILE_PAGE_TERMS }" class="sn-support__tile"><senso-icon name="assignment_return" size="30" /><b>Delivery &amp; returns</b><small>The shop’s terms</small></router-link>
        <router-link v-if="USER()" :to="{ name: 'KalioAccountHome' }" class="sn-support__tile"><senso-icon name="person" size="30" /><b>Your account</b><small>Orders, addresses, saved</small></router-link>
        <button v-else class="sn-support__tile" type="button" @click="signIn"><senso-icon name="person" size="30" /><b>Your account</b><small>Sign in to see your orders</small></button>
      </nav>

      <div class="sn-support__qhead">
        <div>
          <p class="sn-eyebrow">FAQ</p>
          <h2>Questions and answers</h2>
        </div>
        <button v-if="USER()" class="sn-btn" type="button" @click="dialog_faq = true">Ask a question</button>
        <button v-else class="sn-btn -line" type="button" @click="signIn">Sign in to ask</button>
      </div>
      <nav v-if="tags?.length" aria-label="Topics" class="k-faq__tags sn-support__tags">
        <router-link :class="{ '-on': !current_tag }" :to="{ name: 'ShopFAQ' }" class="sn-pillchip" exact>All topics</router-link>
        <router-link v-for="tag in tags" :key="tag" :class="{ '-on': current_tag === tag }" :to="{ name: 'ShopFAQ', params: { tag: tag } }" class="sn-pillchip">{{ tag }}</router-link>
      </nav>

      <u-loading-progress v-if="busy_fetch"></u-loading-progress>

      <div v-if="faqs?.length" class="sn-acclist">
        <div v-for="faq in faqs" :key="faq.id" :class="{ '-open': open === faq.id }" class="sn-acc -faq">
          <button :aria-expanded="open === faq.id" class="sn-acc__head" type="button" @click="open = open === faq.id ? null : faq.id">
            <span v-html="faq.question"></span><senso-icon :name="open === faq.id ? 'remove' : 'add'" size="20" />
          </button>
          <div v-if="open === faq.id" class="sn-acc__body">
            <div class="k-prose" v-html="faq.answer"></div>
            <a v-if="faq.link" :href="faq.link" class="sn-more" rel="noopener" target="_blank">{{ $t("global.faq.read_more") }}<senso-icon name="arrow_forward" size="16" /></a>
          </div>
        </div>
      </div>
      <div v-else-if="!busy_fetch" class="k-official__missing sn-empty">
        <span class="sn-empty__mark"><senso-icon name="help" size="28" /></span>
        <h2>{{ search ? "No question matches that" : "No questions here yet" }}</h2>
        <p>{{ search ? "Try another word, or write to the shop." : `${shop?.title || "The shop"} has not answered any questions here so far. Ask yours, or write to the shop directly.` }}</p>
        <div class="k-official__missingacts">
          <router-link :to="{ name: window.$storefront.routes.SHOP_CONTACT_US }" class="sn-btn">Contact the shop</router-link>
        </div>
      </div>

      <v-pagination
        v-if="pageCount > 1"
        v-model="page"
        :length="pageCount"
        class="k-faq__pages"
        rounded
        @update:model-value="fetchFAQData()"
      />
    </div>

    <!-- =================== Dialog =================== -->
    <v-bottom-sheet
      v-model="dialog_faq"
      width="860"
      max-width="98vw"
      content-class="rounded-t-xl"
    >
      <v-card rounded="t-xl" class="text-start">
        <v-card-title>
          <v-icon class="me-2"> fa:fas fa-question</v-icon>
          {{ $t("global.faq.add_new") }}
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="question"
            :label="$t('global.faq.question_input')"
            :placeholder="$t('global.faq.question_input_placeholder')"
            variant="underlined"
            auto-grow
          />
        </v-card-text>
        <v-card-actions>
          <div class="widget-buttons">
            <v-btn
              :class="{ disabled: !question }"
              :loading="busy"
              color="primary"
              size="x-large"
              variant="elevated"
              @click="sendFAQ"
              prepend-icon="check"
            >
              {{ $t("global.actions.confirm") }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
import NotificationService from "@selldone/components-vue/plugins/notification/NotificationService.ts";

import { throttle } from "lodash-es";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import ULoadingProgress from "@selldone/components-vue/ui/loading/progress/ULoadingProgress.vue";
import SensoIcon from "@app-storefront/components/senso/SensoIcon.vue";
import SnSlot from "@app-storefront/components/senso/SensoSlot.vue";

export default {
  name: "StorefrontPageFaq",
  components: { ULoadingProgress, SensoIcon, SnSlot },
  props: {
    shop: {
      require: true,
      type: Object,
    },
  },

  data() {
    return {
      drawer: false,

      dialog_faq: false,
      question: "",
      busy: false,
      busy_fetch: false,

      faqs: [],
      tags: [],

      total: true,

      search: null,
      /** The open question (an accordion). */
      open: null,
      window,
      //----------------------
      page: 1,
    };
  },
  computed: {
    current_tag() {
      return this.$route.params.tag;
    },
    pageCount() {
      return Math.ceil(this.total / 10);
    },
  },
  watch: {
    current_tag() {
      this.drawer = false;
      this.offset = 0;
      this.fetchFAQData();
    },
    search: throttle(function (newVal) {
      this.page = 1;
      this.fetchFAQData(newVal);
    }, window.SERACH_THROTTLE),
  },
  created() {
    this.setPageTitle("FAQ"); // Set Page Title!
    this.fetchFAQData();
    this.fetchFAQTags();
  },
  methods: {
    /** Kalio: sign in to ask a question. */
    signIn() {
      EventBus.$emit("need-login", true);
    },
    //――――――――――――――――――――――― FAQ Tags ―――――――――――――――――――――――

    fetchFAQTags() {
      axios.get(window.XAPI.GET_FAQ_TAGS(this.shop.name)).then(({ data }) => {
        this.tags = data.tags;
      });
    },

    //――――――――――――――――――――――― FAQs ―――――――――――――――――――――――

    fetchFAQData() {
      this.busy_fetch = true;
      axios
        .get(window.XAPI.GET_FAQ(this.shop.name), {
          params: {
            offset: (this.page - 1) * 10,
            limit: 10,
            tag: this.$route.params.tag,
            search: this.search,
          },
        })
        .then(({ data }) => {
          this.faqs = data.faqs;
          this.total = data.total;
        })
        .finally(() => {
          this.busy_fetch = false;
        });
    },

    sendFAQ() {
      this.busy = true;
      axios
        .post(window.XAPI.POST_SEND_QUESTION(this.shop.name), {
          question: this.question,
        })
        .then(({ data }) => {
          if (data.error) {
            NotificationService.showErrorAlert(null, data.error_msg);
          } else {
            this.question = null;
            NotificationService.showSuccessAlert(
              null,
              this.$t("global.faq.notifications.success_add"),
            );
            this.dialog_faq = false;
          }
        })
        .catch((error) => {
          NotificationService.showLaravelError(error);
        })
        .finally(() => {
          this.busy = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.faq-container {
  text-align: start;
  max-width: 1100px;

  .faq {
    margin: 8px 0;
    padding: 14px 8px;

    .question {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .answer {
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.7rem;
    }
  }

  margin: auto;
}
</style>
