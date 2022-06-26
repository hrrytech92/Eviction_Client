<template>
  <v-app style="background-color: #f8fafb">
    <LoadingOverlay :active.sync="loading" color="#4DCCC4" />
    <div v-if="isDesktopDevice" style="position: relative">
      <!-- <Navigation v-if="$route.name !== 'unauthorized' && $route.name !== 'login' && $route.name !== 'register' && $route.name !== 'forgot-password' && $route.name !== 'change-password'"/> -->
      <header>
        <Toolbar
          v-if="!isAuthRoute"
          class="display-control"
          :is-form-progress="isFormProgress"
        />
        <!-- <toolbar-logged-out
          v-else-if="
            $route.name !== 'welcome' &&
            $route.name !== 'reset-password-success'
          "
        /> -->
      </header>
      <!-- <Main /> -->
      <v-main style="min-height: calc(100vh - 120px)">
        <h2 v-if="asOtherUser" style="color: red; text-align: center">
          Impersonation mode
        </h2>
        <v-alert
          class="d-block mx-8 mt-4 mb-0 error-alert"
          v-if="globalError"
          type="error"
          color="red lighten-2"
          border="left"
          dismissible
          @input="onCloseError"
          >{{ globalError }}</v-alert
        >

        <router-view />
      </v-main>

      <footer v-if="!isAuthRoute" class="footer-container">
        <div class="secondary--text footer-grid">
          <div>
            © {{ currentYear }} FileEvictions. All Rights Reserved, The
            information provided on FileEvictions (“Site”) is not legal advice
            and the Service provided by this Site are not legal services.
            FileEvictions is not a law firm or a legal representative. Access
            and use of this Site is subject to our
            <a
              class="accent--text small-font no-text-dec"
              href="/terms"
              @click.prevent="handleNavigationLink('terms')"
            >
              Terms of Service
            </a>
            and
            <a
              class="accent--text small-font no-text-dec"
              href="https://fileevictions.com/privacy-policy/"
              target="_blank"
              >Privacy Policy</a
            >.
          </div>
        </div>
      </footer>
    </div>
    <div v-else>
      <div class="mobile-responsive-warning">
        <img src="/images/logo.svg" height="50" />
        <p class="secondary--text">
          For the best viewing experience, please access the software from a
          desktop device. We are working on creating a flawless mobile
          experience for you.
          <!-- ({{ deviceWidth }}) -->
        </p>
      </div>
    </div>
    <v-dialog
      v-model="confirmLeaveDialog"
      persistent
      value="''"
      max-width="600"
    >
      <CancelDialog
        @close="confirmLeaveDialog = false"
        @submit="goToSpecificPage"
      />
    </v-dialog>
    <!-- this is the disclaimer dialog -->
    <v-dialog v-model="showDisclaimer" persistent max-width="600" hide-overlay>
      <InfoDialog
        title="Disclaimer"
        color="accent"
        type="warning"
        text="File Evictions is a self-help platform for exporting court forms for the eviction process. The legal information presented to you may or may not apply to your specific case, and as such, should not be applied or relied upon without consulting with an Attorney. By proceeding, you accept full responsibility."
        btn-text="I UNDERSTAND"
        @submit="closeDisclaimerPopup"
      />
    </v-dialog>
  </v-app>
</template>

<script>
// import Vue from 'vue';
// import Navigation from "./components/Navigation";
import CancelDialog from "@/components/dialogs/CancelDialog.vue";
import Toolbar from "./components/Toolbar";
// import ToolbarLoggedOut from "./components/ToolbarLoggedOut.vue";
import { mapGetters } from "vuex";
// import Main from './components/pages/Main'

