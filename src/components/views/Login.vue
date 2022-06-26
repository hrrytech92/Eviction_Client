<template>
  <div
    style="height: 100vh; margin-top: -64px"
    class="d-flex justify-center align-center"
  >
    <!-- <mq-layout :mq="['mobile', 'tablet']">
      <login-mobile />
    </mq-layout>
    <mq-layout mq="laptop+" style="height: 100vh">
      <login-screen/>
    </mq-layout> -->

    <v-card class="ma-6 rounded-card pa-8" width="450">
      <div
        class="pa-8 d-flex flex-column justify-center secondary--text"
        style="height: 100%"
      >
        <div class="mb-4 d-flex justify-start">
          <v-btn
            text
            class="btn--plain capital--btn underlined--btn mr-2 primary--text"
          >
            LOGIN
          </v-btn>
          <v-btn
            class="btn--plain capital--btn info--text ml-2"
            text
            @click="$router.push('/register')"
          >
            REGISTER
          </v-btn>
        </div>
        <!-- 
          <div class="display-1 font-weight-medium py-4" style="font-size: 1.8rem !important; line-height: normal;">glad you're back!</div>
      <div class="mb-6">Be sure to check your notifications to stay on top of tasks and respond to messages. Reach out to us if you need help.</div> -->

        <div class="my-6">
          <v-text-field
            v-model="email"
            rounded
            dense
            placeholder="Email Address"
            class="grey-input heightened-input custom-outlined"
            hide-details
          >
            <template v-slot:prepend-inner>
              <i class="icofont-email info--text mt-4 pr-4" />
            </template>
          </v-text-field>
        </div>

        <div>
          <v-text-field
            v-model="password"
            rounded
            dense
            :type="show ? 'text' : 'password'"
            placeholder="Password"
            class="grey-input heightened-input custom-outlined"
            :class="{ 'accent--error': errorMsg }"
            hide-details
          >
            <template v-slot:prepend-inner>
              <i
                :class="errorMsg ? 'accent--text' : 'info--text'"
                class="icofont-key mt-4 pr-4"
              />
            </template>
            <template v-slot:append>
              <v-btn
                :class="errorMsg ? 'accent--text' : 'info--text'"
                class="btn--plain capital--btn mt-2"
                text
                @click="show = !show"
              >
                <span v-if="!show">SHOW</span><span v-if="show">HIDE</span>
              </v-btn>
            </template>
          </v-text-field>
        </div>

        <div v-if="errorMsg" class="accent--error-message text-left ma-4">
          {{ errorMsg }}
        </div>

        <div class="d-flex align-center my-2">
          <span style="font-size: 18px">Remember me</span>
          <v-switch v-model="remember" class="px-4" inset color="primary" />
        </div>
        <v-btn
          rounded
          dark
          class="primary mb-6 capital--btn"
          large
          depressed
          @click="login"
        >
          Access Account
        </v-btn>
        <v-btn
          text
          class="btn--plain capital--btn info--text"
          @click="$router.push('/forgot-password')"
        >
          FORGOT PASSWORD
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
// import LoginScreen from '@/components/LoginScreen'
// import LoginMobile from '@/components/LoginMobile'
export default {
  name: "Login",
  components: {
    // LoginScreen,
    // LoginMobile
  },
  data() {
    return {
      show: false,
      email: "",
      password: "",
      remember: true,
    };
  },
  computed: {
    errorMsg() {
      const err = this.$store.getters.errorMsg;
      if (err === "Wrong email or password.") {
        return "Seems the Email or Password is incorrect. Try again.";
      }
      return err;
    },
  },
  created() {
    // this.$auth.loginWithRedirect();
  },
  methods: {
    login() {
      this.$store.commit("set_auth_error", "");
      // this.$authHelpers.login(this.email, this.password)
    },
  },
};
</script>

<style>
.dot {
  z-index: 2;
  margin-top: -119px;
  margin-left: calc(50% - 119px);
  width: 238px;
  height: 238px;
  background: #4dccc4 0% 0% no-repeat padding-box;
  border-radius: 50%;
  opacity: 1;
  position: absolute;
}

.line {
  z-index: 3;
  margin-left: calc(50% - 70px);
  width: 262px;
  height: 308px;
  transform: matrix(0.67, -0.74, 0.74, 0.67, 0, 0);
  border-top: 3px solid #003a60;
  opacity: 1;
  position: absolute;
}
.heightened-input div.v-input__slot {
  height: 48px;
  padding-bottom: 8px;
}

.custom-outlined {
  border: 1px solid #afc2ce;
  border-radius: 45px;
}

.login-image {
  position: absolute;
  z-index: 2;
  bottom: 0;
  right: 0;
  width: 52%;
  height: auto;
}
.capital--btn > span.v-btn__content {
  text-transform: capitalize;
}

.underlined--btn {
  border-bottom: solid 1.5px #4dccc4;
  border-radius: 0%;
}

.accent--error {
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 15px 15px 40px #0000001f;
  border: 2px solid #ff854e;
}
</style>
