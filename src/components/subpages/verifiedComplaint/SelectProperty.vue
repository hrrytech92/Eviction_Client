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
      <div class="custom-title pt-8 pb-4">
        {{ $route.query.addUnit ? "Add Unit." : "Select Property." }}
      </div>
      <div v-if="$route.query.addUnit" class="pb-12">
        We’ve simplified the process for you. If you previously added a property
        containing a unit, search for the property address below and add the new
        unit number. We’ll copy the existing property information to the new
        unit.
      </div>
      <div v-else class="pb-12">
        These are all the properties we currently have on file for you. Select
        the one from which you’d like to evict the tenants.
      </div>

      <div
        style="
          height: 370px;
          border: 1px solid #c3d1d2;
          border-radius: 20px;
          position: relative;
        "
      >
        <!-- <LoadingOverlay
          :active="loading"
          :is-full-page="false"
          loader="dots"
          color="#4DCCC4"
          style="border-radius: 20px"
        /> -->
        <vue-scroll :ops="ops">
          <v-list v-show="!loading" style="background-color: transparent">
            <v-list-item-group
              v-if="allProperties.length > 0"
              v-model="chosenProperty"
            >
              <v-list-item
                v-for="propertyData in allProperties"
                :key="propertyData.id"
                class="py-1"
              >
                <span class="secondary--text">{{
                  `${propertyData.streetAddress}${getUnitNo(propertyData)}, ${
                    propertyData.city
                  }, ${propertyData.state} ${propertyData.zipcode}`
                }}</span>
              </v-list-item>
            </v-list-item-group>
            <v-list-item v-else class="py-1">
              <span class="secondary--text">No property found.</span>
            </v-list-item>
          </v-list>
        </vue-scroll>
      </div>
      <div v-if="noPropertyError" class="error-message mt-4">
        Select a property.
      </div>

      <v-sheet
        v-if="$route.query.addUnit"
        class="mt-10 pt-4 pb-10 px-12 font-weight-medium secondary--text d-flex align-end"
        style="
          background: #f6f9fa 0% 0% no-repeat padding-box;
          border-radius: 20px;
        "
      >
        <div class="pr-4">Add Unit/Apt. #</div>
        <v-text-field v-model="unitNo" hide-details />
      </v-sheet>
    </div>
    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        v-if="!$route.query.standalone"
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="back"
      >
        go back
      </v-btn>
      <v-btn
        v-if="$route.query.standalone"
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="$router.push({ name: `properties` })"
      >
        Cancel
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        :disabled="!valid"
        @click="next"
      >
        <span v-if="$route.query.standalone">Submit</span>
        <span v-else>continue</span>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import useRequest from "@/utils/useRequest";

