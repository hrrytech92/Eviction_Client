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
            class="btn--plain capital--btn mr-2 info--text"
            @click="$router.push('/login')"
          >
            LOGIN
          </v-btn>
          <v-btn
            class="btn--plain capital--btn primary--text underlined--btn ml-2"
            text
          >
            REGISTER
          </v-btn>
        </div>

        <div
          class="display-1 font-weight-medium py-4"
          style="font-size: 1.8rem !important; line-height: normal"
        >
          get started in seconds.
        </div>
        <div class="mb-6">
          We’ll revolutionize the way you manage your properties and eviction
          process. Fast. Simple. Painless. Affordable.
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
          <v-btn
            class="btn--plain capital--btn underlined--btn info--text pa-0 mx-4"
            text
            @click.stop="dialogOpen = true"
          >
            READ AND ACCEPT
          </v-btn>
          <v-switch v-model="accept" class="px-4" inset color="primary" />
        </div>
        <v-btn rounded dark class="primary py-2 mb-6" depressed @click="signup">
          create account
        </v-btn>
      </div>
    </v-card>
    <div v-for="item in items" :key="item.title" class="ma-6">
      <div>
        <img
          :src="require(`@/assets/${item.picture}`)"
          class="register-image pt-4"
        />
      </div>
      <div>
        <div class="font-weight-medium">
          {{ item.title }}
        </div>
        <div style="font-size: 0.9rem">
          {{ item.info }}
        </div>
      </div>
    </div>
    <v-dialog v-model="dialogOpen" value="''" :max-width="700">
      <accept-terms-dialog @accept="acceptTerms" @decline="declineTerms" />
    </v-dialog>
  </div>
</template>

<script>
import AcceptTermsDialog from "@/components/dialogs/AcceptTermsDialog";
import MobileMenu from "@/components/MobileMenu";
export default {
  name: "RegisterMobile",
  components: {
    AcceptTermsDialog,
    MobileMenu,
  },
  data() {
    return {
      show: false,
      email: "",
      password: "",
      remember: true,
      menuItems: [{ title: "Home" }, { title: "Help" }],
      dialogOpen: false,
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

<style></style>
