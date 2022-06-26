<template>
  <v-card
    class="d-flex flex-column secondary--text justify-center"
    min-height="550"
  >
    <div
      class="pa-10 d-flex flex-column align-center"
      style="min-height: 500px"
    >
      <i :class="`icofont-exclamation-circle icofont-6x accent--text`" />

      <div
        class="mb-4 custom-title secondary--text font-weight-medium text-center"
      >
        Upcoming Feature
      </div>
      <div class="text-left">{{ bodyText }}</div>
    </div>
    <div>
      <v-btn
        depressed
        tile
        style="width: 50%"
        class="white--text text-center pa-8 font-weight-medium mt-auto capital--btn accent_light"
        @click="close"
      >
        <span class="" style="font-weight: 600 !important">GO BACK</span>
      </v-btn>
      <v-btn
        depressed
        tile
        style="width: 50%"
        class="white--text text-center pa-8 font-weight-medium mt-auto capital--btn accent"
        @click="close"
      >
        <span class="" style="font-weight: 600 !important">CANCEL</span>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "UpcomingFeatureDialog",
  components: {},
  props: {
    bodyText: {
      type: String,
      default: "This is an upcoming feature.",
    },
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("close:dialog");
    },
  },
};
</script>

<style></style>
