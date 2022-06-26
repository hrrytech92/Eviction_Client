<template>
  <div class="secondary--text">
    <v-btn
      color="info"
      icon
      class="float-right ma-8 btn--plain"
      @click="$emit('close:form')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div style="width: 80%" class="pt-10 pb-4 mx-auto text-left">
      <div class="custom-title pt-8 pb-4">Property Type</div>
      <div class="pb-12">
        Select the option that best matches the type of property.
      </div>
      <div class="d-flex py-6">
        <div
          class="d-flex align-center justify-center"
          :class="[
            propertyType === 'Commercial' ? 'selection-selected' : 'selection',
          ]"
          @click="typeClicked('Commercial')"
        >
          <span class="font-weight-medium" style="letter-spacing: 1.68px"
            >COMMERCIAL</span
          >
        </div>
        <div
          class="ml-8 d-flex align-center justify-center"
          :class="[
            propertyType === 'Residential' ? 'selection-selected' : 'selection',
          ]"
          @click="typeClicked('Residential')"
        >
          <span class="font-weight-medium" style="letter-spacing: 1.68px"
            >RESIDENTIAL</span
          >
        </div>
      </div>
    </div>

    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        v-if="isInVC"
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
import { mapGetters } from "vuex";

export default {
  name: "PropertyType",
  components: {},
  data() {
    return {
      propertyType: "",
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
    valid() {
      return this.propertyType;
    },
  },
  activated() {
    window.scrollTo(0, 0);
    // console.log(
    //   "this.currentProperty.propertyId:",
    //   this.currentProperty.propertyId
    // );
    this.propertyType = this.currentProperty.propertyType;
  },
  deactivated() {
    this.saveData();
  },
  mounted() {
    // console.log("mounted");
    // const {
    //   params: { id: propertyId },
    // } = this.$route;
    // if (propertyId === "new") {
    // this.$emit("update:steps", {
    //   type: "completed",
    //   address: "",
    //   registration: "",
    //   owner: "",
    //   associationToOwner: "",
    //   contact: "",
    // });
    // }
    if (!this.$auth.isAuthenticated) {
      const a = this.$store.getters["eviction/caseSteps"];
      a.property.showChildren = true;
      this.$store.commit("eviction/update_steps", a);
    }
  },
  methods: {
    saveData() {
      const propertyData = {
        propertyType: this.propertyType,
        status: "type",
      };
      // console.log("propertyData:", propertyData);
      // console.log("this.valid:", this.valid);
      if (!this.valid) return;
      this.$store.dispatch("property/saveProperty", {
        propertyData,
        // steps: {
        //   type: "completed",
        //   address: "",
        //   registration: "",
        //   owner: "",
        //   associationToOwner: "",
        //   contact: "",
        // },
      });

      // if (this.isInVC) {
      //   const a = this.caseSteps;
      //   a.property.showChildren = true;
      //   a.property.children.type.status = "completed";
      //   a.property.children.address.status = "completed";
      //   this.$store.commit("eviction/update_steps", a);
      // }
    },
    next() {
      this.$router.push({
        name: `${this.isInVC ? "vc-" : ""}property-address`,
      });
    },
    back() {
      // this.$router.push({ name: "vc-intro" });
      this.$auth.isAuthenticated
        ? this.$router.push({ name: "vc-intro" })
        : this.$router.push({ name: "vc-before-creating" });
    },
    typeClicked(type) {
      this.propertyType = type;
      this.next();
    },
  },
};
</script>

<style></style>
