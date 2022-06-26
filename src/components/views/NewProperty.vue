<template>
  <div>
    <div>
      <!-- <v-container> -->
      <v-row>
        <!-- <v-col cols="2" /> -->
        <v-col>
          <v-card
            class="my-12 text-center"
            width="850px"
            style="border-radius: 10px"
          >
            <NewPropertyForm @update:steps="updateSteps" @close:form="cancel" />
          </v-card>
        </v-col>
        <v-col class="py-6 mr-6 my-10">
          <div v-if="isNewProperty">
            <p class="overline info--text font-weight-bold mb-0">SET UP</p>
            <p class="spaced-text secondary--text mb-6">Property</p>
          </div>
          <div v-else>
            <p class="overline info--text font-weight-bold mb-0">
              NON-PAYMENT OF RENT
            </p>
            <p class="spaced-text secondary--text mb-6">Complaint & Summons</p>
          </div>
          <SideList :items="steps" />
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="cancelDialog" persistent value="''" max-width="600">
      <CancelDialog @close="cancelDialog = false" @submit="cancelForm" />
    </v-dialog>
  </div>
</template>

<script>
import SideList from "@/components/SideList.vue";
import NewPropertyForm from "@/components/views/NewPropertyForm.vue";
import CancelDialog from "@/components/dialogs/CancelDialog.vue";
import { mapGetters } from "vuex";

export default {
  name: "NewProperty",
  components: {
    SideList,
    NewPropertyForm,
    CancelDialog,
  },
  data() {
    return {
      currentstep: 1,
      requiredRules: [(v) => !!v || "Name is required"],
      steps: {
        type: {
          label: "Property Type",
          status: "",
          routeName: "property-type",
        },
        address: {
          label: "Property Address",
          status: "",
          routeName: "property-address",
        },
        registration: {
          label: "Registration",
          status: "",
          routeName: "property-registration",
        },
        owner: {
          label: "Owner Information",
          status: "",
          routeName: "property-owner",
        },
        associationToOwner: {
          label: "Association to Owner",
          status: "",
          routeName: "property-association-to-owner",
        },
        contact: {
          label: "Contact Information",
          status: "",
          routeName: "client-contact",
        },
      },
      notRegisteredDialog: false,
      cancelDialog: false,
    };
  },
  computed: {
    ...mapGetters({
      currentProperty: "property/currentProperty",
      properties: "property/properties",
    }),
    isNewProperty() {
      const {
        params: { id: propertyId },
      } = this.$route;

      return propertyId === "new";
    },
    client() {
      return this.$store.getters.client;
    },
  },
  mounted() {
    console.log("NewProperty > mounted -> calling property/loadProperties.");
    this.$store.dispatch("property/loadProperties");

    const {
      params: { id: propertyId },
      query: { status },
    } = this.$route;

    if (propertyId !== "new") {
      let property = this.properties.find((p) => p.propertyId === propertyId);
      if (!this.$store.getters.isAuthenticated) {
        property = JSON.parse(sessionStorage.getItem("property"));
      }

      if (property)
        this.$store.commit("property/set_current_property", property);

      for (const step in this.steps) {
        this.steps[step].status = "completed";
        if (step === status) break;
      }

      if (property.propertyType === "Commercial")
        this.steps.registration.status = "hidden";
    } else {
      // initialize current property and should start the property form
      this.$store.commit("property/init_property");

      this.$router.push({ name: "property-type" });
    }
  },
  methods: {
    updateSteps(steps) {
      // this.save();
      for (const key in steps) {
        this.steps[key].status = steps[key];
      }

      if (this.currentProperty.propertyType === "Commercial") {
        this.steps.registration.status = "hidden";
      }
    },
    cancel() {
      this.cancelDialog = true;
    },
    cancelForm() {
      this.cancelDialog = false;
      this.$router.push("/properties");
    },
    redirect() {
      this.$router.push("/properties");
    },
  },
};
</script>

<style>
.faded {
  opacity: 0.5;
}
.step-wrapper {
  padding: 20px 0;
  display: none;
}
.step-wrapper.active {
  display: block;
}

#custom-dropzone {
  -webkit-transition: 0.2s linear;
  transition: 0.2s linear;
  background: #f6f9fa 0% 0% no-repeat padding-box;
  border: 1px solid #f6f9fa;
  border-radius: 20px;
  padding: 20px 20px;
  min-height: 120px;
}

.custom-dropzone {
  -webkit-transition: 0.2s linear;
  transition: 0.2s linear;
  background: #f6f9fa 0% 0% no-repeat padding-box;
  border: 1px solid #f6f9fa;
  border-radius: 20px;
  padding: 20px 20px;
  min-height: 120px;
}
</style>
