<!--
  Senso — the home's last section: the four newest articles, each with its
  date (the list sends no article text, so a reading time would be a guess).
  Selldone's demo posts are left out once the shop has its own
  (kalio-journal.ts). Pictures come resized (articleImage).
-->
<template>
  <section v-if="posts.length" aria-labelledby="sn-blog-h" class="sn-sec">
    <header class="sn-head">
      <h2 id="sn-blog-h">From the {{ shopName }} blog</h2>
      <router-link :to="allRoute" class="sn-more">All articles<senso-icon name="chevron_right" size="20" /></router-link>
    </header>
    <div :style="{ '--cols': posts.length }" class="sn-blog">
      <router-link v-for="a in posts" :key="a.id" :to="route(a)" class="sn-post">
        <div class="sn-post__img">
          <img v-if="a.image" :src="a.image" :srcset="srcset(a.image)" alt="" loading="lazy" sizes="(max-width: 760px) 78vw, 330px" @error="dropSrcset" />
        </div>
        <time :datetime="a.created_at">{{ date(a.created_at) }}</time>
        <h3>{{ a.title }}</h3>
        <p v-if="a.desc || a.description">{{ a.desc || a.description }}</p>
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
    srcset: (u) => imageSrcset(u),
    route: postRoute,
    date: (iso) => dateParts(iso).full,
  },
};
</script>
