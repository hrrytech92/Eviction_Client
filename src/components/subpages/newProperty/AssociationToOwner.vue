<template>
  <div class="mx-auto">
    <v-btn
      color="info"
      icon
      class="float-right ma-8 btn--plain"
      @click="$emit('close:form')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-form ref="form" v-model="valid">
      <div style="width: 80%" class="pt-10 pb-4 mx-auto text-left">
        <div class="custom-title py-8">Association to Owner</div>
        <div class="custom-subtitle mb-4 mt-10">Select Your Role</div>
        <p class="pb-8">
          Select the option that best describes your role in relation to the
          property. You’ll be the person signing the court pleadings.
        </p>
        <selection
          v-model="clientType"
          :btns="roleStrings"
          @input="roleSelected"
        />
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
          :disabled="!valid"
          @click="next"
        >
          continue
        </v-btn>
      </v-card-actions>
    </v-form>

    <v-dialog v-model="warnDialog" persistent value="''" max-width="600">
      <InfoDialog
        title="Proceed with Caution."
        color="accent"
        type="warning"
        text='Are you sure you want to proceed and represent the Owner without an attorney? You should know that no person shall practice law in NJ unless that person is an attorney holding a plenary license to practice in NJ. See 
      <a
        href="https://casetext.com/rule/new-jersey-rules-of-court/new-jersey-rules-of-court/njr-ct-part-i/part-i-rules-of-general-application/rule-121-practice-of-law"
        target="_blank"
        class="accent--text"
        >Rule 1:21 - Practice of Law, N.J. Ct. R. 1:21.</a
      >'
        btn-text="I UNDERSTAND"
        @submit="next"
      />
    </v-dialog>
  </div>
</template>

<script>
import Selection from "@/components/Selection.vue";
import { mapGetters } from "vuex";

export default {
  name: "PropertyAssociation",
  components: { Selection },
  data() {
    return {
      clientType: "",
      warnDialog: false,
      roleStrings: ["I am the owner", "agent or property manager"],
    };
  },
  computed: {
    ...mapGetters({
      currentProperty: "property/currentProperty",
      evictionAppLoaded: "eviction/evictionAppLoaded",
    }),
    valid: {
      get() {
        return this.clientType !== "";
      },
      set(newName) {
        return newName;
      },
    },
  },
  watch: {
    // evictionAppLoaded(val) {
    //   if (val) {
    //     console.log(this.currentProperty, 'this.currentProperty')
    //     if (this.currentProperty?.propertyId && this.currentProperty?.clientType) {
    //       if (this.currentProperty.clientType === "agent") {
    //         this.warnDialog = true;
    //       }
    //     }
    //   }
    // },
    currentProperty: {
      deep: true,
      immediate: true,
      handler(value) {
        // console.log("value :>> ", value);
        //   if (value?.propertyId && value?.clientType) {
        //     this.clientType =
        //       value.clientType === "owner"
        //         ? this.roleStrings[0]
        //         : this.roleStrings[1];
        //   }
        //   if (
        //     value?.ownershipType === "Limited Liability Company" ||
        //     value?.ownershipType === "Corporation"
        //   ) {
        //     this.roleStrings = [
        //       "I am a member of the entity",
        //       "agent or property manager",
        //     ];
        //     if (value?.clientType !== "") {
        //       this.clientType =
        //         value.clientType === "owner"
        //           ? this.roleStrings[0]
        //           : this.roleStrings[1];
        //     }
        //   } else {
        //     this.roleStrings = ["I am the owner", "agent or property manager"];
        //     if (value?.clientType !== "") {
        //       this.clientType =
        //         value.clientType === "owner"
        //           ? this.roleStrings[0]
        //           : this.roleStrings[1];
        //     }
        //   }
        // },
        this.updateButtons();
      },
    },
  },
  activated() {
    window.scrollTo(0, 0);
  },

  deactivated() {
    this.saveData();
  },
  methods: {
    saveData() {
      if (!this.valid) return;

      const stepData = {
        type: "completed",
        address: "completed",
        registration: "completed",
        owner: "completed",
        associationToOwner: "completed",
        contact: "",
      };

      const propertyData = {
        clientType:
          this.clientType === "I am the owner" ||
          this.clientType === "I am a member of the entity"
            ? "owner"
            : "agent",
        status: "associationToOwner",
      };

      this.$store.dispatch("property/saveProperty", {
        propertyData,
        steps: stepData,
      });
    },
    next() {
      this.$router.push({
        name: `${this.$route.name.includes("vc") ? "vc-" : ""}client-contact`,
      });
    },
    back() {
      // this.$emit("update:steps", {
      //   type: "completed",
      //   address: "completed",
      //   registration: "completed",
      //   owner: "completed",
      //   associationToOwner: "",
      //   contact: "",
      // });

      this.$router.push({
        name: `${this.$route.name.includes("vc") ? "vc-" : ""}property-owner`,
      });
    },
    typeClicked(item) {
      this.selected = item;
    },
    roleSelected(item) {
      if (item === "agent or property manager") this.warnDialog = true;
      else this.next();
    },
    updateButtons() {
      const { clientType, ownershipType } = this.currentProperty;
      if (
        ownershipType === "Limited Liability Company" ||
        ownershipType === "Corporation"
      ) {
        this.roleStrings = [
          "I am a member of the entity",
          "agent or property manager",
        ];
      } else {
        this.roleStrings = ["I am the owner", "agent or property manager"];
      }

      if (clientType)
        this.clientType =
          clientType === "owner" ? this.roleStrings[0] : this.roleStrings[1];
    },
  },
};
</script>

<style></style>
