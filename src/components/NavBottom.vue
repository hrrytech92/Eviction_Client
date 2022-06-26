<template>
  <v-bottom-navigation
    style="box-shadow: 15px 15px 40px #00000029"
    app
    :value="value"
    grow
    active-class="active-bottom-btn"
  >
    <v-btn
      class="capital--btn"
      @click="$router.push(`/case-view/${$route.params.id}/overview`)"
    >
      <span
        class="overline font-weight-medium"
        :class="{ 'info--text': value !== 0 }"
        >OVERVIEW</span
      >

      <i
        class="icofont-search-folder"
        :class="{ 'info--text': value !== 0 }"
        style="font-size: 1.5rem"
      />
    </v-btn>

    <v-btn
      class="capital--btn"
      :class="{ 'info--text': value !== 1 }"
      @click="$router.push(`/case-view/${$route.params.id}/uploads`)"
    >
      <span
        class="overline font-weight-medium"
        :class="{ 'info--text': value !== 1 }"
        >UPLOADS</span
      >

      <i
        class="icofont-copy-invert"
        :class="{ 'info--text': value !== 1 }"
        style="font-size: 1.5rem"
      />
    </v-btn>

    <v-btn
      class="capital--btn"
      @click="$router.push(`/case-view/${$route.params.id}/pleadings`)"
    >
      <span
        class="overline font-weight-medium"
        :class="{ 'info--text': value !== 2 }"
        >PLEADINGS</span
      >

      <i
        class="icofont-gavel"
        style="font-size: 1.5rem"
        :class="{ 'info--text': value !== 2 }"
      />
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "NavBottom",
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style></style>
