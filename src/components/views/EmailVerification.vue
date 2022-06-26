<template>
  <div class="welcome-page">
    <div class="welcome-inner-page">
      <img src="@/assets/grid.svg" alt="grid-image" class="grid-backImage" />
      <v-card
        class="welcome-card rounded-card pt-15 px-10 pb-8 d-flex align-center justify-space-between flex-column"
      >
        <img
          src="@/assets/email-verified.png"
          alt="email-verified"
          class="main-image mb-5"
        />
        <h6 class="custom-subtitle mb-5">Welcome to FileEvictions!</h6>
        <p class="secondary--text welcome-description">
          Thank you for verifying your email! An account has been created for
          you. Log in to enjoy access to all of our available eviction tools.
        </p>
        <v-btn
          rounded
          color="primary"
          class="px-8 white--text capital--btn mt-5 mb-10 go-account-link"
          depressed
          @click="login"
        >
          Go to Your Account
        </v-btn>
        <p class="bottom-link mb-0 secondary--text">
          Need help?
          <a text href="mailto: support@fileevictions.com"> Contact Us </a>
        </p>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
  },
};
</script>
<style>
.welcome-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.welcome-inner-page {
  max-width: 500px;
  margin: 0 auto;
  position: relative;
}

.welcome-inner-page .welcome-card {
  max-width: 375px;
  margin: 0 auto;
  box-shadow: 15px 15px 40px #00000029 !important;
}

.welcome-card .main-image {
  width: 70px;
}

.grid-backImage {
  position: absolute;
  top: -60px;
  right: -86px;
}

.welcome-description {
  font: normal normal normal 14px/24px Open Sans;
}

.welcome-card .bottom-link {
  font: normal normal normal 14px/24px Open Sans;
}

.welcome-card .bottom-link a {
  font-weight: 600;
}

.welcome-card .go-account-link span {
  font: normal normal 600 14px/24px Open Sans;
  letter-spacing: 0.05px;
}
</style>
