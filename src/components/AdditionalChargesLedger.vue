<template>
  <div style="overflow: auto">
    <vue-scroll :ops="ops">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="periods"
        item-key="key"
        show-select
        hide-default-footer
        disable-pagination
        disable-sort
        fixed-header
        height="600"
        sort-by="timePeriod"
      >
        <template v-slot:item.amount="props">
          <div class="d-flex" style="justify-content: space-between">
            <v-edit-dialog
              :return-value.sync="props.item.amount"
              large
              persistent
            >
              <div>
                {{ convertToCurrency(props.item.amount) }}
                <v-icon size="14" color="#4dccc4" class="ml-1">
                  $pencil
                </v-icon>
              </div>
              <template v-slot:input>
                <div class="mt-4">Change amount</div>
                <v-text-field
                  v-model="props.item.amount"
                  label="Edit"
                  single-line
                  autofocus
                  type="number"
                ></v-text-field>
              </template>
            </v-edit-dialog>
            <v-btn color="red" text>Delete</v-btn>
          </div>
        </template>
      </v-data-table>
    </vue-scroll>
  </div>
</template>

<script>
export default {
  name: "AdditionalChargesLedger",
  data() {
    return {
      periods: [],
      headers: [
        {
          text: "Period",
          align: "left",
          value: "timePeriodDisplay",
        },
        {
          text: "Type",
          align: "left",
          value: "type",
        },
        {
          text: "Rent Amount",
          align: "left",
          value: "amount",
        },
      ],
      selected: [],
      ops: {
        vuescroll: {},
        scrollPanel: {
          speed: 100,
          easing: "easeInQuad",
        },
        rail: {
          background: "#EAEBEB",
          opacity: 1,
          size: "10px",
          specifyBorderRadius: false,
          gutterOfEnds: "10px",
          gutterOfSide: "0px",
        },
        bar: {
          onlyShowBarOnScroll: false,
          keepShow: true,
          background: "#4DCCC4",
          opacity: 1,
          size: "10px",
          minSize: 0.1,
        },
      },
    };
  },
  computed: {
    currentCase: function () {
      return this.$store.getters["eviction/currentCase"];
    },
  },
  watch: {
    currentCase: {
      deep: true,
      immediate: true,
      handler(oldCase, newCase) {
        console.log("new case info:>> ", newCase);
        if (!oldCase && !newCase) return;
        const { pastDueRent, utilities, fees, lateCharges, otherCharges } =
          newCase || oldCase;
        // console.log("pastDueRent :>> ", pastDueRent);
        const selectedRents = pastDueRent
          .filter((rent) => rent.selected === true)
          .map((rent) => {
            return { ...rent, type: "Rent" };
          });
        // console.log("selectedRents :>> ", selectedRents);
        const allFees = [
          ...utilities,
          ...fees,
          ...lateCharges,
          ...otherCharges,
        ];
        // console.log("allFees :>> ", allFees);
        const mergedPeriods = allFees.map((fee, index) => ({
          ...fee,
          key: index,
        }));

        mergedPeriods.forEach((period) => {
          period.timePeriodDisplay = this.formatDates(period.timePeriod);
        });
        // console.log("mergedPeriods :>> ", mergedPeriods);
        // this.periods = mergedPeriods;
        console.log("pastDueRent :>> ", pastDueRent);
        this.periods = pastDueRent;
        const selectedPeriods = mergedPeriods.filter(
          (period) => period.selected
        );
        this.selected = selectedPeriods;
      },
    },
  },
};
</script>

<style scoped>
/* .theme--light.v-data-table thead tr th:first-child { */
/* .v-data-table__wrapper >>> th {
  background: red !important;
  border-top-right-radius: 0 !important;
  border-top-left-radius: 0 !important;
} */
</style>
