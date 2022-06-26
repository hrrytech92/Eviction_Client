<template>
  <!-- <mq-layout :mq="['laptop', 'desktop']">
    <div class="dot"></div>
          <div class="line"></div>
    </mq-layout> -->
  <!-- <div style="background-color: white; width: 50%; height: 100%;" class="pa-12 text-center d-flex flex-column justify-center"> -->
  <!-- <mq-layout mq="tablet+">
        <div class="d-flex justify-end pt-2" style="width: 90%;">
        <v-btn class="btn--plain" text>home</v-btn>
        <v-btn class="btn--plain" text>help</v-btn>
        <v-btn class="btn--plain" text @click="$router.push('/login')">login</v-btn>
        </div>
      </mq-layout>
      <mq-layout mq="mobile">
        <mobile-menu />
        </mq-layout> -->
  <div
    style="height: 100vh; margin-top: -64px"
    class="d-flex justify-center align-center"
  >
    <v-card class="ma-6 rounded-card pa-8" width="500">
      <!-- <v-card class="pa-4 mx-auto forgot-card rounded-card"> -->
      <!-- <div class="lock-wrapper"> <i :class="{'icofont-2x': mobileScreenType, 'icofont-3x': !mobileScreenType}" class="icofont-unlock primary--text"></i></div> -->
      <div class="lock-wrapper">
        <i class="icofont-unlock primary--text" style="font-size: 2.5rem" />
      </div>

      <div
        :class="{ 'px-6': mobileScreenType, 'px-12': !mobileScreenType }"
        class="d-flex flex-column justify-center secondary--text"
        style="height: 100%"
      >
        <div class="font-weight-medium" style="font-size: 1.75rem">
          Forgot Password?
        </div>
        <div class="py-2">
          It’s okay! It happens. Enter the email address associated with your
          account. We’ll send you an email with instructions to reset it.
        </div>

        <div class="grey-input my-6">
          <v-text-field
            v-model="email"
            rounded
            outlined
            dense
            placeholder="Email Address"
            class="heightened-input"
            hide-details
          >
            <template v-slot:prepend-inner>
              <i class="icofont-email info--text mt-1 pr-4" />
            </template>
          </v-text-field>
        </div>

        <v-btn
          rounded
          dark
          :class="{ 'py-2': mobileScreenType, 'py-6': !mobileScreenType }"
          class="primary mb-8 capital--btn"
          style="height: 44px"
          depressed
        >
          Send Request
        </v-btn>

        <div class="mb-8 d-flex justify-center">
          <v-btn
            text
            class="btn--plain capital--btn info--text side-line"
            @click="$router.push('/login')"
          >
            LOGIN
          </v-btn>
          <v-btn
            class="btn--plain capital--btn info--text"
            text
            @click="$router.push('/register')"
          >
            REGISTER
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
// import MobileMenu from '@/components/MobileMenu'
export default {
  name: "ForgotPassword",
  components: {
    // MobileMenu
  },
  data() {
    return {
      show: false,
      email: "",
      password: "",
      titleHeight: "",
      accept: false,
      dialogOpen: false,
      menuItems: [{ title: "Home" }, { title: "Help" }],
    };
  },
  computed: {
    mobileScreenType() {
      // if (this.$mq === 'mobile'){
      //   return true
      // }
      // else return false
      return true;
    },
  },
  mounted() {
    this.titleHeight = document.getElementById("registertitle").offsetHeight;
  },
  methods: {
    acceptTerms() {
      this.accept = true;
    },
    declineTerms() {
      this.accept = false;
    },
  },
};
</script>

<style>
.lock-wrapper {
  margin-top: -59px;
  margin-left: 10%;
}

.side-line {
  border-right: solid 2px #afc2ce;
  border-radius: 0%;
}

.forgot-card {
  width: 500px;
  top: 135px;
  z-index: 4;
}

@media screen and (max-width: 450px) {
  .forgot-card {
    width: 90%;
    top: initial;
    margin: 28px 0px;
    border-radius: 50%;
    padding: 24px;
  }

  .lock-wrapper {
    margin-top: -40px;
  }
}
</style>
