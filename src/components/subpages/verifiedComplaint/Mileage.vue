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
    <v-form
      ref="form"
      v-model="valid"
      style="width: 80%"
      class="pt-10 pb-4 mx-auto text-left"
    >
      <div class="custom-title mt-10 mb-10">Mileage</div>

      <div class="custom-subtitle mb-6">Mileage Area</div>
      <div class="mb-10">
        Please use caution when selecting the mileage area; it may not be the
        same as the city wherein the property is located. If you are not sure
        what to select, please contact the court. Submitting an incorrect
        mileage fee may require re-filing the complaint.
      </div>

      <div class="font-weight-medium mb-2">Select Area</div>
      <v-autocomplete
        v-model="selectedArea"
        :items="mileage.areas"
        hide-no-data
        hide-selected
        item-text="neighborhood"
        item-value="neighborhood"
        rounded
        solo
        flat
        dense
        background-color="#F0F5F6"
        class="mb-4"
        :rules="[(v) => !!v || 'Area is required']"
      >
        <v-icon slot="append" medium color="accent"> mdi-chevron-down </v-icon>
      </v-autocomplete>

      <div
        v-if="
          selectedMileageObj &&
          selectedMileageObj.notes &&
          !selectedMileageObj.question
        "
        class="mb-8"
      >
        <div class="grey--text font-italic mb-10">
          <span class="font-weight-bold">NOTE:</span>
          <span> {{ selectedMileageObj && selectedMileageObj.notes }} </span>
        </div>
      </div>

      <div
        v-if="selectedMileageObj && selectedMileageObj.question"
        class="mb-8"
      >
        <div class="font-weight-medium mb-2">Address Type</div>
        <div class="mb-8">
          {{ selectedMileageObj && selectedMileageObj.question }}
        </div>
        <v-autocomplete
          v-model="selectedAddressType"
          :items="addressTypes"
          hide-no-data
          hide-selected
          item-text="name"
          item-value="id"
          rounded
          solo
          flat
          dense
          background-color="#F0F5F6"
        >
          <v-icon slot="append" medium color="accent">
            mdi-chevron-down
          </v-icon>
        </v-autocomplete>

        <div v-if="selectedAddressType" class="grey--text font-italic mb-10">
          <span class="font-weight-bold">NOTE:</span>
          <span> {{ selectedMileageObj && selectedMileageObj.notes }} </span>
        </div>
      </div>

      <div class="custom-subtitle mb-6">Court Information</div>
      <div class="mb-6">
        Based on the property address, this is the court wherein the legal
        proceedings will take place.
      </div>

      <div class="font-weight-medium">
        {{ courtAddress && courtAddress.county }} County Court
      </div>
      <div>{{ courtAddress && courtAddress.street }}</div>
      <div>
        {{ courtAddress && courtAddress.city }},
        {{ courtAddress && courtAddress.state }}
        {{ courtAddress && courtAddress.zipcode }}
      </div>
      <div class="mb-10">
        {{ courtAddress && courtAddress.phone }}
      </div>
    </v-form>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Mileage",
  data() {
    return {
      selectedArea: null,
      selectedAddressType: 0,
      addressTypes: [
        { id: 0, name: "No" },
        { id: 1, name: "Yes" },
      ],
      selectedMileageObj: null,
      loading: false,
      valid: false,
      search: "",
      useNext: false,
    };
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
      mileage: "eviction/mileage",
      currentProperty: "property/currentProperty",
    }),
    courtAddress() {
      return this.mileage.courtAddress;
    },
    newLegalFeesPermitted() {
      return this.currentCase.legalFeesPermitted;
    },
  },
  watch: {
    // async client(val) {
    //   if (val) {
    //     const caseId = this.$route.params.id;
    //     await this.$store.dispatch("eviction/loadCase", {
    //       caseId,
    //       logMessage: "Mileage.vue at line 174",
    //     });

    //     this.selectedArea = this.currentCase.mileageNeighborhood || null;
    //     this.selectedAddressType = this.currentCase.mileageAnswer || 0;
    //   }
    // },
    "currentProperty.county": function () {
      this.selectedMileageObj = null;
      console.log("i'm loading milage");
      this.$store.dispatch("eviction/loadMileage");
    },
    // currentCase() {
    //   this.$store.dispatch("eviction/loadMileage");
    // },
    selectedArea() {
      this.selectedMileageObj =
        typeof this.mileage.areas !== "undefined" &&
        this.mileage.areas.find(
          (item) => item.neighborhood.trim() === this.selectedArea.trim()
        );
    },
  },
  async activated() {
    window.scrollTo(0, 0);
    this.useNext = false;
    await this.$store.dispatch("eviction/loadMileage");
    // if (!this.mileage || !this.$store.getters.isAuthenticated) {
    //   await this.$store.dispatch("eviction/loadMileage");
    // }
    this.selectedArea = this.currentCase.mileageNeighborhood || null;
    this.selectedAddressType = this.currentCase.mileageAnswer || 0;
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    saveData() {
      if (this.useNext) return;

      this.$store.dispatch("eviction/updateCase", {
        caseData: {
          mileageNeighborhood: this.selectedArea,
          mileageAnswer: this.selectedAddressType,
        },
        submitted: false,
      });
    },
    next() {
      this.useNext = true;
      this.$store.dispatch("eviction/updateCase", {
        caseData: {
          mileageNeighborhood: this.selectedArea,
          mileageAnswer: this.selectedAddressType,
        },
        submitted: false,
        lastStep: "Summary of Suit Amount",
      });

      this.$router.push({ name: "vc-suit-summary" });
    },
    back() {
      this.$router.push({ name: "vc-verification" });
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