export default {
  name: "App",

  components: {
    // Navigation,
    Toolbar,
    // ToolbarLoggedOut,
    CancelDialog,
    // Main,
  },
  data() {
    return {
      // authenticated: false,
      currentYear: "",
      confirmLeaveDialog: false,
      specificPage: "",
      deviceWidth: null,
      showGlobalError: false,
      showDisclaimer: false,
      asOtherUser: false,
    };
  },
  computed: {
    ...mapGetters(["loading"]),
    globalError() {
      return this.$store.getters["global/globalError"]?.message;
    },
    isFormProgress() {
      const currentUrl = this.$route.path;
      return !!(
        currentUrl.includes("verified-complaint") &&
        !currentUrl.includes("order-details")
      );
    },
    isDesktopDevice() {
      // return this.deviceWidth > 1215;
      return this.deviceWidth > 900;
    },
    isAuthRoute() {
      return this.$route.meta?.isAuthRoute;
    },
  },
  watch: {
    globalError(val) {
      console.log("val :>> ", val);
      this.showGlobalError = val;
    },
  },
  async created() {
    // window.addEventListener("beforeunload", this.beforeWindowUnload);
    const date = new Date();
    this.currentYear = date.getFullYear();
    window.addEventListener("resize", this.handleResize);
    this.handleResize();

    // if (!this.isAuthRoute && this.$route.path !== "/terms") {
    if (this.$route.path === "/verified-complaint/new") {
      this.showDisclaimer =
        !this.$auth.isAuthenticated ||
        !this.$store.getters.client.dismissedDisclaimer;
    }

    this.asOtherUser = localStorage.getItem("asUserAuth0Id");
  },
  // beforeDestroy() {
  //   window.removeEventListener("beforeunload", this.beforeWindowUnload);
  // },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    onCloseError() {
      this.$store.commit("global/set_global_error", null);
    },

    // beforeWindowUnload() {
    //   // sessionStorage.removeItem("property");
    //   sessionStorage.removeItem("client");
    //   localStorage.removeItem("document");
    // },
    handleNavigationLink(link) {
      const { path } = this.$route;
      if (
        path.includes("verified-complaint") &&
        !path.includes("order-details")
      ) {
        this.confirmLeaveDialog = true;
        this.specificPage = link;
        return;
      }
      if (`/${link}` === path) return;
      this.$router.push(`/${link}`);
    },
    goToSpecificPage() {
      if (this.specificPage === "terms") this.$router.push("/terms");
      this.confirmLeaveDialog = false;
    },
    handleResize() {
      this.deviceWidth = window.innerWidth;
    },
    closeDisclaimerPopup() {
      this.showDisclaimer = false;
      this.$store.dispatch("updateUser", { dismissedDisclaimer: 1 });
    },
  },
};
</script>

<style>
html {
  font-size: 20px !important;
  overflow: auto;
}
.navlinks.v-list .v-list-item--active .v-list-item-icon {
  color: #4dccc4;
}
.navlinks.v-list .v-list-item--active {
  color: #44ddcc;
  box-shadow: 3px 0 0 #4dccc4 inset;
}
.nav-link.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: #afc2ce !important;
}

span.v-btn__content {
  text-transform: capitalize;
  letter-spacing: 0.7px;
}
.theme--light.v-btn {
  color: #003a60;
}
.v-date-picker-header__value .primary--text button {
  font-weight: 500;
  font-size: 20px;
}
.theme--light.v-date-picker-header
  .v-date-picker-header__value:not(.v-date-picker-header__value--disabled)
  .primary--text
  button:not(:hover):not(:focus) {
  color: #003a60;
}
button.v-btn.v-btn--flat.v-btn--icon.v-btn--round.theme--light.v-size--default {
  color: #4dccc4;
}
/* .theme--light.v-input--switch .v-input--switch__thumb {
  color: #9AABB5 !important;
} */

.theme--light.v-input--switch .v-input--switch__track {
  color: #dae3e9 !important;
}
.v-dialog > .v-card > .v-card__title {
  word-break: normal;
}
.v-application {
  font-family: Hind, sans-serif;
}
.full-width {
  width: 100%;
}
.hidden-item {
  visibility: hidden;
}

.non-click {
  pointer-events: none;
}

.elevated-bar {
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 1px 20px 45px #00000007;
  border-radius: 10px;
  opacity: 1;
  min-height: 100px;
  width: 100%;
  font-weight: 500;
  font-size: 26px;
  cursor: pointer;
}

