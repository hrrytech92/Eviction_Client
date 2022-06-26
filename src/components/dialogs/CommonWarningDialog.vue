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
        {{ dialogData && dialogData.headerText }}
      </div>
      <div class="text-left">
        {{ dialogData && dialogData.contentText }}
        <slot name="content-text"></slot>
      </div>

      <slot name="additional-content"></slot>
    </div>
    <div>
      <v-btn
        depressed
        tile
        style="width: 50%"
        class="white--text text-center pa-8 font-weight-medium mt-auto capital--btn accent_light"
        @click="$emit('close')"
      >
        <span class="" style="font-weight: 600 !important">{{
          dialogData && dialogData.cancelText
            ? dialogData.cancelText
            : "No, Go Back."
        }}</span>
      </v-btn>
      <v-btn
        depressed
        tile
        style="width: 50%"
        class="white--text text-center pa-8 font-weight-medium mt-auto capital--btn accent"
        @click="$emit('submit')"
      >
        <span class="" style="font-weight: 600 !important">{{
          dialogData && dialogData.confirmText
            ? dialogData.confirmText
            : "Yes, Quit."
        }}</span>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "CommonWarningDialog",
  props: {
    dialogData: {
      type: Object,
      default: () => ({}),
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
