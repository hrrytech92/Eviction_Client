<template>
  <v-card
    class="rounded-card"
    style="
      box-shadow: 15px 15px 40px #00000029;
      border-radius: 20px;
      min-width: 320px;
    "
  >
    <div class="nextStepHeader">
      <p>Next Steps</p>
      <v-icon large color="white"> mdi-bell </v-icon>
    </div>
    <v-stepper>
      <!-- <v-stepper-step complete>
        Complete Documents
      </v-stepper-step>

      <div class="verticalLine"></div> -->

      <!-- <v-stepper-content step="1">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="e6 = 2"> Continue </v-btn>
        <v-btn text> Cancel </v-btn>
      </v-stepper-content> -->

      <v-stepper-step :complete="courtInfoCompleted" step="2">
        Enter Court Information
        <small class="mt-1"
          >Update the Case File with the information the court has provided you
          with in the notice.</small
        >
        <v-btn
          color="secondary_light"
          class="px-4 py-4 mt-4 white--text"
          rounded
          depressed
          small
          @click="
            $router.push(
              `/verified-complaint/${$route.params.id}/single/court-information/`
            )
          "
        >
          {{
            courtInfoCompleted
              ? "Reschedule/Edit Court Info"
              : "Enter Court Info"
          }}
        </v-btn>
      </v-stepper-step>

      <div class="verticalLine"></div>

      <v-stepper-step :complete="!isCLORSNeeded" step="3">
        Complete Certification of Lease and Registration Statement
        <small class="mt-1"
          >This document must be filed with the court no later than five(5) days
          prior to your case management conference.</small
        >
        <v-btn
          v-if="isCLORSNeeded"
          color="secondary_light"
          class="px-4 py-4 mt-4 white--text"
          rounded
          depressed
          small
          @click="
            $router.push(`/verified-complaint/${$route.params.id}/single/lease`)
          "
        >
          Complete CLORS
        </v-btn>
      </v-stepper-step>
      <div class="verticalLine"></div>

      <v-stepper-step step="4">
        Court Outcome
        <br />
        <v-btn
          color="secondary_light"
          class="px-4 py-4 mt-4 white--text"
          rounded
          depressed
          small
          @click="
            $router.push(
              `/verified-complaint/${$route.params.id}/single/signature-warrant-of-removal`
            )
          "
        >
          Request for Warrant of Removal
        </v-btn>
      </v-stepper-step>
    </v-stepper>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      e6: 1,
      //   courtInfoBtnText: "Enter Court Info",
      courtInfoCompleted: false,
      isCLORSNeeded: false,
    };
  },
  props: {
    currentCase: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.isCLORSNeeded =
      !this.currentCase.clrsSubmission && !this.currentCase.clrsExemption;

    if (
      this.currentCase.manageConf !== null &&
      this.currentCase.docketNo !== null
    ) {
      this.courtInfoCompleted = true;
      this.courtInfoBtnText = "Reschedule/Edit Court Info";
    }
  },
};
</script>

<style scoped>
.verticalLine {
  border-left: 1px solid #c9c9c9;
  height: 50px;
  margin-left: 35px;
  margin-top: -6px;
  margin-bottom: -6px;
}
.nextStepHeader {
  background-color: #59c4be;
  display: flex;
  justify-content: space-between;
  padding: 20px 28px;
}

.nextStepHeader p {
  font-size: 1.2rem;
  font-weight: 500;
  color: white !important;
  margin-bottom: 0;
}
.nextStepHeader i {
  transform: rotate(20deg);
}
</style>
