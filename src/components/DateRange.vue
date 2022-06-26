<template>
  <v-card class="d-flex flex-column date-range">
    <v-btn
      v-if="datePickerType === 'range' && multiPicker"
      rounded
      color="secondary"
      class="date-range__change-type-btn align-self-end px-6"
      small
      depressed
      @click="switchDatePickerType('range')"
    >
      single date
    </v-btn>
    <v-btn
      v-if="datePickerType === 'single' && multiPicker"
      rounded
      color="secondary"
      class="align-self-end px-6"
      small
      depressed
      @click="switchDatePickerType('single')"
    >
      date range
    </v-btn>
    <div class="px-4">
      <div v-if="datePickerType === 'range'" class="d-flex align-center">
        <div>
          <span v-if="!dates[0]" class="info--text caption pa-2">
            START DATE
          </span>
          <span v-else class="secondary--text caption pa-2">
            {{ formatDate(dates[0]) }}
          </span>
        </div>
        <v-icon color="primary" class="pt-1"> mdi-chevron-right </v-icon>
        <div>
          <span v-if="!dates[1]" class="info--text caption pa-2">END DATE</span>
          <span v-else class="secondary--text caption pa-2">
            {{ formatDate(dates[1]) }}
          </span>
        </div>
      </div>
    </div>

    <v-date-picker
      v-model="dates"
      :max="max"
      no-title
      :show-current="false"
      color="primary"
      :range="datePickerType === 'range'"
      class="custom-date no-shadow pb-4"
      :class="{ 'flat-date-range': datePickerType === 'range' }"
      :type="pickerType"
      @input="handleDates"
    />
  </v-card>
</template>

<script>
import moment from "moment";
export default {
  name: "DateRange",
  props: {
    propDates: {
      type: [String, Array],
      default: () => [],
    },
    max: {
      type: [String, Number],
      default: "",
    },
    multiPicker: {
      // determine if date-picker can be switchable from range to single
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "range",
    }, // range / month / single
    parentIndex: {
      type: Number,
      default: -1,
    },
    feeType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dates: [],
      datePickerType: "range",
    };
  },
  computed: {
    pickerType() {
      return this.type === "month" ? "month" : "date";
    },
  },
  watch: {
    type() {
      this.initialization();
    },
  },
  created() {
    this.initialization();
  },
  methods: {
    initialization() {
      if (this.type === "month" || this.type === "single") {
        this.dates = "";
      } else {
        this.dates = [];
      }
      if (this.propDates) {
        this.dates = this.propDates;
      }

      this.datePickerType = this.type || "range";
    },
    formatDate(date) {
      if (!date || (Array.isArray(date) && !date.length)) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    handleDates() {
      // check that dates are not out of order
      if (
        Array.isArray(this.dates) &&
        this.dates[1] &&
        moment(this.dates[0]).isAfter(moment(this.dates[1]))
      ) {
        [this.dates[0], this.dates[1]] = [this.dates[1], this.dates[0]];
      }
      if (this.parentIndex > -1) {
        this.$emit("update:dates", {
          dates: this.dates,
          index: this.parentIndex,
          feeType: this.feeType,
        });
      } else {
        this.$emit("update:dates", this.dates);
      }
    },
    switchDatePickerType(type) {
      if (type === "range") {
        this.datePickerType = "single";
        this.dates = "";
      } else if (type === "single") {
        this.datePickerType = "range";
        this.dates = [];
      }
    },
  },
};
</script>

<style lang="scss">
.date-range {
  .no-shadow {
    box-shadow: none;
  }
  .flat-date-range button.v-btn {
    height: 23px;
    width: 59px;
  }

  .flat-date-range .v-date-picker-table--date th {
    padding: 8px 1px 8px 21px;
  }

  .flat-date-range .v-picker__body > div {
    width: 102%;
    padding: 0px 15px 0px 0px;
  }

  .cursor-default {
    cursor: default !important;
  }

  &__change-type-btn {
    border-radius: 20px 0 0 20px;
  }
}
</style>
