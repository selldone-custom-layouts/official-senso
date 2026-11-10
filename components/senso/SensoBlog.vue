<!--
  Senso — STORIES: the home's journal section, the four newest articles as
  large image cards (picture, date, title), two to a row on a computer and
  one under the other on a phone. The date, not a reading time (the list
  sends no article text). Selldone's demo posts are left out once the shop
  has its own (kalio-journal.ts). Pictures come resized (imageSrcset).
-->
<template>
  <section v-if="posts.length" aria-labelledby="sn-blog-h" class="sn-sec sn-stories">
    <header class="sn-head">
      <div>
        <p class="sn-eyebrow">Stories</p>
        <h2 id="sn-blog-h">From the {{ shopName }} journal</h2>
      </div>
      <div class="sn-head__end">
        <router-link :to="allRoute" class="sn-more">All stories<senso-icon name="arrow_forward" size="18" /></router-link>
      </div>
    </header>
    <div class="sn-stories__grid">
      <router-link v-for="a in posts" :key="a.id" :to="route(a)" class="sn-story">
        <span class="sn-story__img">
          <img v-if="a.image" :src="a.image" :srcset="srcset(a.image)" alt="" loading="lazy" sizes="(max-width: 760px) 92vw, 600px" @error="dropSrcset" />
        </span>
        <time :datetime="a.created_at">{{ date(a.created_at) }}</time>
        <h3>{{ a.title }}</h3>
      </router-link>
    </div>
  </section>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import { dateParts, journalPage, journalRoute, postRoute } from "../kalio/pages/kalio-journal";
import { dropSrcset, imageSrcset } from "../kalio/kalio-catalog";

export default {
  name: "SensoBlog",
  components: { SensoIcon },
  inject: ["$shop"],
  data: () => ({ posts: [] }),
  computed: {
    shopName() {
      return this.$shop?.title || "";
    },
    allRoute() {
      return journalRoute();
    },
  },
  mounted() {
    journalPage({ limit: 12 })
      .then(({ articles }) =>
        (this.posts = [...articles].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, 4)),
      )
      .catch(() => (this.posts = []));
  },
  methods: {
    dropSrcset,
    srcset: (u) => imageSrcset(u, [480, 800, 1200]),
    route: postRoute,
    date: (iso) => dateParts(iso).full,
  },
};
</script>
