<template>
  <div style="height: 100%" class="d-flex">
    <div class="dot" />
    <div class="line" />
    <img
      :src="require('@/assets/login-screen-isometric-3@2x.png')"
      class="login-image"
    />
    <!-- <div style="background-color: white; width: 50%; height: 100%;" class="pa-12 text-center d-flex flex-column justify-center"> -->
    <div
      style="background-color: white; width: 50%; height: 100%"
      class="pa-12 text-center"
    >
      <div
        class="pa-12 text-center d-flex flex-column justify-center secondary--text"
        style="height: 100%"
      >
        <div class="mb-8 d-flex justify-start">
          <v-btn
            text
            class="btn--plain capital--btn underlined--btn mx-4 primary--text"
          >
            LOGIN
          </v-btn>
          <v-btn
            class="btn--plain capital--btn info--text mx-4"
            text
            @click="$router.push('/register')"
          >
            REGISTER
          </v-btn>
        </div>

        <div class="grey-input mb-6">
          <v-text-field
            v-model="email"
            rounded
            outlined
            placeholder="email"
            hide-details
          >
            <template v-slot:prepend-inner>
              <i class="icofont-email info--text pr-4" />
            </template>
          </v-text-field>
        </div>

        <div>
          <v-text-field
            v-model="password"
            rounded
            outlined
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            placeholder="password"
            class="grey-input"
            hide-details
          >
            <template v-slot:prepend-inner>
              <i class="icofont-key info--text pr-4" />
            </template>
            <template v-slot:append>
              <v-btn
                class="btn--plain capital--btn info--text pb-4"
                text
                @click="show = !show"
              >
                <span v-if="!show">SHOW</span><span v-if="show">HIDE</span>
              </v-btn>
            </template>
          </v-text-field>
        </div>

        <div v-if="errorMsg" class="error-message text-left ma-4">
          {{ errorMsg }}
        </div>

        <div class="d-flex align-center my-8">
          Remember me
          <v-switch v-model="remember" class="px-4" inset color="primary" />
        </div>
        <v-btn rounded dark class="primary py-6 mb-6" depressed @click="login">
          access account
        </v-btn>
        <v-btn
          text
          class="btn--plain capital--btn info--text"
          @click="$router.push('/forgot-password')"
        >
          FORGOT PASSWORD
        </v-btn>
      </div>
    </div>
    <div
      style="background-color: #fafbfc; width: 50%; height: 100%; left: 50%"
      class="pa-12 text-center secondary--text"
    >
      <div class="d-flex justify-end" style="width: 90%; margin-top: -32px">
        <v-btn class="btn--plain" text> home </v-btn>
        <v-btn class="btn--plain" text> help </v-btn>
      </div>
      <div
        class="display-1 font-weight-medium py-4"
        style="font-size: 2.7rem !important"
      >
        glad you're back!
      </div>
      <div>
        Be sure to check your notifications to stay on top of tasks and respond
        to messages. Reach out to us if you need help.
      </div>
    </div>
  </div>
</template>

<script>
// import loginImage from '@/assets/login-screen-isometric-3@2x.png'
export default {
  name: "LoginScreen",
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
      return this.$store.getters.errorMsg;
    },
  },
  methods: {
    async login() {
      this.$store.commit("set_auth_error", "");
      const msg = await this.$authHelpers.login(this.email, this.password);
      console.log("msg", msg);
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
</style>
