<!--
  Senso — the product page's Highlights: full-width bands, alternating
  picture and words, written from the product's own content.

  The first band is a dark rounded card: the family's photo
  (highlight-<family>, senso-photos.ts; until it arrives a placeholder)
  under the product's first headline, beside an "At a glance" list of its
  key specs. The next bands pair the product's other pictures (on a pale
  well) with a section of its own article ("Performance", "Design"…: the
  bold headings in the article's text, with the words under them), or,
  when it has no article, with a group of its spec. Nothing is invented:
  no article and no spec means only the first band.
-->
<template>
  <section v-if="product" id="sn-highlights" aria-labelledby="sn-hl-h" class="sn-sec sn-hl">
    <header class="sn-head">
      <div>
        <p class="sn-eyebrow">Highlights</p>
        <h2 id="sn-hl-h">{{ lead }}</h2>
      </div>
    </header>

    <div class="sn-hl__first">
      <div class="sn-hl__card">
        <sn-slot :alt="product.title" :name="slotName" class="sn-hl__photo" fill />
        <span class="sn-hl__shade"></span>
        <div class="sn-hl__over">
          <p class="sn-eyebrow -light">{{ categoryTitle }}</p>
          <b>{{ product.title }}</b>
        </div>
      </div>
      <div v-if="glance.length" class="sn-hl__glance">
        <p class="sn-eyebrow">At a glance</p>
        <dl>
          <div v-for="row in glance" :key="row.key">
            <dt>{{ row.key }}</dt>
            <dd>{{ row.value }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <div v-for="(b, i) in bands" :key="b.title + i" :class="{ '-flip': i % 2 === 1 }" class="sn-hl__band">
      <div class="sn-hl__img sn-tile">
        <img :alt="`${product.title}, ${b.title}`" :src="b.image" loading="lazy" />
      </div>
      <div class="sn-hl__txt">
        <p class="sn-eyebrow">{{ b.title }}</p>
        <h3>{{ b.heading }}</h3>
        <p>{{ b.text }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import SnSlot from "./SensoSlot.vue";
import { specGroups, specValue } from "../kalio/compare/kalio-compare";
import { familiesOf, familyOf } from "./senso-families";
import { aisles } from "../kalio/kalio-catalog";

/** Plain text of an HTML fragment. */
function plain(html) {
  const div = document.createElement("div");
  div.innerHTML = String(html || "");
  return (div.textContent || "").replace(/\s+/g, " ").trim();
}

/** "Lorem ipsum dolor sit amet…" at a sentence or word end. */
function clip(text, max = 260) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  return stop > max * 0.5 ? cut.slice(0, stop + 1) : cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

export default {
  name: "SensoHighlights",
  components: { SnSlot },
  props: { product: { type: Object, required: true } },
  data: () => ({ cats: [] }),
  computed: {
    family() {
      return familyOf(this.product.category || this.cats.find((c) => c.id === this.product.category_id), familiesOf(this.cats));
    },
    slotName() {
      return `highlight-${this.family && this.family.key !== "more" ? this.family.key : "tv-display"}`;
    },
    categoryTitle() {
      const c = this.product.category;
      return c ? c.title || c.name : this.family?.title || "";
    },
    /** The article's sections: { title, text } under each bold heading. */
    sections() {
      const body = this.product?.article_pack?.article?.body;
      if (!body) return [];
      const div = document.createElement("div");
      div.innerHTML = body;
      const out = [];
      let cur = { title: "", parts: [] };
      for (const el of Array.from(div.children)) {
        const t = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (!t) continue;
        const bold = el.tagName === "P" && el.children.length === 1 && /^(B|STRONG)$/.test(el.children[0].tagName) && el.children[0].textContent.trim() === t;
        if (bold || /^H[2-4]$/.test(el.tagName)) {
          if (cur.parts.length) out.push(cur);
          cur = { title: t, parts: [] };
        } else cur.parts.push(t);
      }
      if (cur.parts.length) out.push(cur);
      return out.map((s) => ({ title: s.title, text: s.parts.join(" ") }));
    },
    /** The section's title: the article's own after its colon ("…: Power and
        Precision for Every Project"), else the family's line. */
    lead() {
      const t = String(this.product?.article_pack?.article?.title || "");
      const after = t.includes(":") ? t.split(":").slice(1).join(":").trim() : "";
      if (after.length >= 10 && after.length <= 70) return after;
      return this.family?.line || "Made for every day.";
    },
    /** Four key specs, the first of each group. */
    glance() {
      const out = [];
      for (const g of specGroups([this.product])) {
        for (const key of g.keys) {
          const value = specValue(this.product, key);
          if (value && !/^(product name|colou?r options?)$/i.test(key)) {
            out.push({ key, value });
            break;
          }
        }
        if (out.length >= 4) break;
      }
      return out;
    },
    images() {
      return (this.product.images || []).map((im) => im?.path).filter(Boolean).map((p) => this.getShopImagePath(p));
    },
    bands() {
      const pics = this.images.length > 1 ? this.images.slice(1) : this.images;
      if (!pics.length) return [];
      const named = this.sections.filter((s) => s.title);
      const fromArticle = named.map((s) => ({ title: s.title, heading: this.headingFor(s.title), text: clip(s.text) }));
      const fromSpec = specGroups([this.product])
        .map((g) => {
          const rows = g.keys.map((k) => [k, specValue(this.product, k)]).filter(([, v]) => v);
          return rows.length ? { title: g.title, heading: rows[0][1], text: rows.map(([k, v]) => `${k}: ${v}`).join(" · ") } : null;
        })
        .filter(Boolean);
      const list = fromArticle.length ? fromArticle : fromSpec;
      return list.slice(0, Math.min(3, pics.length)).map((b, i) => ({ ...b, image: pics[i % pics.length] }));
    },
  },
  mounted() {
    aisles().then((list) => (this.cats = list));
  },
  methods: {
    /** A short heading for a section: the first spec value of the group of the same name, else the title. */
    headingFor(title) {
      const t = String(title).toLowerCase();
      const g = specGroups([this.product]).find((x) => t === x.title.toLowerCase()) || specGroups([this.product]).find((x) => t.includes(x.title.toLowerCase()));
      if (g) {
        for (const k of g.keys) {
          const v = specValue(this.product, k);
          if (v) return v.length > 60 ? `${k}: ${v.split(",")[0]}` : v;
        }
      }
      return title;
    },
  },
};
</script>
