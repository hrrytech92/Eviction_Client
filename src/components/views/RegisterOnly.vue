<template>
  <div
    style="height: 100vh; margin-top: -64px"
    class="d-flex flex-column justify-center align-center"
  >
    <v-card class="ma-6 rounded-card pa-8" width="550">
      <div
        class="pa-8 d-flex flex-column justify-center secondary--text"
        style="height: 100%"
      >
        <div class="mb-4">
          <div class="custom-title pb-4">Create an Account</div>
          <div class="text-left">
            To save your document, create an account. Once you are registered,
            you'll have full access to the document, along with a number of
            other exclusive features and tools.
          </div>
        </div>

        <!-- <div class="display-1 font-weight-medium py-4" style="font-size: 1.8rem !important; line-height: normal;">get started in seconds.</div>
      <div class="mb-6">We’ll revolutionize the way you manage your properties and eviction process. Fast. Simple. Painless. Affordable.</div> -->

        <div class="my-6">
          <v-text-field
            v-model="email"
            rounded
            dense
            placeholder="Email Address"
            :class="{ 'accent--error': errorMsg.type === 'email' }"
            class="grey-input heightened-input custom-outlined"
            hide-details
          >
            <template v-slot:prepend-inner>
              <i
                :class="
                  errorMsg.type === 'email' ? 'accent--text' : 'info--text'
                "
                class="icofont-email mt-4 pr-4"
              />
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
            :class="{ 'accent--error': errorMsg.type === 'password' }"
            class="grey-input heightened-input custom-outlined"
            hide-details
          >
            <template v-slot:prepend-inner>
              <i
                :class="
                  errorMsg.type === 'password' ? 'accent--text' : 'info--text'
                "
                class="icofont-key mt-4 pr-4"
              />
            </template>
            <template v-slot:append>
              <v-btn
                :class="
                  errorMsg.type === 'password' ? 'accent--text' : 'info--text'
                "
                class="btn--plain capital--btn pb-2 mt-2"
                text
                @click="show = !show"
              >
                <span v-if="!show">SHOW</span><span v-if="show">HIDE</span>
              </v-btn>
            </template>
          </v-text-field>
        </div>
        <div v-if="errorMsg.type" class="accent--error-message text-left ma-4">
          {{ errorMsg.msg }}
        </div>

        <div v-if="errorMsg.type === 'password'" style="font-size: 0.85rem">
          <!-- <div class="pt-2 pb-4">Your password must contain each of the requirements listed below.</div> -->
          <div class="d-flex pb-1">
            <v-icon :color="characters ? 'primary' : 'info'">
              mdi-check
            </v-icon>
            <div class="ml-4">At least 8 characters</div>
          </div>
          <div class="d-flex pb-1">
            <v-icon :color="uppercase ? 'primary' : 'info'"> mdi-check </v-icon>
            <div class="ml-4">At least 1 uppercase letter (A-Z)</div>
          </div>
          <div class="d-flex pb-1">
            <v-icon :color="lowercase ? 'primary' : 'info'"> mdi-check </v-icon>
            <div class="ml-4">At least 1 lowercase letter (a-z)</div>
          </div>
          <div class="d-flex">
            <v-icon :color="number ? 'primary' : 'info'"> mdi-check </v-icon>
            <div class="ml-4">At least 1 number</div>
          </div>
        </div>

        <div class="d-flex align-center my-2">
          <v-btn
            class="btn--plain capital--btn underlined--btn info--text pa-0 mx-4"
            text
            @click.stop="dialogOpen = true"
          >
            READ AND ACCEPT
          </v-btn>
          <v-switch v-model="accept" class="px-4" inset color="primary" />
        </div>
        <v-btn
          rounded
          class="primary py-2 mb-6 capital--btn"
          large
          depressed
          :disabled="!accept"
          @click="signup"
        >
          Create Account
        </v-btn>

        <v-btn
          v-if="!errorMsg.type === 'password'"
          disabled
          text
          class="btn--plain"
        />
      </div>
    </v-card>

    <v-alert
      v-if="redirect"
      color="primary"
      colored-border
      border="bottom"
      elevation="2"
      width="450"
      class="rounded-alert text-center"
    >
      <v-btn
        class="btn--plain capital--btn info--text mb-4 mt-2"
        text
        small
        @click="startForm"
      >
        CONTINUE NOW, REGISTER LATER.
      </v-btn>
    </v-alert>

    <v-dialog v-model="dialogOpen" value="''" :max-width="700">
      <accept-terms-dialog @accept="acceptTerms" @decline="declineTerms" />
    </v-dialog>
    <!-- <mq-layout :mq="['mobile', 'tablet']">
      <register-mobile />
    </mq-layout>
    <mq-layout mq="laptop+" style="height: 100%">
      <register-screen  style="height: 100%"/>
    </mq-layout> -->
  </div>
