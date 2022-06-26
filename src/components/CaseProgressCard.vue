<template>
  <v-card
    class="secondary--text mt-8 pa-8"
    style="
      box-shadow: 15px 15px 40px #00000029;
      border-radius: 20px;
      min-width: 300px;
    "
  >
    <v-card-title class="pa-0 mb-6">
      <div class="ml-2">Case Progress</div>
    </v-card-title>
    <v-stepper v-model="currentStep" vertical>
      <v-stepper-step
        step="1"
        :complete="currentStep > 1"
        @click="goToStep(1)"
        class="stepper-step"
      >
        <!-- <v-icon size="32" class="mx-5">mdi-folder-open</v-icon> -->
        <div class="secondary--text ml-7">
          <div class="font-weight-medium mb-2">{{ this.stepLabel[0] }}</div>
          <div style="font-size: 0.8rem">{{ this.stepStatusLabel[0] }}</div>
        </div>
      </v-stepper-step>

      <v-stepper-content step="1"> </v-stepper-content>

      <v-stepper-step
        step="2"
        :complete="currentStep > 2"
        @click="goToStep(2)"
        class="stepper-step"
      >
        <!-- <v-icon size="24" class="mx-1">mdi-numeric-2-box-outline</v-icon> -->
        <div class="secondary--text ml-7">
          <div class="font-weight-medium mb-2">{{ this.stepLabel[1] }}</div>
          <div style="font-size: 0.8rem">{{ this.stepStatusLabel[1] }}</div>
        </div>
      </v-stepper-step>

      <v-stepper-content step="2"> </v-stepper-content>

      <v-stepper-step
        step="3"
        :complete="currentStep > 3"
        @click="goToStep(3)"
        class="stepper-step"
      >
        <!-- <v-icon size="32" class="mx-5">mdi-calendar-month</v-icon> -->
        <div class="secondary--text ml-7">
          <div class="font-weight-medium mb-2">{{ this.stepLabel[2] }}</div>
          <div style="font-size: 0.8rem">{{ this.stepStatusLabel[2] }}</div>
        </div>
      </v-stepper-step>

      <v-stepper-content step="3"> </v-stepper-content>

      <v-stepper-step
        step="4"
        :complete="currentStep > 4"
        @click="goToStep(4)"
        class="stepper-step"
      >
        <!-- <v-icon size="32" class="mx-5">mdi-calendar-month</v-icon> -->
        <div class="secondary--text ml-7">
          <div class="font-weight-medium mb-2">{{ this.stepLabel[3] }}</div>
          <div style="font-size: 0.8rem">{{ this.stepStatusLabel[3] }}</div>
        </div>
      </v-stepper-step>

      <v-stepper-content step="4"> </v-stepper-content>

      <v-stepper-step
        step="5"
        :complete="currentStep > 5"
        @click="goToStep(5)"
        class="stepper-step"
      >
        <div class="secondary--text ml-7">
          <div class="font-weight-medium mb-2">{{ this.stepLabel[4] }}</div>
          <div style="font-size: 0.8rem">{{ this.stepStatusLabel[4] }}</div>
        </div>
      </v-stepper-step>

      <v-stepper-content step="5"> </v-stepper-content>

      <v-stepper-step
        step="6"
        :complete="currentStep > 6"
        @click="goToStep(6)"
        class="stepper-step"
      >
        <div class="secondary--text ml-7">
          <div class="font-weight-medium mb-2">{{ this.stepLabel[5] }}</div>
          <div style="font-size: 0.8rem">{{ this.stepStatusLabel[5] }}</div>
        </div>
      </v-stepper-step>

      <v-stepper-content step="6"> </v-stepper-content>

      <v-stepper-step
        step="7"
        :complete="currentStep > 7"
        @click="goToStep(7)"
        class="stepper-step"
      >
        <div class="secondary--text ml-7">
          <div class="font-weight-medium mb-2">{{ this.stepLabel[6] }}</div>
          <div style="font-size: 0.8rem">{{ this.stepStatusLabel[6] }}</div>
        </div>
      </v-stepper-step>

      <v-stepper-content step="7"> </v-stepper-content>
    </v-stepper>
  </v-card>