export default {
  name: "SelectProperty",
  props: {
    redirect: {
      type: String,
      default: "",
    },
    propertyId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      chosenProperty: "",
      property: "",
      allProperties: [],
      unitNo: null,
      loading: false,
      noPropertyError: false,
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {
          // background: '#EAEBEB',
          opacity: 0,
          size: "8px",
          specifyBorderRadius: false,
          gutterOfEnds: "10px",
          gutterOfSide: "0px",
        },
        bar: {
          onlyShowBarOnScroll: false,
          keepShow: true,
          background: "#4DCCC4",
          opacity: 1,
          size: "8px",
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      properties: "property/properties",
      currentProperty: "property/currentProperty",
      currentPropertyId: "property/currentPropertyId",
    }),
    clientId() {
      return this.$store.getters.client.id;
    },
    valid() {
      return this.$route.query.addUnit
        ? this.isPropertyChosen && this.unitNo
        : this.isPropertyChosen;
    },
    isPropertyChosen() {
      return this.chosenProperty != null && this.chosenProperty != -1;
    },
  },
  watch: {
    // chosenProperty(newVal) {
    //   if (newVal === undefined) return;
    //   // console.log("newVal :>> ", newVal);
    //   this.property = this.allProperties[newVal];
    //   const stepKeys = [
    //     "type",
    //     "address",
    //     "registration",
    //     "owner",
    //     "associationToOwner",
    //     "contact",
    //   ];
    //   if (
    //     this.property &&
    //     Object.keys(this.property).length &&
    //     this.property.status
    //   ) {
    //     let setCurrentStatus = false;
    //     const steps = {};
    //     stepKeys.forEach((key) => {
    //       if (!setCurrentStatus) {
    //         steps[key] = "completed";
    //       } else {
    //         steps[key] = "";
    //       }
    //       if (key === this.property.status) {
    //         setCurrentStatus = true;
    //       }
    //     });
    //     if (this.property.propertyType === "Commercial")
    //       steps.registration = "hidden";
    //   }
    //   this.$store.commit("property/set_current_property", this.property);
    // },
  },

  activated() {
    this.loadProperties();
    if (this.$route.query.status === "started") {
      // this.$emit("load:data", this.$route.query.caseId);
      // this.loading = true;
    } else if (
      this.$store.getters.isAuthenticated &&
      this.currentProperty?.streetAddress
    ) {
      this.choseProperty = true;
      this.property = this.currentProperty;
    } else if (sessionStorage.getItem("property")) {
      this.choseProperty = true;
      this.property = JSON.parse(sessionStorage.getItem("property"));
    }

    window.scrollTo(0, 0);
  },
  methods: {
    getUnitNo(property) {
      return !this.$route.query.addUnit && property.unitNo
        ? `, ${property.unitNo}`
        : "";
    },
    removeDuplicateProperties(properties) {
      const uniqueProperties = [];
      properties.forEach((property) => {
        let isDuplicate = false;
        uniqueProperties.forEach((uniqueProperty) => {
          if (
            uniqueProperty.streetAddress === property.streetAddress &&
            uniqueProperty.zipcode === property.zipcode
          ) {
            isDuplicate = true;
          }
        });
        if (!isDuplicate) {
          uniqueProperties.push(property);
        }
      });
      return uniqueProperties;
    },
    async loadProperties() {
      const storeProperties = await this.$store.dispatch(
        "property/loadProperties"
      );
      // const storeProperties = this.properties;
      this.allProperties = this.$route.query.addUnit
        ? this.removeDuplicateProperties(
            storeProperties.filter((property) => property.unitNo)
          )
        : storeProperties.sort((a, b) => {
            if (a.streetAddress < b.streetAddress) return -1;
            if (a.streetAddress > b.streetAddress) return 1;
            return 0;
          });

      // this.allProperties = this.$route.query.addUnit
      // ? storeProperties.filter((property) => property.unitNo)
      // : storeProperties;

      // if (!this.isPropertyChosen)
      this.chosenProperty = this.allProperties
        .map((property) => property.propertyId)
        .indexOf(this.propertyId);
    },
    async save() {
      const nextPath = "vc-tenants";
      const isNewCase =
        this.$route.name.includes("vc") && this.$route.params.id === "new";
      let selectedProperty = this.allProperties[this.chosenProperty];

      if (
        this.$route.query.addUnit &&
        selectedProperty.unitNo !== this.unitNo
      ) {
        const { data: property } = await useRequest({
          path: "properties/newUnit",
          method: "post",
          data: {
            unitNo: this.unitNo,
            propertyId: selectedProperty.propertyId,
          },
        });
        if (!property) return;

        selectedProperty = property;
        this.$store.commit("property/set_current_property", property);
      } else {
        this.$store.dispatch(
          "property/loadProperty",
          selectedProperty.propertyId
        );
      }
      const { propertyId, completed } = selectedProperty;
      if (isNewCase) {
        this.$store.dispatch("eviction/createCase", {
          caseData: {
            propertyId,
          },
          // lastStep: this.property.completed ? "Tenant Information" : "Property",
          nextPath,
          logMessage: "SelectProperty.vue at line 282",
        });
      } else {
        this.$store.commit("eviction/update_current_case", {
          propertyId: propertyId,
        });
        this.$router.push({ name: "vc-tenants" });
      }
    },
    next() {
      this.save();
    },
    back() {
      this.$router.push({ name: "vc-intro" });
    },
  },
};
</script>

<style>
.primary-input-field.theme--light.v-text-field--solo
  > .v-input__control
  > .v-input__slot {
  background-color: #4dccc4;
}
.primary-input-field.v-text-field.v-text-field--solo
  .v-input__control
  input::placeholder,
.primary-input-field.v-text-field.v-text-field--solo .v-input__control input {
  color: white;
  text-align: center;
}
</style>