.elevated-bar-btn {
  background: #f0f5f6 0% 0% no-repeat padding-box;
  border-radius: 0px 10px 10px 0px;
  opacity: 1;
  width: 113px;
  height: 100%;
}

.elevated-bar:hover {
  filter: brightness(98%);
}

.selection,
.selection-box {
  background: #fafbfc 0% 0% no-repeat padding-box;
  border: 1px solid #8ba4b4;
  border-radius: 20px;
  opacity: 1;
  width: 250px;
  min-height: 110px;
  color: #8ba4b4;
  cursor: pointer;
}

.selection:hover,
.selection-selected {
  background: #fafbfc 0% 0% no-repeat padding-box;
  border: 2px solid #4dccc4;
  border-radius: 20px;
  opacity: 1;
  width: 250px;
  height: 110px;
  color: #4dccc4;
  cursor: pointer;
}

.selection-border {
  border: 1px solid #8ba4b4;
  border-radius: 20px;
  color: #8ba4b4;
}

.selection-border-selected {
  border: 2px solid #4dccc4;
  border-radius: 20px;
  color: #003a60;
}

.custom-overline {
  text-transform: uppercase;
  letter-spacing: 1.4px;
}

.spaced-text {
  letter-spacing: 0.29px;
}

.no-text-dec {
  text-decoration: none;
}

.v-tab {
  text-transform: none !important;
}

[class*=" icofont-"],
[class^="icofont-"] {
  line-height: unset;
}

.btn--plain:hover:before {
  background-color: transparent;
}

.btn--plain:before {
  display: none;
}
.v-ripple__animation {
  display: none;
}

.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.centered-input input {
  text-align: center;
}

.v-application a {
  text-decoration: none;
}

.btn-style-text {
  letter-spacing: 0.7px;
  font-weight: 500;
}

.custom-heading {
  font-size: 40px;
  letter-spacing: 0.15px;
  font-weight: 600;
}

.custom-title {
  font-weight: 500 !important;
  color: #003a60 !important;
  font-size: 48px;
}

.custom-subtitle {
  font-weight: 500 !important;
  color: #003a60 !important;
  font-size: 28px;
}

.custom-card {
  box-shadow: 15px 15px 40px #00000029;
  border-radius: 20px;
}

/* VALIDATION MESSAGES */
.v-messages__message {
  line-height: 18px !important;
}

.v-messages {
  font-size: 16px !important;
}

.error-message {
  font-size: 16px;
  line-height: 18px;
  color: #ff5252;
}
.accent--error-message {
  font-size: 16px;
  line-height: 18px;
  color: #ff854e;
}

.v-tooltip__content {
  background: transparent !important;
  opacity: 1 !important;
}
/* .v-input--is-readonly.v-text-field.v-text-field--solo .v-input__control input {
  color: #53809D;
} */

.primary-checkbox .theme--light.v-icon {
  color: #4dccc4;
}

/* Remove buttons from number input */
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

/* this will hide the scrollbar in webkit based browsers - safari, chrome, etc */
.scroll-hide::-webkit-scrollbar {
  width: 0 !important;
  display: none;
}
.scroll-hide {
  /* this will hide the scrollbar in mozilla based browsers */
  overflow: -moz-scrollbars-none;
  /* this will hide the scrollbar in internet explorers */
  -ms-overflow-style: none;
}

.mobile-responsive-warning {
  max-width: 570px;
  text-align: center;
  margin: 200px auto 0;
}

.mobile-responsive-warning img {
  margin-bottom: 36px;
}

/* controls nav display toggle between desktop and mobile */
@media only screen and (max-width: 768px) {
  .display-control {
    display: none;
  }
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  background-color: #f8fafb;
  font-size: 0.7rem;
  margin: 40px 120px 40px 120px;
}
.footer-container {
  position: relative;
  /* position: absolute; */
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  bottom: 0;
}
.error-alert {
  position: fixed;
  bottom: 20px;
  z-index: 999;
  left: 50%;
  transform: translateX(-50%);
  /* width: 80%; */
}
p,
input,
.v-select__selections {
  color: #003a60 !important;
}
</style>
