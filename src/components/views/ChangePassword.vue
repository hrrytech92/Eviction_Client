<template>
  <div
    style="height: 100vh; margin-top: -64px"
    class="d-flex justify-center align-center"
  >
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

    <v-card class="pa-4 mx-auto rounded-card custom-shadow">
      <div class="lock-wrapper">
        <i
          :class="{
            'icofont-2x': mobileScreenType,
            'icofont-3x': !mobileScreenType,
          }"
          class="icofont-unlock primary--text"
        />
      </div>

      <div
        :class="{ 'px-4': mobileScreenType, 'px-12': !mobileScreenType }"
        class="d-flex flex-column justify-center secondary--text"
        style="height: 100%"
      >
        <v-container>
          <v-row>
            <v-col :sm="12" :md="6">
              <div class="font-weight-medium" style="font-size: 1.75rem">
                Change Password
              </div>

              <div>
                <v-text-field
                  v-model="password"
                  rounded
                  dense
                  :type="show ? 'text' : 'password'"
                  placeholder="Password"
                  class="grey-input heightened-input custom-outlined mt-6"
                  hide-details
                >
                  <template v-slot:append>
                    <v-btn
                      class="btn--plain capital--btn info--text"
                      icon
                      @click="show = !show"
                    >
                      <i class="icofont-key info--text" />
                    </v-btn>
                  </template>
                </v-text-field>
              </div>

              <div>
                <v-text-field
                  v-model="confirmPassword"
                  rounded
                  dense
                  :type="show ? 'text' : 'password'"
                  placeholder="Confirm New Password"
                  class="grey-input heightened-input custom-outlined mt-6"
                  :class="{ 'accent--error': errorMsg }"
                  hide-details
                  @click="errMsg = ''"
                >
                  <template v-slot:append>
                    <v-btn
                      :class="errorMsg ? 'accent--text' : 'info--text'"
                      class="btn--plain capital--btn"
                      icon
                      @click="show = !show"
                    >
                      <i
                        :class="errorMsg ? 'accent--text' : 'info--text'"
                        class="icofont-key"
                      />
                    </v-btn>
                  </template>
                </v-text-field>
              </div>

              <div
                v-show="errorMsg"
                class="accent--error-message text-left ma-4"
              >
                {{ errorMsg }}
              </div>

              <v-btn
                v-if="!mobileScreenType"
                block
                rounded
                :dark="validPassword"
                class="primary my-6 py-6"
                depressed
                :disabled="!validPassword"
                @click="submit"
              >
                create new password
              </v-btn>
            </v-col>
            <v-col
              :sm="12"
              :md="6"
              :class="{
                'pl-12': !mobileScreenType,
                'pl-12': !mobileScreenType,
              }"
            >
              <div class="font-weight-medium" style="font-size: 1.5rem">
                Add some strength.
              </div>
              <div class="pt-2 pb-6 mobile-smaller-text">
                Your new password must contain each of the requirements listed
                below.
              </div>
              <div class="d-flex pb-1 mobile-smaller-text">
                <v-icon :color="characters ? 'primary' : 'info'">
                  mdi-check
                </v-icon>
                <div class="ml-4">At least 8 characters</div>
              </div>
              <div class="d-flex pb-1 mobile-smaller-text">
                <v-icon :color="uppercase ? 'primary' : 'info'">
                  mdi-check
                </v-icon>
                <div class="ml-4">At least 1 uppercase letter (A-Z)</div>
              </div>
              <div class="d-flex pb-1 mobile-smaller-text">
                <v-icon :color="lowercase ? 'primary' : 'info'">
                  mdi-check
                </v-icon>
                <div class="ml-4">At least 1 lowercase letter (a-z)</div>
              </div>
              <div class="d-flex pb-1 mobile-smaller-text">
                <v-icon :color="number ? 'primary' : 'info'">
                  mdi-check
                </v-icon>
                <div class="ml-4">At least 1 number</div>
              </div>
            </v-col>
          </v-row>
        </v-container>
        <!-- <v-btn block rounded :dark="validPassword" class="primary mb-2 py-2" depressed :disabled="!validPassword" @click="sub">create new password</v-btn> -->
        <v-dialog v-model="successDialog" persistent value="''" max-width="500">
          <InfoDialog
            color="primary"
            title="Success!"
            text="Your password has been successfully changed."
            btn-text="ALL DONE"
            @submit="$router.push('/')"
          />
        </v-dialog>
      </div>
    </v-card>
  </div>
</template>

<script>
import InfoDialog from "../dialogs/InfoDialog.vue";
// import MobileMenu from '@/components/MobileMenu'
export default {
  name: "ChangePassword",
  components: {
    InfoDialog,
    // MobileMenu,
  },
  data() {
    return {
      show: false,
      password: "",
      confirmPassword: "",
      accept: false,
      dialogOpen: false,
      errMsg: "",
      successDialog: false,
    };
  },
  computed: {
    mobileScreenType() {
      return this.$mq === "mobile";
    },
    characters() {
      return this.password.length >= 8;
    },
    uppercase() {
      return /[A-Z]/.test(this.password);
    },
    lowercase() {
      return /[a-z]/.test(this.password);
    },
    number() {
      return /\d/.test(this.password);
    },
    validPassword() {
      return this.characters && this.uppercase && this.lowercase && this.number;
    },
    client() {
      return this.$store.getters.client;
    },
    errorMsg() {
      return this.errMsg;
    },
  },
  methods: {
    submit() {
      if (this.password !== this.confirmPassword) {
        this.errMsg = "Oops! Passwords don't match.";
      } else {
        this.$http
          .patch(`${process.env.VUE_APP_URL}/password`, {
            auth0Id: this.client.auth0Id,
            p: this.password,
          })
          .then((r) => r.data)
          .then((data) => {
            console.log(data);
            this.successDialog = true;
          });
      }
    },
  },
};
</script>

<style>
.custom-shadow {
  box-shadow: 15px 15px 40px #00000029 !important;
}
.change-card {
  width: 80%;
  top: 135px;
  z-index: 4;
}
.medium-heading {
  font-size: 1.8em;
}
@media screen and (max-width: 450px) {
  .change-card {
    width: 90%;
    top: initial;
    margin: 28px 0px;
    border-radius: 50%;
    padding: 24px;
  }

  .medium-heading {
    font-size: 1.2em;
  }

  .mobile-smaller-text {
    font-size: medium;
  }
}

.v-input__control .v-input__append-inner {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
