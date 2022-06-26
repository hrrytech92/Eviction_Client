<template>
  <div class="mx-auto secondary--text">
    <v-btn
      color="info"
      icon
      class="float-right ma-8 btn--plain"
      @click="$bus.emit('open-cancel-dialog-verified-complaint')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <div style="width: 80%" class="pt-10 pb-4 mx-auto text-left">
      <slot></slot>
    </div>

    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0 0 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="$emit('vcBoxCancel')"
        v-bind="vcCancelBtnProps"
      >
        {{
          vcCancelBtnProps && vcCancelBtnProps.btnText
            ? vcCancelBtnProps.btnText
            : "go back"
        }}
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        @click="$emit('vcBoxContinue')"
        :disabled="continueBtnDisabled"
      >
        {{ vcContinueBtnText || "continue" }}
      </v-btn>
      <v-btn
        v-if="isLease"
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        @click="$emit('vcBoxSkip')"
      >
        {{ vcSkipBtnText || "skip" }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  name: "VerifiedComplaintBox",
  props: {
    vcContinueBtnText: {
      type: String,
      default: "",
    },
    vcSkipBtnText: {
      type: String,
      default: "",
    },
    vcCancelBtnProps: {
      type: Object,
      default: null,
    },
    continueBtnDisabled: {
      type: Boolean,
      default: false,
    },
    isLease: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped></style>
