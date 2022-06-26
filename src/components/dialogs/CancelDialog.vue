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
        Quit the form?
      </div>
      <div class="text-left">
        {{ defineLeaveText }}
      </div>
    </div>
    <div>
      <v-btn
        depressed
        tile
        style="width: 50%"
        class="white--text text-center pa-8 font-weight-medium mt-auto capital--btn accent_light"
        @click="$emit('close')"
      >
        <span class="" style="font-weight: 600 !important">No, Go Back.</span>
      </v-btn>
      <v-btn
        depressed
        tile
        style="width: 50%"
        class="white--text text-center pa-8 font-weight-medium mt-auto capital--btn accent"
        @click="$emit('submit')"
      >
        <span class="" style="font-weight: 600 !important">Yes, Quit.</span>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "CancelDialog",
  computed: {
    defineLeaveText() {
      if (!this.$auth.isAuthenticated) {
        return 'Looks like you are not logged in. Sign in to your account or create an account to have your information saved. If you navigated away from the form by mistake, click "No, Go Back" to continue completing the form and Log in or Register later.';
      }

      return "We’ll store the information you’ve provided thus far, and have it available for you to access from your dashboard at any time. If you clicked the close button by mistake, click “No, Go Back” to continue completing the form.";
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
