<template>
  <div class="mx-auto secondary--text">
    <v-btn
      color="info"
      icon
      class="float-right ma-8 btn--plain"
      @click="$emit('close:form')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <div style="width: 80%" class="pt-10 pb-4 mx-auto text-left">
      <div class="custom-title pt-8 pb-4">Upload Registration</div>
      <document-upload :is-registration="true" />
    </div>

    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="back"
      >
        go back
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

    <v-dialog v-model="dialog" value="''" max-width="700px">
      <new-document-dialog @add:files="addFiles" />
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// TODO: Sync data to Vuex and file operation.
import DocumentUpload from "@/components/DocumentUpload.vue";
export default {
  name: "UploadRegistration",
  components: {
    DocumentUpload,
  },
  data() {
    return {
      documents: [],
      dialog: false,
      addFiles: [],
      useNext: false,
    };
  },
  computed: {
    ...mapGetters({
      currentProperty: "property/currentProperty",
      caseSteps: "eviction/caseSteps",
    }),
  },
  activated() {
    window.scrollTo(0, 0);
    this.useNext = false;

    this.loadPropertyRegistrations();
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    loadPropertyRegistrations() {
      const { propertyId } = this.currentProperty;

      if (!this.$store.getters.isAuthenticated) {
        this.$store.dispatch("property/getRegistrationDocs", { propertyId });
        return;
      }

      if (!propertyId) return;
      this.$store.dispatch("property/getRegistrationDocs", { propertyId });
    },
    saveData() {
      if (this.useNext) return;

      if (this.$route.name.includes("vc")) {
        this.$emit("update:property");

        const propertyData = {};

        this.$store.dispatch("property/saveProperty", {
          propertyData,
        });

        const a = this.caseSteps;
        a.property.showChildren = true;
        a.property.children.owner.status = "completed";
        this.$store.commit("eviction/update_steps", a);
      }
    },
    next() {
      this.useNext = true;

      const stepData = {
        type: "completed",
        address: "completed",
        registration: "completed",
        owner: "completed",
        associationToOwner: "",
        contact: "",
      };
      if (this.$route.name.includes("vc")) {
        // this.$emit("update:property", {
        //   steps: stepData,
        //   showChildren: true,
        // });
        const propertyData = {};

        const stepData = {
          type: "completed",
          address: "completed",
          registration: "completed",
          owner: "completed",
          associationToOwner: "",
          contact: "",
        };

        this.$store.dispatch("property/saveProperty", {
          propertyData,
          steps: stepData,
        });

        const a = this.caseSteps;
        a.property.showChildren = true;
        a.property.children.owner.status = "completed";
        this.$store.commit("eviction/update_steps", a);
      } else {
        this.$emit("update:steps", stepData);
      }

      this.$router.push({
        name: `${this.$route.name.includes("vc") ? "vc-" : ""}property-owner`,
      });
    },
    back() {
      this.$router.push({
        name: `${
          this.$route.name.includes("vc") ? "vc-" : ""
        }property-registration`,
      });
    },
  },
};
</script>

<style></style>
