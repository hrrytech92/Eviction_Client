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
    <div class="text-left ml-8">
      <div class="custom-title pt-8" style="font-size: 2.2rem">
        Add Additional fees & Charges
      </div>
      <div class="mb-6">
        Add all applicable fees that are currently due.
        <!-- Should you need more
        information on what types of newFees and charges may be allowable, visit
        our Legal Encyclopedia. -->
      </div>
    </div>

    <div class="d-flex mb-4" style="gap: 10px; justify-content: space-evenly">
      <v-btn
        text
        rounded
        v-if="checklist.newLateCharges"
        @click="lateChargesOpen = true"
      >
        <v-icon class="mr-1" color="primary"> mdi-plus-circle </v-icon>
        Late Charges</v-btn
      >
      <v-btn
        text
        rounded
        @click="utilitiesOpen = true"
        v-if="checklist.newUtilities"
      >
        <v-icon class="mr-1" color="primary"> mdi-plus-circle </v-icon>
        Utilities</v-btn
      >
      <v-btn text rounded v-if="checklist.newFees" @click="feesOpen = true">
        <v-icon class="mr-1" color="primary"> mdi-plus-circle </v-icon>
        Fees
      </v-btn>
      <v-btn text rounded v-if="checklist.other" @click="otherOpen = true">
        <v-icon class="mr-1" color="primary"> mdi-plus-circle </v-icon>
        Other
      </v-btn>
    </div>

    <AdditionalChargesLedger />
    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="$router.push({ name: 'vc-additional-charges' })"
      >
        go back
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        @click="next"
      >
        continue
      </v-btn>
    </v-card-actions>
    <!-- dialoges -->
    <v-dialog v-model="lateChargesOpen" value="''" max-width="1000" persistent>
      <LateChargesDialog
        @close:dialog="lateChargesOpen = false"
        @add="calculateLateChargePeriods"
      />
    </v-dialog>
    <v-dialog v-model="utilitiesOpen" persistent value="''" max-width="900">
      <UtilitiesAndFeesDialog
        title="Utilities"
        :types="utilityTypes"
        @close:dialog="utilitiesOpen = false"
        @add="addUtility"
        dialogHeight="800px"
      />
    </v-dialog>
    <v-dialog v-model="feesOpen" persistent value="''" max-width="900">
      <UtilitiesAndFeesDialog
        title="Fees"
        :types="feeTypes"
        @close:dialog="feesOpen = false"
        @add="addFee"
        dialogHeight="800px"
      />
    </v-dialog>
    <v-dialog v-model="otherOpen" persistent value="''" max-width="900">
      <OtherFeesDialog
        title="Other"
        @close:dialog="otherOpen = false"
        @add="addOther"
      />
    </v-dialog>
    <!-- END dialoges -->
  </div>
</template>

<script>
// import DateRange from "@/components/DateRange";
// import Checkbox from "@/components/Checkbox";
import LateChargesDialog from "@/components/dialogs/lateChargesDialog.vue";
import OtherFeesDialog from "@/components/dialogs/FeesDialog.vue";
import UtilitiesAndFeesDialog from "@/components/dialogs/UtilitiesAndFeesDialog.vue";
// import EditableField from "@/components/EditableField.vue";
import AdditionalChargesLedger from "@/components/AdditionalChargesLedger.vue";

import { mapGetters } from "vuex";

