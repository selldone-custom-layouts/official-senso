<!-- Senso — a guest's nudge to sign in (hidden once signed in or while the
     account is still being read). -->
<template>
  <section v-if="!user && !busyUser" class="sn-signin">
    <senso-icon name="account_circle" size="34" />
    <p><b>Sign in for a faster checkout.</b> Track your orders, keep your addresses and pick up where you left off.</p>
    <button class="sn-btn" type="button" @click="signIn">Sign in</button>
    <button class="sn-btn -line" type="button" @click="signIn">Create an account</button>
  </section>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";

export default {
  name: "SensoSignInNudge",
  components: { SensoIcon },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    busyUser() {
      return this.$store.getters.getBusyUser;
    },
  },
  methods: {
    signIn() {
      EventBus.$emit("need-login", true);
    },
  },
};
</script>
