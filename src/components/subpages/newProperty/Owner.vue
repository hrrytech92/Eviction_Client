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

    <v-form
      ref="form"
      v-model="valid"
      style="width: 80%"
      class="pt-10 pb-4 mx-auto text-left"
    >
      <div class="custom-title pt-8 pb-1">Deed Information</div>
      <div class="custom-subtitle mb-2">Owner Name</div>
      <p>
        Provide the name(s) of the owner(s) of the property as it appears on the
        property deed. If the Lease provides a name for the Landlord that is
        different than the owner on the deed, add that name as well in the
        following format: Deed Owner Name, DBA Lease Landlord Name.
      </p>

      <div class="font-weight-medium secondary--text pb-2">Name</div>
      <div v-for="(name, index) in deedNames" :key="index" class="d-flex">
        <v-text-field
          v-model="deedNames[index]"
          rounded
          hide-details
          solo
          flat
          dense
          background-color="#F0F5F6"
          :rules="[(v) => !!v || 'Item is required']"
        />
        <div class="d-flex mb-4">
          <v-btn
            color="info"
            icon
            tile
            class="btn--plain"
            :class="{
              'hidden-item': index === 0,
            }"
            @click="deleteItem(index, deedNames)"
          >
            <v-icon style="font-size: 28px"> mdi-close-circle-outline </v-icon>
          </v-btn>

          <v-btn
            color="accent"
            :class="{
              'hidden-item': index !== deedNames.length - 1,
            }"
            icon
            class="btn--plain"
            tile
            @click="deedNames.push('')"
          >
            <v-icon style="font-size: 28px"> mdi-plus-circle-outline </v-icon>
          </v-btn>
        </div>
      </div>

      <div class="custom-subtitle mb-4" style="margin-top: 20px">
        Entity Type
      </div>
      <p>
        Select the type of business entity that best describes the structure of
        the organization of the owner you have named in the previous field.
        Select “Individual” if the owner is not an entity.
      </p>
      <Selection
        v-model="ownershipType"
        :btns="types"
        @input="typeClicked($event)"
      />
    </v-form>

    <v-dialog v-model="warnDialog" persistent value="''" max-width="600">
      <InfoDialog
        title="Proceed with Caution."
        color="accent"
        type="warning"
        text='Are you sure you want to proceed without an attorney? You should know that any entity, other than a sole proprietorship and a partner of a general partnership, 
        shall neither appear nor file any paper in any NJ court except through an authorized attorney. See
      <a
        href="https://casetext.com/rule/new-jersey-rules-of-court/new-jersey-rules-of-court/njr-ct-part-i/part-i-rules-of-general-application/rule-121-practice-of-law"
        target="_blank"
        class="accent--text"
        >Rule 1:21 - Practice of Law, N.J. Ct. R. 1:21</a
      >
      &
      <a
        href="https://www.njcourts.gov/attorneys/assets/rules/r6-10.pdf"
        target="_blank"
        class="accent--text"
        >Rule 6:10 - Representation in Summary Actions Between Landlord and Tenant, N.J. Ct. R. 6:10.</a>
      '
        btn-text="I UNDERSTAND"
        @submit="dismissWarning"
      />
    </v-dialog>
    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12"
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
  </div>
</template>

<script>
import Selection from "@/components/Selection.vue";
import { mapGetters } from "vuex";
import { bussinessEntityType } from "@/resources/index.js";

export default {
  name: "PropertyOwner",
  components: { Selection },
  data() {
    return {
      valid: false,
      warnDialog: false,
      deedNames: [""],
      ownershipType: "",
      types: bussinessEntityType,
      useNext: false,
    };
  },
  computed: {
    ...mapGetters({
      currentProperty: "property/currentProperty",
    }),
    isInVC() {
      return this.$route.name.includes("vc");
    },
    // currentProperty() {
    //   return this.isInVC
    //     ? this.$store.getters["eviction/currentCase"].property
    //     : this.$store.getters["property/currentProperty"];
    // },
  },
  // watch: {
  // ownershipType(newVal) {
  //   if (newVal === "Corporation") {
  //     this.warnDialog = true;
  //   }
  // },
  // currentProperty: {
  //   deep: true,
  //   immediate: true,
  //   handler(value) {
  //     if (value?.propertyId) {
  //       if (Array.isArray(value?.deedNames)) {
  //         this.deedNames = value.deedNames;
  //       } else if (typeof value.deedNames === "string") {
  //         this.deedNames = [value.deedNames];
  //       }
  //       this.ownershipType = value?.ownershipType;
  //     }
  //   },
  // },
  // },
  activated() {
    window.scrollTo(0, 0);
    const { deedNames, ownershipType } = this.currentProperty;
    // if (propertyId) {
    if (Array.isArray(deedNames)) {
      this.deedNames = deedNames;
    } else if (typeof deedNames === "string") {
      this.deedNames = [deedNames];
    }
    this.ownershipType = ownershipType;
    // }
  },
  async deactivated() {
    await this.saveData();
  },
  methods: {
    async saveData() {
      // this.valid = this.$refs.form.validate();
      if (!this.valid) return;

      const propertyData = {
        deedNames: this.combineDeedNames(),
        ownershipType: this.ownershipType,
        status: "owner",
      };

      const stepData = {
        type: "completed",
        address: "completed",
        registration: "completed",
        owner: "completed",
        associationToOwner: "completed",
        contact: "",
      };
      this.$store.dispatch("property/saveProperty", {
        propertyData,
        steps: stepData,
      });

      // if (this.isInVC) {
      //   const a = this.caseSteps;
      //   a.property.showChildren = true;
      //   a.property.children.associationToOwner.status = "completed";
      //   this.$store.commit("eviction/update_steps", a);
      // }
    },
    next() {
      this.$router.push({
        name: `${this.isInVC ? "vc-" : ""}property-association-to-owner`,
      });
    },
    combineDeedNames() {
      if (this.deedNames.length === 1) return this.deedNames[0];
      const last = this.deedNames.pop();
      return this.deedNames.join(", ") + " and " + last;
    },
    deleteItem(index, arr) {
      arr.splice(index, 1);
    },
    back() {
      this.$router.push({
        name: `${this.isInVC ? "vc-" : ""}property-address`,
        // name:
        //   this.currentProperty.propertyType === "Commercial"
        //     ? `${this.isInVC ? "vc-" : ""}property-address`
        //     : this.currentProperty.registrationFiled
        //     ? `${this.isInVC ? "vc-" : ""}upload-registration`
        //     : `${this.isInVC ? "vc-" : ""}property-registration`,
      });
    },
    typeClicked(event) {
      // console.log(event);
      // this.ownershipType = event;
      if (event === "Corporation") return (this.warnDialog = true);

      this.valid && this.next();
    },
    dismissWarning() {
      this.warnDialog = false;
      this.valid && this.next();
    },
  },
};
</script>

<style></style>
