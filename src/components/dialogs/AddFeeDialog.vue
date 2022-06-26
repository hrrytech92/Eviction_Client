<template>
  <v-card class="secondary--text pa-6 d-flex flex-column" @close-dialog="close">
    <v-btn
      color="info"
      icon
      class="align-self-end pa-6 btn--plain"
      @click="close"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div class="headline font-weight-medium py-4 text-center">
      Additional Fees
    </div>

    <div style="width: 80%" class="mx-auto">
      <div class="font-weight-medium secondary--text pt-4">Type</div>
      <v-select
        v-model="fee.title"
        :items="types"
        rounded
        hide-details
        solo
        flat
        dense
        background-color="#F0F5F6"
      >
        <v-icon slot="append" medium color="accent"> mdi-chevron-down </v-icon>
      </v-select>

      <div
        v-if="fee.title === 'Other'"
        class="font-weight-medium secondary--text pt-4"
      >
        Custom Type
      </div>
      <v-text-field
        v-if="fee.title === 'Other'"
        v-model="fee.title2"
        rounded
        hide-details
        solo
        flat
        dense
        background-color="#F0F5F6"
      />

      <div class="font-weight-medium secondary--text pt-4">Fee Description</div>
      <v-text-field
        v-model="fee.description"
        rounded
        hide-details
        solo
        flat
        dense
        background-color="#F0F5F6"
      />

      <div class="font-weight-medium secondary--text pt-4">Amount</div>
      <v-text-field
        v-model="fee.amount"
        rounded
        hide-details
        solo
        flat
        dense
        background-color="#F0F5F6"
      >
        <div slot="prepend-inner">$</div>
      </v-text-field>

      <div class="font-weight-medium secondary--text pt-4">Time Period</div>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="fee.timePeriodDisplay"
            append-icon="$calendar"
            color="accent"
            readonly
            rounded
            hide-details
            solo
            flat
            dense
            background-color="#F0F5F6"
            v-on="on"
          />
        </template>
        <date-range @update:dates="updateDates($event)" />
      </v-menu>
    </div>

    <v-card-actions class="justify-center">
      <v-btn
        rounded
        color="primary"
        class="px-12 mb-10 mt-6"
        small
        depressed
        :disabled="!fieldsFilled"
        @click="submit"
      >
        add
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import DateRange from "@/components/DateRange";
export default {
  name: "AddFeeDialog",
  components: {
    DateRange,
  },
  props: {
    dialogOpen: Boolean,
    attorney: Boolean,
  },
  data() {
    return {
      fee: {
        title: "",
        title2: "",
        description: "",
        amount: "",
        timePeriod: [],
        timePeriodDisplay: "",
      },
      menu: false,
    };
  },
  computed: {
    fieldsFilled() {
      return (
        this.fee.timePeriodDisplay &&
        this.fee.title &&
        this.fee.description &&
        this.fee.amount
      );
    },
    types() {
      const typeArr = [
        "Court Costs",
        // "Associated Legal Expenses",
        "Other",
      ];
      if (this.attorney) {
        typeArr.unshift("Attorney Fees");
      }
      return typeArr;
    },
  },
  watch: {
    dialogOpen: function (newVal, oldVal) {
      // watch it
      if (!newVal && oldVal) {
        this.fee = {
          title: "",
          title2: "",
          description: "",
          amount: "",
          timePeriod: [],
          timePeriodDisplay: "",
        };
      }
    },
  },
  methods: {
    close() {
      this.fee = {
        title: "",
        title2: "",
        description: "",
        amount: "",
        timePeriod: [],
        timePeriodDisplay: "",
      };
      this.$emit("close-dialog");
    },
    updateDates(dates) {
      this.fee.timePeriod = dates;
      this.fee.timePeriodDisplay = this.formatDates(dates);
    },
    formatDates(dates) {
      if (Array.isArray(dates)) {
        const [year1, month1, day1] = dates[0].split("-");
        const [year2, month2, day2] = dates[1].split("-");
        return `${month1}/${day1}/${year1} - ${month2}/${day2}/${year2}`;
      }
      const [year1, month1, day1] = dates.split("-");
      return `${month1}/${day1}/${year1}`;
    },
    submit() {
      this.$emit("add:item", this.fee);
      this.fee = {};
      this.timePeriodDisplay = "";
    },
  },
};
</script>

<style></style>
