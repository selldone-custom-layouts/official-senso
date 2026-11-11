<!--
  Senso — the home: a brand site's sections, in Senso's dress, top to bottom:

    the full-bleed hero carousel, one slide per product family
    FEATURED     a wide image card (a family's story) + 3 category tiles
    COLLECTIONS  one tab per tag in use (best sellers first), a line of cards
    LIFESTYLE    another wide image card + 4 category tiles
    DEALS        "Offers worth a closer look": the biggest savings
    CATEGORY     "Shop the latest": every category as a line-icon tile
    NEW          "Just arrived": the new-arrival tag (hidden when no product has it)
    STORIES      the four newest articles
    the newsletter form

  Everything is read live; a section with nothing to show is not drawn. The
  tiles take the categories family by family, so FEATURED and LIFESTYLE show
  different ones. The header (KalioHeader, clear over the hero) and footer
  (KalioFooter) are the Layout's. It shows on the bare shop page only: any
  query shows the listing.
-->
<template>
  <div class="sn-home">
    <senso-hero />

    <div class="sn-page sn-home__body">
      <senso-showcase
        :categories="featuredCats"
        :family="families[0] || null"
        :products="all"
        :eyebrow="t('senso.home.featured', 'Featured')"
        :title="t('senso.home.featuredTitle', 'Built for every kind of setup')"
        photo="feature-wide"
      />

      <senso-collections />

      <senso-showcase
        v-if="families.length > 1 || lifestyleCats.length"
        :categories="lifestyleCats"
        :family="lifestyleFamily"
        :products="all"
        :eyebrow="t('senso.home.lifestyle', 'Lifestyle')"
        :title="t('senso.home.lifestyleTitle', 'Made for the way you work and play')"
        photo="lifestyle-wide"
      />
    </div>

    <div class="sn-ground">
      <div class="sn-page">
        <senso-rail
          v-if="deals.length || !loaded"
          :items="deals"
          :more-to="dealsRoute"
          :pending="!loaded"
          :eyebrow="t('senso.blog.dealsEyebrow', 'Deals')"
          :more-label="t('senso.common.allOffers', 'All offers')"
          :title="t('senso.blog.offers', 'Offers worth a closer look')"
        />
      </div>
    </div>

    <div class="sn-page sn-home__body">
      <senso-shelf />

      <senso-rail
        v-if="newTagged.length"
        :eyebrow="t('senso.home.new', 'New')"
        :items="newTagged"
        :more-label="t('senso.home.seeNew', 'See what’s new')"
        :more-to="newRoute"
        :title="t('senso.home.justArrived', 'Just arrived')"
      />

      <senso-blog />
    </div>

    <div class="sn-newsband">
      <div class="sn-page">
        <senso-newsletter />
      </div>
    </div>
  </div>
</template>

<script>
import SensoHero from "./SensoHero.vue";
import SensoShowcase from "./SensoShowcase.vue";
import SensoCollections from "./SensoCollections.vue";
import SensoRail from "./SensoRail.vue";
import SensoShelf from "./SensoShelf.vue";
import SensoBlog from "./SensoBlog.vue";
import SensoNewsletter from "./SensoNewsletter.vue";
import { aisles, catalogueRoute, dealsRoute } from "../kalio/kalio-catalog";
import { allProducts, dealsOf, isNewTag, mix, tagIndex } from "./senso-home";
import { familiesOf } from "./senso-families";

export default {
  name: "SensoHome",
  components: { SensoHero, SensoShowcase, SensoCollections, SensoRail, SensoShelf, SensoBlog, SensoNewsletter },

  data: () => ({ all: [], cats: [], loaded: false, byTag: new Map() }),

  computed: {
    families() {
      return familiesOf(this.cats);
    },
    /** Every category with products, family by family. */
    ordered() {
      const has = new Set(this.all.map((p) => p.category_id));
      return this.families.flatMap((f) => f.categories).filter((c) => !this.loaded || has.has(c.id));
    },
    featuredCats() {
      return this.ordered.slice(0, 3);
    },
    /** The family the LIFESTYLE card tells (the third, else the second). */
    lifestyleFamily() {
      return this.families[this.families.length > 2 ? 2 : 1] || null;
    },
    /** Four tiles from the LIFESTYLE family on, never one FEATURED shows. */
    lifestyleCats() {
      const used = new Set(this.featuredCats.map((c) => c.id));
      const first = this.lifestyleFamily?.categories?.[0];
      const at = first ? Math.max(0, this.ordered.findIndex((c) => c.id === first.id)) : 0;
      const rest = [...this.ordered.slice(at), ...this.ordered.slice(0, at)].filter((c) => !used.has(c.id));
      return rest.length >= 4 ? rest.slice(0, 4) : rest.length === 3 ? rest : rest.slice(0, 2);
    },
    /** The biggest savings, two at most per category so one kind does not fill the row. */
    deals() {
      const per = new Map();
      const out = [];
      for (const p of dealsOf(this.all)) {
        const n = per.get(p.category_id) || 0;
        if (n >= 2) continue;
        per.set(p.category_id, n + 1);
        out.push(p);
        if (out.length >= 12) break;
      }
      return out;
    },
    newTagged() {
      for (const [tag, list] of this.byTag) if (isNewTag(tag)) return mix(list, 12);
      return [];
    },
    dealsRoute() {
      return dealsRoute();
    },
    newRoute() {
      return catalogueRoute({ sort: "newest" });
    },
  },

  mounted() {
    allProducts().then((list) => {
      this.all = list;
      this.loaded = true;
    });
    aisles().then((list) => (this.cats = list));
    tagIndex().then(({ byTag }) => (this.byTag = byTag));
  },
};
</script>
