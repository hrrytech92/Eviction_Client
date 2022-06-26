<template>
  <v-card class="chanage-password-card rounded-card pt-12 px-10 pb-8">
    <v-btn
      v-if="!showSuccessMessage"
      color="info"
      icon
      class="close-popup"
      @click="close"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div v-if="!showSuccessMessage">
      <div class="text-center">
        <img
          src="@/assets/key.png"
          alt="email-verified"
          class="main-image mb-5"
        />
      </div>
      <div>
        <h6 class="custom-subtitle mb-5 text-center">Change Password</h6>
        <div>
          <v-text-field
            v-model="password"
            rounded
            dense
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="grey-input heightened-input custom-outlined mt-6"
            hide-details
          >
            <template v-slot:append>
              <v-btn
                class="btn--plain capital--btn info--text"
                icon
                @click="showPassword = !showPassword"
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
            :type="showConfirmPassword ? 'text' : 'password'"
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
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i
                  :class="errorMsg ? 'accent--text' : 'info--text'"
                  class="icofont-key"
                />
              </v-btn>
            </template>
          </v-text-field>
        </div>

        <div v-show="errorMsg" class="accent--error-message text-left ma-4">
          {{ errorMsg }}
        </div>

        <div class="py-4 secondary--text">
          Your new password must contain each of the requirements listed below.
        </div>
        <div class="d-flex pb-1">
          <v-icon :color="characters ? 'primary' : 'info'"> mdi-check </v-icon>
          <div class="ml-4 secondary--text">At least 8 characters</div>
        </div>
        <div class="d-flex pb-1">
          <v-icon :color="uppercase ? 'primary' : 'info'"> mdi-check </v-icon>
          <div class="ml-4 secondary--text">
            At least 1 uppercase letter (A-Z)
          </div>
        </div>
        <div class="d-flex pb-1">
          <v-icon :color="lowercase ? 'primary' : 'info'"> mdi-check </v-icon>
          <div class="ml-4 secondary--text">
            At least 1 lowercase letter (a-z)
          </div>
        </div>
        <div class="d-flex pb-1">
          <v-icon :color="number ? 'primary' : 'info'"> mdi-check </v-icon>
          <div class="ml-4 secondary--text">At least 1 number</div>
        </div>

        <v-btn
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
      </div>
    </div>

    <div v-if="showSuccessMessage" class="primary--text text-center">
      <div class="text-center">
        <img src="@/assets/key.png" alt="key" class="main-image mb-5" />
      </div>
      <div>
        <h6 class="custom-subtitle mb-5 text-center">Password Updated</h6>
        <div class="py-4 secondary--text">
          Your password has been reset successfully. You may now access your
          account with your new password.
        </div>
        <v-btn
          rounded
          color="primary"
          class="px-8 white--text capital--btn mt-5 mb-10"
          depressed
          @click="login"
        >
          Return to Login
        </v-btn>
      </div>
    </div>
  </v-card>
</template>
<script>
import useRequest from "@/utils/useRequest";

export default {
  data() {
    return {
      showSuccessMessage: false,
      showPassword: false,
      showConfirmPassword: false,
      password: "",
      confirmPassword: "",
      accept: false,
      dialogOpen: false,
      errMsg: "",
    };
  },
  computed: {
    client() {
      return this.$store.getters.client;
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
    errorMsg() {
      return this.errMsg;
    },
  },
  methods: {
    close() {
      this.password = "";
      this.confirmPassword = "";
      this.$emit("close:change-popup");
    },
    async submit() {
      if (this.password !== this.confirmPassword) {
        this.errMsg = "Oops! Passwords don't match.";
        return;
      }
      await useRequest({
        path: "change-password",
        method: "put",
        data: {
          p: this.password,
        },
        onSuccess: () => {
          this.showSuccessMessage = true;
        },
      });
      // this.$http
      //   .put(`${process.env.VUE_APP_URL}/api/change-password`, {
      //     auth0Id: this.client.auth0Id,
      //     p: this.password,
      //   })
      //   .then((r) => r.data)
      //   .then((data) => {
      //     if (data === "success") {
      //       this.showSuccessMessage = true;
      //       // setTimeout(() => {
      //       //   this.$emit('close:change-popup');
      //       //   this.$auth.loginWithRedirect();
      //       // }, 5000);
      //     }
      //   });
    },
    login() {
      this.$auth.loginWithRedirect();
    },
  },
};
</script>
<style>
.chanage-password-card {
  position: relative;
}

.chanage-password-card .secondary--text {
  font: normal normal normal 14px/24px Open Sans;
}

.chanage-password-card input {
  font: normal normal normal 14px/19px Open Sans;
  letter-spacing: 0.04px;
  color: #003a60 !important;
}
.chanage-password-card .v-input {
  border: 2px solid #afc2ce;
}

.chanage-password-card .v-input:hover .icofont-key {
  color: #4dccc4 !important;
}

.chanage-password-card .v-input--is-focused .icofont-key {
  color: #4dccc4 !important;
}

.chanage-password-card .v-input:hover {
  border: 2px solid #4dccc4;
  box-shadow: 15px 15px 40px #00000029;
}

.chanage-password-card .v-input--is-focused {
  border: 2px solid #4dccc4;
  box-shadow: 15px 15px 40px #00000029;
}

.chanage-password-card img {
  width: 69px;
}
.chanage-password-card .close-popup {
  position: absolute;
  top: 15px;
  right: 15px;
}
</style>
