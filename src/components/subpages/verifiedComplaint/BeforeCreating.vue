<template>
  <div class="before-creating mx-auto secondary--text">
    <v-btn
      color="info"
      icon
      class="float-right ma-8 btn--plain"
      @click="$emit('close:form')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <div style="width: 80%" class="pt-10 pb-4 mx-auto text-left">
      <div class="custom-title pt-8 pb-4">Before you begin.</div>
      <div class="pb-4">
        Although you may use our software to go through the legal process to
        evict a tenant due to non-payment of rent, there are a few things we are
        not quite yet ready for, but will support in the future. You can view a
        detailed list of our
        <a target="_blank" href="https://fileevictions.com/upcoming-features/"
          >Upcoming Features</a
        >. Confirm the following before proceeding.
      </div>

      <v-row v-for="(description, index) in descriptionList" :key="index">
        <v-col :cols="1" class="d-flex justify-center align-center pa-0">
          <v-radio-group v-model="description.checked" mandatory readonly>
            <v-radio
              :value="true"
              on-icon="mdi-checkbox-marked-circle"
              readonly
              :ripple="false"
            />
          </v-radio-group>
        </v-col>
        <v-col class="d-flex align-center pa-0">
          {{ description.content }}
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="upcomingFeatureDialogOpen" :max-width="500">
      <UpcomingFeatureDialog
        @close:dialog="upcomingFeatureDialogOpen = false"
      />
    </v-dialog>

    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="cancel"
      >
        cancel
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        @click="next"
      >
        continue
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import UpcomingFeatureDialog from "@/components/dialogs/UpcomingFeatureDialog";
import { mapGetters } from "vuex";

export default {
  name: "BeforeCreating",
  components: { UpcomingFeatureDialog },
  data() {
    return {
      descriptionList: [
        {
          content: "The lease or rental agreement is in writing.",
          checked: true,
        },
        {
          content: "Rent payments are due monthly.",
          checked: true,
        },
        {
          content: "This eviction is due to non-payment of rent.",
          checked: true,
        },
        {
          content:
            "All persons that must be served reside at the same location.",
          checked: true,
        },
        {
          content: "You do not wish to obtain an attorney via our website.",
          checked: true,
        },
        {
          content: "The Rental property is not subject to the CARES Act.",
          checked: true,
        },
      ],
      upcomingFeatureDialogOpen: false,
    };
  },
  // computed: {
  //   ...mapGetters({
  //     isAuthenticated: "isAuthenticated",
  //   }),
  // },
  // activated() {
  //   window.scrollTo(0, 0);
  //   this.$store.commit("property/set_steps", {
  //     type: "",
  //     address: "",
  //     registration: "",
  //     owner: "",
  //     associationToOwner: "",
  //     contact: "",
  //   });
  // },
  // created() {
  //   const authenticated = this.$store.state.auth;
  //   const isAuthParams = this.$route.query.authchecked;
  //   // console.log("isAuthParams", isAuthParams);
  //   if (isAuthParams !== null && isAuthParams !== undefined) {
  //     if (!authenticated) {
  //       this.$auth.loginWithRedirect();
  //     } else {
  //       this.$router.push("/verified-complaint/new");
  //     }
  //   }
  // },
  mounted() {
    window.scrollTo(0, 0);
    if (!this.$auth.isAuthenticated) return;
    //   // return localStorage.setItem("hasGuestFlow", "1");
    //   this.$store.commit("property/set_current_property", {
    //     propertyId: "",
    //     propertyType: "",
    //     ownershipType: "",
    //     clientType: "",
    //     unitNo: "",
    //     streetAddress: "",
    //     city: "",
    //     subdivision: "",
    //     state: "New Jersey",
    //     zipcode: "",
    //     county: "",
    //     contactInfoId: "",
    //     deedNames: [""],
    //     registrationFiled: "",
    //     registrationFiles: [],
    //     status: "address",
    //   });
    // this.$store.commit("property/set_steps", {
    //   type: "",
    //   address: "",
    //   registration: "",
    //   owner: "",
    //   associationToOwner: "",
    //   contact: "",
    // });
    this.$store.commit("eviction/init_steps");
    this.$store.commit("eviction/init_case");
  },
  methods: {
    next() {
      if (this.$auth.isAuthenticated) {
        this.$router.push({ name: "vc-intro" });
      } else {
        // sessionStorage.removeItem("property");
        // localStorage.removeItem("contactInfo");
        // sessionStorage.removeItem("case");

        this.$router.push({ name: "vc-property-type" });
      }
    },
    cancel() {
      if (this.$auth.isAuthenticated) this.$router.push("/");
      else this.$auth.loginWithRedirect();
    },
    showUpcomingFeatureDialog() {
      this.upcomingFeatureDialogOpen = true;
    },
  },
};
</script>

<style lang="scss">
.before-creating {
  .v-input--selection-controls__input input[role="radio"] {
    &:focus,
    &:hover {
      cursor: default;
    }
  }

  a {
    color: #8f9fe4 !important;
  }
}
</style>
