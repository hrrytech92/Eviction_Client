import { mapGetters } from "vuex";
import moment from "moment";

export default {
  data: () => ({
    summaryItems: [],
  }),
  computed: {
    ...mapGetters({
      // mileage: "eviction/mileage",
      case: "eviction/currentCase",
      // property: "property/currentProperty",
      // orders: "eviction/stepOrders",
    }),
    // feesTotal() {
    //   const total = this.summaryItems.reduce(
    //     (sum, item) => sum + item.total,
    //     0
    //   );
    //   return Number(total);
    // },
  },
  methods: {
    async initFeeData() {
      try {
        // console.log("initFeeData was called****");
        const caseData = this.case;
        const { pastDueRent, additionalChargesPermitted, legalFeesPermitted } =
          caseData;
        // this.summaryItems = [];

        this.summaryItems = [
          {
            name: "Past Due Rent",
            total: 0,
            amounts: [],
            keys: ["pastDueRent"],
          },
        ];

        if (pastDueRent.length) {
          this.summaryItems[0].amounts = pastDueRent.filter(
            (value) => value.selected
          );
          this.summaryItems[0].total = this.calculateTotal(pastDueRent);
        }

        if (additionalChargesPermitted) {
          const lateCharges = caseData.section8 ? [] : caseData.lateCharges;
          this.summaryItems.push({
            name: "Additional Charges",
            total: this.calculateAdditionalChargeTotal(),
            amounts: [
              ...caseData.utilities,
              ...caseData.fees,
              ...caseData.otherCharges,
              ...lateCharges,
            ],
            keys: ["utilities", "fees", "otherCharges", "lateCharges"],
          });
        }

        if (legalFeesPermitted) {
          let total = 0;
          let amounts = [];
          if (!caseData.section8) {
            const courtFees = this.calculateCourtFees(caseData);
            amounts = courtFees;
            total = this.calculateTotal(courtFees);
          }
          this.summaryItems.push({
            name: "Court Fees",
            total,
            amounts,
            keys: ["legalFees"],
          });
        }

        // console.log("this.summaryItems :>> ", this.summaryItems);
      } catch (error) {
        console.error("initFeeData error:", error.message);
      }
    },
    calculateCourtFees(caseData) {
      // console.log("calculateCourtFees - caseData :>> ", caseData);
      if (!caseData.tenants.length) {
        console.error("No tenants found");
        this.$store.commit(
          "global/set_global_error",
          {
            message: "No tenants found on this case.",
          },
          { root: true }
        );
        return null;
      }

      const calculateTenantFee = 5 * (caseData.tenants.length - 1); //The first tenant is $0.00.
      // console.log("calculateTenantFee :>> ", calculateTenantFee);
      /*
      const getCurrentCaseCounty = this.property.county.trim();
      if (typeof this.mileage.areas === "undefined") {
        await this.$store.dispatch("eviction/loadMileage");
      }
      const getMileageData = this.mileage.areas?.find((item) => {
        if (caseData.mileageNeighborhood) {
          return (
            item.county.trim() === getCurrentCaseCounty &&
            item.neighborhood.trim() === caseData.mileageNeighborhood.trim()
          );
        }
      });
      let calculateMileageFee = "";
      if (getMileageData) {
        // console.log("getMileageData :>> ", getMileageData);
        calculateMileageFee = getMileageData.mileage;
        if (caseData.mileageAnswer) {
          calculateMileageFee =
            getMileageData.mileage + getMileageData.additional_fee;
        }
      }
      */

      const amountsArray = [
        {
          type: "Filing Fee",
          amount: "50.00",
          selected: caseData.legalFeesPermitted,
        },
        {
          type: "Mileage Fee",
          amount: "7.00", //parseFloat(calculateMileageFee).toFixed(2),
          selected: caseData.legalFeesPermitted,
        },
      ];

      if (caseData.tenants.length > 1) {
        amountsArray.push({
          type: "Tenant Fee",
          amount: parseFloat(calculateTenantFee).toFixed(2),
          selected: caseData.legalFeesPermitted,
        });
      }
      return amountsArray;
    },
    // async saveLegalFees(caseData, submitted = false, lastStep = null) {
    //   const data = await this.calculateCourtFees(caseData);
    //   // console.log("data :>> ", data);
    //   if (!data) return;

    //   if (!this.$store.getters.isAuthenticated) {
    //     const storageCase = sessionStorage.getItem("case");
    //     const caseInfo = {
    //       ...JSON.parse(storageCase),
    //       legalFees: data,
    //       statusDate: this.$dayjs().format("MM.DD.YY"),
    //     };
    //     const updatedCase = {
    //       ...caseInfo,
    //       status: null,
    //       submitted: false,
    //     };
    //     sessionStorage.setItem("case", JSON.stringify(updatedCase));
    //     return;
    //   }
    //   await this.$store.dispatch("eviction/updateCase", {
    //     caseData: {
    //       legalFees: data,
    //       statusDate: moment().format("MM.DD.YY"),
    //     },
    //     lastStep: submitted
    //       ? "Verified Complaint Complete"
    //       : this.orders.indexOf(lastStep) > this.orders.indexOf(caseData.status)
    //       ? lastStep
    //       : caseData.status,
    //     // lastStep: "Past Due Rent",
    //     logMessage: "calculate-fees.js:169",
    //   });
    // },
    calculateTotal(arr) {
      // console.log("arr :>> ", arr);
      let total = 0;
      arr
        .filter((value) => value.selected)
        .forEach((item) => {
          if (item.amount) {
            total += parseFloat(item.amount);
          }
        });
      return total;
    },
    calculateAdditionalChargeTotal() {
      const lateCharges = this.case.section8
        ? 0
        : this.calculateTotal(this.case.lateCharges);
      return (
        lateCharges +
        this.calculateTotal(this.case.utilities) +
        this.calculateTotal(this.case.fees) +
        this.calculateTotal(this.case.otherCharges)
      );
    },
  },
};
