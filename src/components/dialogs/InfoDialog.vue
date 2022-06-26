<template>
  <v-card
    class="d-flex flex-column secondary--text justify-center"
    min-height="550"
  >
    <div
      class="pa-10 d-flex flex-column align-center"
      style="min-height: 500px"
    >
      <v-icon
        v-if="type === 'success'"
        style="height: 140px; width: 140px; margin-left: 20px"
        :color="color"
      >
        $circleCheckmark
      </v-icon>
      <i
        v-else
        :class="`icofont-exclamation-circle icofont-6x ${color}--text`"
      />

      <div
        class="my-2 custom-title secondary--text font-weight-medium text-center"
      >
        {{ title }}
      </div>
      <div class="text-left" v-html="text" />
    </div>
    <v-btn
      tile
      class="white--text text-center pa-8 font-weight-medium mt-auto capital--btn"
      :class="color"
      @click="$emit('submit')"
    >
      <span class="" style="font-weight: 600 !important">{{ btnText }}</span>
    </v-btn>
  </v-card>
</template>

<script>
export default {
  name: "InfoDialog",
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    btnText: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
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
