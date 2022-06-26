<template>
  <div class="d-flex" style="padding-bottom: 70px">
    <div class="pr-8">
      <i class="icofont-calculator icofont-2x info--text" />
    </div>
    <div>
      <div class="text-left font-weight-medium info--text text-uppercase pb-2">
        Past Due Rent Calculations
      </div>
      <div class="pb-4">
        Due to various moratorium periods during COVID-19, the court may request
        a breakdown of the rent due and owing corresponding to those timeframes.
        Below, we've provided you with the calculations. Keep in mind, the last
        period reflects the current rents due and owing, and may require further
        adjustment as time elapses.
      </div>
      <v-data-table
        :headers="headers"
        :items="totals"
        :items-per-page="5"
        class="elevation-1"
        hide-default-footer
        disable-sort
      ></v-data-table>
    </div>
  </div>
</template>

<script>
import useRequest from "@/utils/useRequest";

export default {
  name: "OrderDetailsPasdDueRentCalcs",
  data() {
    return {
      withoutTimePeriod: 0,
      totals: [],
      headers: [
        {
          text: "Period Due",
          align: "left",
          value: "label",
        },
        {
          text: "Rent Owing",
          value: "rent",
        },
        {
          text: "Other Fees",
          value: "otherFee",
        },
        {
          text: "Total Fees",
          value: "total",
        },
      ],
    };
  },
  computed: {
    caseId() {
      return this.$store.getters["eviction/currentCase"].id;
    },
  },
  mounted() {
    this.getRentCalcs();
  },

  methods: {
    async getRentCalcs() {
      const { data } = await useRequest({
        path: `getRentCalculations/${this.caseId}`,
      });
      this.totals = data.totals;
      this.withoutTimePeriod = data.withoutTimePeriod;
    },
  },
};
</script>

<style scoped>
.fee-grid {
  display: grid;
  grid-template-columns: 395px 1fr 1fr 1fr;
  gap: 10px;
}
</style>