export default {
  name: "AdditionalCharges",
  components: {
    // VDaterange
    // DateRange,
    // Checkbox,
    LateChargesDialog,
    OtherFeesDialog,
    // EditableField,
    UtilitiesAndFeesDialog,
    AdditionalChargesLedger,
  },
  props: {},
  data() {
    return {
      additionalCharges: "",
      lateChargesOpen: false,
      utilitiesOpen: false,
      otherOpen: false,
      feesOpen: false,
      checklist: {
        newLateCharges: true,
        newUtilities: true,
        newFees: true,
        other: true,
      },
      utilityTypes: [
        "Water",
        "Sewer",
        "Water & Sewer",
        "Gas",
        "Electricity",
        "Cable",
        "Garbage",
        "Parking",
      ],
      feeTypes: [
        "Bounced/Returned Check",
        "Certified letter reminder of late rent",
        "Municipal Violations",
        "Parking Fee",
        "Unauthorized Parking Fee",
        "Pet Fees",
        "Unauthorized Pet Fee",
        "Garbage Fee",
        "Storage Fees",
        "Garage Rent",
        "Pool Use Fee",
        "Gym Use Fee",
        "Home Owner’s Associations Fee",
        "Administrative fees",
        "Service charges",
        "Property Management Fees",
        "Other",
      ],
      feeTotals: {
        newLateCharges: 0,
        newUtilities: 0,
        newFees: 0,
        other: 0,
      },
      newPastDueRent: [],
      newLateCharges: [],
      newUtilities: [],
      newFees: [],
      newOtherCharges: [],
      useNext: false,
    };
  },
  computed: {
    ...mapGetters({
      case: "eviction/currentCase",
    }),
    valid() {
      return this.additionalCharges;
    },

    suitAmount() {
      return (
        parseFloat(this.calculateChargeCost) +
        parseFloat(this.calculateUtilityCost) +
        parseFloat(this.calculateFeeCost) +
        parseFloat(this.calculateOtherCost)
      ).toFixed(2);
    },
  },
  activated() {
    window.scrollTo(0, 0);
    this.useNext = false;

    if (this.case.section8) this.checklist.newLateCharges = false;
    else this.checklist.newLateCharges = true;
    // this.checklist.other = false;
    this.newPastDueRent = this.case.pastDueRent;
    this.newLateCharges = this.case.lateCharges || [];
    this.newUtilities = this.case.utilities || [];
    this.newFees = this.case.fees || [];
    this.newOtherCharges = this.case.otherCharges || [];
  },
  deactivated() {
    this.saveData();
  },

  methods: {
    calculateLateChargePeriods(calculateInfoArray) {
      console.log("calculateInfoArray :>> ", calculateInfoArray);
      for (const calculateInfo of calculateInfoArray) {
        let amount = 0;
        let type = "";
        switch (calculateInfo.type) {
          case "flat":
            type = "Late Charge Flat Fee";
            amount = calculateInfo.flatAmount;
            break;
          case "percentage":
            type = "Late Charge Percentage Fee";
            amount = (calculateInfo.percentage / 100) * this.case.rentAmount;
            break;
          case "daily":
            // amount = calculateInfo.dailyAmount * (this.calculateDateDifferance()) + calculateInfo.baseAmount;
            // will have to add to specific ranges
            amount =
              Number(calculateInfo.dayAmount) *
                Number(calculateInfo.dailyAmount) +
              Number(calculateInfo.baseAmount);

            this.newLateCharges.push({
              amount: parseFloat(amount).toFixed(2),
              timePeriod: calculateInfo.timePeriod,
              timePeriodDisplay: calculateInfo.timePeriodDisplay,
              selected: true,
              type: "Late Charge Daily Fee",
            });
            break;
          case "other":
            this.newLateCharges.push({
              amount: parseFloat(calculateInfo.otherAmount).toFixed(2),
              timePeriod: calculateInfo.timePeriod,
              timePeriodDisplay: calculateInfo.timePeriodDisplay,
              selected: true,
              type: "Late Charge Other Fee",
            });
            break;
          default:
            amount = 0;
        }
        this.lateChargesOpen = false;
        for (const period of this.case.pastDueRent.filter(
          (value) => value.selected
        )) {
          if (calculateInfo.type === "other") {
            continue;
          }

          if (calculateInfo.type === "daily") {
            continue;
            // amount =
            //   calculateInfo.dailyAmount *
            //   (this.calculateDateDifferance(period.timePeriod) -
            //     calculateInfo.gracePeriod) +
            //   parseFloat(calculateInfo.baseAmount);
          }

          this.newLateCharges.push({
            amount: parseFloat(amount).toFixed(2),
            timePeriod: period.timePeriod,
            timePeriodDisplay: period.timePeriodDisplay,
            calculatedAmount: 400,
            selected: true,
            type: type,
          });
        }
        // console.log("this.newPastDueRent :>> ", this.newPastDueRent);
        // const updatedPeriods = this.newPastDueRent.map((rent) => {
        //   console.log("rent :>> ", rent);
        //   if (!rent.selected) return rent;
        //   const otherFees = rent.otherFees || [];
        //   return {
        //     ...rent,
        //     otherFees: [
        //       ...otherFees,
        //       {
        //         amount: parseFloat(amount).toFixed(2),
        //         calculatedAmount: 400,
        //         selected: true,
        //         type: type,
        //       },
        //     ],
        //   };
        // });
        // console.log("updatedPeriods", updatedPeriods);
        // this.saveData();
      }
    },
    addCharge() {
      this.newLateCharges.push({
        type: "flat",
        amount: "",
        timePeriod: [],
      });
    },
    addUtility(fee) {
      this.utilitiesOpen = false;
      this.newUtilities = [...this.newUtilities, ...fee];
    },
    addFee(fee) {
      this.feesOpen = false;
      // this.newFees.push(fee);
      this.newFees = [...this.newFees, ...fee];
    },
    addOther(fee) {
      this.otherOpen = false;
      this.newOtherCharges.push(fee);
    },
    deleteItem(index, arr) {
      arr.splice(index, 1);
    },
    updateDates(dates, row) {
      row.timePeriod = dates;
      row.timePeriodDisplay = this.formatDates(dates);
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
    calculateDateDifferance(dates) {
      if (!Array.isArray(dates)) return this.$dayjs(dates).daysInMonth();
      if (!dates[1]) return 1;
      // 1 day in milliseconds
      const oneDay = 1000 * 60 * 60 * 24;
      // convert string to dates to milliseconds
      const day1 = new Date(dates[0]).getTime();
      const day2 = new Date(dates[1]).getTime();

      const millisecondDif = day2 - day1;
      // add 1 because calculates the difference btw days but not first/last day
      return Math.round(millisecondDif / oneDay) + 1;
    },
    saveData() {
      if (this.useNext) return;
      // const lastStep = this.case.section8 ? "Confirmation" : "Legal Fees";
      this.$store.dispatch("eviction/updateCase", {
        caseData: {
          pastDueRent: this.newPastDueRent,
          lateCharges: this.newLateCharges,
          utilities: this.newUtilities,
          fees: this.newFees,
          otherCharges: this.newOtherCharges,
        },
        status: this.case.section8 ? "confirmation" : "legalFees",
      });
    },
    next() {
      this.saveData();
      this.useNext = true;
      this.$router.push({
        name: this.case.section8 ? "vc-confirmation" : "vc-legal-fees",
      });
    },
  },
};
</script>

<style scoped>
.text-uppercase {
  text-transform: uppercase;
}
.__vuescroll >>> .__panel {
  overscroll-behavior: contain;
}
</style>
