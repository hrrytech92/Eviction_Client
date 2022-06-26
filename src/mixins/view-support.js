import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
    isInStandaloneForms() {
      // return this.$router.currentRoute.meta === "single";
      return this.$route.name.startsWith("saf-");
    },
    // isClrsStandaloneFormVisitedNExists() {
    //   return this.currentCase.isClrsStandaloneFormTouched && this.isCLRSCase;
    // },
    // isCLRSCase() {
    //   const {
    //     // clrsDraft,
    //     // uploadLease,
    //     // leaseCopySubmission,
    //     // documentDetailType,
    //     clrsSubmission,
    //     clrsExemption,
    //   } = this.currentCase;

    //   // return (
    //   //   clrsDraft &&
    //   //   (uploadLease || documentDetailType === 3) &&
    //   //   (clrsSubmission || clrsExemption)
    //   // );

    //   // if (!clrsDraft) return false; //*User skipped CLRS section
    //   // if (!leaseCopySubmission && documentDetailType !== 3) return false;
    //   if (!clrsSubmission && !clrsExemption) return false;
    //   return true;
    // },
    isCLRSInFlow() {
      if (this.isInStandaloneForms) return true;
      const {
        isClrsInStandAloneForm,
        clrsDraft,
        clrsSubmission,
        clrsExemption,
      } = this.currentCase;
      // if (this.$router.currentRoute.name === "vc-signature") {
      //   //* for pDF template preview (before creating the order)
      //   return clrsSubmission || clrsExemption;
      // }
      return clrsDraft && (clrsSubmission || clrsExemption);
    },
  },
  methods: {
    routerPushCondition(destinationPage) {
      return this.isInStandaloneForms
        ? `saf-${destinationPage}`
        : `vc-${destinationPage}`;
    },
  },
};
