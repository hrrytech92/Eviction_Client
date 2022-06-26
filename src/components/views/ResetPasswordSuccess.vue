<template>
  <div class="reset-password-success-page">
    <div class="project-logo">
      <img
        src="https://fileevictions.com/wp-content/uploads/2021/06/logo.png"
        alt=""
      />
    </div>
    <div class="reset-password-success-inner-page">
      <v-card
        class="reset-password-success-card rounded-card pt-15 px-10 pb-8 d-flex align-center justify-space-between flex-column"
      >
        <img src="@/assets/key.png" alt="key" class="main-image mb-5" />
        <h6 class="custom-subtitle mb-5">Password Updated</h6>
        <p class="secondary--text reset-password-success-description">
          Your password has been reset successfully. You may now access your
          account with your new password.
        </p>
        <v-btn
          rounded
          color="primary"
          class="px-8 white--text capital--btn mt-5 mb-10 go-account-link"
          depressed
          @click="login"
        >
          Return to Login
        </v-btn>
      </v-card>
    </div>
    <div class="project-footer">
      <p>©2020 EasyEvictions LLC</p>
      <a href="/">Legal</a>
      <a href="/">Privacy</a>
      <a href="/">Disclaimer</a>
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
.reset-password-success-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
}

.reset-password-success-inner-page {
  max-width: 500px;
  margin: 0 auto;
  position: relative;
}

.reset-password-success-inner-page .reset-password-success-card {
  max-width: 375px;
  margin: 0 auto;
  box-shadow: 15px 15px 40px #00000029 !important;
}

.reset-password-success-card .main-image {
  width: 70px;
}

.reset-password-success-description {
  font: normal normal normal 14px/24px Open Sans;
}

.reset-password-success-card .go-account-link span {
  font: normal normal 600 14px/24px Open Sans;
  letter-spacing: 0.05px;
}

.project-logo {
  position: absolute;
  top: 25px;
  left: 32px;
}

.project-logo img {
  width: 210px;
}

.project-footer {
  position: absolute;
  bottom: 0;
  border-radius: 0px 58px 58px 0px;
  background: #ffffff;
  display: flex;
  padding: 17px 34px;
}

.project-footer p {
  font-size: 14px;
  line-height: 22px;
  font-family: "futura-pt", sans-serif;
  letter-spacing: 0.04px;
  color: #53809d;
  margin-bottom: 0;
}

.project-footer a {
  font-size: 14px;
  line-height: 22px;
  font-family: "futura-pt", sans-serif;
  letter-spacing: 0.04px;
  color: #4dccc4;
  margin-left: 20px;
}
</style>
