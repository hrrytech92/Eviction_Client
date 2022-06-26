<template>
  <div>
    <!-- <div class="dot"></div> -->
    <!-- <div class="line"></div> -->
    <mobile-menu />
    <!-- <div style="background-color: white; width: 50%; height: 100%;" class="pa-12 text-center d-flex flex-column justify-center"> -->
    <v-card class="ma-6 rounded-card">
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

        <div
          class="display-1 font-weight-medium py-4"
          style="font-size: 1.8rem !important; line-height: normal"
        >
          glad you're back!
        </div>
        <div class="mb-6">
          Be sure to check your notifications to stay on top of tasks and
          respond to messages. Reach out to us if you need help.
        </div>

        <div class="grey-input mb-6">
          <v-text-field
            v-model="email"
            rounded
            outlined
            dense
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
            dense
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
                class="btn--plain capital--btn info--text pb-2"
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

        <div class="d-flex align-center my-2">
          <span style="font-size: 18px">Remember me</span>
          <v-switch v-model="remember" class="px-4" inset color="primary" />
        </div>
        <v-btn rounded dark class="primary py-2 mb-6" depressed @click="login">
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
    </v-card>
    <img
      :src="require('@/assets/login-screen-isometric-3@2x.png')"
      class="login-image-mobile"
    />
    <!-- <div class="pa-12 text-center secondary--text">
      <div class="d-flex justify-end" style="width: 90%; margin-top: -32px">
        <v-btn class="btn--plain" text>home</v-btn>
        <v-btn class="btn--plain" text>help</v-btn>
        </div>
    </div> -->
  </div>
</template>

<script>
import MobileMenu from "@/components/MobileMenu";
export default {
  name: "LoginMobile",
  components: {
    MobileMenu,
  },
  data() {
    return {
      show: false,
      email: "",
      password: "",
      remember: true,
      items: [{ title: "Home" }, { title: "Help" }],
    };
  },
  computed: {
    errorMsg() {
      return this.$store.getters.errorMsg;
    },
  },
  methods: {
    login() {
      this.$store.commit("set_auth_error", "");
      this.$authHelpers.login(this.email, this.password);
    },
  },
};
</script>

<style></style>
