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
        color="primary"
      >
        $circleCheckmark
      </v-icon>
      <i
        v-else
        :class="`icofont-exclamation-circle icofont-6x primary--text`"
      />

      <div
        class="my-2 custom-title secondary--text font-weight-medium text-center"
      >
        Success
      </div>
      <div class="text-left">
        <slot name="success-text" />
      </div>
    </div>
    <v-btn
      tile
      class="primary white--text text-center pa-8 font-weight-medium mt-auto capital--btn"
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
    btnText: {
      type: String,
      default: "ALL DONE",
    },
    type: {
      type: String,
      default: "success",
    },
  },
  methods: {
    close() {
      this.$emit("close:dialog");
    },
  },
};
</script>

<style></style>
