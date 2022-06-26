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
        Too Complicated
      </div>
      <div class="text-left">
        {{ defineLeaveText }}
      </div>
    </div>
    <div>
      <v-btn
        depressed
        tile
        style="width: 100%"
        class="white--text text-center pa-8 font-weight-medium mt-auto capital--btn accent_light"
        @click="$emit('endFlow')"
      >
        <span class="" style="font-weight: 600 !important">I UNDERSTAND</span>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "ComplicateDialog",
  computed: {
    defineLeaveText() {
      if (!this.$auth.isAuthenticated) {
        return 'Looks like you are not logged in. Sign in to your account or create an account to have your information saved. If you navigated away from the form by mistake, click "No, Go Back" to continue completing the form and Log in or Register later.';
      }

      return "Unfortunately, at this time, our software does not support this process. This is where we hand over the reins. You can continue to use our software to upload documents and manage your case, but we won't be able to help.";
    },
  },
};
</script>

<style></style>
