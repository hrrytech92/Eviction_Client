<template>
  <v-sheet :height="height" class="sticky-bottom-bar-sheet">
    <slot />
  </v-sheet>
</template>

<script>
export default {
  name: "StickyBottomBar",
  props: {
    height: {
      type: String,
      default: "55px",
    },
  },
};
</script>

<style>
.sticky-bottom-bar-sheet {
  background-color: white;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 10;
}
</style>
