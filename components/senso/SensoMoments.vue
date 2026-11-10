<!--
  Senso — "Gear for every moment": tall photo cards, one per category that
  has a portrait photo (assets/senso/portrait-<name>), with its live line
  ("Up to $200 off" or "From $42") and "Shop now". Without photos, the five
  categories with the most products get a collage of their own products.
  Every row is full: as many columns as cards, up to five.
-->
<template>
  <section v-if="cards.length" aria-labelledby="sn-moments-h" class="sn-sec">
    <header class="sn-head"><h2 id="sn-moments-h">{{ title }}</h2></header>
    <div :style="{ '--cols': cards.length }" class="sn-tall">
      <router-link v-for="c in cards" :key="c.id" :to="c.to" class="sn-tall__c">
        <senso-photo :products="c.products" :src="c.photo" eager shape="portrait" />
        <span class="sn-tall__txt">
          <small>{{ c.line }}</small>
          <b>{{ c.title }}</b>
          <em>Shop now<senso-icon name="arrow_forward" size="17" /></em>
        </span>
      </router-link>
    </div>
  </section>
</template>

<script>
import SensoIcon from "./SensoIcon.vue";
import SensoPhoto from "./SensoPhoto.vue";
import { aisleRoute, aisles } from "../kalio/kalio-catalog";
import { allProducts, categoryLine, money, photoOf } from "./senso-home";

export default {
  name: "SensoMoments",
  components: { SensoIcon, SensoPhoto },
  inject: ["$shop"],
  props: { title: { type: String, default: "Gear for every moment" } },
  data: () => ({ cards: [] }),
  mounted() {
    Promise.all([aisles(), allProducts()]).then(([cats, list]) => {
      const cur = this.$shop?.currency || "USD";
      const make = (c) => ({
        id: c.id,
        title: c.title || c.name,
        photo: photoOf("portrait", c),
        products: list.filter((p) => p.category_id === c.id),
        line: categoryLine(c, list, (n) => money(n, cur, true)),
        to: aisleRoute(c),
      });
      let cards = cats.filter((c) => photoOf("portrait", c)).map(make).filter((c) => c.products.length);
      if (!cards.length) cards = cats.map(make).filter((c) => c.products.length >= 3).sort((a, b) => b.products.length - a.products.length);
      this.cards = cards.slice(0, 5);
    });
  },
};
</script>