</template>

<script>
import caseSteps from "@/utils/initialCaseSteps.json";
import ViewSupport from "@/mixins/view-support";

export default {
  name: "CaseProgressCard",
  mixins: [ViewSupport],
  props: {
    currCase: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentStep: 0,
      stepLabel: [
        "Verified Complaint",
        "Certification of Lease and Registration Statement",
        "Case Management",
        "Trial Day",
        "Court Outcome",
        "Request Warrant Of Removal",
        "Call the Sheriff to schedule Lockout",
      ],
      stepStatusLabel: ["", "", "", "", "", "", ""],
    };
  },

  methods: {
    redirectToOrderDetails(item) {
      this.$store.commit("eviction/set_current_order", item);
      this.$router.push({
        name: "vc-order-details",
        // params: { orderDetailsProp: item },
        params: { landedFromCaseView: true },
      });
    },
    goToStep(whereTo) {
      switch (whereTo) {
        case 1:
          // this.$router.push(`verified-complaint/${this.currentCase.id}/tenants`);
          break;
        case 2:
          this.$router.push({ name: this.routerPushCondition("lease") });
          break;
        case 3:
          this.$router.push({ name: "saf-court-information" });
          // alert("Case Management clicked");
          break;
        case 4:
          // this.$router.push({ name: this.routerPushCondition("lease") });
          alert("Trial Day clicked");
          break;
        case 5:
          // this.$router.push({ name: this.routerPushCondition("lease") });
          alert("Court Outcome clicked");
          break;
        case 6:
          this.$router.push({ name: "wor-court-outcome" });
          break;
        case 7:
          // this.$router.push({ name: this.routerPushCondition("lease") });
          alert("Call the Sheriff to schedule Lockout clicked");
          break;
      }
    },
    fixDate(date) {
      if (date) {
        const d = new Date(Date.parse(date));
        const day = d.getDate();
        const month = d.getMonth() + 1; // months are counted starting from 0
        const yr = d.getFullYear();
        return `${month}.${day}.${yr}`;
      }
      return "";
    },
  },
  async created() {
    if (!this.currCase?.actions) return "";
    const actionId = this.currCase.actions[0]?.actionId;
    let i;
    switch (actionId) {
      case 181: // Complete Document
        this.currentStep = 2;
        this.stepStatusLabel[0] = `Verified Complaint | ${
          caseSteps[this.currCase.status]?.label || this.currCase.status
        }`;
        break;
      case 21: // Enter Court Information
      case 191: // Complete CLORS
        this.currentStep = 3;
        this.stepStatusLabel[0] = `Verified Complaint | Completed: ${this.currCase.statusDate} `;
        break;
      case 201: //Follow-up with Court
        this.currentStep = 4;
        this.stepStatusLabel[0] = `Verified Complaint & File Certification of Lease and Landlord Registration | Completed: ${this.currCase.statusDate} `;
        this.stepStatusLabel[2] = `Case Management Conference: ${this.fixDate(
          this.currCase.manageConf
        )}`;
        break;
      case 211: //Request from sheriff for removal of Tenant
        this.currentStep = 7;
        this.stepStatusLabel[0] = `Verified Complaint & File Certification of Lease and Landlord Registration | Completed: ${this.currCase.statusDate} `;
        this.stepStatusLabel[2] = `Case Management Conference: ${this.fixDate(
          this.currCase.manageConf
        )}`;
        this.stepStatusLabel[5] = `Completed`;
        break;
      default:
        for (i = 0; i < this.stepStatusLabel.length; i++)
          this.stepStatusLabel[i] = "???";
        break;
    }
  },
};
</script>

<style>
.stepper-step {
  height: 100px;
}
.stepper-step:hover {
  cursor: pointer;
}
</style>
