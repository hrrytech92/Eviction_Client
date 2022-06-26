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
      <div class="custom-title py-8">Property Address</div>
      <FormLabel>County</FormLabel>
      <v-select
        v-model="county"
        item-color="#F6F9FA"
        rounded
        item-text="countyName"
        solo
        flat
        dense
        background-color="#F0F5F6"
        :items="counties"
        class="pb-2"
        :rules="[]"
        return-object
        @blur="isCountyTouchedOrSkipped = true"
      >
        <v-icon slot="append" medium color="accent"> mdi-chevron-down </v-icon>
      </v-select>
      <div
        v-if="showCountyRequired"
        class="error--text mt-n9 mb-3 ml-3 text--lg"
        style="font-size: 16px"
      >
        Item is required
      </div>
      <div class="text-left">
        <FormLabel>Street Address</FormLabel>
        <v-text-field
          v-model="streetAddress"
          rounded
          solo
          flat
          dense
          background-color="#F0F5F6"
          class="pb-2"
          :rules="[required]"
          @click="isCountyTouchedOrSkipped = true"
        />
        <FormLabel>Unit/Apt</FormLabel>
        <v-text-field
          v-model="unitNo"
          rounded
          solo
          flat
          dense
          background-color="#F0F5F6"
          class="pb-2"
          @click="isCountyTouchedOrSkipped = true"
          placeholder="Apt. 201"
        />
        <FormLabel>City</FormLabel>
        <v-autocomplete
          v-model="city"
          :items="cities"
          :loading="loading"
          :search-input.sync="search"
          hide-no-data
          hide-selected
          item-text="cityName"
          placeholder="Start typing to Search"
          return-object
          rounded
          solo
          flat
          dense
          background-color="#F0F5F6"
          class="pb-2"
          :rules="[required]"
          @click="isCountyTouchedOrSkipped = true"
        >
          <!-- <template slot="selection" slot-scope="data">
            {{ displayCityInfo(data.item) }}
          </template>
          <template slot="item" slot-scope="data">
            {{ displayCityInfo(data.item) }}
          </template> -->
          <v-icon slot="append" medium color="accent">
            mdi-chevron-down
          </v-icon>
        </v-autocomplete>

        <FormLabel>State</FormLabel>
        <v-text-field
          v-model="state"
          item-color="#F6F9FA"
          rounded
          solo
          flat
          dense
          disabled
          background-color="#F0F5F6"
          class="pb-2"
          :rules="[required]"
        />

        <FormLabel>Zip Code</FormLabel>
        <v-text-field
          v-model="zipcode"
          rounded
          solo
          flat
          dense
          background-color="#F0F5F6"
          class="pb-2"
          :rules="[required]"
        />
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
import { states } from "@/resources/index.js";
import useRequest from "@/utils/useRequest";
import FormLabel from "../../fields/FormLabel.vue";

export default {
  name: "PropertyAddress",
  data() {
    return {
      valid: false,
      streetAddress: "",
      city: "",
      subdivision: "",
      state: "",
      zipcode: "",
      county: "",
      unitNo: "",
      states,
      counties: [],
      subdivisions: [],
      loading: false,
      allCitiesandSubs: [],
      cities: [],
      search: null,
      select: null,
      required: (value) => !!value || "Item is required",
      isCountyTouchedOrSkipped: false,
    };
  },
  computed: {
    ...mapGetters({
      currentProperty: "property/currentProperty",
    }),
    isInVC() {
      return this.$route.name.includes("vc");
    },
    showCountyRequired() {
      return !this.county && this.isCountyTouchedOrSkipped;
    },
  },
  watch: {
    county: {
      handler: function (newCounty, prevCounty) {
        const newCountyName = newCounty?.countyName;
        const prevCountyName = prevCounty?.countyName;
        if (newCountyName && newCountyName !== prevCountyName)
          this.getCitiesByCounty(newCountyName);
      },
    },
  },
  async mounted() {
    window.scrollTo(0, 0);
    this.loading = true;
    // await this.getAllCities();
    await this.getCountiesOfState();
    this.loading = false;
  },
  async activated() {
    this.$refs.form.resetValidation();
    const { streetAddress, unitNo, subdivision, zipcode, city, county } =
      this.currentProperty;
    if (streetAddress) this.streetAddress = streetAddress;
    this.subdivision = subdivision;
    // this.state = this.currentProperty.subdivisions || "New Jersey";
    this.state = "New Jersey";
    if (zipcode) this.zipcode = zipcode;
    if (county) this.county = county;
    this.unitNo = unitNo;
    if (county) await this.getCitiesByCounty(county);
    if (city) this.city = city;
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    handleCountyChange(county) {
      console.log("handleCountyChange", county);
    },
    async getCountiesOfState() {
      await useRequest({
        path: "countiesOfState",
        params: {
          stateId: 31,
        },
        onSuccess: (counties) => {
          this.counties = counties;
        },
      });
    },
    async getCitiesByCounty(county) {
      if (!county) return;
      const { data: cities } = await useRequest({
        path: "citiesByCounty",
        params: {
          county,
        },
      });
      if (!cities?.length) return;
      this.cities = cities;
      if (!cities.find((city) => city.cityName === this.city?.cityName))
        this.city = null;
      this.$refs.form.resetValidation();
    },
    saveData() {
      this.valid = this.$refs.form.validate();
      // const stepData = {
      //   type: "completed",
      //   address: "completed",
      //   registration: "completed",
      //   owner:
      //     this.currentProperty.propertyType === "Residential"
      //       ? ""
      //       : "completed",
      //   associationToOwner: "",
      //   contact: "",
      // };
      if (!this.valid) return;
      const { city, county } = this;
      const cityObj =
        typeof city === "string"
          ? {}
          : {
              city: city.cityName,
              municipalCode: city.municipalCode,
            };
      const countyObj =
        typeof county === "string"
          ? {}
          : {
              county: county.countyName,
              countyId: county.countyId,
            };
      const propertyData = {
        streetAddress: this.streetAddress,
        // city: this.city.cityName,
        // municipalCode: this.city.municipalCode,
        // county: this.county.countyName,
        // countyId: this.county.countyId,
        ...countyObj,
        ...cityObj,
        subdivision: this.subdivision,
        state: this.state,
        zipcode: this.zipcode,
        unitNo: this.unitNo,
        // status:
        //   this.currentProperty.propertyType === "Residential"
        //     ? "registration"
        //     : "owner",
        status: "address",
      };
      this.$store.dispatch("property/saveProperty", {
        propertyData,
        // steps: stepData,
      });
    },
    next() {
      this.$router.push({
        // name:
        //   this.currentProperty.propertyType === "Residential"
        //     ? `${this.isInVC ? "vc-" : ""}property-registration`
        //     : `${this.isInVC ? "vc-" : ""}property-owner`,
        name: `${this.isInVC ? "vc-" : ""}property-owner`,
      });
    },
    back() {
      this.$router.push({
        name: `${this.isInVC ? "vc-" : ""}property-type`,
      });
    },
    displayCityInfo(cityOrSub) {
      if (cityOrSub.countyId) return cityOrSub.name;
      const city = this.allCitiesandSubs.find((c) => {
        if (!c.countyId) {
          return false;
        }
        return c.id === cityOrSub.cityId;
      });
      return `${cityOrSub.name} (${city.name})`;
      // return "needs work"
    },
  },
  components: { FormLabel },
};
</script>

<style></style>
