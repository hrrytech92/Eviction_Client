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

    <div style="width: 80%" class="pt-15 pb-4 mx-auto text-left">
      <div class="custom-title pb-4">Move Out Date</div>
      <div class="pb-8 mb-8">
        Based on the Consent to Enter Judgment, what date did the parties agree the
        tenant(s) would vacate the property?
      </div>
      <v-row justify="center" class="pb-8">
        <v-date-picker 
          v-model="moveOutDate"
          no-title
          color="primary"
          class="py-4 px-6"
          style="box-shadow: 15px 15px 40px #00000029;"
        />
      </v-row>
    </div>

    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="goBack"
      >
        Go Back
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        @click="next"
      >
        Continue
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { getCourtOutcomes } from "@/utils/getInfoForWOR";
import { mapGetters } from "vuex";

export default {
  name: "MoveOutDate",
  data() {
    return {
      moveOutDate: "",
    }
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
  },
  activated() {
    window.scrollTo(0, 0);
    this.moveOutDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
  },
  deactivated() {
    // this.saveData();
  },
  methods: {
    async saveData() {
      // if (!this.isValid) return;
      await this.$store.dispatch("eviction/updateCase", {
        caseData: {
          moveOutDate: this.moveOutDate,
        },
        // submitted: false,
        // logMessage: "LeaseDetails.vue:786",
        flowType: "wor"
      });
    },
    next() {
      // this.saveData();
      // if (!this.isValid) return;
      const courtOutcomes = getCourtOutcomes();
      if (this.currentCase.courtOutcome == courtOutcomes[3] || this.currentCase.courtOutcome == courtOutcomes[4]) { // Breach of Consent to Enter Judgment - Pay and Stay
        const breachTerms = this.currentCase.breachTerms;
        let i = 0;
        for (i = 1; i < breachTerms.length; i++) {
          if (breachTerms[i].selected)
            break;
        }
        switch (i) { // if selected breach term in Confirmation of Breach is ...
          case 1: // FAILED TO MAKE PAYMENT
            this.$router.push({ name: "wor-breach-of-payments-plan" });
            break;
          case 2: // BREACH OF OTHER CONDITIONS
            this.$router.push({ name: "wor-breach-of-other-conditions" });
            break;
          default:
            this.$router.push({ name: "wor-uc-rent-balance" });
            break;
        }
      } else {
        this.$router.push({ name: "wor-uc-rent-balance" });
      }
    },
    goBack() {
      const courtOutcomes = getCourtOutcomes();
      if (this.currentCase.courtOutcome == courtOutcomes[3] || this.currentCase.courtOutcome == courtOutcomes[4]) { // Breach of Consent to Enter Judgment - Pay and Stay
        this.$router.push({ name: "wor-confirm-breach" });
      } else {
        this.$router.push({ name: "wor-update-filing-info" });
      }
    },
  },
};
</script>

<style>
.v-date-picker-table {
  height: 252px;
}
</style>