</template>

<script>
// import RegisterScreen from '@/components/RegisterScreen'
// import RegisterMobile from '@/components/RegisterMobile'
import AcceptTermsDialog from "@/components/dialogs/AcceptTermsDialog";

export default {
  name: "RegisterOnly",
  components: {
    // RegisterScreen,
    // RegisterMobile,
    AcceptTermsDialog,
  },
  data() {
    return {
      show: false,
      email: "",
      password: "",
      titleHeight: "",
      accept: false,
      dialogOpen: false,
      clientId: "",
      property: "",
    };
  },
  computed: {
    errorMsg() {
      const err = this.$store.getters.errorMsg;
      if (!err) {
        return { type: "user", msg: "" };
      }
      if (err === "The user already exists.") {
        return { type: "email", msg: err };
      }
      // if (err.includes('pass validation for format email')){
      //   return { type: 'email', msg: 'Please enter a valid email.' }
      // }
      if (err === "PasswordStrengthError: Password is too weak") {
        return {
          type: "password",
          msg: "Your password must contain each of the requirements listed below.",
        };
      }
      if (err === "") {
        // no error
        return { type: "", msg: err };
      }
      return { type: "user", msg: "" };
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
    redirect() {
      return this.$store.getters.redirect;
    },
  },
  methods: {
    acceptTerms() {
      this.accept = true;
      this.dialogOpen = false;
    },
    declineTerms() {
      this.accept = false;
      this.dialogOpen = false;
    },
    startForm() {
      this.$store.commit("set_cont_wo_login", true);
      this.$router.push(`/${this.$store.getters.redirect}`);
    },
    async signup() {
      try {
        // const signupResponse = this.$authHelpers.signup(this.email, this.password)
        // auth0Id = signupResponse.data.client_id
        const signupDetails = {
          email: this.email,
          p: this.password,
        };
        if (sessionStorage.getItem("client")) {
          signupDetails.user = JSON.parse(sessionStorage.getItem("client"));
        }

        await this.$http
          .post(`${process.env.VUE_APP_URL}/register`, signupDetails)
          .then((r) => r.data)
          .then((data) => {
            if (data.err) {
              throw data.err;
            }
            this.clientId = data;
            sessionStorage.removeItem("client");
          })
          .catch((e) => {
            throw e;
          });

        // save info with the client's clientId (data)
        // if the unregistered user created a document
        if (sessionStorage.getItem("property")) {
          await this.$http
            .post(`${process.env.VUE_APP_URL}/properties/save`, {
              property: JSON.parse(sessionStorage.getItem("property")),
              clientId: this.clientId,
            })
            .then((r) => r.data)
            .then((data) => {
              this.property = data;
            });

          sessionStorage.removeItem("property");
        }

        // if the unregistered user created a document
        if (localStorage.getItem("document")) {
          const doc = JSON.parse(localStorage.getItem("document"));
          doc.property = this.property;
          const docType = localStorage.getItem("document_type");
          const docName = localStorage.getItem("document_name");
          await this.$http
            .post(`${process.env.VUE_APP_URL}/${docType}`, {
              docInfo: doc,
              clientId: this.clientId,
            })
            .then((r) => r.data)
            .then((data) => {
              // data should be the id of the previously created item
              this.$http
                .post(`${process.env.VUE_APP_URL}/cart`, {
                  itemId: data,
                  clientId: this.clientId,
                  itemName: docName,
                  itemTableName: docType,
                })
                .then((r) => r.data)
                .then((data) => {
                  this.$store.commit("update_cart", data);
                });
            });

          localStorage.removeItem("document");
          localStorage.removeItem("document_type");
          localStorage.removeItem("document_name");
        }

        // const response = await this.$http.post(`${process.env.VUE_APP_URL}/login`, signupDetails)

        // console.log(response)
      } catch (err) {
        this.$store.commit("set_auth_error", err);
      }
    },
  },
};
</script>

<style>
.rounded-alert {
  border-radius: 20px !important;
}
.rounded-alert .v-alert__border--bottom {
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  border-width: 7px;
}
</style>
