<template>
  <div class="quick-link d-flex flex-column align-center">
    <v-btn
      depressed
      small
      color="white"
      icon
      :to="{ path: `/case-view/${path}/overview` }"
    >
      <v-icon>{{ icon }}</v-icon>
    </v-btn>
    <p class="info--text overline font-weight-medium text-center ma-2">
      {{ title }}
    </p>
  </div>
</template>

<script>
export default {
  name: "PageNavItem",
  props: {
    title: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    path: {
      type: String,
      default: "",
    },
  },
};
</script>

<style>
.quick-link {
  margin: auto;
}
</style>
