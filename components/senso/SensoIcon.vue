<!-- Senso — an icon from Material Symbols Rounded (kalio-fonts.ts loads
     only the icons listed there; add a new one to ICONS). -->
<template>
  <span :class="{ '-fill': fill }" :style="size ? { fontSize: size + 'px' } : null" aria-hidden="true" class="sn-ms">{{ name }}</span>
</template>

<script>
export default {
  name: "SensoIcon",
  props: {
    name: { type: String, required: true },
    size: { type: [Number, String], default: null },
    fill: Boolean,
  },
};
</script>
