<template>
  <div style="height: 100%" class="d-flex">
    <div class="dot" />
    <div class="line" />
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
            class="btn--plain capital--btn mx-4 info--text"
            @click="$router.push('/login')"
          >
            LOGIN
          </v-btn>
          <v-btn
            class="btn--plain capital--btn underlined--btn primary--text mx-4"
            text
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
          :dark="accept"
          class="primary py-6 mb-6"
          depressed
          :disabled="!accept"
          @click="signup"
        >
          create account
        </v-btn>
        <v-btn text class="btn--plain capital--btn info--text" />
      </div>
    </div>
    <div
      style="background-color: #fafbfc; width: 50%; height: 100%; left: 50%"
      class="pa-12 secondary--text"
    >
      <div class="d-flex justify-end" style="width: 90%; margin-top: -32px">
        <v-btn class="btn--plain" text> home </v-btn>
        <v-btn class="btn--plain" text> help </v-btn>
      </div>
      <div style="margin-top: 90px">
        <div id="outer-title-box" :style="`height: ${titleHeight}px;`">
          <div class="half-box" />
          <div
            id="registertitle"
            class="display-1 font-weight-medium pa-6"
            style="font-size: 2.7rem !important"
          >
            get started in seconds.
          </div>
        </div>
        <div class="pl-6 pt-2">
          We’ll revolutionize the way you manage your properties and eviction
          process. Fast. Simple. Painless. Affordable.
        </div>
        <v-container>
          <v-row v-for="item in items" :key="item.title">
            <v-col cols="2">
              <img
                :src="require(`@/assets/${item.picture}`)"
                class="register-image pt-4"
              />
            </v-col>
            <v-col>
              <div class="font-weight-medium">
                {{ item.title }}
              </div>
              <div style="font-size: 0.9rem">
                {{ item.info }}
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>

    <v-dialog v-model="dialogOpen" value="''" :max-width="700">
      <accept-terms-dialog @accept="acceptTerms" @decline="declineTerms" />
    </v-dialog>
  </div>
</template>

<script>
// import loginImage from '@/assets/login-screen-isometric-3@2x.png'
import AcceptTermsDialog from "@/components/dialogs/AcceptTermsDialog";
export default {
  name: "RegisterScreen",
  components: {
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
      items: [
        {
          title: "Draft Documents",
          info: "Create, preview, and approve eviction forms and pleadings in minutes with just a few clicks. Need them served and/or filed? We have you covered!",
          picture: "Signed-Document@2x.png",
        },
        {
          title: "Personalized Dashboard",
          info: "All-in-one place to view notices served, eviction proceedings, task notifications, court reminders, attorney communication, and much more to keep you organized.",
          picture: "Dashboard@2x.png",
        },
        {
          title: "Robust Reports",
          info: "Reports that make sense. Keep track of expenses, delinquencies, amounts owed and collected, legal fees, and more.",
          picture: "Reporting@2x.png",
        },
      ],
    };
  },
  computed: {
    errorMsg() {
      return this.$store.getters.errorMsg;
    },
  },
  mounted() {
    this.titleHeight = document.getElementById("registertitle").offsetHeight;
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

        this.$authHelpers.login(this.email, this.password);
      } catch (err) {
        this.$store.commit("set_auth_error", err);
      }
    },
  },
};
</script>

<style>
.half-box {
  border-top: 3px solid #4dccc4;
  border-left: 3px solid #4dccc4;
  width: 130px;
  height: 130px;
  opacity: 1;
}

.register-image {
  width: 80px;
  height: auto;
}

.capital--btn > span.v-btn__content {
  text-transform: capitalize;
}

.underlined--btn {
  border-bottom: solid 1.5px #4dccc4;
  border-radius: 0%;
}

#outer-title-box {
  position: relative;
}

/*every direct child positioned absolute*/
#outer-title-box > div {
  position: absolute;
}
</style>
