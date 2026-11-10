<!--
  Senso — the newsletter: a centred teal headline and a white rounded form
  card (first name, last name, email, a dark-teal Submit pill). It uses
  Selldone's own newsletter subscription for the shop. That belongs to a
  customer account, so a guest gets the sign-in sheet first and the form
  keeps what they typed; once signed in, Submit subscribes them.
-->
<template>
  <section aria-labelledby="sn-news-h" class="sn-sec sn-news">
    <h2 id="sn-news-h" class="sn-news__h">Sign up for deals, news &amp; product updates</h2>
    <div class="sn-news__card">
      <p v-if="done" class="sn-news__ok" role="status"><senso-icon name="check_circle" size="22" />You’re on the list. Watch your inbox.</p>
      <form v-else class="sn-news__form" novalidate @submit.prevent="submit">
        <label class="sn-field">
          <span>First name<em aria-hidden="true">*</em></span>
          <input v-model.trim="first" autocomplete="given-name" name="first" required type="text" />
        </label>
        <label class="sn-field">
          <span>Last name<em aria-hidden="true">*</em></span>
          <input v-model.trim="last" autocomplete="family-name" name="last" required type="text" />
        </label>
        <label class="sn-field -wide">
          <span>Email<em aria-hidden="true">*</em></span>
          <input v-model.trim="email" autocomplete="email" name="email" required type="email" />
        </label>
        <p v-if="error" class="sn-news__err" role="alert">{{ error }}</p>
        <p v-else-if="!user" class="sn-news__note">You’ll be asked to sign in, then we add you to the list.</p>
        <button :disabled="busy" class="sn-btn -lg sn-news__go" type="submit">{{ busy ? "Sending…" : "Submit" }}</button>
      </form>
    </div>
  </section>
</template>

<script>
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import SensoIcon from "./SensoIcon.vue";

export default {
  name: "SensoNewsletter",
  components: { SensoIcon },
  data: () => ({ first: "", last: "", email: "", busy: false, done: false, error: null }),
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    submit() {
      this.error = null;
      if (!this.first || !this.last) return (this.error = "Add your first and last name.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) return (this.error = "Add a valid email address.");
      if (!this.user) {
        EventBus.$emit("need-login", true);
        return;
      }
      this.busy = true;
      window.axios
        .post(window.XAPI.POST_SUBSCRIBE(window.$storefront.name), { email: this.email, name: `${this.first} ${this.last}` })
        .then(({ data }) => {
          if (data?.error) this.error = data.error_msg || "That didn’t work. Try again.";
          else this.done = true;
        })
        .catch(() => (this.error = "That didn’t work. Try again in a minute."))
        .finally(() => (this.busy = false));
    },
  },
};
</script>
