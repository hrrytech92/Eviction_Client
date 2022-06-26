<template>
  <v-card
    class="d-flex flex-column secondary--text justify-center"
    style="border-radius: 20px"
  >
    <div
      class="pa-10 d-flex flex-column align-center"
      style="padding-bottom: 20px !important"
    >
      <img src="@/assets/login-icon.svg" alt="login-icon" class="pt-10" />

      <div
        class="mb-8 mt-8 custom-title secondary--text font-weight-medium text-center"
        style="font-size: 25px"
      >
        Create an Account
      </div>
      <div class="text-left" style="font-family: Open Sans; font-size: 14px">
        To save and download your documents, create an account. Once you are
        registered, you’ll have full access to the document, along with a number
        of other exclusive features and tools.
      </div>

      <div class="mt-10" style="width: 70%">
        <v-btn
          depressed
          rounded
          color="#4DCCC4"
          class="white--text text-center w-100"
          style="font-family: Open Sans; font-size: 14px; font-weight: 600"
          @click="goRegister"
        >
          Register
        </v-btn>
      </div>

      <div style="margin-top: 60px; font-family: Open Sans; font-size: 14px">
        Already have an account?
        <span class="sign-in-text" @click="goLogin">Sign in</span>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "ShouldLoginDialog",
  components: {},
  props: {},
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("close:dialog");
    },
    goRegister() {
      this.$emit("register:clicked");
    },
    goLogin() {
      this.$emit("login:clicked");
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap");

.w-100 {
  width: 100%;
}

.sign-in-text {
  color: #4dccc4;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);
}

.sign-in-text:hover {
  opacity: 0.8;
}
</style>
